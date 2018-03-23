---
layout: post
title: "Rails test coverage: Measuring what matters with SimpleCov"
excerpt: "Many developers strive for 100% test coverage in their Rails applications, but what does that mean? And does it matter? Here's how I use the wonderful SimpleCov to help guide my testing."
tags: rspec
image: "/images/posts/simplecov-header.jpg"
---

It's no secret that I love test-driven development, and I find a well-tested codebase one of the most welcoming introductions to a project I'm working on for the first time, or revisiting after a long time away.

But how do you know if something's well-tested, and how do you go about building a project's test suite from zero coverage to a trusty safety net? You've got to write tests, of course. But you can measure your progress by keeping an eye on your test coverage metrics as you go.

I don't talk about test coverage in my Rails testing book, _[Everyday Rails Testing with RSpec](https://leanpub.com/everydayrailsrspec)_. I'd rather people who are just getting started with testing focus on writing as many tests as they can, and not necessarily stop because a metric says they've reached 100% coverage. I also don't want people getting too stressed out right away because they _haven't_ reached that 100% number. Learning to test is hard enough!

There are lots of ways to test the same code, and it's important to get a feel for how each level of testing works, both on its own and as part of a test suite. So if you're just starting out writing tests, don't sweat getting to 100% coverage right away, or even installing a tool to measure it. It'll come with time and practice.

<div class="alert alert-info">
  <p>
  If you're familiar with measuring test coverage, and are interested in my take on how to apply coverage metrics to your work, feel free to skip ahead to the <a href="#test_coverage_in_practice">Test coverage in practice</a> section. If this is a new concept for you, please read on.
  </p>
</div>

When you _do_ decide you want to start measuring test coverage in your Rails app, you're in luck: We've got a great gem at our disposal called [SimpleCov](https://github.com/colszowka/simplecov). It works with pretty much every mainstream Ruby testing library, including my favorite, RSpec. True to its name, it's simple to install and use. Every time you run tests, you'll get an HTML-formatted report showing which lines of code in your app were run by one or more tests. From there, you can determine which areas of your code have sufficient coverage, and which areas need some work.

SimpleCov's documentation is top-notch, so I don't feel like it's necessary to provide instructions for installing and configuring it here. I will mention that my configs typically use a custom profile that looks something like this:

    require "simplecov"

    SimpleCov.profiles.define "my app" do
      load_profile "rails" # simplecov defaults
      add_filter "spec"    # don't include the spec directory
      add_filter "lib"     # only if an app doesn't have code in lib
    end

With SimpleCov installed, run your suite, then open _coverage/index.html_ in your browser to explore the report. That first report can be an affirming relief--yes, you've got great coverage! But in many cases, it may be sobering to see lots of red lines and not many green.

Is that a problem? Maybe--but also, maybe not as big a problem as it appears.

## Test coverage in practice

The fact of the matter is, attaining 100% test coverage is a challenge, especially if you're introducing a test suite to an otherwise untested app. This applies as much to experienced software developers as it does beginners. Achieving a 100% score from SimpleCov is an admirable goal, and I don't want to stop you from trying to reach it--someday.

But there are intermediary steps that may be just as beneficial. Here are some other ways I like to think about and measure test coverage.

### 1. Focus on the important bits

As you think about the gaps in your coverage, look at them through the lens of _testing what matters most_. Why do customers use your software? What would cause them frustration if it didn't work as expected? That's where to focus your testing efforts. Turn those lines of valuable business logic from red to green first, then fill in the rest later.

### 2. Pick a realistic goal

Maybe 100% coverage isn't a good short-term goal, but is 80%? Or 60%? You've got to start somewhere. Pick a percentage, even if it's arbitrary. Maybe it's the measurement you got the first time you ran SimpleCov. That works great as a starting point--just do your best to not let future runs dip below that!

### 3. Review coverage before making changes

This is where I reach for test coverage reports the most--before I add a line of code, or change code already in place, I take a look at how well it's already tested--if at all. If coverage is decent, I have a safety net to protect me from a breaking change. If coverage is lacking, I put the code change on pause, long enough to add coverage and build that safety net.

_Where_ I add that coverage is based on where the code lives in my app, and what I intend to do with it. In a Rails app, a change I want to make to a controller or view will most likely be covered in an integration spec (requests for APIs, features for web UIs, system specs in Rails 5.1 and RSpec 3.7). Otherwise, I'll try to test directly against a model or other Ruby object.

But if my intention is to heavily refactor existing code, I may strongly consider a higher-level test first. This approach lets me know that, from an end user's perspective, a feature will still work. I can drop down to lower test coverage to sort out details, but I'll almost always start with a simple integration test to make sure I don't break the happy path.

As a bonus, once I'm done, my coverage percentage gets a boost, getting me ever closer to 100% (or that more attainable number my team is working toward, whichever comes first).

I hope this has helped you think about your own applications' test coverage, whether they're at 100% or you're just starting with coverage. I'm curious, do you use SimpleCov or other coverage metrics in your daily development? How do you apply the report to actual coding work? Please leave a comment to let me know what you think, and thanks as always for reading.

<em>Photo Credit: <a href="https://www.flickr.com/photos/8283439@N04/36800437670/">Amaury Laporte</a> Flickr via <a href="http://compfight.com">Compfight</a> <a href="https://creativecommons.org/licenses/by-nc/2.0/">cc</a></em>
