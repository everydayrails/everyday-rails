---
layout: post
title: "Building Rails apps faster with Nifty Generators, part 1: nifty_layout"
excerpt: "Nifty Generators make scaffolding in Rails an even more effective way to get your Rails app off the ground quickly. Here's how I use this handy gem to create a basic layout and stylesheet for my app."
---

Moving along with the steps I follow to create a new Rails application, I want to get into a little detail on some of the specific steps I outlined previously. These are the first steps in taking a Rails app beyond the default shell and making it do what you need to get done. While most of the steps I went through last week are familiar to anyone who's set up a Rails application before, in the next few posts I want to talk about [Nifty Generators](http://github.com/ryanb/nifty-generators), a set of useful generator methods to simplify customization of your application. You may be familiar with Nifty Generators and not realize it--if you've ever watched an episode of [Railscasts](http://railscasts.com/), Ryan Bates' popular screencast series about Ruby on Rails, you've probably seen Nifty Generators in action. Ryan created Nifty Generators and uses them in almost every example he provides in the series.

In my previous posts about [bootstrapping a Rails app by hand](/2010/05/19/bootstrapping-a-rails-app.html) and [bootstrapping using an app template](/2010/05/22/bootstrapping-rails-template.html) I showed how to use Nifty Generators' `nifty_layout` and `nifty_config` methods to create a nice layout file for your views and a global configuration file for your Rails environments, respectively:

{% highlight bash %}
  $ script/generate nifty_layout --haml
  $ script/generate nifty_config
{% endhighlight %}

So what do these two generators actually do? In this post I'll talk about `nifty_layout`, which essentially does three things. First, it generates a layout template for your application at `app/views/layouts/application.html.haml`. In my case, this is a Haml-formatted file since I passed the `--haml` flag; leaving it off would generate `/app/views/layouts/application.html.erb` if that's your markup preference.

Second, the generator adds a stylesheet for my app at `/public/stylesheets/sass/application.sass` (foregoing the `--haml` flag would generate a standard CSS file at `/public/stylesheets/application.css`). By default, this gives your Rails app the look and feel of a Railscasts tutorial, which I find to be a nice, clean interface for getting started with my apps.

Finally `nifty_layout` creates the file `app/helpers/layout_helper.rb`. This file adds one particularly useful feature to help you DRY up your view templates. Essentially, within a given view template, the Haml-formatted line

{% highlight haml %}
  - title 'My awesome scaffold'
{% endhighlight %}

renders my view's title in two places: Inside an `<h1>` element, and in the `<title>` element.

If for some reason I only want the title to show within `<title>`, I can use
  
{% highlight haml %}
  - title "Just show this in the title element", false
{% endhighlight %}

If you take a look at the code in `app/views/layouts/application.html.haml` (or `app/views/layouts/application.html.erb`) you can see what's going on here--when the optional `show_title` value is passed to the `title` helper method, it helps the layout determine whether or not to render an `<h1>` element for the page. In the case above, I passed `false` for this value, so the `<h1>` is not rendered.

Note also that the `title` helper method doesn't actually handle _printing_ the title; it just prepares it for the layout to print to the screen. This is subtle, but important. It means I don't use `= title 'my title'` in Haml or `<%= title 'my title' %>` in Erb; I just use `- title 'my title'` or `<% title 'my title' %>`, respectively.

That makes up pretty much all of my use of `nifty_layout`, but there's more to this generator. Take a look at its help file by typing

{% highlight bash %}
  $ script/generate nifty_layout --help
{% endhighlight %}

That's it for `nifty_layout`--next time I'll talk about how I use its parter, `nifty_config`, to simplify my apps' global settings.

<div class="alert alert-info" markdown="1">
#### Tip:

When using generated code like that from `nifty_layout`, take time to look over the code to familiarize yourself with what it does and how it works. Not only will this practice help make sure you use the generated code as intended, it also gives you the chance to see how a seasoned developer like Ryan Bates writes code. In this case, you can pick up some tips on refactoring your view code into helpers and layouts.
</div>