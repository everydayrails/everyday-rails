---
layout: post
title: "Happy 10th birthday to Everyday Rails!"
excerpt: "Looking back on a decade of writing about Ruby on Rails."
---

On May 19, 2010, I published my first post on Everyday Rails.

I'm still letting that sink in.

That post, if you're interested, was about [bootstrapping a fresh Rails application]. It's horribly out of date now, but I appreciate it as a time capsule of how far Rails has come in those ten years, yet how similar my philosophy and approach to software development remain. My mission statement has never changed in these ten years:

> Everyday Rails is about using the Ruby on Rails web application framework to get stuff done as a web developer.

For a little perspective, I'd been writing software professionally for more than 15 years when I started Everyday Rails. In that time, I'd split my time across several languages and frameworks, moving on when my frustration with each one became too much. Back then, for the most part, I was lucky that I could call my shots and not only try new languages and ideas, but put them into production early. Rails came along at a particularly sweet spot in my career.

By 2010, I'd been writing Ruby almost exclusively for about four years, and had written at least a dozen small, but actively used, Rails applications. I'd learned from the greats like Ryan Bates, Geoffrey Grosenbach, Jim Weirich, DHH, and why the lucky stiff. And I need to let you in on a little secret: I don't particularly enjoy writing software; it's a means to an end for me, and probably always will be. But I fell in love with Ruby as much as I can ever love a programming language. I fell in love with the community. As I just commented the other day, any programming language that can inspire [Why's (Poignant) Guide to Ruby] is a programming language for me.

At that point, I'd already been blogging for a couple of years about education technology, and how consumer tech was steadily eating into the little fiefdom that education technologists had built for themselves (I was right). My boss at the time would send me emails asking about then-nascent technologies like YouTube, Flip cameras (remember those?), and social media. I'd essentially copy and paste my responses into blog posts, with the idea that if one person found the information useful, then chances were a few others in the world would, too.

I observed a similar need when attending local meetups and talking Ruby. The questions I fielded over beers at Johnny's Tavern in Lawrence, Kansas went on to become some of my earliest posts in Everyday Rails.

## The name

![Everyday Rails logo](/images/logo-square.png){: .decoration}

I'm not really sure how I came up with the name _Everyday Rails_. I know the intent behind it. I'm big on establishing good habits through routine, and Everyday Rails was and is about the habits and routines I follow, and the tools I use, to write Ruby and Rails code on a day-to-day basis--thus, _every day_. And I knew that Ryan Bates had made a name for himself through [Railscasts], so I needed a succinct name for my little contribution to the Rails community, too. And the domain name was available. But I will admit I probably saw a Rachael Ray magazine cover in a checkout line one day and cribbed the title. Sorry, Rachael. Thanks for not sending your lawyers after me.

At times, I've wished I named it something different, to not tie it so closely to a single framework. Or maybe not named it at all, but publish content under my own name. But I don't regret it much in hindsight, nor do I feel like dealing with the SEO hassles of moving to [my personal blog] or something more generic.


## Cadence

I laugh when looking back at how quickly I knocked out new posts here. My first six posts were in the wild in about two weeks. And that was on purpose, and I actually thought I could maintain that pace for the long haul. But over time, that pace drooped to once a week, to a couple times a month, to a few times a year. Fast-forward to now, and I just released my first post with actual content in ten months.

Starting hot out the gates is a rookie mistake in any distance or endurance sports event, and it's a total rookie mistake in writing. I imagine burnout could be blamed for some of the slowdown (or I could be blamed for letting myself burn out), but a change in job also took its toll on my ability to crank out the type of content I wanted. Instead of working on several small applications at once, and spinning up several new ones all the time, after moving to O'Reilly I focused on one large, mature codebase for nearly seven years. I was still learning things, but often not the kinds of things germane to a typical Rails application.

That said, I was kind of shocked just now to see Markdown files for 111 articles in my posts folder, and I'm trying to build back up to a respectable cadence. Trying for weekly, but content with monthly.


## The RSpec book

A funny thing happened a couple of years into Everyday Rails. I kicked off a series on learning to test in March, 2012. That series is 100% based on real experience. I understood that testing was an important part of writing quality software, and as a practice was strongly valued by the Ruby community, and I should be doing it. But I had no idea where to start. Many resources available at the time assumed you understood the basic principles, and either ignored testing, or treated it as a chapter toward the end. Or they weren't specific enough to Rails, and I had trouble applying their generalized teachings to my specific projects.

I'm not exactly sure when I started, but once I felt comfortable with most of the rest of Rails, I decided to really focus on learning to test my applications. I read lots of books and blog posts, watched videos from Peepcode and Railscasts. Things started to gel as I read the first edition of Noel Rappin's _[Rails Test Prescriptions]_ (affiliate link), and I began applying what I learned to my own projects.

![Everyday Rails Testing with RSpec cover](/images/rspec_book_large.jpg){: .decoration}

If you've read _[Everyday Rails Testing with RSpec]_, you know the drill: Take a codebase you know reasonably well, have tested a ton in the browser, maybe even shipped out into the world for real users. In theory, such a codebase should be bug-free enough that if there's a problem with a test, it's on the test and not the code under test. Start with the smaller, most isolated pieces of code--in a Rails app, models--and start writing tests for them. Test the easy stuff; then test the less easy stuff. When you're comfortable writing tests for models, move up to controllers, then to system-wide tests, then to everything else. Finally, the next time a feature request comes in, start by writing a system test that shows the code meets its requirements, then work your way down. Boom, you're doing outside-in, test-driven development!

Anyway, the original series of five blog posts got the most traction of anything I'd written, then or now. I'd heard about [Leanpub] a few months prior, and it occurred to me that I had a little self-publishing opportunity. The first version of the book was seriously little more than those five posts, a little intro, some metadata required by Leanpub, and a promise to add more. I hit the publish button and announced the book. A few weeks later, I'd already sold hundreds of copies, and even made some money for my work!

The book evolved since those first five posts. Most of the original content has been replaced over time, but the structure and approach is the same. Those five blog posts have expanded to 242 pages, and almost 49,000 words. It's sold more than 6,700 copies, and is still one of [Leanpub's all-time top sellers]. Not bad for a book that started from a handful of blog posts!


## Career

That career change I mentioned a moment ago? There's no evidence I know of to prove it, but I don't believe I would've had the opportunity to interview with O'Reilly, without having Everyday Rails and the book in my portfolio. Especially not from 2,000 miles away, as was the case at the time. Between this job and the nice side hustle that has been _Everyday Rails Testing with RSpec_, I owe much career-wise to this blog, and I remain convinced that establishing your name, your voice, and your authority through writing remains one of the most valuable things you can do to further your career.


## The future of Everyday Rails

Let's come back full circle now. My job at O'Reilly has changed drastically in the past couple of months. I no longer work on that same large, legacy codebase I worked on for nearly seven years. I'm working with new teams with new (to me) ways of doing things, and introducing my ways of doing things to them, too. I'm working on several smaller, legacy-in-different-ways applications, and finding opportunities to improve them, modernize them, and make them more Rails-like. I've already written a post about introducing yourself to a legacy Rails application for the first time, and expect more content around this, security, and testing in the months to come. And again, I'm trying to get back to a respectable, maintainable publishing schedule. I've learned a lot in these past ten years, and even in the last several years when I didn't write here nearly as often. I am looking forward to sharing more again.


## Thank you

Thank you for reading this non-technical, admittedly self-congratulatory post. Thank you for reading anything I've written in the past ten years. Thank you for buying my book, and telling your peers they should buy it, too. Thank you for your kind, constructive feedback. Thank you to my personal list of Ruby heroes, too long to list at this point. And thank you in advance for coming back to read my next post soon!


[bootstrapping a fresh Rails application]: https://everydayrails.com/2010/05/19/bootstrapping-a-rails-app.html
[Why's (Poignant) Guide to Ruby]: https://poignant.guide
[my personal blog]: https://www.aaronsumner.com
[Railscasts]: https://railscasts.com
[my personal blog]: https://www.aaronsumner.com
[Rails Test Prescriptions]: https://amzn.to/36fKQyy
[Everyday Rails Testing with RSpec]: https://leanpub.com/everydayrailsrspec
[Leanpub]: https://leanpub.com
[Leanpub's all-time top sellers]: https://leanpub.com/bookstore/book?sort=lifetime_earnings

