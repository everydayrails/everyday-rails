---
layout: post
title: "Diary of a Rails rescue project"
excerpt: "Notes from the field as bring a long-neglected Rails application up to speed."
tags: legacy rails-rescue
---

I recently picked up a rescue project. It's pretty gnarly--the application was, I believe, originally written in Rails 2.3 (possibly older), was updated to Rails 3.0 at some point, and sat unattended for most of last year. When major security issues hit Ruby and Rails the past few months, there were concerns that the application would have to be taken offline if action weren't taken. So I agreed to the work.

Rescue projects are unique challenges. Chances are, you're working with someone else's code. (Or maybe you're working with your own code, but it's been so long you don't remember the work or it represents a former self's skill set.) If a project hasn't been touched in awhile, you may need to do a lot of infrastructure work before getting to things like new features. In the case of this project, not only was the version of Rails grossly out of date; pretty much every dependency was as well. On top of that, the project was written by a developer who was new to Rails and new to the profession, so there were quality issues. The biggest: No meaningful tests to speak of--and making major infrastructure changes without halfway-decent tests is never fun.

So what I'd like to present here, over time, is a log of the work. Since it's not my code to share, there won't be a lot of code samples for you to copy and paste. Instead, I'm going to focus on the thought processes I go through on this project, as I bring it up to code:

- Rails 3.2.12, with an eye on Rails 4 (currently at 3.0.6!)
- Fully tested with RSpec
- Updated dependencies (and there are a lot of dependencies)
- Ruby 1.9.3 (currently using Ruby Enterprise Edition)
- Refactored, clean code (or at least cleaner than its current state)
- Reasonable documentation to help the next developer to pick this up get started

My general plan of attack is to get the application up to as current of a release of Rails 3.0 as I can, then build out tests against that. Using those tests, I can then more comfortably update to Rails 3.1, then 3.2. From there I can update Ruby to at least 1.9, if not 2.0, and, finally, get things running in Rails 4.0.

I'm not sure where this journal of the work will head, but honestly, after writing and maintaining a living book heavy with code samples for a year, I'm ready to try something different.

So let's start with my development setup. The most pressing matter was to get Rails patched. As I mentioned, the project was built on [Ruby Enterprise Edition](http://www.rubyenterpriseedition.com) (REE), an optimized version of Ruby 1.8.7. I had to get REE installed on my laptop, but installing pre-1.9 versions of Ruby on Mountain Lion involves [a couple of extra steps](https://coderwall.com/p/fywjrw) beyond `rvm install ree`.

So in the interest of time, I turned to [Vagrant](http://www.vagrantup.com). Using an disk image I already had for Ubuntu 10.04, I created a Vagrant virtual machine and spun it up. A couple of minutes later, I had REE installed on that virtual machine and was able to bring Rails up to the final 3.0 release. Since security patches are still being back-ported to the Rails repository on GitHub, I can grab them by updating the `Gemfile` accordingly:

    gem 'rails', :git => "git://github.com/rails/rails.git", :branch => "3-0-stable"

This isn't an ideal long-term solution, but it will take care of the immediate security issues while I work on other issues.

With Rails patched, I turned my attention to the other dependencies listed in the Gemfile. Did any of them have security patches to apply? This took some research. Given that the version of Rails was so out of date, some of the gems required by the application no longer supported the outdated version of Rails--or, if they do, only do so with a specific older version. Take Devise, for example. Jumping across major releases for any library is foolhardy, but for something like Devise, it's nearly impossible to do without major headaches. Instead, I told Bundler to stick to a specific version, at least until specs can be added to test against when integrating future versions:

    gem 'devise', '~> 1.3.4'

In some cases, loading a gem from a specific branch on GitHub is necessary, as I showed with the Rails example. Again, not ideal, but it keeps the project moving forward. (As an aside, if you're relying on source from a Git repository and you're not absolutely certain that repo's going to stick around for the long haul, you might consider forking it first and pointing to that fork in your Gemfile.)

I wasn't as familiar with other dependencies, so in some cases I left them at their current versions until I could get a better understanding. And since the project doesn't yet have any tests, I had to work with a dump of the production database for a local spot-check. This isn't a good practice, and I don't condone it as a regular means of testing! However, given the time crunch and lack of other tests, this had to do.

The project was luckily already set up to deploy with Capistrano--I was worried I'd have to set that up as well--so in a minute or so everything was patched on the server and I could begin tackling other issues in the project.

## Takeaways and recommendations

- **Keep your applications patched.** This app was more than a dozen patches behind its primary Rails branch. Don't overlook the amount of effort that goes into these patches--they're there to deliver real value to you as a developer. Yes, sometimes they're minor bugs, but other times they can plug major security issues.
- **Stay current on security issues.** While any number of blogs and Twitterers will report these, my favorite is the [Ruby on Rails: Security maling list](https://groups.google.com/forum/?fromgroups#!forum/rubyonrails-security). It's low noise (actually, it's read-only, with posts coming from core team members) and timely.
- **Make a general plan.** If you try to tackle every issue at once you might as well just rewrite the application. Break things down. Figure out which requirements depend upon other requirements. Begin with the dependencies.
- **Take notes.** Working with legacy code is an exploration process. Taking notes along the way will help you identify potential problem areas.

## Next time

In the next post of this series, I'll start writing tests against the current code base in order to get a better understanding of it, and to use as a development tool as I apply changes to the software itself.