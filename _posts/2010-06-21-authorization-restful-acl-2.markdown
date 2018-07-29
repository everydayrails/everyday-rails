---
layout: post
title: "Adding authorization to your Rails app with RESTful_ACL, part 2: Basic ACLs"
excerpt: "Here's how to protect your application's data through an easy-to-apply access control layer."
---

In [part one of this series on the RESTful_ACL gem](http://everydayrails.com/2010/06/16/authorization-restful-acl-1.html), I walked through the steps required to prepare an app to use this handy, albeit overshadowed, mechanism for adding authorization to a Rails application. Now let's dive into the actual ACL settings themselves. In the interest of simplicity and familiarity, we'll go with a basic blogging app with categories, posts, and comments. Let's say that admins can create and edit categories, regular users can write posts and edit posts they've written. In this part I'll cover categories and posts; we'll use some more advanced features to protect our comments in a later tutorial.

<div class="alert alert-info">
<p>Behind the scenes, I've set up a Rails 2.3.8 application with an [authentication system](http://everydayrails.com/2010/06/06/rails-authentication-options.html) installed. The important thing to know here is that your authentication session information must be named `current_user`, which has pretty much become practice in every authentication mechanism I've seen for Rails in the last couple of years. I've also added a boolean `is_admin` to my User model and run the generated migration.</p>
</div>

First, let's create the category and post scaffolds (see my post on [using Nifty Generators to create Rails scaffolds](http://everydayrails.com/2010/06/01/nifty-scaffold.html) if you need a primer):

{% highlight bash %}
  $ script/generate nifty_scaffold category name:string --haml
  $ script/generate nifty_scaffold post title:string body:text user_id:integer --haml
{% endhighlight %}

Run the migrations, then open the two new model files. Let's start with the Category model, which only users where `is_admin` is `true` may manipulate. Its ACL settings are thus pretty simple:

<div class="box code">
  app/models/category.rb:
</div>

{% highlight ruby %}
  class Category < ActiveRecord::Base
    attr_accessible :name

    has_many :posts

    # ACL settings start here

    # Anybody may access the :index action
    def self.is_indexable_by(user, parent = nil)
      true
    end

    # Only administrators may access the :new and :create actions
    def self.is_creatable_by(user, parent = nil)
      user.is_admin?
    end

    # Anybody may access the :show action
    def is_readable_by(user, parent = nil)
      true
    end

    # Only administrators may access the :edit and :update actions
    def is_updatable_by(user, parent = nil)
      user.is_admin?
    end

    # Only administrators may access the :destroy action
    def is_deletable_by(user, parent = nil)
      user.is_admin?
    end
  end
  
{% endhighlight %}

For each of the five methods in the above model, returning `true` will allow the user to access the action in question. Otherwise they'll get redirected to the `denied` path we set up in Part 1 of this tutorial, but first we need to tell the controller to refer to the ACL settings we just created:

<div class="box code">
  app/controllers/categories_controller.rb:
</div>

{% highlight ruby %}
  class CategoriesController < ApplicationController

    before_filter :login_required, :except => [ :index, :show ]
    before_filter :has_permission?
  
    # rest of controller ...
  end
{% endhighlight %}

Two things going on here: The first `before_filter` checks for `current_user` (in this case, I'm using Restful Authentication because it's easy; other authentication mechanisms use `before_filter` as well but call different methods&mdash;consult their documentation). The second filter tells the controller that this model has ACLs to check. Assuming both of these filters return `true` then the requested action will process. Otherwise the user will be redirected to the login path (because `:login_required` returned false) or the denied path (because `:has_permission?`) returned false.

Let's clean up a couple of views real quick. In our index view, we only want the links to each object's Edit and Destroy options, and the New Category form, to be visible if the user has the appropriate permission (that is, is logged in and is an administrator).

<div class="box code">
  app/views/categories/index.html.haml:
</div>

{% highlight haml %}
  - title "Categories"

  %table
    %tr
      %th Name
    - for category in @categories
      %tr
        %td= h category.name
        %td= link_to 'Show', category
        %td= allowed?{ link_to 'Edit', edit_category_path(category) } if logged_in?
        %td= allowed?{ link_to 'Destroy', category, :confirm => 'Are you sure?', :method => :delete } if logged_in?

  %p= allowed?{ link_to "New Category", new_category_path } if logged_in?
{% endhighlight %}

There are two things doing the work here&mdash;RESTful_ACL's `allowed?` helper is checking the ACL, but only if Restful Authentication's `logged_in?` helper returns true. This two-level setup is necessary because the `:index` action doesn't require login, so some users (guests) may not be logged in.

<div class="alert alert-info">
  <p>You can also apply these helpers to `show.html.haml` to hide the Edit and Destroy links from non-administrators.</p>
</div>

Now let's move on to the Post model:

<div class="box code">
  app/models/post.rb
</div>

{% highlight ruby %}
  class Post < ActiveRecord::Base
    attr_accessible :title, :body, :post_id, :user_id

    belongs_to  :post
    belongs_to  :user

    # ACL settings start here

    # Anybody may access the :index action
    def self.is_indexable_by(user, parent = nil)
      true
    end

    # Only logged-in users may access the :new and :create actions
    def self.is_creatable_by(user, parent = nil)
      user != nil
    end

    # Anybody may access the :show action
    def is_readable_by(user, parent = nil)
      true
    end

    # Only the post's user or administrators may access the :edit and :update actions
    def is_updatable_by(user, parent = nil)
      user.eql?(self.user) or user.is_admin?
    end

    # Only the post's user or administrators may access the :destroy action
    def is_deletable_by(user, parent = nil)
      user.eql?(self.user) or user.is_admin?
    end
  end
{% endhighlight %}

<div class="alert alert-info">
  <p>The controller and views for the Post scaffold will be set up in the same fashion as they were for Categories.</p>
</div>

We're off to a good start. Our application now protects two models from unauthorized access. Next time I'll add a basic commenting system to my application, and use RESTful_ACL's logical parent option to extend existing ACLs to a model's children. As always, please let me know what you think about this article. I appreciate your questions, comments and suggestions.
