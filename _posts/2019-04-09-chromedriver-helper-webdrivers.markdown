---
layout: post
title: "Replace chromedriver-helper with webdrivers (a public service announcement)"
excerpt: "My recommended setup for testing JavaScript in Rails has changed. Read on to learn about the switch to webdrivers."
---

_chromedriver-helper_ is no longer supported. If you try to install it or upgrade to a newer version, you'll be greeted with this announcement:

{% highlight text %}
+--------------------------------------------------------------------+
|                                                                    |
|  NOTICE: chromedriver-helper is deprecated after 2019-03-31.       |
|                                                                    |
|  Please update to use the 'webdrivers' gem instead.                |
|  See https://github.com/flavorjones/chromedriver-helper/issues/83  |
|                                                                    |
+--------------------------------------------------------------------+
{% endhighlight %}

As the message suggests, if you need to test JavaScript within the confines of a Rails app, then _webdrivers_ is how you'll want to manage Selenium drivers. If you've purchased my Rails testing book, _[Everyday Rails Testing with RSpec](https://leanpub.com/everydayrailsrspec)_, you can download an updated version from Leanpub that uses webdrivers.

This switch is a good move overall. webdrivers provides support for non-Chrome browsers, and is more actively maintained. And, from my experience, making the switch is mostly a one-line replacement. Open your _Gemfile_ and make the swap:

{% highlight diff %}
 group :test do
-  gem 'selenium-webdriver'
-  gem 'chromedriver-helper'
+  gem 'webdrivers'
   # other test-only dependencies ...
 end
{% endhighlight %}

Since webdrivers brings in _selenium-webdriver_ as a dependency, I've been removing it from my apps' own explicit dependencies. If you use Spring, you may need to stop it with `bin/spring stop`, then run your tests as usual. Assuming things were working before with chromedriver-helper, they should continue to work using webdrivers.

The only exception I've found to that is on a computer where I had a dev channel version of Chrome installed. While working to upgrade the source for my book, I ran into the following failure:

{% highlight text %}
Failures:

  1) Tasks user toggles a task
     Failure/Error: visit root_path

     Net::HTTPServerException:
       404 "Not Found"
     # /Users/asumner/.rvm/gems/ruby-2.4.1/gems/webdrivers-3.7.1/lib/webdrivers/common.rb:109:in `get'
     # /Users/asumner/.rvm/gems/ruby-2.4.1/gems/webdrivers-3.7.1/lib/webdrivers/chromedriver.rb:26:in `latest_version'
     # /Users/asumner/.rvm/gems/ruby-2.4.1/gems/webdrivers-3.7.1/lib/webdrivers/common.rb:37:in `desired_version'
<... more stack trace ...>
     # ./spec/features/tasks_spec.rb:11:in `block (2 levels) in <top (required)>'
     # /Users/asumner/.rvm/gems/ruby-2.4.1/gems/spring-commands-rspec-1.0.4/lib/spring/commands/rspec.rb:18:in `call'
     # -e:1:in `<main>'

Finished in 4.71 seconds (files took 0.59138 seconds to load)
46 examples, 1 failure

Failed examples:

rspec ./spec/features/tasks_spec.rb:4 # Tasks user toggles a task
{% endhighlight %}

At first glance, I thought my app was returning a 404 for some reason, but that didn't make sense. After digging into the gem's source, I found the 404 was coming from Google's servers, attempting to download the latest ChromeDriver version from the dev channel. I was on a tight schedule, and replacing my dev channel Chrome with a standard install fixed the issue. (This may have been solved by now; I'll dig back in and update this post accordingly as I know more.)

I've also read about issues using webdrivers alongside VCR. I didn't run into these issues myself, but [workarounds are now documented](https://github.com/titusfortner/webdrivers/wiki/Using-with-VCR-or-WebMock).

Thanks to Junichi Ito for [sharing this issue with me](https://github.com/everydayrails/everydayrails-rspec-2017/issues/100), thanks to [Mike Dalessio](https://github.com/flavorjones) for his work on chromedriver-helper, and thanks to you for reading. I hope you find this information helpful.
