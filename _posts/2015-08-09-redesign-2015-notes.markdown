---
layout: post
title: "Everyday Rails redesign for 2015: Initial notes and reflections"
excerpt: "A behind-the-scenes look at the tools and decisions that led to the first major redesign of Everyday Rails in three years."
tags: site-news
---

I know you're not supposed to do Friday night deploys, but two nights ago I couldn't resist running my little script that builds this Jekyll site and rsyncs it to my server. And with that, the first major redesign of Everyday Rails in more than three years went live. Even though it's not a Rails project, I wanted to share a few reflections on the tools I used and decisions I made.

## Tools

- **Bootstrap 3:** I stuck with Bootstrap for the redesign, upgrading from version 2 to 3 and taking advantage of some of its mobile-first features. I like CSS frameworks for the same reason I like good frameworks in general—people much smarter than I have taken the time to make sure things look nice and work as they should across a variety of browsers and devices. And of the front-end frameworks out there, I still think that Bootstrap provides the best out-of-box experience and look.
- **Gulp:** On any new project, I try to apply something new (or new to me). On this, I decided to try out JavaScript-based tooling for front-end matters like compiling Sass and (eventually) minifying and generally optimizing some files. I'm still feeling my way around some of that. There are a lot of tutorials out there for it, but they often contradict one another.

## Decisions

- **Sticking with Jekyll:** When I first decided that Everyday Rails needed a facelift, I planned to switch out Jekyll for the Middleman static site generator. Nothing against Jekyll, but I like Middleman's tooling. I've used it for a few years on my personal blog now. In the end, I decided that Jekyll does what I need for Everyday Rails.
- **Dropping the hero:** The previous redesign sort of coincided with the release of _[Everyday Rails Testing with RSpec](https://leanpub.com/everydayrailsrspec)_, so of course I wanted to feature it prominently. In 2012, Bootstrap's hero element was _the_ way to do things like that. But that element was arguably the most dated part of the old site, and I always cringed a bit at how much real estate it took up (especially on mobile).

  I like the sticky sidebar solution better--it allows me to keep some visibility on the book, but not as obtrusively. It's functionally still a work-in-progress (still tweaking pixel widths) but overall I'm happy with how it turned out.

- <s>**No more comments:** I struggled with this one for a bit, but decided to remove comments functionality from Everyday Rails. This has less to do with the bad reputation that Internet comments sections have earned themselves, and more to do with reducing page clutter. I understand that Disqus needs to make money, and I was using their services for free, but I wasn't happy with add-ons they started applying a year ago or so. And it was one more thing to try to style correctly. So I pulled it.</s> I've re-enabled comments, per several requests.

  It's not that I don't want to hear from you, though. I do. My contact information is in the navigation bar, and I'm generally findable online.

## Still to come

- **Optimization:** As mentioned earlier, I have some work to do around asset optimization and general front-end performance matters. It's been a little while since I've done much front-end work, so I'm learning and re-learning some things and will roll them out as I go.
- **Accessibility:** I'm also keenly aware that some of the decisions I've made may not lend themselves to accessibility tools such as screen readers. It's not because I don't care; it's because I'm admittedly ignorant about the best practices for making modern web sites work well with these devices. Things have come a long way since just making sure things look nice in Lynx. I'm learning, and appreciate your understanding.

In the meantime, I hope you enjoy the new look. Now I need to get better at putting more new content into it!
