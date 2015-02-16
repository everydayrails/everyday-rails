---
layout: post
title: "Switching from Selenium to Poltergeist in RSpec feature specs"
excerpt: "A quick one, for readers of my RSpec book: Moving to a headless driver for faster JavaScript testing with Capybara."
---

I was recently asked about how I test JavaScript-dependent features in RSpec. In [Everyday Rails Testing with RSpec](https://leanpub.com/everydayrailsrspec), I demonstrate using Selenium for this type of test. As I note there, though, and as you've no doubt found for yourself, spawning a browser window each time is slow. It's also not compatible with continuous integration services like Jenkins or Travis CI. That's where headless drivers like Poltergeist and capybara-webkit come into play. They're capable of running JavaScript, like Selenium, but don't require an external browser.

In my own work, I use [Poltergeist](https://github.com/teampoltergeist/poltergeist) for these tests. Poltergeist is a Ruby wrapper for the [PhantomJS headless browser](http://phantomjs.org), so you'll have to install PhantomJS first. I recommend using your operating system's built-in package manager to do this, when possible. On my Mac, I use [Homebrew](http://brew.sh) (`brew install phantomjs`). If you're on Windows, or just not sure, [download and run the installer](http://phantomjs.org).

With installation out of the way, you can now install Poltergeist and configure it to be your test suite's driver for JavaScript-dependent tests. First, add it to your *Gemfile*:

    group :test do
      # Other testing gems ...
      gem 'poltergeist'
      # Go ahead and remove selenium-webdriver, if needed
    end

Run `bundle install` to install the gem.

Next, configure RSpec to use it. Add the following to your *spec/rails_helper.rb* file. (If you're still using RSpec 2.x, you'll add this to *spec/spec_helper.rb*):

    require 'capybara/poltergeist'
    Capybara.javascript_driver = :poltergeist

Now, run your test suite--or at least run your feature specs, or your feature specs that require JavaScript. If everything is set up correctly, you should see them run in your terminal, but not in a Firefox window.

In addition to speeding up your test runs, Poltergeist provides some advanced features. I don't use these often, but they are handy from time to time, particularly for debugging tests. I encourage you to refer to [Poltergeist's README](https://github.com/teampoltergeist/poltergeist) to learn more.
