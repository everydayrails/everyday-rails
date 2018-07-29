---
layout: post
title: "Building Rails apps faster with Nifty Generators, part 3: nifty_scaffold"
excerpt: "Scaffolds are great when you're learning Rails, but the nifty_scaffold generator makes them effective timesavers when you're working on an app."
---

In my last two posts, I shared how I use Ryan Bates' Nifty Generators gem to create starter layouts for my Rails applications and add a configuration file with variables for use throughout my app. While extremely useful, `nifty_layout` and `nifty_config` probably aren't utilities you'll make use of day in and day out as your application evolves. With each new model you add to your app, though, `nifty_scaffold` will come in useful.

The default scaffolds in Rails are good to start, but they've got their shortcomings. It's not hard to find criticisms elsewhere online, so I'll just mention the two things that bugs me the most: First, they don't generate un-DRY code, particularly for forms. Second, you're stuck with Erb-formatted views and Test::Unit for a testing framework--if you want options, you're kind of stuck.

So why is `nifty_scaffold` better? Basically because it addresses those shortcomings. It's much more flexible than what comes out of the box with Rails. Here's a simple model to store information about restaurants--in this case, the name, location (city and state), and a description:

{% highlight bash %}
  $ script/generate nifty_scaffold restaurant name:string \
  city:string state:string description:text
{% endhighlight %}

<div class="alert alert-info">
  <p><strong>Reminder:</strong> I'm still using Rails 2.3; if you're on Rails 3 use `rails generate nifty_scaffold` instead.</p>
</div>

So what does this generator give us? Let's look at the list returned in the terminal. First, it's created my model and the migration to go along with it:

{% highlight bash %}

  exists  app/models
  create  app/models/restaurant.rb
  exists  db/migrate
  create  db/migrate/20100531151422_create_restaurants.rb

{% endhighlight %}

It's also created test files for Test::Unit (you can override this with RSpec or Shoulda if you prefer):

{% highlight bash %}

  exists  test/unit
  create  test/unit/restaurant_test.rb
  exists  test/fixtures
  create  test/fixtures/restaurants.yml
  exists  test/functional
  create  test/functional/restaurants_controller_test.rb
  
{% endhighlight %}

Next up is the controller, helper, and nice DRY views (notice the `_form.html.erb` partial, which is referred to by both new and edit):

{% highlight bash %}

  exists  app/controllers
  create  app/controllers/restaurants_controller.rb
  exists  app/helpers
  create  app/helpers/restaurants_helper.rb
  create  app/views/restaurants
  create  app/views/restaurants/index.html.erb
  create  app/views/restaurants/show.html.erb
  create  app/views/restaurants/new.html.erb
  create  app/views/restaurants/edit.html.erb
  create  app/views/restaurants/_form.html.erb

{% endhighlight %}

Finally, your RESTful routes:

{% highlight bash %}

   route  map.resources :restaurants

{% endhighlight %}

Run your migrations, and you're ready to go.

If you're like me and prefer Haml to Erb, you can render your view templates to suit by including `--haml` at the end of your command:

{% highlight bash %}
  $ script/generate nifty_scaffold restaurant name:string \
  city:string state:string description:text --haml
{% endhighlight %}

You can also tell the generator to create some default model and controller specs in RSpec (or Shoulda) instead of the default Test::Unit by passing along `--rspec`:

{% highlight bash %}
  $ script/generate nifty_scaffold restaurant name:string \
  city:string state:string description:text --rspec
{% endhighlight %}

Finally, you can automatically stage the new files for your next commit to a Git repository by passing `--git`. I personally don't do this because I usually tweak a few things prior to staging.

{% highlight bash %}
  $ script/generate nifty_scaffold restaurant name:string \
  city:string state:string description:text --git
{% endhighlight %}

<div class="alert alert-info">
  <p>Of course, you can pass along any or all of these flags as needed--you don't need to pick one.</p>
</div>

That's just a bit of what you can crank out with `nifty_scaffold`, but there are several more flags it provides. I don't use these very often myself, but it's possible to do things like only create a model (or only create a controller and views), omit Rails' default timestamps from your model (to be fair, regular scaffolds can do this as well), or indicate specific methods your controller needs (or does not need). The best way to see everything you can accomplish with `nifty_scaffold` is to check out its help file:

{% highlight bash %}
  $ script/generate nifty_scaffold --help
{% endhighlight %}

Like with regular Rails scaffolds, if you're not sure what a given call to `nifty_scaffold` is going to do, pass `--pretend` along with the rest to see a list of which files will be added or modified by the scaffold. For example,

{% highlight bash %}
  $ script/generate nifty_scaffold restaurant name:string \
  cuisine:references is_chain:boolean --rspec --haml --pretend
{% endhighlight %}

That wraps up our tour of Nifty Generators. As I've been saying, the three components of this gem are extremely useful for Rails developers of all skill levels--they're easy to follow for newcomers, and great timesavers for more advanced users who would prefer to get on to the more interesting aspects of their Rails applications.