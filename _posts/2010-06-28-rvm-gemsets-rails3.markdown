---
layout: post
title: "Stop procrastinating and install Rails 3 now with RVM"
excerpt: "Worried about Rails 3 disrupting your workflow? Here's how I use RVM's gemsets feature to keep my day-to-day development environment and Rails 3 distinct."
---

<div class="box note" markdown="1">
I've written a follow-up to this post for using the [Rails 3.1 beta with RVM](/2011/05/08/rails-3.1-beta-rvm.html).
</div>

A couple of weeks ago at a get-together of local developers, someone mentioned he hadn't checked out Rails 3 yet because he didn't want pre-release software mucking up his usual development environment. I don't blame him--this is a reason I also put off checking out earlier releases of Rails 3. That was before I got a new computer and set up Ruby from scratch, using the why-didn't-someone-think-of-this-sooner [Ruby Version Manager](http://rvm.beginrescueend.com/) (RVM). Simply put, RVM lets you have multiple versions of Ruby on your computer, and keeps these Rubies and any gems you install in your user account. No root access or `sudo` is required to install.

In addition to managing Ruby versions, RVM gives you a second killer feature--the ability to create _gemsets_, which are exactly what they sound like. Each Ruby version managed with RVM has its own set of gems configured to work with it, and each Ruby version can have multiple gemsets applied to it. Each gemset is distinct, so you can experiment with different versions of Ruby and different versions of gems without affecting your go-to configurations. In other words, you've got no excuses to not be tinkering with Rails 3 _right now_.

The tutorials on the RVM website cover all of the steps to get going, but they may require a little hunting and can be daunting if you don't know what you're doing. I use Mac OS X 10.6 for development; if you do as well then these steps should work for you. Steps 2 through 5 should fly for you if you're using a Linux distribution. If you're using Windows, check out [Pik](http://github.com/vertiginous/pik) for similar functionality (I have no experience with Pik myself).

## 1. Prerequisites

Depending on the installation method you choose, you may be good to go with a stock installation of your operating system. You may want to install Git if you haven't already to retrieve the latest versions of RVM or Rubies. I recommend [Homebrew](http://mxcl.github.com/homebrew/) for installing Git and other software packages for Mac OS X, though if you'd prefer a double-click installer there's [Git for OS X](http://code.google.com/p/git-osx-installer/).

## 2. Installation

The [RVM installation documentation](http://rvm.beginrescueend.com/rvm/install/) lists three options. I used the first option (installing from the GitHub repository via a single command). I'm not sure why installing from the gem is not recommended, other than you're apt to not get the latest version. For what it's worth, the [Railscasts episode on using RVM with Rails 3 Beta](http://railscasts.com/episodes/200-rails-3-beta-and-rvm) installs from GitHub. So, going that route, type:

{% highlight bash %}
  $ bash < <( curl http://rvm.beginrescueend.com/releases/rvm-install-head )
{% endhighlight %}

The real work begins with the post-installation steps (scroll down about halfway on the [installation documentation](http://rvm.beginrescueend.com/rvm/install/)). Locate your profile (by default on a Mac, that's `.bash_profile` inside your home directory; you may also have settings like `$PATH` in this file) and paste the following line at the bottom:

{% highlight bash %}
  [[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"
{% endhighlight %}

You can type the `source` command shown in the instructions, or open a new shell, to begin using RVM.

To install a particular version of Ruby, do like the following:

{% highlight bash %}
  $ rvm install 1.8.7
{% endhighlight %}

Then switch to that Ruby with

{% highlight bash %}
  $ rvm 1.8.7
{% endhighlight %}

The RVM documentation provides [a complete list of Ruby interpreters available](http://rvm.beginrescueend.com/interpreters/)

See a list of all your installed Rubies with

{% highlight bash %}
  $ rvm list
{% endhighlight %}

And pick a default Ruby interpreter with

{% highlight bash %}
  $ rvm 1.8.7 --default
{% endhighlight %}

<div class="alert alert-info" markdown="1">
**Which Rubies should I install?** That depends on your particular development needs. I have 1.8.7, 1.9.1, and REE (Ruby Enterprise Edition) installed.
</div>

## 3. Rails 3 gemset

At this point you can install Rails 2.3.8 and any other gems in your default environment, and continue using them for your day-to-day Rails development. You can also create a compartmentalized area called a _gemset_ for experimenting with Rails 3.

The basic syntax to get started is

{% highlight bash %}
  $ rvm gemset create rails3
{% endhighlight %}

where `rails3` is your gemset's name. You can use another version of Ruby if you'd prefer&mdash;in fact, it might not be a bad idea to start getting familiar with Ruby 1.9.1 as long as you're enabling your computer to handle multiple Rubies and Rails versions.

<div class="alert alert-info" markdown="1">
You can copy gemsets from Ruby to Ruby; see the [RVM documentation](http://rvm.beginrescueend.com/gemsets/copying/) for details.
</div>

Now type

{% highlight bash %}
  $ rvm 1.8.7@rails3
{% endhighlight %}

to switch to the new gemset. A quick

{% highlight bash %}
  $ gem list --local
{% endhighlight %}

shows the gemset is empty; change that with

{% highlight bash %}
  $ gem install rails --pre
{% endhighlight %}

to install the current pre-release version of Rails.

Read the [RVM documentation on gemsets](http://rvm.beginrescueend.com/gemsets/basics/) for more usage examples for gemsets--but for all intents and purposes, we're ready to roll with Rails 3.

*Update:* Reader Sutto points out that you can create and switch to a new gemset in one fell swoop with

{% highlight bash %}
  $ rvm use 1.8.7@rails3 --create
{% endhighlight %}

## 4. Passenger setup (optional)

If you're using Passenger on your development computer, and want to keep using it with RVM, you'll need to make a few tweaks to your web server configuration. In my case, I'm using the default installation of Apache in Mac OS X. Looking at the [documentation on integrating Passenger with RVM](http://rvm.beginrescueend.com/integration/passenger/), you'll see there are a few steps involved here. It confused me a little the first time I ran through it, but here's the rundown:

First, switch to the Ruby version you want to use with Passenger, if necessary. In the documentation they're using REE but you can use any Ruby you've installed with RVM.

Next, install the Passenger gem as usual, with the exception that you'll run the script to install the Passenger module for the web server via rvm (I guess I'm a "tomahawk chucker").

Finally, edit your web server configuration file (in the case of Apache on OS X, that's `/etc/apache2/httpd.conf`). This is what I wound up having to do to get mine to work:

{% highlight apache %}
  LoadModule passenger_module /Users/everydayrails/.rvm/gems/ruby-1.8.7-p249/gems/passenger-2.2.11/ext/apache2/mod_passenger.so
  PassengerRoot /Users/everydayrails/.rvm/gems/ruby-1.8.7-p249/gems/passenger-2.2.11
  PassengerRuby /Users/everydayrails/.rvm/bin/passenger_ruby
{% endhighlight %}

<div class="alert alert-info" markdown="1">
Did you copy and paste the above and it didn't work? Remember, RVM installs Rubies and gems inside _your home folder_, so these settings point to those files. Unless your account name is also `everydayrails` you'll need to update these paths accordingly.
</div>

Reboot Apache and you should be good to go. For the record, I'm about to switch my server settings to use REE instead of 1.8.7, to better reflect a production environment.

## 5. MySQL (optional)

First, install MySQL the way you normally would (if you haven't already). You can use Homebrew, or you can download an installer for your operating system. I went with the latter--if you're using Leopard or Snow Leopard, _make sure you download and install the 64-bit version_.

Then, follow the instructions provided in the [RVM documentation](http://rvm.beginrescueend.com/integration/databases/) to finish. Specifically, you'll add the following to `~/.rvmrc`:

{% highlight bash %}
  rvm_archflags="-arch x86_64"
{% endhighlight %}

And install the MySQL Ruby gem via:

{% highlight bash %}
  export ARCHFLAGS="-arch x86_64" ; gem install mysql -- --with-mysql-config=/usr/local/mysql/bin/mysql_config
{% endhighlight %}

(Adjust your path to MySQL's `bin` directory if needed; what's above is the default installation.)

<div class="alert alert-info" markdown="1">
## Don't forget!

* Aside from integrating Passenger with your web server, _you won't use `sudo` to install gems anymore_.
* You'll need to install gems for _each Ruby and each gemset you've installed using RVM_. In other words, a gem you installed in one gemset won't work in a second unless you install the gem in the second gemset, too.
</div>