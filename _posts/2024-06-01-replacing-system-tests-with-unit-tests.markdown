---
layout: post
title: "Replacing system tests with unit tests"
excerpt: "Is your testing strategy too top-heavy? Here are some techniques to spread coverage down the testing pyramid."
tags: tdd rspec
---

It's amusing and affirming to me that [system testing (in Rails) has been declared a failure]. I could've told you that years ago! I've spent much of the past ten years working with test suites that are slow, brittle, and ultimately uninformative—almost always because they're overly reliant on testing end-to-end.

This article isn't to say I told you so, though. Much of the pain I've felt from too many system tests was self-inflicted—either because I wrote the test myself, or because I suggested to someone else that they give it a try. So it's one thing for me to tell you to reduce or replace your system tests with smaller ones—in this article, I'll also give you some general guidance on _how_ to do it. This advice comes from experience with Ruby on Rails, but if you're using other languages or frameworks, and you're clever, I bet it's at least a little applicable to your situation.

[system testing (in Rails) has been declared a failure]:https://world.hey.com/dhh/system-tests-have-failed-d90af718


## Rethink the unit

When I was first learning test-driven development, one of my biggest hurdles was understanding mocks (or stubs, or fakes, or doubles). What should I mock? What should I _not_ mock? When do I use them? Fast-forward nearly twenty years to today, and guess what? Mocks are still a hassle—and if used incorrectly, can lead to faulty assumptions about code.

In particular, I grew increasingly frustrated in my attempts to separate the database from Rails models. I eventually stopped trying. The fractions of a second I was saving running tests in isolation weren't worth the time and effort it took to maintain extra test code, or explain to teammates less familiar with mocking.

I felt pretty guilty about this for some time, until I heard Noel, Betsy, Avdi, and Penelope discuss the matter on [an episode of Tech Done Right] a few years ago:

> BETSY: But for me, I would argue that the database is just part of the unit in a Rails model test if you're writing Rails correctly. And so, you should just suck it up and deal.
>
> NOEL: I mean that's basically what I do in practice, right? I think that Rails, yes, within the Rails universe, the database is part of your Active Record model.
>
> PENELOPE: That's a really interesting way of looking at it because like just from a completely different domain, I was once in a distribution systems architecture meeting where they were like, "Cool, so you have your Rails app and you have your database and these are logically separate components in our distributed system." And I was like, "No, there's no way for us to keep that Rails app online if the database isn't there." Or they were like, "Have it return a health check that doesn't require the data." I was like, "The controller will raise an exception regardless of what I put in it if the database isn't there." Like, no, these are all one box. And so, I'm just sort of inclined to agree with Betsy there that like yeah, that makes a lot of sense.

Boy oh boy, I needed to hear this. Since then, I've not been shy about leaning on the actual test database when building out test suites. I've extended this to testing other areas of code, such as controllers and jobs. In turn, this has helped me rely less and less on full end-to-end system tests to make sure things are wired together correctly.

If you're not doing this already already, give this a try. Don't mock for the sake of purity or test speed or because you read somewhere that it's the right thing to do. Like any tool, mocks have their good uses—but decoupling tests from the underlying database aren't always one of them.

[an episode of Tech Done Right]:https://www.techdoneright.io/72


## Know what to keep

Generally speaking, if a system test covers a critical feature of my software, I'll keep it around. For me, _critical_ means I'll have a very bad day if I ship something that breaks it. There's no real metric for this, and I can't tell you what these features are in your software. My _very bad day_ is different from yours. You'll need to work with your stakeholders to determine that and consider tradeoffs.

Any tests covering scenarios that _aren't_ critical, and can be readily swapped with simpler, lower-level coverage, can be targeted for replacement and removal.

Also, don't forget about [Rack::Test]! It's considerably lighter-weight and faster than Selenium and the like. Rack::Test doesn't support JavaScript, but maybe your critical usage scenarios don't, either.

[Rack::Test]:https://github.com/rack/rack-test


## Leverage coverage tooling

Measuring test coverage, or the percentage of lines of code that are exercised by at least one test, is a common, and good, metric for the overall health of a code base. All test coverage is not equal, though! System tests can cover large areas of application code with relatively few lines of test code. I am guilty of leaning on this fact to boost an application's test coverage, and perhaps you are, too. But it's a crutch—here's how to move that coverage from system tests down to unit tests, instead.

You'll need coverage measurement tooling installed and configured for your code base. For Ruby, that's often [SimpleCov]. I like to configure it to save coverage reports as HTML. You may also need to disable any coverage percentage requirements for this exercise.

Working against your list of system tests targeted for removal, start by selecting _one_ test from the list and running it individually. For example, in RSpec, this might look like

```
# Run the spec at line 27 of the specified file
bin/rspec spec/system/widget_management_spec.rb:27
```

Open your coverage output from SimpleCov, and look through which lines the system test touches. These are the lines you'll need to ensure have coverage elsewhere. Next, run your unit tests on their own. This might look like

```
# Run all your model specs
bin/rspec spec/models
```

or

```
# Run an individual spec file
bin/rspec spec/models/widget_spec.rb
```

Check SimpleCov's output again and compare it to what you saw from the system test you ran earlier. Lines that are covered by the system test, but not by unit tests, should be targeted first. Once you've filled in your unit tests, you should be safe to remove the system test—on to the next!

Be advised, SimpleCov doesn't measure coverage for your application's views, JavaScript, or other assets. But you can use this approach to specifically cover models, controllers, jobs, etc.

[SimpleCov]:https://github.com/simplecov-ruby/simplecov


## Experiment with AI

I've written about successes I've had [porting existing tests from Minitest to RSpec with the help of generative AI]. My feelings about using AI to generate tests from scratch are kind of mixed, though. I think it's because it's a slippery slope toward falsely assuming code is correct, and then inadvertently writing tests that actually prove the wrong thing. But as I continue to get better at prompt engineering and understanding what AI is good (and not good) at, I feel better about my own ability to use it to augment tests.

As I've said before, the important thing for you, a smart, software developing person, to avoid is blindly accepting what the AI suggests you do. Just like a (usually) well-intentioned commenter on Stack Overflow, the AI doesn't have the context you do about your application, your users, and what matters most to them (and you). So do use AI, but as an assistant—sorry, you're still going to have to do some work here!

[porting existing tests from Minitest to RSpec with the help of generative AI]:https://everydayrails.com/2024/03/13/migrate-minitest-to-rspec-copilot


## Next steps?

What's next? I don't have the answers there, but here are a few things I've been thinking about:

- Will out-of-the-box support for system tests be removed in a future version of Rails?
- What of the state of "soft-deprecated" controller testing? In particular, running RSpec's `rails g rspec:controller <controller>` generates a request spec file, not a controller spec file. But controller tests are still pretty useful, it turns out.
- Will a component library like [ViewComponent] or [Phlex] finally make its way into the default Rails stack? I've had great luck with ViewComponent in particular when it comes to testing user interfaces.

In the meantime, I hope you've found this useful, and try some of these suggestions to free yourself of a few system tests!

[ViewComponent]:https://viewcomponent.org
[Phlex]:https://www.phlex.fun
