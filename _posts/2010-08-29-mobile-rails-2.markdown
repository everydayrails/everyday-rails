---
layout: post
title: "Mobile Rails applications, part 2: jQTouch with Rails 3"
excerpt: "Continuing on my project to build a mobile-friendly Rails application, here's a look at making the jQTouch mobile framework talk to your Rails application."
---

In my [last post](/2010/08/22/mobile-rails-1.html) I shared my first steps toward creating a mobile version of a Rails application. I looked at the Mobile Fu plugin, but wasn't happy with how it played with other parts what you might want to do with a Rails application. So referring to a couple of screencasts I moved forward with hand-rolling my mobile detection code&mdash;as it turns out, it's not hard at all to do. 

## Prerequisites

I'll assume you've watched the [Railscasts episode on mobile websites](http://railscasts.com/episodes/199-mobile-devices) and followed the steps in it to prepare your application for mobile devices. Although it was written with Rails 2.3 in mind, I'm not having problems with it in Rails 3 RC 2.

The Railscast is an excellent start, but after watching [Peepcode's episode on jQTouch](http://peepcode.com/products/jqtouch) I learned a few small touches I'd been missing to make my app work like an _app_. If you're still getting a feel for jQTouch, the Peepcode episode is worth the money. It doesn't cover some things I want to get into later (like theming), but it is more than enough to get you started with a mobile Rails application.

## Layout file

My mobile layout file is mostly the same as Railscasts' version; I just converted it to Haml. I had a problem with indentation when I used `html2haml`, but that was easily fixed (note: like the Railscasts code, I'm also using the Nifty Generators gem). I removed the line that generates a Back button in the layout because based on what I know about jQTouch I think it needs to be in the view that needs a Back button to exist. This could be refactored but I'll worry about that later.

Here's what my layout currently looks like, using jQTouch's Apple theme:

{% highlight haml %}
  # app/views/layouts/application.mobile.haml
  
  !!! Strict
  %html{html_attrs}
    %head
      %meta{:charset => "UTF-8"}/
      %title= yield(:title) || "Untitled"
      = stylesheet_link_tag "/jqtouch/jqtouch.min.css", "/jqtouch/themes/apple/theme.min.css"
      = javascript_include_tag "/jqtouch/jquery.1.3.2.min.js", "/jqtouch/jqtouch.min.js", 'mobile'
      = yield(:head)
    %body
      .current
        - if show_title?
          .toolbar
            %h1= h yield(:title)
            = link_to "Full Site", root_url(:mobile => 0), :class => "button", :rel => "external"
            = yield(:toolbar)
        - unless flash.empty?
          .info
            - flash.each do |name, msg|
              = content_tag :div, msg, :id => "flash_#{name}"
        = yield
        
{% endhighlight %}

## Controller

This is another thing I picked up from Peepcode: Code for mobile views must be rendered without a layout; jQTouch then correctly replaces the `current` div with the code from the server and properly does the right-to-left slide transition.

{% highlight ruby %}
  # app/controllers/recipes_controller.rb

  def show
    @recipe = Recipe.find(params[:id])
    respond_to do |format|
      format.html
      format.mobile { render :layout => false }
    end
  end

{% endhighlight %}

## Views

First, here's what the `index` method's view looks like. It returns a basic unordered list of my recipes, each with the `arrow` style that jQTouch uses.

{% highlight haml %}
  # app/views/recipes/index.mobile.haml

  - title Recipes

  %ul.rounded
    - @recipes.each do |recipe|
      %li.arrow
        = link_to recipe.name, recipe
        = link_to recipe.total_time, recipe
{% endhighlight %}

Second, the view for my `show` method. Note that the `.toolbar` code is duplicated here; I haven't done any refactoring of this yet but will eventually create a helper to handle this. Note I have the `.toolbar` here, with a Back button.

{% highlight haml %}
  # app/views/recipes/show.mobile.haml
  
  - title @recipe.name

  %div#recipe
    .toolbar
      = link_to "Back", nil, :class => "back"
      %h1= Recipes
    - unless flash.empty?
      .info
        - flash.each do |name, msg|
          = content_tag :div, msg, :id => "flash_#{name}"

    %h2= @recipe.name

    %ul.rounded
      %li= "Prep time: #{@recipe.prep_time}"
      %li= "Cook time: #{@recipe.cook_time}"
      %li= "Total time: #{@recipe.total_time}"
      %li= "Servings: #{@recipe.servings}"

    %h2 Ingredients

    %ul.rounded
      - @recipe.ingredients.split("\r\n").each do |ingredient|
        %li= ingredient

    %h2 Directions

    %ul.rounded
      - @recipe.directions.split("\r\n").each do |step|
        %li= step

{% endhighlight %}

## Next steps

I still have a few things to do, for a future post. First, I want to build in some better mobile device detection so I can give high end mobile users a rich experience while still providing content for devices without the bells and whistles (hopefully another look at the Mobile Fu code will help with that). Second, I want to put in some authentication with Devise. Finally, I want to experiment more with jQTouch's theming system to give my little application a more universal user interface.

In the meantime, if you have any questions or suggestions, please drop a comment below.