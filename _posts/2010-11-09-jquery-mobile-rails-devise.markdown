---
layout: post
title: "jQuery Mobile, Rails, and Devise"
excerpt: "jQuery Mobile is easy to integrate with Rails and Devise to create authenticated, mobile-friendly web applications."
---

Mobile web frameworks are taking off, and developers now have a number of options for making great-looking mobile-optimized web applications with relative ease. In the past I covered jQTouch, a jQuery-based JavaScript framework (see [part one](/2010/08/22/mobile-rails-1.html) and [part two](/2010/08/29/mobile-rails-2.html) of my work), but ran into frustrations when trying to integrate it with the likes of [Devise](https://github.com/plataformatec/devise). Meanwhile, [jQuery Mobile](http://jquerymobile.com)/, from the jQuery Group themselves, has been released and shows great promise, especially if you need to get a mobile version up and running within an existing application.

### Background reading

To start, I recommend reading through Jarod Santo's [excellent introduction to using jQuery Mobile with Rails 3](http://fuelyourcoding.com/getting-started-with-jquery-mobile-rails-3)/. It goes through the steps of integrating the mobile framework into a standard CRUD scaffold. However, to make your app both mobile and desktop-savvy, you'll probably want to do some browser detection like that covered in the [Railscasts episode on mobile web apps](http://railscasts.com/episodes/199-mobile-devices). Depending on the mobile devices you want to support (jQuery Mobile should eventually support most mobile platforms) you may need to change the regular expression Ryan uses to detect mobile browsers.

Just for clarification: You'll need to bounce back and forth between the two tutorials, especially if you're still getting comfortable with Rails 3. Start with Jarod's tutorial to get your application set up and jQuery installed. Then follow the Railscasts example to add mobile detection, but replace any jQTouch-specific steps and views with those from the jQuery Mobile tutorial. Your views will be named <em>index.mobile.erb</em>, <em>show.mobile.erb</em>, etc., and sit alongside your standard browser-friendly views.

We're going to use Devise to handle our app's authentication, so if you haven't done so yet, install Devise and create a User model. (New to Devise? [Refer to the Railscasts tutorial](http://railscasts.com/episodes/209-introducing-devise) and the [GitHub project](https://github.com/plataformatec/devise).) Specifically, we'll be working more with the Devise views in a minute.

This is by no means a template for creating your mobile app, but here are some ideas to help you get started.

### Application code tweaks

First off, here is a mobile application layout. Mine's a little different from Jarod's in that I've moved rendering of the `header` div to my layout file. Here I've got a Nifty Generators-like `@title` value that gets set in individual views, but is rendered in the right place. Otherwise, I have a straightforward conditional to display either a Sign In or Sign Out button. Any thoughts on how to properly display my app's flash messages here?

{% highlight erb %}
<!-- views/layouts/application.mobile.erb -->

<!DOCTYPE html>
<html>
<head>
  <title>Jqmoblog</title>
  <link rel="stylesheet" href="/stylesheets/jquery.mobile.css" />
  <%= javascript_include_tag :defaults %>
  <script src="/javascripts/jquery.mobile.js"></script>
  <%= csrf_meta_tag %>
</head>
<body>  
  <div data-role="page"> 
    <div data-role="header">
      <h1><%= @title || 'Mobile App' %></h1>
      <% unless user_signed_in? %>
        <%= link_to 'Sign In', new_user_session_path, "class" => "ui-btn-right" %>
      <% else %>
        <%= link_to 'Sign Out', destroy_user_session_path, "class" => "ui-btn-right" %>
      <% end %>
    </div>
       
    <%= yield %>
  </div>
</body>
</html>
{% endhighlight %}

Since I moved the `header` div to the layout, I've removed it from the views corresponding to `posts_controller.rb`. That makes things look something like this:



### Devise views

If you haven't done so already, generate a copy of the Devise views into your application:

{% highlight bash %}
  $ rails g devise:views
{% endhighlight %}

We're going to add mobile versions of a few Devise view templates. To start, let's make a mobile sign in form:

{% highlight erb %}
<!-- views/devise/sessions/new.mobile.erb -->
<% @title = 'Sign In' %>

<div data-role="content">
  <%= form_for(resource, :as => resource_name, :url => session_path(resource_name)) do |f| %>
    <p><%= f.label :email %><br />
    <%= f.text_field :email %></p>

    <p><%= f.label :password %><br />
    <%= f.password_field :password %></p>

    <% if devise_mapping.rememberable? -%>
      <p><%= f.check_box :remember_me %> <%= f.label :remember_me %></p>
    <% end -%>

    <p><%= f.submit "Sign in" %></p>
  <% end %>

  <%= render :partial => "devise/shared/links" %>
</div>
{% endhighlight %}

The shared links (displayed depending on the Devise modules your application is using) could be made to look a little more like buttons:

{% highlight erb %}
<!-- views/devise/shared/_links.mobile.erb (make them buttons?) -->

<div data-inline="true">
  <%- if controller_name != 'sessions' %>
    <%= link_to "Sign in", new_session_path(resource_name), "data-role" => "button" %>
  <% end -%>

  <%- if devise_mapping.registerable? && controller_name != 'registrations' %>
    <%= link_to "Sign up", new_registration_path(resource_name), "data-role" => "button" %>
  <% end -%>

  <%- if devise_mapping.recoverable? && controller_name != 'passwords' %>
    <%= link_to "Forgot your password?", new_password_path(resource_name), "data-role" => "button" %>
  <% end -%>

  <%- if devise_mapping.confirmable? && controller_name != 'confirmations' %>
    <%= link_to "Didn't receive confirmation instructions?", new_confirmation_path(resource_name), "data-role" => "button" %>
  <% end -%>

  <%- if devise_mapping.lockable? && resource_class.unlock_strategy_enabled?(:email) && controller_name != 'unlocks' %>
    <%= link_to "Didn't receive unlock instructions?", new_unlock_path(resource_name), "data-role" => "button" %>
  <% end -%>
</div>
{% endhighlight %}

Finally, here's a mobile login form:

{% highlight erb %}
<!-- views/devise/registrations/new.mobile.erb -->

<% @title = 'Sign In' %>

<div data-role="content">
  <%= form_for(resource, :as => resource_name, :url => session_path(resource_name)) do |f| %>
    <p><%= f.label :email %><br />
    <%= f.text_field :email %></p>

    <p><%= f.label :password %><br />
    <%= f.password_field :password %></p>

    <% if devise_mapping.rememberable? -%>
      <p><%= f.check_box :remember_me %> <%= f.label :remember_me %></p>
    <% end -%>

    <p><%= f.submit "Sign in" %></p>
  <% end %>

  <%= render :partial => "devise/shared/links" %>
</div>
{% endhighlight %}

### Locking down the Posts controller

Let's say that anyone can access the Posts controller's `index` and `show` methods, but a user must be logged in to do anything else. The following before filter will take care of that:

{% highlight ruby %}
# app/controllers/posts_controller.rb

class PostsController < ApplicationController
  
  before_filter :authenticate_user!, :except => [ :index, :show ]
  
  # rest of controller
end
{% endhighlight %}

If you used the built-in Rails scaffold generator you may need to specify what to do when the mobile MIME type is used for `create`, `update` and `destroy`; for example:
  
{% highlight ruby %}
# app/controllers/posts_controller.rb

def create
  # ...
  respond_to do |format|
    if @post.save
      format.mobile { redirect_to(@post) }
      format.html { redirect_to(@post, :notice => 'Post was successfully created.') }
      format.xml  { render :xml => @post, :status => :created, :location => @post }
    else
      format.mobile { render :action => 'new' }
      format.html { render :action => "new" }
      format.xml  { render :xml => @post.errors, :status => :unprocessable_entity }
    end
  end
end

{% endhighlight %}

### Next steps

This should be enough to get you started, though as I said it's not the end-all, be-all template for creating apps with Rails and jQuery Mobile. What I've shared here is working for me in development but I'm not ready to move any of this to production just yet. Experiment with it and [some of the options available in jQuery Mobile](http://jquerymobile.com/demos/1.0a1)/, keeping in mind that jQuery Mobile is currently in its first alpha release. You'll find some quirks, but I think in the long run this framework will be a winner for creating cross-platform mobile web apps. As you make discoveries of your own, I hope you'll share them here in the comments.