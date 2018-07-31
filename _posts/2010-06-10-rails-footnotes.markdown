---
layout: post
title: "Debugging Rails apps with Rails Footnotes"
excerpt: "Rails Footnotes is a must-have gem for Rails developers of all skill levels. Here's how to get started with this invaluable debugging tool."
---

I live in Lawrence, Kansas; home of the Django web framework. I'm sticking with Ruby on Rails for my own work, though I'll admit there are features in Django that would make Rails a better development experience. In particular, the first time I saw the Django Debug Toolbar I couldn't figure out why Rails didn't have such a utility--then I learned that we Rails developers have our own debugging tool called [Rails Footnotes](http://github.com/josevalim/rails-footnotes). You just have to install it separately.

Instructions in the gem's [README](http://wiki.github.com/josevalim/rails-footnotes/) file are a little misleading. Here's what I've done to get up and running in a few Rails applications. 

To start, the line for installing the gem isn't quite current--I added the following to my `config/environments/development.rb` file:

{% highlight ruby %}
  config.gem "rails-footnotes", :source => "http://rubygems.org"
{% endhighlight %}

Then install the gem:

{% highlight bash %}
  $ rake gems:install
{% endhighlight %}

Reboot your app, and you're good to go. Out of the box (or fresh from the command line; which is it?) Rails Footnotes gives you convenient access to session variables, cookie values, param values, a complete list of environment variables, the database queries involved in rendering your view, the tail of your environment's log file, and other potentially useful information to help troubleshoot and optimize your Rails application.

As noted, you can add your own custom footnotes. The example note, to display information about the currently logged-in user, is useful relative to the current theme at _Everyday Rails_ about authentication systems. The sample code is 99 percent useful as-is; however, there are a couple of issues if you're new to Ruby and/or Rails that may throw you for a loop. Specifically:

1. **Where does the custom note code go?** Create a file in your app's `lib/` directory. I just called mine `footnotes.rb`.
2. **Why do I get an error stating `uninitialized constant Footnotes::Notes::AbstractNote` when I try restarting my app?** You need to add `require 'rails-footnotes'` to the top of your `footnotes.rb` file (this is not included in the example code).

Now, with that said, here's why you might want to add custom notes with caution. I don't know why this happens, but when I add a custom note to my configuration, Queries/DB note and the Log note both fail to yield any information. The Queries/DB note is particularly useful as it can help diagnose database bottlenecks. I'm unclear on why this is, but my workaround is to enable or disable my custom notes as needed by commenting or uncommenting the line to append your custom notes to the notes array (in the example code, this is `Footnotes::Filter.notes += [:current_user]`). In other words, only load your custom notes when you need them.

One final issue: As of right now, it looks like [Rails Footnotes is not compatible with Rails 3](http://www.railsplugins.org/plugins/19-rails-footnotes). However, the project is being actively maintained on GitHub, so hopefully a Rails 3-ready version will be ready soon.

These problems aside, Rails Footnotes are very handy and I recommend checking them out. The issues I mentioned above could well be due to something I'm doing; if I find out what it is I'll update this post as needed.