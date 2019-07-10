---
layout: post
title: "How to TDD when TDD is hard"
excerpt: "Sometimes, TDD gets in the way, does more to confuse than guide, or generally just slows development to a monotonous crawl. Here's a set of five go-to strategies I use to get out of test-fueled frustration, and back to productivity."
---

When test-driven development works well, it's smooth and fluid, guiding you back and forth between test code and application code. It hints at what you need to do next—what to add, what to change, what to remove. And it does so quickly. The process is an asset, not a liability.

You and I both know it's always an easy ride, though. Sometimes, TDD gets in the way, does more to confuse than guide, or generally just slows development to a monotonous crawl—leaving you staring repeatedly at vague test failures, or maybe just an empty line in your code editor, unsure where to even start.

When those times arise (and they will), here's a set of five go-to strategies I use to get out of test-fueled frustration, and back to productivity. While I mostly use them in Ruby on Rails with the RSpec testing framework, they're pretty general overall, and conceptually apply to TDD in other languages and frameworks.

## Problem: This test isn't telling me anything

Whether you call it a system test, integration test, feature test, or acceptance test, a high-level test is often the starting point with TDD, especially if you practice outside-in testing like I generally do. This test is great for showing that the finished product works as intended, but is less great at actually _driving_ development decisions. A failed system test's output is often too vague to point out problems in your app's deeper levels.

When a system test is too abstract to understand the problem, try testing at a lower level. In a stock Rails application, this could mean dropping down to a controller test, or even further down to a model test. If you've extracted service objects or similar, see if you can get meaning from tests that interact directly with them. If the test raised an exception instead of passing/failing, the resulting stack trace may help you decide where to test.

Ideally, code at lower levels requires fewer variables and conditions to understand its inner workings. Explore the individual objects expected to interact together to make a feature run, using tests as guides. See if you can test closer to the problematic code, then work your way back up toward a system test.

## Problem: This test needs too much setup

If you're like me, you've got a love-hate relationship with mocking in tests. Most of the time, I like it just fine—until I run into a test that requires more and more to be stubbed out just to run. By the time I'm finished, my test's setup code outnumbers the actual test, ten to one. And the test is now so tightly coupled to the application code that any minor change to the latter ripples over to more and more test tweaks.

Sound familiar? I'm exaggerating slightly, but I think this is a common complaint about mocking. And I also think mocking gets a bad rap for it. The problem isn't always mocking—sometimes, it's a sign that the code under test has too much responsibility, and is a candidate for a refactor. I see this a lot in Rails controllers and their corresponding tests, especially in legacy apps that carry over pre-RESTful behavior.

When this occurs, try moving up to test from a higher level. On the downside, this new test may be slower than the test it's replacing. But the new test is often also easier to set up, and provides a safety net for refactoring. Use the high level test as a guide to help you break down that complicated code into smaller, more testable parts. Depending on the results of that exercise, you may find the high level test no longer necessary. Use your coverage metrics and professional judgment as guides.

## Problem: This test is confusing

Many times, TDD requires you to dig into existing tests, rather than writing new ones. Maybe those old tests are supposed to tell you how the software works, or maybe they need to be adapted to support new behavior. But when an existing test is buried inside nested `context`s, relies heavily on mystery guests, and is generally just overly refactored to the point that it's unreadable, it's only useful as safety net coverage for existing functionality. It can't evolve alongside your application.

I often see this in system tests, especially those written in RSpec. It can happen at other levels of testing, but the extra setup required by system tests seems to lend itself to over-refactoring. Nothing frustrates me more than a test that requires more time to understand than it takes to just add a trivial new application behavior!

When I run into a test like this, I try to tease it back into a decidedly un-DRY, single, inline test. Working in a new file often helps. Paste the confusing test's contents into the new file. Paste the setup from `before` blocks, nesting, and shared contexts that the confusing test relies on. Get the test to pass on its own, and then take some time to understand _how_ it passes.

Once you've studied the test, you can either go forward with the original test, operating with a better understanding of how it works, or you can keep the new test and build upon it, dropping the original, confusing version. Again, you'll need to put some thought into which version is better. There's no one right way to do this sort of thing—and even when someone says there is, there are almost always exceptions to such rules.

## Problem: This app doesn't have enough (or any!) test coverage to begin with

This is a tough one. I won't lie. But it's solvable, if you can put some time into it. I've successfully approached the problem of insufficient coverage, inspired by Katrina Owen's wonderful talk [Therapeutic Refactoring](https://www.youtube.com/watch?v=J4dlF0kcThQ). The trick is to assume existing behavior is correct, and use the code's current output to build out high-level coverage.

It's not always beautiful, but it'll get coverage in place for the features that matter most—and then you can use that coverage as a starting point to improve tests and the code being tested.

As a rule of thumb, you'll get broader coverage more quickly with high-level tests. Bear in mind, though, that focusing exclusively on this level to build out your coverage can quickly to a slow test suite, incapable of providing the rapid feedback necessary for TDD to flow smoothly. Use these new tests as a starting point, but try to limit them to critical use cases—and as early as possible, explore ways to speed up feedback loops by testing at lower, faster levels.

## Problem: I have no idea what I'm doing

I'll admit, test-first, test-driven development isn't always as great as advertised. Sometimes, I can't even figure out what to test, or how to write it—never mind writing code to make it pass!

For these cases of tester's block, when a new feature's requirements don't immediately lend themselves to a test, the first thing I do is ask for clarification. I know that asking others for help can be difficult, but it's a a critical tool for developers at all career stages to master. Better to ask up front than make a faulty assumption!

If things are still unclear, I give myself permission to poke at the code a little bit, and get a better understanding of it. Maybe even try some ideas and see how they look in the browser (or UI, or API, or whatever your interface is). Break out the debugging tools (I like [pry](https://pryrepl.org), but feel free to use a traditional debugger, or `puts`, or a mix). Usually, this gives me a sense of what to test. Experimenting with the code before writing tests can also guide _where_ to start testing. Maybe a top-down testing approach doesn't apply to a certain situation, and starting at a lower level yields a better-crafted solution.

## Problem: I just don't have time to TDD this!

Sometimes, deadlines are too pressing to ignore. When due dates loom, it's tempting to put testing aside, get that mission-critical feature out the door, and move on to the next deadline, with the pinky-swear promise that we'll go back and clean up that messy code, build out test coverage, and make things beautiful.

My experience tells me that all other TDD challenges we've talked about so far, lead up to this point. It's easy for me to say, _well, make time!_ So I'm not going to say it, or at least, not in those words. Instead, let me frame the problem another way. Ask yourself a few questions: How confident are you in this code you're writing under pressure? What negative impact might this pressure have on your code? What's the worst thing that could happen if this code is wrong?

TDD is a double-layered safety net. Good tests guide good code. Yeah, sometimes, good code means _good enough_ code—I'm not going to pretend to be above deadlines. And if and when you _do_ have the time to go back and clean things up, a _good enough_ test is the first step toward more performant, better-factored code.

Foregoing tests leads down a dangerous slope. I've seen this myself, with ignored test suites in business-critical software. As time passes and original developers move on (and they do), test suites get more and more difficult to resurrect. A neglected test suite is useless—and the code base it covers becomes the same in short order.

So do try to get at least _some_ coverage in with every code change, even when you're short on time. That could be a single, high-level happy path test, or a few lower-level tests covering the important parts of an important algorithm. They may not be the prettiest tests, but that's OK! Increase reliability as you face the deadline at hand, and leave useful breadcrumbs for future development.
