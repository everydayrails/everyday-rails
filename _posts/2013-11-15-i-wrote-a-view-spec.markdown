---
layout: post
title: "I wrote a view spec"
excerpt: "When is it beneficial to include a view spec in your Rails app's test suite? Here's one example."
tags: rspec tdd
---

For almost two years now, I've been telling people I never write view specs for my Rails applications. They're hard to write and harder to manage over time. I don't even talk about them in *[Everyday Rails Testing with RSpec](https://leanpub.com/everydayrailsrspec)*--as a general rule, I try to either test view-related matters in my feature specs, or better yet, extract the stuff that needs testing into more testable layers of my application.

So why did I write a view spec the other day?

In this case, I needed to test-drive some inline JavaScript (inline because it injects server-side environment variables into a larger JavaScript library, but not enough to warrant a more thorough solution like [gon](https://github.com/gazay/gon)). It's kind of difficult to test the end result of doing this in a feature spec, at least without massively slowing down the test suite. View specs to the rescue?

Here's the general idea:

{% gist 7490444 %}

In this case, the environment variables are loaded into Rails via [dotenv](https://github.com/bkeepers/dotenv). If a developer (or continuous integration tool) doesn't have these variables set, the test will fail. It also served as a guide as I wrote the actual code to make it pass. All this in a spec that took about two minutes to write, and runs in an instant.

I'm still not advocating trying to cover every view with a view spec. All the same, they can serve a purpose and belong in your RSpec toolbox.
