---
layout: post
title: "A great example of outside-in testing from Ruby Tapas"
excerpt: "How do you turn testing knowledge into a testing habit? Learn from an expert."
tags: rspec tdd
---

**Update: Avdi has generously made the Outside-In episode of Ruby Tapas embeddable for this post--see below. Thanks, Avdi!**

Once you know the basic mechanics of testing, how do you bring it all together into a consistent testing habit or routine? I get asked this a lot by people who've recently finished *[Everday Rails Testing with RSpec](https://leanpub.com/everydayrailsrspec)* or are generally still getting comfortable with this facet of development. While there are a number of approaches, I like to go *outside-in* by starting with a high-level spec, using it to drive the desired behavior of my software, and dropping down to unit tests to suss out the finer details of a feature. It's an organic process, to be sure, and one that can take some practice before becoming second nature.

Lately I've been catching up on [Ruby Tapas](http://rubytapas.com/), Avdi Grimm's excellent series of bite-sized videos on Ruby. If you're not already a subscriber, I highly recommend checking it out. $9 a month gives you access to a large library of videos, growing at a rate of two per week. If you need additional motivation, episode 120, [Outside-In](http://www.rubytapas.com/episodes/120-Outside-In), is a wonderful demonstration of the outside-in testing process in action, and a great example of an approach I try to follow, myself.

<iframe src="//fast.wistia.net/embed/iframe/75ibgae9hk" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" oallowfullscreen="oallowfullscreen" msallowfullscreen="msallowfullscreen" width="770" height="461">&nbsp;</iframe>

A few observations:

- Watch how Avdi goes about writing a test--starting with a very high-level outline and working out the details as his understanding of the problem increases.
- Along these same lines, note that he doesn't start out writing a ton of specs at the outset. He focuses on one issue at a time, refining his test suite as he proceeds. Again, it's *organic*.
- Finally, did you notice what Avdi said about *when* to add a test? It's a sense you'll hone as you continue to practice test-first software development. So keep practicing!

This isn't the only Ruby Tapas episode dedicated to writing tests--and even episodes not focused on testing show how your test suite is an integral part of growing and refactoring your code base. Again, I can't suggest [checking it out](http://rubytapas.com/) enough. And, though I've mentioned it before, I suggest checking out [How I Test](http://railscasts.com/episodes/275-how-i-test) on Railscasts. It's a few years old now, and some of the syntax has changed a bit, but it's still a wonderful demonstration of this same approach to testing. In fact, this video is what inspired me to write my book in the first place. It's a free clip, so if you haven't watched it yet, please take 15 minutes to do so.
