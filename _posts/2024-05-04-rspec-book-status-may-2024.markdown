---
layout: post
title: "Testing with RSpec book May 2024 status report"
excerpt: "How it started, how it's going, what I've learned, and a revised delivery timeline for book updates."
tags: rspec-book
---

In February, I said I wanted to have at least a partial release of the updated [Everyday Rails Testing with RSpec](https://leanpub.com/everydayrailsrspec) book ready in time for Railsconf 2024. That time is here, but the updates, unfortunately, are not. Here's a short status report on how things are going, and an attempt at a more realistic timeline.

- I am replacing the sample project/task manager app with something that's a little more flexible and lightweight. To be frank, though it did the job, I was never super-happy with the project manager example. The simpler sample app I'm using now (think Instagram, but for food recipes) is a little less fiddly and provides more surface area for exploring different ways of testing.
- I'm restructuring the book somewhat, based on part on how I'm testing today. I want you to be productive right away, and not get bogged down too much by fundamentals and first principles. This means that the order in which some tools are introduced will change, some chapters will get a little larger, and others will go away as their contents are subsumed elsewhere. I think this will make for a more readable book, with less hopping around code and concepts.
- I'm taking a hard look at how I test today, versus how I tested five or ten years ago. Some of the tools I loved back then aren't part of my kit today, so I'm not going to include them (though I will reference them for independent study). I discourage developers from leaning too heavily into RSpec's support for DRY tests. And I feel like I've steered readers toward top-heavy test coverage, a recipe that I've seen fail on multiple projects I've been asked to help rescue. I don't want you to fall prey to that, and am being much more mindful of the tried-and-true testing pyramid now.
- Along those lines, Rails has changed a lot since the last book release! Hotwire's great, but I'm still not awesome at it. And the whole "soft-deprecation" of controller tests is strange—like, did you know if you type `rails g rspec:controller`, you'll get a stubbed request spec file? I actually think I like that, but given that controller tests were such a big part of the book, I need to rethink my approach.

Finally, we've had some significant health issues in my family this year, especially since I announced the book updates. I haven't had the time or energy I'd hoped to put into the book. It's been discouraging at times to have my laptop open, code or text in front of me, but too exhausted to think or type.

So with that said, here's an updated timeline:

- I want the first release to include the introduction, setup, and model testing chapters. I'd love to have this done and to you by the end of May.
- From there, I want to get at least one chapter finished and released every two weeks. I'm not sure at the moment how many chapters the final book will have, but I think that'll put me on pace to have everything wrapped by the beginning of September.
- Errata will be tracked on GitHub and fixed on at least a monthly cadence.
- Any updates for Rails 7.2 or Rails 8 will come in 2025 and hopefully be more straightforward.

Thank you again for your patience! I am still amazed my book has helped so many people, and hope it can continue to do so for years to come.
