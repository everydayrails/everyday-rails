---
layout: post
title: "Start with what you know"
excerpt: "Learning something brand new? Think again, it's probably got
some overlap to skills you already have. Here's one way I approach
learning to make it a more effective, intentional process."
tags: learning
---

<div class="alert alert-info">
  This post isn't directly or exclusively about Rails. It's from a
  writing idea I had a few months ago, to share more general thoughts
  on being a good software developer, teammate, and communicator. I
  abandoned the project, but liked this piece, and wanted to share it.
  Expect a few more similar to this in the future. I hope you find it
  useful!
</div>

The next time you need to learn something new, start with what you know.
Then apply that to learning the new thing.

Let’s take the approach I took to learn test-driven development on
Rails. At the time, TDD was still a new concept to me, but I’d written
and released a handful of Rails apps, and manually tested each one
through the browser. More importantly, these were real apps with real
users. If something was broken, I’d hear about it fast!

But manual testing and releasing software into the wild without a safety
net don’t scale, and I knew that. So I took what I had—reasonably sound
software that I trusted—and applied it to what I needed to learn.

Starting small, I focused on simple, tiny tests that covered
functionality that obviously worked in my applications: data entry
validations, relations across different classes of objects, string
manipulations. If the tests failed, I could be reasonably certain that
it wasn’t the application’s fault; it was the test. And if I wasn’t so
certain, double-checking my work was as simple as loading an object into
the Rails console and experimenting with it.

Once I’d mastered these simple tests, I gradually moved to more complex
examples that took inputs from different sources, requiring several
objects to play nice together, and eventually full-stack tests
interacting not just with Rails, but with front-end code, external APIs,
and the rest of what’s considered a full web stack.

As an added bonus, as I mastered each layer of testing, I improved my
apps’ test coverage. Again, these were real, production apps, not toys
never intended for public consumption. I delivered value as I learned.

It's not just for testing--I'm using this approach now, as I need to
get more comfortable with modern front-end development after a few
years focusing more on the back-end. Tools like Webpack and Tailwind
CSS are new to me, but they're just different, more efficient ways to
accomplish things I already know how to do.

Technology moves quickly, but don’t discount what you already know.
Look for ways to apply that knowledge to what you need to learn next,
and build new skills on top of it, deliberately.
