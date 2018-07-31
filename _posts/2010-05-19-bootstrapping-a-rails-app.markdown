---
layout: post
title: Bootstrapping a Rails application
excerpt: "The process of creating a new Rails application is straight from Rails 101, but there are a few steps you can add early on to help you code more efficiently down the road."
---

Let's kick off this series with a quick look at the process I follow every time I start a new Rails project. Generally speaking, I know this is remedial course material for Rails developers. However, I've been asked about my approach to starting a Rails app by more than one person, so I figured others would benefit as well. I'm going to assume that you've got Ruby and Rails installed and configured on your computer, and that hopefully you've created an application already to verify that your setup is working.

So let's get started and create that app (which, in this example, will use Rails 2.3.5). For what it's worth, on my Mac I keep all of my application development in my `Sites/Rails` folder.

{% highlight bash %}
  $ rails -d mysql appname
{% endhighlight %}

The `-d` flag allows you to specify a database engine; in this case I'm using MySQL. If I typed `rails appname` it would use the default SQLite3 engine, which is fine for general development but can be frustrating to use in a command line environment.

Next I'll edit my `config/database.yml` file. In particular, I enter my database login credentials (if necessary) and remove the production environment settings since I don't use them on my development computer. My final `database.yml` file winds up looking something like

{% highlight yaml %}
  development:
    adapter: mysql
    encoding: utf8
    reconnect: false
    database: appname_development
    pool: 5
    username: root
    password:
    socket: /tmp/mysql.sock

  test:
    adapter: mysql
    encoding: utf8
    reconnect: false
    database: appname_test
    pool: 5
    username: root
    password:
    socket: /tmp/mysql.sock
{% endhighlight %}

Now I'll create my databases for the development and test environments. Not necessary if you're using SQLite3 as your database engine.

{% highlight bash %}
  $ rake db:create:all
{% endhighlight %}

So far, everything has been pretty by-the-book in terms of setting up a Rails application from scratch. From here, I get into some of the specific tools I use to code my apps.

I use [Haml](http://haml-lang.com/) instead of ERb for my views. Haml gives me much cleaner code, and it's true that Haml speeds things up when it comes to tweaking views to get them how you want. When you install Haml, you also install Sass--an alternative to traditional CSS that lets you include variables, cleaner nested styles, and "mixins" for reusable code. If you haven't done so already, install the Haml gem:

{% highlight bash %}
  $ sudo gem install haml
{% endhighlight %}

After that, you need to install the Haml plugin in your app using the next command. This step is optional, so if you'd prefer to use ERb for your views and CSS for your stylesheets, then skip it.

{% highlight bash %}
  $ haml --rails .
{% endhighlight %}

I'm also a big fan of the [Nifty Generators](http://github.com/ryanb/nifty-generators) gem, created by Ryan Bates of [Railscasts](http://railscasts.com/) fame. For one thing, its default look-and-feel for scaffolds is a little nicer than the Rails default. I also like the code it generates for my controllers, and if you're with me on using Haml, you can tell it to generate Haml instead of ERb (and RSpec instead of Test::Unit, but that's another post for another time). The first line creates a layout file for your application, a default stylesheet, and a helper file to help DRY up your views with a `title` method.

The second line is also pretty handy. It generates a configuration file for your application, so you can specify site-wide variables that are dependent on your current environment. For example, say your app has a mailer, and you want messages sent to one address during development, and a different address during production. The nifty_config generator makes that easy. I'll cover Nifty Generators more in a future post, but in the meantime you can prepare your application for these very handy features with the following:

{% highlight bash %}
  $ script/generate nifty_layout --haml
  $ script/generate nifty_config
{% endhighlight %}

Next I'll get rid of the index.html and rails.png files that Rails installs by default. You can do this later if you want; I just like getting this out of the way.

{% highlight bash %}
  $ rm public/index.html
  $ rm public/images/rails.png
{% endhighlight %}

Now, assuming you're using Git for version control, 

{% highlight bash %}
  $ git init
{% endhighlight %}

There are several files in your application that Git doesn't need to track, so create a file called `.gitignore` and list them. You can, of course, add to this as your application grows, but here's a good start:

{% highlight text %}
  config/database.yml
  *~
  *.cache
  *.log
  *.pid
  tmp/**/*
  .DS_Store
  tmp/restart.txt
{% endhighlight %}

At this point I'll make my first code commit:

{% highlight bash %}
  $ git commit -a -m "create basic rails application"
{% endhighlight %}

Finally, I'll configure Passenger to serve my new application, using the Passenger preference pane. Setting up Passenger is well beyond the scope of this post, so I'll try to cover it in the future. For now, if you're not using Passenger, you can launch your app with the standard

{% highlight bash %}
  $ script/server
{% endhighlight %}

Point your browser to `http://localhost:3000` and you'll get an error message, since you haven't created any scaffolds yet and deleted the default `index.html` file in the `public` directory. But everything else is good to go--commence coding!

That's all there is to it. After a few times you should be able to have your Rails applications bootstrapped in just a couple of minutes. Of course, you can save even more time by using Rails application templates, but I think it's a good idea to become familiar with the steps before automating them.