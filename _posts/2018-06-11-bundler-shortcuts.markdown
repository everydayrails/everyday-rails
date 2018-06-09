---
layout: post
title: "Simple shortcuts to get more out of Bundler"
excerpt: "Ruby's dependency manager, Bundler, includes lots of features to help make life as a developer a little easier. Here are a few of my favorites, and the shortcuts I've written to make them even simpler to use."
---

As a Ruby developer, I use Bundler almost every day to manage my applications' dependencies. Often, my interactions with it consist of the basics: Set a new gem dependency or version number in a project's _Gemfile_, then run `bundle install` on the command line. Bundler then gets to work, resolving the new dependency (and _its_ dependencies) against the project's existing dependencies. It's easy to take this for granted, but if you've been working in Rails since the early days like me, you may remember that we had to figure out dependencies and avoid conflicts on our own. Bundler was a little slow then, but still a breath of fresh air!

As Bundler has matured, it's gained not only speed, but also a host of useful features that go beyond the basic `bundle install`. I've got a few favorites, and I've created shortcuts to simplify their daily usage.

<div class="alert alert-info">
  <strong>A couple of caveats:</strong> I use these shortcuts on Unix-like operating systems, and they are written for Bash. You may need to modify them for other operating systems or shells. You may also need to download a newer version of Bundler to take advantage of some of these features; <code>gem install bundler</code>.
</div>

### Installing gems

This one's kind of cheating, but I still see many people type `bundle install`, when they could just type `bundle` to run the `install` command. It's less than half the length!

### View info on a dependency

Many times, adding one gem dependency means adding multiple gem dependencies. And gem authors are a creative lot, especially when it comes to naming things, so a gem's name doesn't always immediately convey what it does. The next time you look at your _Gemfile.lock_ file and think, _wait, I didn't install this `nokogiri` gem! And what the heck is a `nokogiri`, anyway?_, then `bundle info` can help:

    $ bundle info nokogiri
      * nokogiri (1.8.1)
    	Summary: Nokogiri (鋸) is an HTML, XML, SAX, and Reader parser
    	Homepage: http://nokogiri.org
    	Path: /Users/asumner/.rvm/gems/ruby-2.4.1/gems/nokogiri-1.8.1

This can save a lot of trips to Rubygems.org or GitHub. And in case you were still curious, a _nokogiri_ is a Japanese saw. Like I said, gem authors can be creative!

`bundle info` is easy enough to remember and not _that_ difficult to type, but I have this aliased as `bi` in my _.bashrc_ file:

    # show info on a dependency
    function bi() {
        bundle info $1
    }

### Open a dependency for editing

Sometimes, understanding your application means understanding the dependencies on top of which it's built. Bundler offers `bundle open` for this. It opens the dependency in your editor and lets you make changes on the fly--very useful for debugging, or just learning by reading code written by others.

I had a small problem, though. I use Atom as my regular code editor when working on projects, but I find Vim to be much simpler to use for standalone files and commit message editing. So my system editor is set to `vim`, meaning I had to go through some extra hoops to open a dependency in Atom. First, I had to find where it was installed, then use the `atom` command line tool to open it in my code editor (or use Vim, but I'm personally not as efficient working in large, multi-file projects in Vim as I am in Atom).

Then, I learned that Bundler looks for a `BUNDLER_EDITOR` environment configuration, and if set, will open code in that editor. That means I can use `BUNDLER_EDITOR=atom bundle open <gem-name>`.

My shortcut for `bundle open` is `bo`, using this function in my _.bashrc_ file:

    function bo() {
      BUNDLER_EDITOR=atom bundle open $1
    }

If you use Vim for your regular code editor, then you can omit the `BUNDLER_EDITOR` environment configuration. You could also set  `BUNDLER_EDITOR=atom` (or your editor of choice) separately in your Bash configs; I may do this in the future if I find myself needing the setting outside of this context.

### Search dependencies

This trick might be my favorite. Have you ever wondered where a method gets defined? Bundler can help, along with your favorite code search tool. I strongly recommend [Ripgrep](https://github.com/BurntSushi/ripgrep), or `rg`. It's super-fast and its output is optimized for displaying code. Regular grep, the Silver Searcher (`ag`), or other search tools work, too.

To make this work, I'll take advantage of `bundle show --paths`, which lists all of a project's dependencies' locations on the filesystem. I'll pass that information along to Ripgrep to tell it where to search. So, to find where `fill_in` gets defined, I'd do this:

    rg "def fill_in" $(bundle show --paths)

And get back

    /Users/asumner/.rvm/gems/ruby-2.4.1/gems/capybara-2.15.4/lib/capybara/node/actions.rb
    86:      def fill_in(locator, options={})

To see more, I could then use that handy new `bo` shortcut (shown above) to open up the Capybara gem's source.

I have a shortcut for dependency searching as well, aliased to `bs` (for _bundle search_). With this shortcut, I can clip the command down to just `bs "def fill_in"`. Again, this goes in my _.bashrc_.

    function bs() {
      rg "$1" $(bundle show --paths)
    }

### More in the docs

These are my favorites, but there are lots more features to learn about in [Bundler's documentation](https://bundler.io/docs.html). If you find yourself using any of these commands regularly, think about how to simplify them with shortcuts of your own.

<div class="alert alert-info">
  I learned about searching dependencies and specifying an editor in <a href="https://www.rubytapas.com/2018/03/27/bundler-tips-and-tricks-andre-arko/">André Arko's guest appearance on Ruby Tapas</a>, in which he demonstrates these and other useful Bundler features.
</div>
