---
layout: post
title: "A general guide to upgrading Ruby in your Rails applications"
excerpt: "It's the middle of December, which means a new version of Ruby will be released in just a few days. Even if you don't plan on upgrading your Rails applications to the latest version on day one, it's never a bad time to begin planning your next upgrade."
tags: security upgrading ruby
---

It's the middle of December, which means **a new version of Ruby will be released in just a few days**. Even if you don't plan on upgrading your Rails applications to the latest version on day one, it's never a bad time to begin planning your next upgrade.

## Why upgrade Ruby?

Each year, the Ruby core team introduces new features to push the language forward. Sometimes, these are **new programming constructs** to make your life as a developer easier. Other times, these changes result in **performance gains and overall reliability**. Isn't it great when a little upgrading work can make your Rails app faster, or when a new feature to the language simplifies a formerly complex approach to a simple line or two of code?

Ruby releases throughout the year also provide **important security upgrades** to the language, which trickle up to your applications and the people who use them. Making sure all the layers of your application are secure is just as important as avoiding SQL injection and cross-site scripting vulnerabilities. Keeping up with supported Ruby versions is key.

And sometimes, your hand is forced by a dependency, or a dependency of that dependency. Perhaps you've been there--you want to integrate a third-party library into your app, but you can't, because it requires a newer Ruby than you're currently running. Do you spend your time forking and back-porting the library to support your older code base, or do you **upgrade your code base to leverage the current Ruby ecosystem**?

## When to upgrade Ruby

New major versions (for example, 2.2, 2.3, and 2.4) are **traditionally released on December 25 each year**. Looking at the last few major Ruby releases, you can expect security support for a given Ruby for about three years after its initial release. If you can, **get your Ruby upgraded before that window of support expires**.

Even on conservative projects, I'm comfortable upgrading to a given version of Ruby about a year after its initial release. That provides time for bug fixes to that release, as well as gem authors to make any necessary updates necessary to support a newer Ruby.

## When _not_ to upgrade Ruby

A word of advice: **Don't upgrade Ruby versions the same time as a Rails version upgrade**! Even if the version of Rails you're upgrading to requires a certain Ruby version, upgrade and release your Ruby version first--then tackle the Rails upgrade. You're apt to make your overall upgrade much more difficult if you try to do it all at once, versus in steps.

I've had decent luck upgrading multiple versions at once--for example, from Ruby 2.1 to Ruby 2.4, but other attempts to do this have caused me problems, like going from Ruby 1.8 to 2.0. When in doubt, **break the upgrade into smaller chunks**. I almost always find incremental upgrades to go more smoothly than wholesale approaches.

## Get ready

Before doing any upgrade, it's a good idea to **read up on what's new**--features, fixes, deprecations, and things that'll just no longer work at all. preview versions of Rubies begin coming out months in advance, and lots of bloggers take the time to explore what's new--so search _what's new in ruby x.y_ to get a sense of what your fellow Rubyists are finding. [The news feed on the official Ruby website](https://www.ruby-lang.org/en/news/) also posts announcements of each release, along with what's new in them.

And, like any upgrade, **you'll want as thorough a test suite as possible for your application**--even if your own application code doesn't require a lot of changes to conform to the new Ruby, your dependencies may have gone through deeper changes. Or maybe _they_ have issues with the new Ruby version. Take a little time to review your testing situation. Use [SimpleCov](https://github.com/colszowka/simplecov) to help identify areas that are light on coverage. Try to fill in the gaps, or at least manually test those areas a little more than usual. (And if you need help getting started with testing, [I know a pretty good book on the subject](https://leanpub.com/everydayrailsrspec), _wink wink_.)

## How to upgrade Ruby

To begin, **install the targeted Ruby onto your development setup**, using your Ruby version manager of choice (or via a Docker image, if that's your thing). See instructions for [RVM](https://rvm.io), [rbenv](http://rbenv.org), and [chruby](https://github.com/postmodern/chruby) for details.

Now is a good time to also specify the new Ruby version in your `.ruby-version` file, and/or in your `Gemfile` (preferred by Heroku). Either way, you'll likely be replacing an old value with a new one. Verify the change by reloading the directory:

{% highlight bash %}
$ cd .
$ ruby -v
ruby 2.4.2p198 (2017-09-14 revision 59899) [x86_64-darwin16]
{% endhighlight %}

Next, **install Rails and your application's other dependencies** into the new Ruby environment:

{% highlight bash %}
$ bundle install
{% endhighlight %}

This is where things can get tricky, especially if you're including any gem versions that don't support the new Ruby. I've approached this two different ways on upgrade projects. In some cases, I've updated individual gems until all dependencies can install. With newer versions of Bundler, conservative updating mode, which prevents shared dependencies from also being updated, has worked well for me.

{% highlight bash %}
$ bundle update --conservative
{% endhighlight %}

In some cases, you may wind up needing to use conservative mode, then upgrading individual gems to address other changes. For example, when upgrading an app to Ruby 2.4 earlier this year, I had to separately upgrade the simple_form gem to address a deprecation.

With everything installed, you're ready to **run your test suite**! First, make sure it boots, then **watch for failures and deprecation warnings**. If you read up on the new Ruby you're upgrading to, then the failures and warnings should look familiar, and you'll hopefully have a clear path to addressing them. Don't ignore deprecation warnings! Today's warnings are tomorrow's failures. Take the time to clean up now, while you're in the thick of a Ruby upgrade.

With a passing test suite, free of deprecation warnings, I like to **run the app locally**, and **fire up the Rails console**, and check for any other deprecation warnings in the development log. This is especially important if SimpleCov found gaps in your test coverage. If you notice new warning (or failures) that weren't revealed in your existing tests, do your best to add coverage now.

## Next steps

Congratulations, your application is updated to a newer, supported Ruby! Your next steps will vary depending on how and where your application is deployed to the world. Platform-as-a-service providers like Heroku and container-based deployments make this relatively simple If you have your own servers, you'll likely have a little more work to do, like getting Ruby, Rails, and other dependencies installed on the servers in question. That's outside the scope of this article.

Once it's done, though, you can sleep a little easier, knowing that your Rails application is using a modern Ruby. Thanks for reading!
