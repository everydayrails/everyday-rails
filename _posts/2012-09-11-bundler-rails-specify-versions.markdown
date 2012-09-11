---
layout: post
title: "Bundler tip: Always specify gem versions"
excerpt: "Don't make future developers (or future you) guess your application's dependencies. Tell Bundler how to load the right gems every time."
---

I recently picked up a brownfield project. It involves some cleanup and a few new features. It's built in Rails 3.0 and has several external gem dependencies. I can deal with it being Rails 3.0 versus a newer release, but the problem is the Gemfile. Can you spot the potential problem here?

{% highlight ruby %}
source 'http://rubygems.org'

gem 'rails', '3.0.6'

gem 'mysql2'
gem 'fastercsv'
gem 'paperclip'
gem 'devise'
gem 'cancan'
{% endhighlight %}

The Rails ecosystem moves quickly--too quickly, some might say--and as a result a given library's API from just a few months ago may be deprecated today--or worse, it may just no longer work. Running `bundle install` with the Gemfile as-is, I could get gem versions that are no longer compatible with a legacy version of Rails. Or potentially worse, I could get gem versions with drastically rewritten APIs--*very* difficult to debug without a solid suite of tests. (The codebase in question lacks test coverage, too, but that's a different subject.)

It's good practice to be more forthright about your applications' external dependencies, whether it's to communicate them to other developers or to yourself in the future. Don't beat yourself up if you've not been doing this--to be fair, I see a lot of Rails tutorials that ignore dependency versions.

Luckily for me, the previous developer had checked in the application's `Gemfile.lock` file, so I was able to read through it and apply the correct versions:

{% highlight ruby %}
source 'http://rubygems.org'

gem 'rails', '3.0.6'

gem 'mysql2', '~> 0.2.7'
gem 'fastercsv', '~> 1.5.4'
gem 'paperclip', '~> 2.3.8'
gem 'devise', '~> 1.3.4'
gem 'cancan', '~> 1.6.4'
{% endhighlight %}

So how do you keep your dependencies in line? The best way is to make a habit of including version numbers as you add dependencies. My preferred method is to first locate them gem on [Rubygems.org](http://rubygems.org) and use the convenient clipboard utility to grab the version number. Alternatively you could run `bundle install` with no version number, then check to see which version was installed with `gem list` and apply that version.

As a reminder, Bundler uses this simple syntax to help with versioning:

* `'1.0.3'` will install version 1.0.3 and *only* version 1.0.3 of a given gem.
* `'~> 1.0.3'` will install the latest version of the 1.0.x branch of the gem, from 1.0.3 on. This is generally the route I take, as acceptable newer versions should not alter the gem's API. If they do, I'll fall back to requiring a specific version.
* `'>= 1.0.3'` will install *any* version of the gem from 1.0.3 on, including significant updates--and, potentially, significant API changes.

It's worth the time to [read the Bundler documentation on Gemfile setup](http://gembundler.com/gemfile.html), as you can get a little fancier than what I've shown if you'd like. However, I've found that sticking to these three rules can go a long way toward keeping your dependencies in check.

I'm sorry if this post is a little basic for some folks, but honestly, I've seen even some pretty experienced Rails developers fall into this trap. Including version numbers in your Gemfiles only takes a moment and is a good habit to build.