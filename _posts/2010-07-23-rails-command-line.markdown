---
layout: post
title: "Know your Rails command line tools"
excerpt: "There's no getting around the command line when it comes to developing Rails applications. Here are several resources to help you get the most out of the Rails command line experience."
---

In a keynote at last week's [Ruby Midwest](http://www.rubymidwest.com)/ conference in Kansas City, Rails core contributor Yehuda Katz talked about the attention the Rails team puts into the experience of the developer. A large part of this experience is the command line, and Yehuda pointed to the efforts that have been put into making sure that interface to Rails and the software you write with it is as useful as possible. The goal is to keep you from having to refer to a manual or stack trace as little as possible.

If Rails is your first real exposure to the command line&mdash;and I know a few people for whom this is true&mdash;you may think that command lines aren't what we use to interact with computers anymore (especially on Macs). With a bit of practice, though, you may discover that the command line is a much quicker and more powerful way to get things done on your computer than a graphical interface and a mouse. Here are some resources to get you started with the command line in Rails.

## The basics

* RailsGuides has documentation on [the Rails 2.3 command line](http://guides.rubyonrails.org/command_line.html) and [the Rails 3 command line](http://guides.rails.info/command_line.html). As usual with RailsGuides, these are very thorough and well-written.
* The Rails 3 screencast series has a good video outlining [what's new in the Rails 3 command line](http://rubyonrails.org/screencasts/rails3/getting-started-action-dispatch). In particular, there are new flags to `rails` when setting up your application, and changes to the contents of the `script/` directory in a Rails application.

## Generators

Rails has default generators like `scaffold`, `model` and the like; various gems and plugins add generators of their own to help you quickly get your applications up and running. See the RailsGuides above for the defaults and the documentation of your installed gems and plugins for what they provide.

For Rails 2.3:

* Pat Shaughnessy has a good [writeup on writing generators](http://patshaughnessy.net/2009/8/23/tutorial-how-to-write-a-rails-generator) (see also [part two](http://patshaughnessy.net/2009/9/2/rails-generator-tutorial-part-2-writing-a-custom-manifest-action)).
* Railscasts has an episode on [creating your own generators](http://railscasts.com/episodes/58-how-to-make-a-generator)

When it comes to generators, everything changes in Rails 3. 

* Ryan Bates covers the [changes to generators in Rails 3](http://railscasts.com/episodes/216-generators-in-rails-3) in Railscasts;
* He's also got an episode on [writing generators in Rails 3](http://railscasts.com/episodes/218-making-generators-in-rails-3)
* Ben Scofield has written a good series on Rails 3 generators that gives a line-by-line comparison of the Rails 2 way to the Rails 3 way of using generators&mdash;see [the standard generators](http://www.viget.com/extend/rails-3-generators-the-old-faithful)/, some [less common generators like mailers, helpers, and observers](http://www.viget.com/extend/rails-3-generators-the-unusuals-part-1)/, some [more testing-specific generators](http://www.viget.com/extend/rails-3-generators-the-unusuals-part-2)/.

## Rake

Rake, Ruby's build tool, is essential to Rails development. Rake is discussed in the RailsGuides referenced above. You're not limited to the tasks Rails provides&mdash;the gems and plugins your app uses may add tasks, and you can create your own.

* Type `rake -T` to view the tasks you have access to within your application.
* This Railscasts episode on [writing your own Rake tasks](http://railscasts.com/episodes/66-custom-rake-tasks) is essential viewing.
* Jason Siefer has also written a good [guide to writing Rake tasks](http://jasonseifer.com/2010/04/06/rake-tutorial).

## Unix

These last links aren't specific to Rails, but a general grasp of the Unix command line is going to make your life as a Rails developer much easier, and can help you get other things done on your computer that are cumbersome (or impossible) via a graphical interface. Seriously, if you're using a Mac or Linux-based computer, learn the command line.

<div class="alert alert-info">
  <p>If you _really_ want to get hands-on exposure to command line-only computing, install [Ubuntu Server Edition](http://www.ubuntu.com/server) a computer or virtual machine. This version of Ubuntu Linux is optimized for server use so it doesn't include a GUI out of the box. You can install one if you want, but you'll need to use the command line to do so.</p>
</div>

* The [Unix/Linux tutorial for beginners](http://www.ee.surrey.ac.uk/Teaching/Unix)/ is a good start, especially if the day you installed Rails was the first time you'd opened Terminal.
* Here's a [summary of Unix commands](http://www.math.utah.edu/lab/unix/unix-commands.html) for quick reference.