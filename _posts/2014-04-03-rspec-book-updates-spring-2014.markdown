---
layout: post
title: "Everyday Rails Testing with RSpec: Upcoming updates for 2014"
excerpt: "It's getting time for the book's annual-ish update. Here's a look at what's planned for the next version."
tags: rspec
---

Big changes are afoot for Rails and RSpec, which means it's almost time for another update to *Everyday Rails Testing with RSpec.* Here's a list of things I'm planning to address in this release.

Don't forget, you can [buy the current version now](https://leanpub.com/everydayrailsrspec) and get these updates for free when they're released.

### Rails 4.1

In all likelihood, Rails 4.1 will be released within the next few weeks. Of note, this update includes Spring, a Rails application preloader to speed up your tests' runs. In an effort to minimize extra dependencies, **Spring will replace Spork in the next version of the book.**

### RSpec 2.99 and 3.0

The next releases of RSpec are still in beta, and their APIs are still shifting a bit. Once RSpec 3.0 goes final, I'll start the heaviest work of rewriting the code samples and updating content in the book to correspond with it. In the meantime, I'm going to **add a chapter on upgrading the existing sample application to RSpec 2.99** and preparing for RSpec 3.0. This will be included in an update in the next week or two.

### Capybara and Factory Girl

Capybara and Factory Girl have been relatively stable since the last version, but chapters focusing on them will be updated and expanded as needed.

### New content

I received some well-deserved criticism a little while back that I defer too frequently to Railscasts in some sections. That's fair, especially since Railscasts haven't been updated in nearly a year and some of the episodes I refer to are significantly older than that. With that in mind, I'm going to add content on the following topics:

- Setting up Guard
- Testing email
- Testing integration with external web services

I've also gotten a lot of questions and requests about testing your own application's API, so I'll be adding coverage of that as well.

### Timeline

Unfortunately, I don't have a hard-set timeline for this work. Much of it depends on when RSpec 3.0's API is stable enough to begin my writing process. I'm also doubtful that the simple sample application presently used in the book can carry the weight of some of these new features, so there's a chance I may scrap it for a totally new example. I haven't decided yet.

In the meantime, please [give the book a try](https://leanpub.com/everydayrailsrspec) if you haven't already. If you have thoughts on what you'd like to see change (or stay the same) in the next version, leave a comment below. I can't promise I'll be able to address every concern, but I'll do my best.
