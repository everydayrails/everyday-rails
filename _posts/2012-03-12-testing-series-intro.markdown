---
layout: post
title: "How I learned to test my Rails applications, Part 1: Introduction"
excerpt: "Are you still wrapping your head around Rails testing techniques? Here are the tools and techniques that helped me go from zero to decent test coverage."
tags: rspec
---

Ruby on Rails and automated testing go hand in hand. Rails ships with a built-in test framework; if it's not to your liking you can replace it with one of your liking (as I write this, [Ruby Toolbox](ruby-toolbox.com/) lists 32 projects under the _Testing Frameworks_ category). So yeah, testing's pretty important in Rails--yet many people developing in Rails are either not testing their projects at all, or at best only adding a few token specs on model validations.

There are several reasons for this. Perhaps working with Ruby or web frameworks is a novel enough concept; adding an extra layer of work seems like just that--extra work. Or maybe there is a perceived time constraint--spending time on writing tests takes time away from writing the features our clients or bosses demand. Or maybe the habit of defining "test" as clicking links in the browser is too hard to break.

I've been there. I've been developing web applications since 1995, but usually as a solo developer on shoestring projects. Aside from some exposure to BASIC as a kid, a little C++ in college, and a wasted week of Java training in my second grown-up job outside of college, I've never had any honest-to-goodness schooling in software development. In fact, it wasn't until 2005, when I'd had enough of hacking ugly spaghetti-style PHP code, that I sought out a better way to write web applications.

I'd looked at Ruby before, but never had a serious use for it until Rails began gaining steam. There was a lot to learn--new language, an actual _architecture_, and a more object-oriented approach. Even with all those new challenges, though, I was able to create complex applications in a fraction of the time it took me in my previous framework-less efforts. I was hooked.

That said, early Rails books and tutorials focused more on speed (build a blog in 15 minutes!) than on good practices like testing. If testing were covered at all, it was generally reserved for a chapter toward the end. Newer works on Rails have addressed this shortcoming, and now demonstrate how to test applications throughout, and a number of books have been written specifically on the topic of testing. But without a sound approach to the testing side, many developers--especially those in a similar boat to the one I was in--may find themselves without a consistent testing strategy. My goal with this series is to introduce you to a consistent strategy that works for me--one that you can then adapt to make work consistently for you, too.

## Who should read this series

If Rails is your first foray into a web application framework, and your past programming experience didn't involve any testing to speak of, this series will hopefully help you get started. If you're really new to Rails, you may find it beneficial to review coverage of testing in the likes of Michael Hartl's [Rails Tutorial](http://ruby.railstutorial.org/) or Sam Ruby's _[Agile Web Development with Rails (4th Edition)](http://www.amazon.com/gp/product/1934356549/ref=as_li_ss_tl?ie=UTF8&tag=everrail-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=1934356549_) as well--this series assumes you've got some basic Rails skills under your belt. In other words, this series won't teach you how to use Rails, and it won't provide a ground-up introduction to the testing tools built into the framework--we're going to be installing a few extras to make the testing process easier to comprehend and manage.

If you've been developing in Rails for a little while, and maybe even have an application or two in production, but testing is still a foreign concept, this series is for you! I was in the same boat for a long time, and the techniques I'll share here helped me improve my test coverage and think more like a test-driven developer. I hope they'll do the same for you.

On the more advanced end, if you're familiar with using Test::Unit or even RSpec, and have a workflow that (a) you're comfortable with and (b) provides adequate coverage already in place, you may be able to fine-tune some of your approach to testing your applications--but to be honest, at this point you're probably on board with automated testing and don't need this extra nudge. Books like David Chelimsky's _[The RSpec Book](http://www.amazon.com/gp/product/1934356379/ref=as_li_ss_tl?ie=UTF8&tag=everrail-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=1934356379_) or Noel Rappin's _[Rails Test Prescriptions](http://www.amazon.com/gp/product/1934356646/ref=as_li_ss_tl?ie=UTF8&tag=everrail-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=1934356646_) may be of more use to you in the long run.

## My testing philosophy

Discussing the right way to test your Rails application can invoke holy wars--not quite as bad as the Vim versus Emacs debate, but still not something to bring up in an otherwise pleasant conversation with fellow Rubyists. Yes, there is a right way to do testing--but there are degrees of **right** when it comes to testing.

At the risk of starting riots among the Ruby TDD and BDD communities, my approach focuses on the following:

* Tests should be reliable
* Tests should be easy to write
* Tests should be easy to understand

If you follow that three-step approach, you'll go a long way toward first having a sound test suite for your application--not to mention becoming an honest-to-goodness practitioner of Test-Driven Development.

Yes, there are some tradeoffs--in particular:

* We're not focusing on speed
* We're not focusing on overly DRY code in our tests

In the end, though, the most important thing is that you'll have tests--and reliable, understandable tests, even if they're not quite as optimized as they could be, are a great way to start. It's the approach that finally got me over the hump between writing a lot of application code, calling a round of browser-clicking “testing,” and hoping for the best; and taking advantage of a fully automated test suite and using tests to drive development and ferret out potential bugs.

And that's the approach we'll take in this series.

Ready to go? We'll start in part two by [configuring a Rails application to use RSpec](http://everydayrails.com/2012/03/12/testing-series-rspec-setup.html).