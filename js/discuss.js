/*
 * Sharing and comments for posts. See _includes/discuss.html for the markup.
 *
 * Two independent pieces:
 *
 *   1. The Mastodon share control, which has to ask the reader which instance
 *      they're on before it can send them anywhere.
 *   2. The comment list, which is the public replies to the post's own Bluesky
 *      and Mastodon threads, read from each service's public API. Both are
 *      unauthenticated and CORS-enabled, so there's no key to keep and no
 *      build step involved -- but it also means replies are fetched by the
 *      reader's browser, and a failure there has to degrade quietly.
 *
 * Everything a remote server hands us is untrusted. Bluesky returns plain text
 * plus facets, which we rebuild ourselves; Mastodon returns HTML, which we run
 * through the allowlist sanitizer below before it goes near the page.
 */
(function () {
  "use strict";

  var BSKY_API = "https://public.api.bsky.app/xrpc";
  var INSTANCE_KEY = "mastodon-instance";
  var MAX_DEPTH = 4;

  /* ---------------------------------------------------------------- utils */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function isHttpUrl(value) {
    return typeof value === "string" && /^https?:\/\//i.test(value);
  }

  function link(href, text, className) {
    var a = el("a", className, text);
    a.href = href;
    a.rel = "nofollow ugc noopener";
    return a;
  }

  function formatDate(value) {
    var date = new Date(value);
    if (isNaN(date.getTime())) return null;
    try {
      return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
        date
      );
    } catch (e) {
      return date.toDateString();
    }
  }

  function getJSON(url) {
    return fetch(url, { headers: { Accept: "application/json" } }).then(
      function (response) {
        if (!response.ok) throw new Error("Request failed: " + response.status);
        return response.json();
      }
    );
  }

  /* ------------------------------------------------------ Mastodon sharing */

  function readStoredInstance() {
    try {
      return window.localStorage.getItem(INSTANCE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeInstance(host) {
    try {
      window.localStorage.setItem(INSTANCE_KEY, host);
    } catch (e) {
      /* Private browsing, or storage is full. One-click sharing is a nicety. */
    }
  }

  function clearStoredInstance() {
    try {
      window.localStorage.removeItem(INSTANCE_KEY);
    } catch (e) {}
  }

  /*
   * Readers type all of "ruby.social", "@me@ruby.social" and
   * "https://ruby.social/" into a box like this. Reduce them all to a host.
   */
  function normalizeInstance(input) {
    var value = String(input || "")
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "");
    var at = value.lastIndexOf("@");
    if (at !== -1) value = value.slice(at + 1);
    return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value) ? value.toLowerCase() : null;
  }

  function setUpMastodonShare(details) {
    var form = details.querySelector(".share-mastodon-form");
    var input = details.querySelector("input[name='instance']");
    var forget = details.querySelector(".share-mastodon-forget");
    var summary = details.querySelector("summary");
    if (!form || !input || !summary) return;

    var shareText =
      (details.getAttribute("data-share-title") || "") +
      "\n\n" +
      (details.getAttribute("data-share-url") || "");

    function composerUrl(host) {
      return (
        "https://" + host + "/share?text=" + encodeURIComponent(shareText)
      );
    }

    function refreshStoredState() {
      var stored = readStoredInstance();
      if (stored) {
        input.value = stored;
        if (forget) forget.hidden = false;
      } else if (forget) {
        forget.hidden = true;
      }
      return stored;
    }

    // A remembered instance makes this a one-click share: skip the panel
    // entirely rather than making the reader confirm what they told us before.
    summary.addEventListener("click", function (event) {
      if (details.open) return;
      var stored = readStoredInstance();
      if (!stored) return;
      event.preventDefault();
      window.open(composerUrl(stored), "_blank", "noopener");
    });

    details.addEventListener("toggle", function () {
      if (details.open) {
        refreshStoredState();
        input.focus();
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var host = normalizeInstance(input.value);
      if (!host) {
        input.setCustomValidity(
          "That doesn't look like an instance address. Try something like ruby.social."
        );
        input.reportValidity();
        return;
      }
      input.setCustomValidity("");
      storeInstance(host);
      if (forget) forget.hidden = false;
      window.open(composerUrl(host), "_blank", "noopener");
      details.open = false;
    });

    input.addEventListener("input", function () {
      input.setCustomValidity("");
    });

    if (forget) {
      forget.addEventListener("click", function () {
        clearStoredInstance();
        input.value = "";
        forget.hidden = true;
        input.focus();
      });
    }

    refreshStoredState();
  }

  /* --------------------------------------------------------- HTML cleaning */

  // Tags Mastodon actually emits in status HTML, plus the inline formatting
  // some clients add. Anything else is unwrapped to its text; anything in
  // DROPPED is discarded outright so its contents never surface as text.
  var ALLOWED_TAGS = {
    A: true,
    P: true,
    BR: true,
    SPAN: true,
    EM: true,
    I: true,
    STRONG: true,
    B: true,
    CODE: true,
    PRE: true,
    UL: true,
    OL: true,
    LI: true,
    BLOCKQUOTE: true,
    DEL: true
  };

  var DROPPED_TAGS = {
    SCRIPT: true,
    STYLE: true,
    IFRAME: true,
    OBJECT: true,
    EMBED: true,
    LINK: true,
    META: true,
    TEMPLATE: true,
    NOSCRIPT: true,
    SVG: true
  };

  function cleanInto(source, destination) {
    Array.prototype.forEach.call(source.childNodes, function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        destination.appendChild(document.createTextNode(node.nodeValue));
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;

      var tag = node.tagName.toUpperCase();
      if (DROPPED_TAGS[tag]) return;
      if (!ALLOWED_TAGS[tag]) {
        cleanInto(node, destination);
        return;
      }

      if (tag === "A") {
        var href = node.getAttribute("href");
        // A link we won't follow (javascript:, mailto:, a relative path into
        // someone's instance) becomes its own text rather than a dead anchor.
        if (!isHttpUrl(href)) {
          cleanInto(node, destination);
          return;
        }
      }

      var copy = document.createElement(tag.toLowerCase());
      if (tag === "A") {
        copy.href = node.getAttribute("href");
        copy.rel = "nofollow ugc noopener";
      }
      cleanInto(node, copy);
      destination.appendChild(copy);
    });
  }

  // DOMParser doesn't execute anything it parses, so this is only ever
  // inspected, never run.
  function sanitizeHtml(html) {
    var parsed = new DOMParser().parseFromString(String(html || ""), "text/html");
    var fragment = document.createDocumentFragment();
    cleanInto(parsed.body, fragment);
    return fragment;
  }

  /* ----------------------------------------------------- Bluesky rich text */

  /*
   * Bluesky sends post text as a plain string plus facets whose offsets are in
   * UTF-8 bytes, not JavaScript characters -- so any emoji or accented
   * character in a reply would shift the links if we sliced the string
   * directly. Slice the encoded bytes instead.
   */
  function renderBlueskyText(text, facets) {
    var fragment = document.createDocumentFragment();
    var value = String(text || "");

    if (!facets || !facets.length || typeof TextEncoder === "undefined") {
      fragment.appendChild(document.createTextNode(value));
      return fragment;
    }

    var bytes = new TextEncoder().encode(value);
    var decoder = new TextDecoder();
    var ordered = facets.slice().sort(function (a, b) {
      return a.index.byteStart - b.index.byteStart;
    });
    var cursor = 0;

    ordered.forEach(function (facet) {
      var feature = facet.features && facet.features[0];
      var start = facet.index && facet.index.byteStart;
      var end = facet.index && facet.index.byteEnd;
      if (!feature || start == null || end == null) return;
      if (start < cursor || end > bytes.length || end <= start) return;

      if (start > cursor) {
        fragment.appendChild(
          document.createTextNode(decoder.decode(bytes.slice(cursor, start)))
        );
      }

      var label = decoder.decode(bytes.slice(start, end));
      var href = null;
      if (feature.$type === "app.bsky.richtext.facet#link") {
        href = feature.uri;
      } else if (feature.$type === "app.bsky.richtext.facet#mention") {
        href = "https://bsky.app/profile/" + encodeURIComponent(feature.did);
      } else if (feature.$type === "app.bsky.richtext.facet#tag") {
        href = "https://bsky.app/hashtag/" + encodeURIComponent(feature.tag);
      }

      if (isHttpUrl(href)) {
        fragment.appendChild(link(href, label));
      } else {
        fragment.appendChild(document.createTextNode(label));
      }
      cursor = end;
    });

    if (cursor < bytes.length) {
      fragment.appendChild(
        document.createTextNode(decoder.decode(bytes.slice(cursor)))
      );
    }
    return fragment;
  }

  /* ---------------------------------------------------------- reply models */

  /*
   * Both services get normalized into the same shape so the renderer doesn't
   * have to care where a reply came from:
   *
   *   { source, name, handle, avatar, url, date, body, replies }
   *
   * `body` is a DocumentFragment that's already safe to insert.
   */

  function blueskyThreadUri(threadUrl) {
    var match = String(threadUrl).match(
      /bsky\.app\/profile\/([^\/]+)\/post\/([^\/?#]+)/
    );
    if (!match) return Promise.reject(new Error("Unrecognized Bluesky URL"));

    var actor = decodeURIComponent(match[1]);
    var rkey = match[2];

    if (actor.indexOf("did:") === 0) {
      return Promise.resolve("at://" + actor + "/app.bsky.feed.post/" + rkey);
    }
    return getJSON(
      BSKY_API +
        "/com.atproto.identity.resolveHandle?handle=" +
        encodeURIComponent(actor)
    ).then(function (data) {
      return "at://" + data.did + "/app.bsky.feed.post/" + rkey;
    });
  }

  function blueskyReplyUrl(post) {
    var handle = post.author && post.author.handle;
    var rkey = String(post.uri || "").split("/").pop();
    if (!handle || !rkey) return null;
    return "https://bsky.app/profile/" + handle + "/post/" + rkey;
  }

  function mapBlueskyNode(node, depth) {
    // Deleted, blocked and muted posts come back as stubs with no record.
    if (!node || !node.post || !node.post.record) return null;

    var post = node.post;
    var author = post.author || {};
    var replies = [];
    if (depth < MAX_DEPTH && node.replies) {
      replies = node.replies
        .map(function (child) {
          return mapBlueskyNode(child, depth + 1);
        })
        .filter(Boolean);
    }

    return {
      source: "Bluesky",
      name: author.displayName || author.handle || "Someone",
      handle: author.handle ? "@" + author.handle : null,
      avatar: isHttpUrl(author.avatar) ? author.avatar : null,
      url: blueskyReplyUrl(post),
      date: post.indexedAt || post.record.createdAt,
      likes: post.likeCount || 0,
      body: renderBlueskyText(post.record.text, post.record.facets),
      replies: replies
    };
  }

  function loadBlueskyReplies(threadUrl) {
    return blueskyThreadUri(threadUrl)
      .then(function (uri) {
        return getJSON(
          BSKY_API +
            "/app.bsky.feed.getPostThread?depth=" +
            MAX_DEPTH +
            "&uri=" +
            encodeURIComponent(uri)
        );
      })
      .then(function (data) {
        var root = data.thread;
        if (!root || !root.replies) return [];
        return root.replies
          .map(function (child) {
            return mapBlueskyNode(child, 1);
          })
          .filter(Boolean);
      });
  }

  function mastodonStatusParts(threadUrl) {
    var match = String(threadUrl).match(
      /^https?:\/\/([^\/]+)\/(?:@[^\/]+|users\/[^\/]+\/statuses)\/(\d+)/
    );
    if (!match) return null;
    return { host: match[1], id: match[2] };
  }

  function mapMastodonStatus(status, host) {
    var account = status.account || {};
    // `acct` omits the domain for accounts local to the instance we asked.
    var handle = account.acct
      ? account.acct.indexOf("@") === -1
        ? "@" + account.acct + "@" + host
        : "@" + account.acct
      : null;

    return {
      source: "Mastodon",
      name: account.display_name || account.username || "Someone",
      handle: handle,
      avatar: isHttpUrl(account.avatar) ? account.avatar : null,
      url: isHttpUrl(status.url) ? status.url : null,
      date: status.created_at,
      likes: status.favourites_count || 0,
      body: sanitizeHtml(status.content),
      replies: []
    };
  }

  function loadMastodonReplies(threadUrl) {
    var parts = mastodonStatusParts(threadUrl);
    if (!parts) return Promise.reject(new Error("Unrecognized Mastodon URL"));

    return getJSON(
      "https://" + parts.host + "/api/v1/statuses/" + parts.id + "/context"
    ).then(function (data) {
      var descendants = (data && data.descendants) || [];
      var byId = {};
      var roots = [];

      // Mastodon returns the whole subtree flat; rebuild the nesting from
      // in_reply_to_id. Followers-only and direct replies are skipped -- they
      // weren't posted to be republished here.
      descendants.forEach(function (status) {
        if (status.visibility !== "public" && status.visibility !== "unlisted") {
          return;
        }
        byId[status.id] = mapMastodonStatus(status, parts.host);
      });

      descendants.forEach(function (status) {
        var reply = byId[status.id];
        if (!reply) return;
        var parent = byId[status.in_reply_to_id];
        if (parent && status.in_reply_to_id !== parts.id) {
          parent.replies.push(reply);
        } else {
          roots.push(reply);
        }
      });

      return roots;
    });
  }

  /* -------------------------------------------------------------- rendering */

  function renderReply(reply, depth) {
    var item = el("li", "comment");

    var header = el("div", "comment-header");
    if (reply.avatar) {
      var avatar = el("img", "comment-avatar");
      avatar.alt = "";
      avatar.loading = "lazy";
      avatar.width = 40;
      avatar.height = 40;
      // Avatars are hotlinked from the other service; drop the element rather
      // than leaving a broken-image icon if one has gone away.
      avatar.addEventListener("error", function () {
        if (avatar.parentNode) avatar.parentNode.removeChild(avatar);
      });
      avatar.src = reply.avatar;
      header.appendChild(avatar);
    }

    var byline = el("div", "comment-byline");
    var who = el("span", "comment-author", reply.name);
    byline.appendChild(who);
    if (reply.handle) {
      byline.appendChild(el("span", "comment-handle", reply.handle));
    }

    var meta = el("div", "comment-meta muted");
    var when = formatDate(reply.date);
    if (reply.url) {
      // Describe where the link goes: "on Bluesky", not the bare date.
      meta.appendChild(
        link(
          reply.url,
          when ? when + " on " + reply.source : "Read on " + reply.source,
          "comment-permalink"
        )
      );
    } else if (when) {
      meta.appendChild(document.createTextNode(when));
    }
    if (reply.likes) {
      meta.appendChild(
        document.createTextNode(
          " · " + reply.likes + (reply.likes === 1 ? " like" : " likes")
        )
      );
    }
    byline.appendChild(meta);
    header.appendChild(byline);
    item.appendChild(header);

    var body = el("div", "comment-body");
    body.appendChild(reply.body);
    item.appendChild(body);

    if (reply.replies && reply.replies.length) {
      item.appendChild(renderReplies(reply.replies, depth + 1));
    }
    return item;
  }

  function renderReplies(replies, depth) {
    var list = el("ul", "comment-list");
    replies.forEach(function (reply) {
      list.appendChild(renderReply(reply, depth));
    });
    return list;
  }

  function setUpComments(container) {
    var status = container.querySelector(".comments-status");
    var list = container.querySelector(".comments-list");
    var blueskyUrl = container.getAttribute("data-bluesky");
    var mastodonUrl = container.getAttribute("data-mastodon");

    var jobs = [];
    if (blueskyUrl) jobs.push(loadBlueskyReplies(blueskyUrl));
    if (mastodonUrl) jobs.push(loadMastodonReplies(mastodonUrl));
    if (!jobs.length) return;

    // A single unreachable instance shouldn't hide the other service's
    // replies, so failures resolve to nothing and are counted separately.
    var failures = 0;
    var settled = jobs.map(function (job) {
      return job.catch(function (error) {
        failures += 1;
        if (window.console && console.warn) {
          console.warn("[discuss] Could not load replies:", error);
        }
        return [];
      });
    });

    Promise.all(settled).then(function (results) {
      var replies = results.reduce(function (all, batch) {
        return all.concat(batch);
      }, []);

      replies.sort(function (a, b) {
        return new Date(a.date) - new Date(b.date);
      });

      if (replies.length) {
        list.appendChild(renderReplies(replies, 0));
        status.hidden = true;
        return;
      }

      // Only claim there are no replies when every service actually answered.
      // A silent failure would otherwise read as an empty conversation.
      status.textContent = failures
        ? "Replies couldn't be loaded right now. The threads linked above have them."
        : "No replies yet. Yours would be the first.";
    });
  }

  /* ----------------------------------------------------------------- start */

  function init() {
    var share = document.querySelector(".share-mastodon");
    if (share) setUpMastodonShare(share);

    var comments = document.getElementById("post-comments");
    if (comments) setUpComments(comments);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
