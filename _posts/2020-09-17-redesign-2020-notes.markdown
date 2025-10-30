---
layout: post
title: "Thoughts on Everyday Rails 2020 redesign"
excerpt: "Everyday Rails gets a fresh coat of paint after five years. Here's what went into the new look."
tags: site-news
---

I'm really excited to launch the first major visual update to
Everyday Rails in five years! It's been fun putting it together, and
I'm really liking the new look.

I wrote a similar post when I last [updated the site's design back in 2015],
and I figured I'd do something similar this time around to talk about
the tools I used, the decisions I made, and the plans I have going
forward for the 2020 edition of Everyday Rails.

[updated the site's design back in 2015]: /2015/08/09/redesign-2015-notes.html

## Decisions

- **Cleaner and lighter:** I hate to say it, but I tired of reading
  content on the previous version within a few weeks after making the
  switch. That was kind of the height of using custom web fonts
  everywhere, as I recall. I've switched to the default sans serif
  font used by Tailwind CSS, and don't feel a need to switch it out
  anytime soon.

  I also like that the simpler font lends to an overall lighter feel
  to the site. The layout is almost identical, but it feels easier to
  read and navigate to me. I hope you agree.

- **Still sticking with Jekyll:** The static site generation landscape
  has increased a great deal in the last five years. Jekyll still does
  what I need, though I had a rough time trying to upgrade, and put
  this project on hold for a few months as a result. I'm intrigued by
  projects like [Bridgetown] and [11ty], but that's for another time.

- **No more comments:** I dropped comments last time, then reinstated
  them shortly after upon reader request. I'm not doing that again
  this time--I no longer trust services like Disqus, and don't feel
  like rolling my own solution right now for such a low-use
  communication mechanism. I _have_ noticed some technical blogs using
  GitHub issues as makeshift blog discussion tools, though, and may
  consider something like that at some point.

[Bridgetown]: https://www.bridgetownrb.com
[11ty]: https://www.11ty.dev

## Tools

- **Tailwind CSS:** I have to admit, the first time I looked at
  [Tailwind CSS], I didn't get it. Then I began watching the screencast
  tutorial series, and quickly became hooked. My use of it is admittedly
  simple so far, but the new look came together in hours--probably not
  much more time than it would've taken to tweak things for a new
  version of something like Bootstrap, and significantly less time than
  CSS from scratch would have taken me. Tailwind has made web design
  fun for me again for the first time in awhile, and I recommend
  checking it out if you haven't already.

- **Netlify:** Everyday Rails has been hosted on Netlify for some time
  now. I've been enjoying watching the JAMstack grow in capability and
  popularity for the past year or so, and appreciate no longer needing
  to manage my own server to host this site. I _really_ appreciate how
  easy it is to publish via a Git deploy and preview new builds via
  pull requests. I've also finally got a contact form on the site,
  thanks to their forms service. Netlify just works.

[Tailwind CSS]: https://tailwindcss.com
[screencast tutorial series]: https://tailwindcss.com/course
[Netlify]: https://www.netlify.com

## Still to come

- **Tailwind refactoring:** I'm learning Tailwind as I go, and know
  there are places I could extract styles or just do things a little
  better to make things more manageable in the long run.

- **Fix code highlighting:** I'm honestly not sure how long this has
  been broken, but I'd like it to be _not_ broken at some point.

- **Analytics replacement:** I dislike that I still use Google
  Analytics. I'm really only interested in seeing in broad strokes
  which posts are popular, so I can write more about those topics. But
  the alternatives I've seen either require too much manual effort, or
  are too cost-prohibitive for me to justify running. I'll keep
  looking.

- **Other tweaks as needed:** I spot checked some representative posts,
  but no doubt missed something that needs special attention. I'll get
  to these as I find them, but if you see something that looks out of
  place in the new theme, please [let me know] so I can address it.

[let me know]: /contact.html
