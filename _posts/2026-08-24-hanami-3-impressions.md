---
layout: post
title: A fresh look at Hanami
excerpt: Love Ruby, but looking to expand beyond Rails? Here are my notes on a quick visit to Hanami.
tags: hanami learning
---

I recently took a little break from other work to explore [Hanami] 3.0. As software developers, it's always good to check out other frameworks, new languages, and different ways of accomplishing similar tasks.

While Rails focuses on fast development, it's got a deserved reputation for long-term maintainability issues as codebases grow. Hanami, on the other hand, leans toward separation of concerns by design, favoring deliberate, modular software design.

It's been ages since I last visited Hanami, so I made my way through the [official Hanami tutorial] to reorient myself. I'm no expert as a result, but I did come away with some observations you might find interesting, especially if you're a Rails developer looking for alternatives.

To work through the tutorial, I installed the newest Ruby 4.0 version on my Mac via `mise`. This isn't required, but it's now my favorite version management tool.

[Hanami]:https://hanakai.org/hanami
[Official Hanami tutorial]:https://hanakai.org/learn/hanami/v3.0/getting-started

## First impressions

Hanami is an opinionated framwork, in the best ways possible! Everything has a place: The HTTP layer does HTTP things, the data layer does data things, and the business logic layer (operations) does business things. Hanami pushes strongly toward putting things where they go, much moreso than Rails.

And I greatly appreciate the attention to developer experience, via Hanami's rich command line development tooling. I never thought that code generators were beginners' tools only--because again, I'd much rather spend my time thinking about business logic than boilerplate. Rails developers should find the options provided by `hanami generate` familiar.

## Routing, actions, and views

The tutorial kicks off by having the reader add a new route by hand. Smart move; [routes] are _extremely_ Rails-like and a nice way to build off of existing knowledge.

Actions, while not really the same as Rails controllers, still feel intuitive--essentially, instead of one controller class with several _action_ methods, each action is split into its own class. Among other things, this permits each action to handle `params` as it needs, rather than a single Strong Parameters-style approach seen in a Rails controller. I like it.

Views and templates should also have a familiar feel, while also contributing to lighter actions by giving their display logic first-class classes of their own.

[routes]:https://hanakai.org/learn/hanami/v3.0/routing

## Data layer

This will be the big learning curve for me. Not that I don't understand the general concepts around mapping relational data into objects, and breaking data concerns into more discrete objects than an Active Record model. I've just not done a ton of work professionally that made me do it. It will be good to make my brain hurt a little bit here.

That said, the data layer portions of the tutorial felt a little tedious to me. Maybe by design, as the tutorial explicitly breaks down crucial concepts? Or maybe I'm just lazy?

## Other things I noticed

I'm delighted to see RSpec as Hanami's testing library of choice! Nothing against Minitest; it's just still not for me. I'm excited to dig into Hanami's testing story further.

[Operations] follow a business logic pattern I love and have loosely adopted in Rails and Django. It's great to see skinny ~~controllers~~ actions encouraged by default!

And I'm really looking forward to exploring [slices] as a way to break monoliths into "app" components. This is Django's killer feature in my opinion, and it's good to see an official approach to this in a Ruby framework. (Yes, I know this is doable via Rails engines, but they've always felt cumbersome to me.)

One last thought: I'm liking how well Hanami illustrates how expressive Ruby can be, without being guilty of "magic."

[operations]:https://hanakai.org/learn/hanami/v3.0/operations
[slices]:https://hanakai.org/learn/hanami/v3.0/app/slices

## Next steps

I'm the learn-as-I-go-by-doing sort, so rather than read through all the docs, I plan on porting the TasteDrivenDishes sample Rails app I wrote for my testing books over to Hanami. I'll provide writeups on what I learn as I go!

Aside from a tiny typo fix in the Hanami docs, I haven't gotten involved in the [Hanakai community] yet. I expect that to change in the coming days as I continue learning.

I'm also planning to share what I learn at a future [STLRuby] meetup--I think we are talking about scheduling one for later in 2026? If it is recorded, I will share.

[Hanakai community]:https://hanakai.org/community
[STLRuby]:https://www.meetup.com/stlruby/
