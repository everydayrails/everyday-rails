---
layout: post
title: "Updates to Everyday Rails Testing with RSpec for Rails 5 and RSpec 3.5"
excerpt: "A big update to my testing book is coming in 2017. Here's a list of things to expect in the new edition."
tags: rspec rspec-book
---

Rails 5 has been out for several months now, and I've received many questions about when *[Everyday Rails Testing with RSpec](https://leanpub.com/everydayrailsrspec)* will be updated to reflect the new version of the Rails framework and recent changes to RSpec. I've been quiet on the matter, but I finally have some news I'd like to share with everyone who's already supported my writing project, as well as those of you who have been on the fence about purchasing the book now.

First, just because the sample code doesn't cover the latest versions of Rails or RSpec, it is by no means obsolete. I still use these techniques every day to test my own Rails applications. I *don't* handle controller testing as I did in the latest version of the book, but those chapters cover important techniques for test code organization that I do still use. In other words, if you're worried the book is out-of-date because the sample application doesn't use the latest version of Rails, don't worry. It's still relevant, and there are still a lot of Rails 4.x code bases out there that need better test coverage! If you *are* on Rails 5, or are preparing to upgrade to it, you may be interested in a couple of articles I wrote about future-proofing with [request specs](https://everydayrails.com/2016/08/29/replace-rspec-controller-tests.html) and [feature specs](https://everydayrails.com/2016/09/05/replace-rspec-controller-tests.html).

All that said, **I am actively working on an update to the book, to reflect changes in Rails and RSpec**. It's taken me more time than usual for a few reasons:

- I've created a **new sample application** with **more features to cover**, which means I can provide **more thorough testing examples**. I experimented with a few different ideas for sample apps, but have settled on a multi-user project management tool. The to-do list has become the standard for web application tutorials, and it turns out that it's also well-suited as a baseline application for introducing testing concepts. I'll be able to better demonstrate how I use RSpec and related tools to test APIs, JavaScript, and more.

- Related to that, I'm juggling around some content to better reflect **how I test my applications today, and best practices in Rails testing in general**. For example, as I mentioned earlier, I've used controller tests to introduce concepts like shared examples and mocking. In practice, though, I rely on controller testing less and less, and use of these tests is now generally frowned upon in the Rails community. I'll still touch on controller tests, since you're apt to see them when working on legacy Rails applications, but I'm moving these other concepts to other parts of the book, and expanding on them as needed.

Second, **I may be changing the name and cover of the book**. The blog *Everyday Rails* has been around longer than the book, but my decision to include the blog title in the book title confused a lot of people who weren't familiar with the prior work. So, if things go to plan, the book itself will have a new title that hopefully helps disambiguate. It will still be the **same general topic** (testing Rails applications practically and with confidence), and the **same general approach** (start by testing existing code; shift to test-first). It will just likely have a different name.

Third, **this is a free update for anyone who's already purchased the English version of the book**. I don't want to speak for the people who've worked on the Chinese and Japanese translations, but I am making the new English version available to anyone who ever purchased a previous edition.

In return, **I'm hoping you'll do me a favor**: If you found *[Everyday Rails Testing with RSpec](https://leanpub.com/everydayrailsrspec)* to be useful, please **tell your friends and coworkers**. If they buy today, they'll **get the update for free**, too.

Finally, **I hope to start sharing new content in February, 2017**. I don't feel comfortable saying it will be completely finished by then, because I also have some contract work I'm wrapping up as I write this, and a day job. But my goal is to get the updates to a point where I feel comfortable sharing what I have with you by then.

In the meantime, **I thank you for your patience**. Writing a book is not as easy as many think, and overhauling an existing book may be even more challenging. (Anyone who's undertaken a software rewrite project may understand.) If you have any questions, please leave a comment below, or contact me directly through one of the channels listed in the navigation bar.

I will post updates at Everyday Rails, or you can [subscribe to my newsletter](http://eepurl.com/nRW0z) if you prefer to receive updates via email.

As always, thanks for your support! It's hard to believe it's been almost five years since I released the first version of the book. I'm glad so many of you joined me for the ride.
