---
layout: post
title: "Nest routes through multiple controllers to DRY up your code"
excerpt: "Want to nest an #index action under multiple parent scaffolds? It's actually pretty easy; this tutorial explains how."
---

Here's a neat trick I saw Ryan Bates do in a _Railscasts_ episode at some point. I honestly can't find the episode now for reference, but here's what he did: Using a single controller method, he generated list views of a given model, filtered based on what was passed into the method.

Why would you want to do this? Say you're writing a blog (sorry to be trite, but it works well for this example). You've got three models in your blogging app: Authors, Categories, and Posts. You want to be able to list Posts in the following ways:

|. Listing |. Path |
| Posts by category | /categories/3/posts |
| Posts by author | /authors/27/posts |
| All posts | /posts |

<div class="alert alert-info" markdown="1">
I know those paths could be more human and search engine friendly by replacing the IDs with a token of some kind; I'll talk about ways to do that in a future post. Check out [FriendlyID](http://github.com/norman/friendly_id) or [this Railscasts episode](http://railscasts.com/episodes/63-model-name-in-url) if you're in a hurry.
</div>

## The models

In order for this to work, the first thing you'll need to do is make sure your model relationships are in place. So an Author has many Posts, a Category has many Posts (for the sake of simplicity we'll just assign a Post to a single Category, though this technique will apply to a more complex relationship), and a Post belongs to an Author and belongs to a Category.

## The routes

Here's the first part of the trick&mdash;you're not limited to nesting a route under a single parent route. Rather, you can nest it under as many parents as you need to. You can also leave it un-nested. So what does this mean? We can create the following routes (in Rails 2.3.x style):

<div class="box code">
  config/routes.rb
</div>

{% highlight ruby %}
  map.resources :authors,
    :has_many => [ :posts ]
  
  map.resources :categories,
    :has_many => [ :posts ]
    
  map.resources :posts

{% endhighlight %}

which gives you the following routes:

|. Listing |. Path |
| Posts by category | /categories/:category_id/posts |
| Posts by author | /authors/:author_id/posts |
| All posts | /posts |

`:category_id` and `:author_id` are now `param` values that you can access in your controller. Let's look at that now.

## The controller

The second part of the trick happens in `posts_controller.rb`. What you need to do here is check for which `param` (if any) was passed into the `index` method, since that's what we'll use to generate a list of posts. Here's what happens:

<div class="box code">
  app/controllers/posts_controller.rb
</div>

{% highlight ruby %}
  class PostsController < ApplicationController

    def index
      if params[:category_id]
        @posts = Category.find(params[:category_id]).posts
      elsif params[:author_id]
        @posts = Author.find(params[:author_id]).posts
      else
        @posts = Post.all
      end
    end
    
    # rest of controller ...
  end
    
{% endhighlight %}

So if `group_id` is passed (like `/categories/3/posts`) the controller returns a list of that category's posts to the `index` view. If `author_id` is passed (via `/authors/27/posts`) we get that author's posts. If neither is passed (`/posts`) we get a list of all posts.

## A real-world example

I'm working on a project at work that involves tagging items and then sharing those items in one or more groups (similar to categories in the example I made up above). Using the method I just outlined, I can display a list of tags that are used on items shared with a given group, or a list of tags used by an individual user, or a list of all the tags in my system.