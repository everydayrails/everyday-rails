---
layout: post
title: "Building Rails apps faster with Nifty Generators, part 2: nifty_config"
excerpt: "Nifty Generators does more than just view-related code; here's an easy way to create a global config file for your app."
---

Continuing with my series on the [Nifty Generators](http://github.com/ryanb/nifty-generators) gem by Ryan Bates (see [part 1 on nifty_layout](/2010/05/25/nifty-generators.html)), in this post I want to talk about a second feature this gem provides, called `nifty_config`. With `nifty_config`, you can quickly create a set of global variables for your application, dependent on the environment in which your Rails application is currently running.

To get started, generate a config file:

{% highlight bash %}
  $ script/generate nifty_config
{% endhighlight %}

This adds two files to your app: A configuration file called `app_config.yml` located inside `config`, and an initializer (to load the config file when your Rails app starts) in `config/initializers`.

{% highlight yaml %}
  development:
    domain: localhost:3000

  test:
    domain: test.host

  production:
    domain: example.com
{% endhighlight %}

From there you can customize the default values created by the generator. For example, I use the Passenger preference pane for Mac OS X to manage multiple local development environments, instead of running `script/server` within my apps. The preference pane defaults to `appname.local` as its convention, so I use that as my local domain.

You can also add your own values to the YAML file. For me, the most useful addition is an e-mail address for mailers to use when sending e-mail. I might use a personal account during development, but a more official contact address once the app is in production. I sometimes also include a `name` value for each environment, mainly because there are times I'll start on application development before I know what it's going to be called--so I use some sort of code name during development, and want to have placeholders for the final name. This isn't always a good practice, but it generally works for me. It's no substitute for error-checking your views and your copy before deployment, though.

Here's what a completed `config.yml` file might look like for me:

{% highlight yaml %}
  development:
    name: My Great App Development
    domain: mygreatapp.local
    email: devaccount@mygreatapp.com

  test:
    name: My Great App Test
    domain: test.host
    email: devaccount@mygreatapp.com

  production:
    name: My Great App
    domain: mygreatapp.com
    email: help@mygreatapp.com
{% endhighlight %}

<div class="alert alert-info" markdown="1">
**Don't forget:** The values in your `app_config.yml` file are loaded when your application starts, so you'll need to restart your application after you first create the file or whenever you make changes to its values.
</div>

From there, it's just a matter of calling up your values wherever they're needed. All you need to do is refer to `APP_CONFIG[:value]` within your application's code to use whatever you assigned to `value` in your `config.yml` file, for the environment in which your app is currently running. For example, given the above configuration file, `APP_CONFIG[:email]` would return `devaccount@mygreatapp.com` if I were running the code in development mode; it would return `help@mygreatapp.com` if I were in production.

So in a standard Rails view file, you might include your application's name like

{% highlight erb %}
  <h1>Welcome to <%= APP_CONFIG[:name] %>!</h1>
{% endhighlight %}

Using Haml, I'd write the above like

{% highlight haml %}
  %h1= "Welcome to #{APP_CONFIG[:name]}!"
{% endhighlight %}

Or in a mailer model like

{% highlight ruby %}
  def message(sent_at = Time.now)
    subject    "#{APP_CONFIG[:name]}: New message received"
    recipients @message.recipient.email
    from       APP_CONFIG[:email]
    sent_on    sent_at
    
    body       :greeting => 'Hi,'
  end
{% endhighlight%}

Here's a simple example of using APP_CONFIG values outside of view-type files. In this case, I wanted to limit the number of people who could create accounts while I was scaling up. I created a `max_users` value in my `app_config.yml` file, then called the below method with a `before_filter` call in the controller that created new user accounts.

{% highlight ruby %}

  def room_for_user?
    if User.count >= APP_CONFIG[:max_users]
      flash[:error] = 'Sorry, we have all the users we can handle right now.'
      redirect_to root_path
      false
    else
      true
    end
  end

{% endhighlight %}

That's all for Nifty Generators' nifty_config feature. These are my uses for it, but I recommend experimenting with it in your own apps. Next time I'll close out my series on Nifty Generators with `nifty_scaffold`, the real meat of this very useful gem.

<div class="alert alert-info" markdown="1">
**How am I doing?** I'm still getting a feel for this blog and how to write for it. If you're reading (thanks, by the way) I'd love to hear what you think of what I've written so far. Please leave a comment with any input you care to share.
</div>