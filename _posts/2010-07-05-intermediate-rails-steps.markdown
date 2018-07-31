---
layout: post
title: "Moving from beginner to intermediate Rails development"
excerpt: "So you've watched the podcasts, read the books, done the tutorials, and written your own Rails app. What's next?"
---

I believe that Rails is an excellent way to get started on server-side web development. The framework provides a good structure that's easy to understand, and provided you follow some fairly basic rules, you can have a functioning web application up and running pretty quickly. Add to that the gems and plugins that add near-instant functionality, and even newcomers can show off useful, good-looking web apps. Clicking through links and forms on an app _you made yourself_ feels pretty good and should hopefully motivate you to want to do more.

If you're just getting started, you probably watched a video showing how easy it is to create applications with Rails, read books like _Agile Rails_ or _Simply Rails_, and hacked your way through MVC and model associations to turn your own idea into something you can show off to your friends. It feels pretty good, doesn't it? But now that you've gotten that far, you may be wondering what's next&mdash;what are some good skills to have and best practices to follow as a Rails developer?

So with those questions in mind, if you're early in your career as a Rails developer and looking for some next steps, here are five places to consider exploring. For those of you who consider yourselves more advanced, what would you recommend?

## 1. Use version control to manage your code

Version control is one of those things that really fall outside of the scope of most Rails-specific tutorials and texts, so if this is your first time writing code you may not have much exposure to the concept. Basically, version control helps you keep track of the files in your project and the changes made to them as your application evolves. If you're working with a group, version control is essential. It helps keep the team on the same page code-wise by grabbing each team member's updates, resolving conflicting code, and providing options like branching for working on new features without disrupting production-ready code.

Even if you're working on your own, and even if you never share your code on GitHub, you should use version control. It's an easy way to keep a running backup of your work and potentially save yourself from yourself when some attempted changes get out of hand. Version control isn't just for programming, either--even if you're developing static websites with HTML, CSS, and maybe a bit of JavaScript, you can use version control to manage your sites' code.

There are many version control systems to choose from, though these days [Git](http://git-scm.com/) is the most popular among Rails developers (other options include Subversion, Mercurial, and the old-timer CVS). The walkthrough [Version Control for Designers](http://hoth.entp.com/output/git_for_designers.html) is the best introduction to version control in general and Git in particular. It's not just for designers--when I moved from Subversion to Git and needed a handle on some of the nuances I referred to this site regularly. If you prefer a GUI to a command line, check out tools like [GitX](http://gitx.frim.nl/) to help visualize your project's development.

## 2. Use RVM to manage your Rubies and gems

Even though I just wrote at length about [the benefits of using RVM](http://everydayrails.com/2010/06/28/rvm-gemsets-rails3.html) for your Rails development, I'll reiterate two reasons you should be doing this. First, it allows you to experiment with different versions of Ruby, Rails, and other gems without disrupting other projects. Second, it moves Rubies and gems into your home directory, so you don't need to use `sudo` or log into your computer as an administrator to install them.

A relatively recent [Railscast about RVM](http://railscasts.com/episodes/200-rails-3-beta-and-rvm) provides a good visual introduction to this tool. [My tutorial on setting up RVM](http://everydayrails.com/2010/06/28/rvm-gemsets-rails3.html) focused on using it to set up Rails 3 without disrupting your Rails 2.3.x development environment, but steps 1, 2, 4 and 5 apply to _any_ Rails version. Finally, you can refer to the [RVM documentation](http://rvm.beginrescueend.com/) for more complete documentation on other particulars.

## 3. Use Passenger in development mode

If you've deployed a Rails application&mdash;that is, installed your code on a server to share it with the world&mdash;then you may be familiar with Passenger, an add-on to common web servers like Apache and Nginx to make deployment as easy as adding a few lines to your web server configuration. (If you ever deployed an application in Rails' early, early days, you know this is not something to take for granted!) However, Passenger greatly simplifies work on the development side by letting you run multiple Rails applications simultaneously without the need to juggle ports.

<div class="alert alert-info" markdown="1">
Sorry, Passenger doesn't work with Windows&mdash;you'll need to use a Mac or the Linux distribution of your choice.
</div>

The [Passenger installation instructions](http://www.modrails.com/install.html) provided by Phusion are straightforward and, as long as you pay attention to the instructions provided during the installation process, should work for you just fine. The [Railscast on Passenger](http://railscasts.com/episodes/122-passenger-in-development) is another good primer. If you use a Mac for development, do yourself a favor and grab the [Passenger Preference Pane](http://www.fngtps.com/passenger-preference-pane) to add a GUI for managing your development-side applications.

## 4. Use a deployment tool to move code to production

How are you moving your code from a development environment (on your computer) to production (on a server)? Zipping things up and FTPing works well enough the first time, but what happens when you've got updates? Things get delicate to say the least. A step up from that is to put the version control system you chose earlier to work for you--log into your server, switch to your app's directory, and `git pull` or `svn update` or whatever. This actually works well enough&mdash;it's how I managed several apps for a couple of years&mdash;but there are much better deployment tools out there. Capistrano is probably the most popular, but there are [several deployment options for Rails](http://www.ruby-toolbox.com/categories/deployment_automation.html) worth considering.

I'm currently using Capistrano, and I won't lie&mdash;it was kind of a pain to set up. Part of the problem is there are a lot of tutorials offering conflicting advice. I may write one myself some day, but in the meantime I picked up good information from these in particular:

* [The absolute moron's guide to Capistrano](http://www.softiesonrails.com/2007/4/5/the-absolute-moron-s-guide-to-capistrano) is a good primer but uses some old syntax. Read it if you need a general introduction or more rationale than I've already given you to use a deployment tool.
* The [Capistrano website](http://www.capify.org/index.php/Capistrano) has a good guide for starting out.
* This collection of [Capistrano recipes](http://github.com/nesquena/cap-recipes/) helped a great deal in showing some complete examples, both simple and advanced.
* [Set Up Your Server Right, Part 1](http://blog.envylabs.com/2009/08/set-up-your-server-right-part-1/) has some good server-side details, such as _not deploying your apps as root_ (this is my main issue with many of the tutorials I've seen&mdash;do as little as root as possible).
* The chapter on Capistrano in _[Deploying Rails Applications: A Step-by-Step Guide](http://pragprog.com/titles/fr_deploy/deploying-rails-applications_) by Ezra Zygmuntowicz, Bruce Tate, and Clinton Begin helped, too.

This may seem like a major time investment&mdash;and it can be, but only at the front end. Once you've got your deployment system configured and ready to go, it's relatively easy to apply it to future applications. Then it's just a matter of issuing `cap deploy` (or your chosen system's method for deployment) for future iterations of your app.

## 5. Test your code

Last but not least&mdash;you need to write tests. If you're new to software development, the notion of writing tests may seem totally foreign&mdash;isn't clicking through my app in a browser or two (or five) enough? That part's important, but good developers test their code. The problem, I think, is that most Rails tutorials either don't cover testing, or in the case of the book [Agile Web Development with Rails](http://pragprog.com/titles/rails3/agile-web-development-with-rails-third-edition), testing is covered almost as an aside. When done right, testing is done concurrent to development (note: in the [fourth edition of this book](http://amzn.to/n3NP4S) you begin testing much earlier).

As with other facets of Rails development, there are [multiple options for writing tests](http://www.ruby-toolbox.com/categories/testing_frameworks.html). I personally use RSpec, with Machinist taking care of generating mock data for my tests. Tutorial-wise, I've had to hunt around a lot to learn best practices for Rails testing (and I'm still learning, to be honest) but one of the best things you can do to get started is to hit up the [Railscasts archives](http://railscasts.com/episodes/archive) and watch every episode related to testing. Another good screencast series for testing is [BDDCasts](http://bddcasts.com/), which demonstrate a full Behavior Driven Development process in a pair programming environment. I've heard that [Peepcode's](http://peepcode.com/) videos on RSpec are good, though I haven't seen any of them myself. Finally, I recommend buying the (currently beta) book _[Rails Test Prescriptions: Keeping Your Application Healthy](http://amzn.to/ofN37q_) by Noel Rappin. It's still in the works, but looks like it may become the definitive book on Rails testing. Noel does a great job explaining the why and how to write good tests without the preachiness that can come with other guides to Test Driven or Behavior Driven Development.

One final thought on testing&mdash;if you haven't done any testing in your code, my guess is you're not alone. You're also at an advantage to get started because you've got existing code that you're pretty sure works. Write some tests that test said code, and make them pass. If you get errors they'll probably be due to something in your test, as opposed to your code, so you'll have an easier time troubleshooting as you're getting started with testing. Start by testing your models&mdash;I think they're the easiest to test&mdash;and move on to controllers. Get as many tests as possible in place for your existing code, then try your hand at writing tests first as you implement new features.