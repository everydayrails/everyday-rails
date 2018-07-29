---
layout: post
title: "Learning Ruby and Rails"
excerpt: "There's been a lot of conversation recently about the best ways to get started with Ruby. Here's my take on the subject, based on how I learned Ruby back in 2005 and what I'd do differently today."
---

I live in a town dominated by Python, PHP, and Java developers, so hiring someone who can come in and write Ruby code from day one is a challenge. I've been thinking about how I learned Ruby myself, how I've gone about helping others learn it, and what I would do differently if I had to do it all over. Meanwhile, last week Mashable [polled several notable Rubyists about how newcomers should get started with the language](http://mashable.com/2011/01/14/ruby-on-rails-for-beginners)/. Since the topic has been on my mind, too, and I'm not notable enough for major tech blogs, I'm going to share my thoughts here. I'd be interested in your feedback, as I hope to eventually have a set of go-to resources for new employees and other would-be Ruby and Rails developers.

### Start with Rails

Some Rubyists suggest that the way to learn the language is to pick up a Ruby manual, go through the traditional _Hello World_ tutorials, and go from there. I disagree&mdash;I think the best way to get running is to learn Rail. You'll get a framework that lets you build complete projects quickly, and observe many Ruby best practices in the process. I believe this applies whether you're coming from other language frameworks that may lack some of Rails' ease of development or, like me, from an anything goes approach to web application development.

When I got started the selection of resources for learning Rails was relatively limited compared to today's veritable library. I picked up a copy of _[Agile Web Development with Rails](http://amzn.to/n3NP4S_) (then in its first edition), worked my way through the online store tutorial (with much more real world applicability than _Hello World_), and began developing real, productional applications at my day job. These days I think _Agile Rails_ (now in its third edition) is still a good primer, though Michael Hartl's _[Rails Tutorial](http://railstutorial.org/_) might be a better way to go because it does a better job of embedding common tasks like testing, version control, and deployment. (Hartl's book was recently [released in print form](http://amzn.to/ovOHFn) if you'd prefer to read it in that format.)

There are also some recently-updated screencasts from [Peepcode](http://peepcode.com)/ covering Rails 3. I haven't reviewed these, but generally speaking, I like the Peepcode series provided I watch them in a timely manner. Some of their older offerings haven't aged well in my opinion.

### Next, focus on Ruby

Once you've learned how easy it is to use Rails to build full-featured web software, it's time to go under the hood and understand more about how some of that Rails magic actually works. (I've seen people develop complete Rails apps with very little Ruby understanding, or at least an understanding of where Rails ends and Ruby begins, but that's probably not a sustainable practice.) Now's the time for _Hello World_ and Ruby shell scripts. I'm still a fan of Pragmatic Programmers' _[Programming Ruby: The Pragmatic Programmers' Guide](http://amzn.to/rn1G2b_). The third edition covers Ruby 1.9; if you're in a development or production environment still using 1.8 you can [grab the second edition](http://amzn.to/oWYAwN) (or pick up a used copy of it cheaply).

There are a ton of [free Ruby books out there](http://everydayrails.com/2010/07/28/free-ruby-rails-books.html) (and [even more](http://everydayrails.com/2010/08/04/more-free-ruby-rails-books.html)) if you'd like to learn more without spending a lot of money. I think Jeremy McAnally's _[Mr. Neighborly's Humble Little Ruby Book](http://humblelittlerubybook.com/_) is a good primer, albeit for an older version of Ruby. 

### Branch out from Rails

From there, I think you'll have good footing from which to expand your Ruby palette, whether you're checking out other web frameworks like [Sinatra](http://www.sinatrarb.com)/, using Ruby to automate system tasks through shell scripting, or writing your own Mac OS X software with [MacRuby](http://www.macruby.org)/.

### Keep up

Rails has evolved enormously since its debut, and interesting new Ruby projects spring up daily. Whether it's an upgrade to your favorite gem, a new gem that does something a little better, or a whole new framework to check out, there's always something new to learn in Ruby. Luckily there are some excellent blogs, podcasts, and link sharing services to help you keep up and keep your Ruby skills honed.

As you probably already know, [Railscasts](http://railscasts.com)/ is _the_ podcast to check out every week to keep building your Rails skills. I watch it even when I don't have an immediate need for what's being presented&mdash;it's an excellent, free way to see how a Ruby expert gets things done. Plan to spend 15 minutes or so following along each week. You can also follow along via [ASCIIcasts](http://asciicasts.com)/, the text transcriptions of each week's tutorial.

Other podcasts are less tutorial in nature and more about what's new in Ruby: [Ruby5](http://ruby5.envylabs.com)/, [The Ruby Show](http://5by5.tv/rubyshow), and [The Changelog](http://thechangelog.com)/ all provide regular updates on the Ruby world, new gems, and other projects you should be aware of. Each show also provides a list of links discussed in that episode, so even if you don't have time to listen you can still check out what's new.

How about a good old fashioned e-mail newsletter? Check out [Ruby Weekly](http://rubyweekly.com)/ for a weekly dose of Ruby news in your inbox. I like Ruby Weekly because it helps me follow up on things I may have missed throughout the week, or serves to reinforce things I _should_ have checked out.
