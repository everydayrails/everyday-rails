---
layout: post
title: "RVM and project-specific gemsets in Rails"
excerpt: "Take advantage of RVM's gemset feature to create project-specific gem installations for your Rails applications."
---

Sorry about the delay in posting&mdash;everyday life got in the way of Everyday Rails. I've also been in the middle of changing how my development Ruby environment works, and want to share that today.

In a little more than a year, [RVM](rvm.beginrescueend.com)/ (Ruby Version Manager) has become a critical tool for Ruby and Rails developers. A few months ago, when Rails 3 was still in beta, I [wrote how to use RVM's gemsets feature to allow multiple versions of Rails to coexist](/2010/06/28/rvm-gemsets-rails3.html) by creating a separate gemset for Rails 3 and its dependencies, so you wouldn't have to worry about conflicts with productional Rails 2.3 code. In this post, I'll extend that general approach to show how I'm using RVM to create project-specific gemsets, allowing each of my Ruby projects (Rails 3, Rails 2.3, Jekyll, and Sinatra) to exist in a silo, with their own, independent gem installations.

*Why would you want to do this?* I'm currently developing new applications in Rails 3, while maintaining a handful of Rails 2.3 applications that aren't quite ready to be migrated to Rails 3. (I even have a Rails 1.2 application I need to poke at every now and then.) Given not just all these different versions of Rails, but also the different levels of compatibility a given gem has for that version of Rails, it's important that I keep things separate. Updating a gem for Application A could wreck Application B. Long story short, it's a little bit of short-term setup headache for a lot of long-term code maintenance sanity.

With that said, for this setup, I'm going to assume the following:

* You have Rails 2.3 applications you need to maintain, but you'd also like to move forward with Rails 3 development
* You're already using RVM for easier Ruby and gem installation
* You're already using Phusion Passenger in development
* You're using Apache on your development computer (I haven't tried this with Nginx)

### Preparation

Before you begin, I strongly recommend checking the versions of any gems you're using in your applications, particularly your legacy (pre-Rails 3) apps. Most of the problems I've had have resulted from not being strict enough with my gem versions listed in my `environment.rb` file. As a result, `rake gems:install` installs the latest versions of these gems, and in many cases those versions are no longer Rails 2.3 compatible.

### Update RVM

As of this writing, the current version of RVM is 1.0.5. If you need to update you can do so with the following:

{% highlight bash %}
  $ rvm update
  $ rvm reload
{% endhighlight %}

### Pick a Ruby

Even though RVM lets you run multiple Ruby interpreters simultaneously, Passenger will only let you use one at a time. Unless your code needs to run on every Ruby under the sun you can probably pick one that makes sense. On my work computer, I went with Ruby Enterprise Edition since that's what my server runs. On my home computer I'm going with 1.9.2 since I primarily deploy personal projects to Heroku. This isn't to say you can _only_ use one Ruby; it just makes it easier to integrate with other apps like Passenger and TextMate.

Once you've picked your Ruby interpreter, go ahead and install it and make it your default in RVM.

{% highlight bash %}
  $ rvm install ree
  $ rvm --default ree
  $ rvm use ree
{% endhighlight %}

One last check to make sure you're using the Ruby you want:

{% highlight bash %}
  $ ruby -v
{% endhighlight %}

### Create a global gemset

This is where things begin to get a little tricky. What we're going to do is create a _global_ gemset that contains gems that will be used across multiple projects, then a _project-specific_ gemset for each of our Rails applications. To begin, let's make our global gemset:

{% highlight bash %}
  $ rvm gemset create global
  $ rvm use @global
{% endhighlight %}

What you put in @global is up to you, but try to keep it clean. Since the point of this exercise is to maintain separate development environments for Rails 2.3 and Rails 3, don't install any frameworks in @global. Here I'm just loading some necessities. We'll get to a project-specific gemset momentarily.

{% highlight bash %}
  $ gem install bundler passenger capistrano hirb wirble
{% endhighlight %}

### Configure Passenger

This is the first kind of tricky part. If you're content using your application's built-in server, you can skip it. After much frustration, I found [this post on RVM and Passenger integration by Sam Philips](http://www.samsworldofno.com/2009/12/30/playing-nicely-notes-on-installing-rvm-and-passenger)/ to be the most helpful. The gist is you're going to point Apache to the copy of Passenger you just installed in the `@global` gemset and create a wrapper to point it to the Ruby version you picked to kick things off.

First, let's create that wrapper:

{% highlight bash %}
  $ rvm wrapper ree@global passenger
{% endhighlight %}

Next, run the Passenger installation utility (again, not as root).

{% highlight bash %}
  $ passenger-install-apache2-module
{% endhighlight %}

Edit your Apache configuration to properly load Passenger. As noted in the RVM documentation, these paths will differ from what the Passenger installer tells you to use. Here's what mine looks like; if you replace `asumner` with your own home directory you should be fine.

{% highlight apache %}
  LoadModule
  PassengerRoot /Users/asumner/.rvm/gems/ree-1.8.7-2010.02@global/gems/passenger-2.2.15
  PassengerRuby /Users/asumner/.rvm/bin/passenger_ruby
{% endhighlight %}

### Set up your project (Rails 3)

Thanks to Bundler, getting your Rails 3 projects configured to use your new development environment should be fairly straightforward.

First, we'll create another gemset; this one will be specific to our Rails 3 project. Replace _rails3_project_ with a gemset name that makes more sense for your project:

{% highlight bash %}
  $ rvm gemset create rails3_project
  $ rvm use @rails3_project
{% endhighlight %}

Next, create a `.rvmrc` file at the root of your Rails 3 application. It will look something like this:

{% highlight bash %}
  rvm ree-1.8.7-2010.02@rails3_project
{% endhighlight %}

This is the key to the magic that's happening here: RVM is smart enough to know that if it sees a `.rvmrc` file in a directory, it should load the version specified inside.

Here's the second kind of tricky part: Since Passenger doesn't technically know about our project-specific gemset, we need to tell it where to access our app's gems. It will get this information from the `.rvmrc` file.

To do this, inside your app's `config` directory, create a new file called `setup_load_paths.rb` to let your app know how to access its gems. Here's what wound up working for me, courtesy of [Jeremy Lecour's excellent writeup on RVM and Passenger](http://jeremy.wordpress.com/2010/08/19/ruby-rvm-passenger-rails-bundler-in-development)/:

{% highlight ruby %}
  # config/setup_load_paths.rb
  
  if ENV['MY_RUBY_HOME'] && ENV['MY_RUBY_HOME'].include?('rvm')
    begin
      rvm_path     = File.dirname(File.dirname(ENV['MY_RUBY_HOME']))
      rvm_lib_path = File.join(rvm_path, 'lib')
      $LOAD_PATH.unshift rvm_lib_path
      require 'rvm'
      RVM.use_from_path! File.dirname(File.dirname(__FILE__))
    rescue LoadError
      # RVM is unavailable at this point.
      raise "RVM ruby lib is currently unavailable."
    end
  end

  ENV['BUNDLE_GEMFILE'] = File.expand_path('../Gemfile', File.dirname(__FILE__))
  require 'bundler/setup'
{% endhighlight %}

Now we can install the gems from our project's Gemfile:

{% highlight bash %}
  $ bundle install
{% endhighlight %}

Configure Passenger to point to your application as you normally would (I use the [Passenger PrefPane](http://www.fngtps.com/passenger-preference-pane) for Mac OS X) and everything should work as you'd expect. If not, double check your Apache configuration (did you reboot Apache?), your `.rvmrc` file, and your installed gems. Stack traces were especially useful for me while getting my first Rails 3 application set up for development in this new environment.

### Set up your project (Rails 2.3)

Getting a Rails 2.3 application up and running in this new development environment isn't necessarily more difficult, but there are different details to watch for. In particular, a 2.3 app probably isn't going to be using Bundler, so we'll be installing gems in a more traditional manner. As noted at the beginning of this article, attention to gem versions will also be important.

The first step is the same as before&mdash;we need a project-specific gemset:

{% highlight bash %}
  $ rvm gemset create rails2_project
  $ rvm use @rails2_project
{% endhighlight %}

Your project's `.rvmrc` file will work the same, too:

{% highlight bash %}
  rvm ree-1.8.7-2010.02@rails2_project
{% endhighlight %}

You'll also need a `setup_load_paths.rb` file, though this time omit the Bundler-specific lines (unless your Rails 2.3 application _is_ using Bundler):

{% highlight bash %}
  # config/setup_load_paths.rb

  if ENV['MY_RUBY_HOME'] && ENV['MY_RUBY_HOME'].include?('rvm')
    begin
      rvm_path     = File.dirname(File.dirname(ENV['MY_RUBY_HOME']))
      rvm_lib_path = File.join(rvm_path, 'lib')
      $LOAD_PATH.unshift rvm_lib_path
      require 'rvm'
      RVM.use_from_path! File.dirname(File.dirname(__FILE__))
    rescue LoadError
      # RVM is unavailable at this point.
      raise "RVM ruby lib is currently unavailable."
    end
  end
{% endhighlight %}

Now install Rails 2.3. Note that since newer versions of Rails are out, you'll need to specify which version of Rails to install, using the `-v` flag:

{% highlight bash %}
  gem install rails -v=2.3.8
{% endhighlight %}

Next it's time to install the gems used by the application. The database driver isn't typically listed in a Rails 2.3 app's `environment.rb`, so you'll need to install that first. Here's how I installed the MySQL driver (this is straight from the RVM documentation):

{% highlight bash %}
  $ ARCHFLAGS="-arch x86_64" gem install mysql -- --with-mysql-config=/usr/local/mysql/bin/mysql_config
{% endhighlight %}

Now install the rest of the gems used in the application. Did you double-check the versions used by your application?

{% highlight bash %}
  $ rake gems:install
{% endhighlight %}
  
Set up a virtual host for your application, restart it (either `touch tmp/restart.txt` or reboot Apache), and try it out. If it doesn't work, check the stack trace. Odds are a rogue gem is causing problems, or you didn't point to the right gemset in your `.rvmrc` file.

### Configure TextMate

Finally, let's make TextMate aware of the new configuration. Luckily, the RVM documentation on this topic is solid&mdash;rather than recreate it I'll just refer you there. One downside is you'll have to switch the gemset TextMate uses when you switch from project to project.

To set this up, I recommend following the [instructions on RVM and TextMate integration](http://rvm.beginrescueend.com/integration/textmate)/ on the RVM site. It's kind of a messy process, but it works. Hopefully this will be made easier in TextMate 2.

I've also read about issues with Ruby 1.9 and TextMate in this setup, but haven't gone about setting up a Ruby 1.9 environment yet. If you know something I don't, please comment below.

### That's it!

That was a lot of work, but hopefully worth the trouble: You now have a Rails development environment capable of running Rails 2.3 and Rails 3 applications simultaneously, with independent gemsets to help avoid potential conflicts. This should give you a solid platform on which to move forward with new development in Rails 3, while maintaining legacy code as needed (and hopefully getting it up-to-date as well).