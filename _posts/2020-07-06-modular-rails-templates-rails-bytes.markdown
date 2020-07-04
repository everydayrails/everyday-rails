---
layout: post
title: "Rails application templates made even easier with Rails Bytes"
excerpt: "Application templates aren't just for new Rails apps! Stop copy-pasting configurations and get back to productivity with modular templates from this promising new service."
---

It's no secret that **I love Rails application templates**. The [second post I ever wrote here], ten years ago, was about application templates, and I wrote an update for [app templates in Rails 3] a year later, when Thor was introduced as the DSL of choice for templates. It's what's still used today with Rails 6.

**What's an application template?** Think of the gems you often add to your Rails applications. Gems like RSpec, or Devise, or Active Admin (to name only a few I've recently installed myself) don't just require a `bundle install` to add; you may also need to add initializers, tweak configurations, or run migrations. That's where application templates come in--instead of copy and pasting code and commands from a README, the template scripts these steps, so you can get back to Rails productivity mode even more quickly. Convention over configuration, for the win. And it's built into Rails.

Here's something I didn't know about until recently, though: **Application templates aren't just for new Rails apps!** For some reason, I had assumed a template was an all or nothing deal, and have been guilty of creating a few overly complex, _one-template-to-rule-them-all_ templates to try to cover all my various application needs. These have proven hard to maintain, and require a lot of up-front decisions about a new Rails application to be at all effective.

But it turns out, you can run `rails app:template LOCATION=<template location>` on any application, new or old. Defer decisions until they're ready to be made, and simplify initial app creation by using more modular templates. And did I mention? It's built into Rails!

I learned this through **[Rails Bytes]**, a promising new service from Chris Oliver (of [GoRails] fame). Rails Bytes is a community-driven repository of [more than 100 application templates] for specific purposes. And of course, you can create your own or fork and modify an existing template.

I've been working on a small Rails project for the past few weeks, and have made heavy use of Rails Bytes as the application has progressed. I love that it stripped out the annoying boilerplate code required to wire up many gems into a single command.

I can't say enough about how excited I am to see projects like Rails Bytes exist, more than 15 years into the existence of Ruby on Rails. It brings to mind the excitement and vibrancy of the community back then, and shows that there's still room for new ideas and ways to collaborate as a developer community. I hope you'll check it out the next time you need to add a popular dependency to your Rails application, and thank you to Chris for making Rails Bytes available to our community!


[second post I ever wrote here]: https://everydayrails.com/2010/05/22/bootstrapping-rails-template.html
[app templates in Rails 3]: https://everydayrails.com/2011/02/28/rails-3-application-templates.html
[Rails Bytes]: https://railsbytes.com
[GoRails]: https://gorails.com
[more than 100 application templates]: https://railsbytes.com/public/templates

