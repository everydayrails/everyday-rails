---
layout: post
title: "Creating a Rails admin panel from scratch, part 2: Scaffolded resources"
excerpt: "In part two of the series, we'll take a look at moving a scaffold-generated resource into our custom admin panel."
---

In the first part of this series on creating Rails administration panels, we created a basic dashboard upon which we'll be able to add the functionality necessary to actually manage the site. ([Read part one](http://everydayrails.com/2012/07/31/rails-admin-panel-from-scratch.html).)

As a review, this simple blog-type application allows users to log in, then add, edit, and delete articles. We're working on a namespaced administration section for the site, accessible only to people with accounts, to accomplish this. So far the application has an admin dashboard set up, but no further functionality. That's what we'll tackle in this tutorial. Specifically, we're going to take a controller and views that were previously generated with Rails' `scaffold` generator, move them into the `admin` namespace, and make them work in our admin panel.

We'll also be using RSpec request specs to drive this process. If this is a new process for you, you might want to go through the work we did in part one, or, of course, pick up a copy of my book on learning how to test Rails apps with RSpec. And with that shameless plug out of the way, let's get on with our task. You can [follow along with the complete source on GitHub](https://github.com/ruralocity/admin_demo); the relevant stuff is located in the `scaffold` branch.

## A little spec refactoring

Before we get too far into this, I want to clean up my RSpec setup a little bit. First, I've created the following factory (using Factory Girl) to simplify creating users for my tests:

{% highlight ruby %}
  # spec/factories/users.rb
  
  FactoryGirl.define do
    factory :user do
      sequence(:email) { |n| "johndoe#{n}@example.com"}
      password 'secret'
    end
  end
{% endhighlight %}

I've also created a couple of RSpec macros to simplify the simulation of a user logging in, at both the controller and request level:

{% highlight ruby %}
  # spec/support/login_macros.rb

  module LoginMacros
    def set_user_session(user)
      session[:user_id] = user.id
    end

    def sign_in(user)
      visit root_path
      click_link 'Log In'
      fill_in 'Email', with: user.email
      fill_in 'Password', with: user.password
      click_button 'Log In'
    end
  end
{% endhighlight %}

Again, take a look at the `scaffold` branch on GitHub to see how this all integrates.

## Making the move

Before we go much further, let me point out that, on paper, this looks like a *lot* of work, especially when thrown in with failing tests. In practice, though, it's pretty easy. That said, what we're doing here--converting a scaffolded resource to one you'll manage via an admin panel--will probably happen more in apps you've already scaffolded. If this technique of creating administration areas for your apps becomes commonplace for you, then you may find yourself creating the controller and views by hand, as we'll get to in a later post in this series.

Here's the request spec we need to pass:

{% highlight ruby %}
  # spec/requests/admin_spec.rb

  describe 'article management' do
    before :each do
      user = FactoryGirl.create(:user)
      sign_in user
    end

    it "adds an article" do
      click_link 'Manage Articles'
      current_path.should eq admin_articles_path

      expect{
        click_link 'New Article'
        fill_in 'Name', with: 'My favorite web framework'
        fill_in 'Body', with: 'Rails is great!'
        click_button 'Create Article'
      }.to change(Article, :count).by(1)

      current_path.should eq admin_articles_path
      page.should have_content 'My favorite web framework'
    end
  end
{% endhighlight %}

And running it gives us this failure right off:

{% highlight ruby %}
  1) site administration article management adds an article
     Failure/Error: current_path.should eq admin_articles_path
     NameError:
       undefined local variable or method `admin_articles_path' for #<RSpec::Core::ExampleGroup::Nested_1::Nested_2:0x007fea259e30d8>
     # ./spec/requests/admin_spec.rb:43:in `block (3 levels) in <top (required)>'
{% endhighlight %}

We need to namespace a resourced route for articles in `config/routes.rb`:

{% highlight ruby %}
  # config/routes.rb

  namespace :admin do
    get '', to: 'dashboard#index', as: '/'
    resources :articles
  end
{% endhighlight %}

Go ahead and leave the top-level `resources :articles` declaration; we'll be addressing it later on.

When the spec runs again we get a new error:

{% highlight ruby %}
  1) site administration article management adds an article
     Failure/Error: current_path.should eq admin_articles_path

       expected: "/admin/articles"
            got: "/admin"

       (compared using ==)
     # ./spec/requests/admin_spec.rb:43:in `block (3 levels) in <top (required)>'
{% endhighlight %}

What's this telling us? Recall that in the previous post, when we created a dashboard view, we didn't make the *Manage Articles* link actually link to anything--thus it's just reloading the page we're already on. Easily fixed in the dashboard view:

{% highlight erb %}
  # admin/dashboard/index

  <h1>Administration</h1>

  <ul>
    <li><%= link_to 'Manage Users' %></li>
    <li><%= link_to 'Manage Articles', admin_articles_path %></li>
  </ul>
{% endhighlight %}

Running the spec now gives us this failure:

{% highlight ruby %}
  Failures:

    1) site administration article management adds an article
       Failure/Error: click_link 'Manage Articles'
       ActionController::RoutingError:
         uninitialized constant Admin::ArticlesController
       # (eval):2:in `click_link'
       # ./spec/requests/admin_spec.rb:42:in `block (3 levels) in <top (required)>'
{% endhighlight %}

Which means we need to actually move the controller into the `admin` subdirectory:

{% highlight bash %}
  mv app/controllers/articles_controller.rb app/controllers/admin/
{% endhighlight %}

And the subsequent error:

{% highlight ruby %}
  1) site administration article management adds an article
     Failure/Error: click_link 'Manage Articles'
     LoadError:
       Expected /Users/asumner/Sites/Rails/admin_demo/app/controllers/admin/articles_controller.rb to define Admin::ArticlesController
     # (eval):2:in `click_link'
     # ./spec/requests/admin_spec.rb:42:in `block (3 levels) in <top (required)>'
{% endhighlight %}

Tells us that the articles controller must be subclassed to `Admin` like so:

{% highlight ruby %}
  # app/controllers/admin/articles_controller.rb
   
  class Admin::ArticlesController < ApplicationController
    # ...
  end
{% endhighlight %}

Now the spec reports a new issue:

{% highlight ruby %}
  1) site administration dashboard access accesses the dashboard
     Failure/Error: visit root_path
     ActionController::RoutingError:
       uninitialized constant ArticlesController
     # ./spec/requests/admin_spec.rb:11:in `block (3 levels) in <top (required)>'
{% endhighlight %}

Wait, wasn't this already resolved? Well, we moved `articles_controller.rb` into `admin`, so the route no longer has a controller to point to--and since `articles#index` is our application's root path, the spec is choking right out of the gates. What we need to do, then, is recreate a public-facing `articles_controller.rb`:

{% highlight bash %}
  rails generate controller articles index
{% endhighlight %}

**Don't overwrite `index.html.erb`!** We're going to be moving it in just a minute, and then we'll create a new, public-facing view to take its place. Hang tight.

Believe it or not we've made a lot of progress, though looking at the latest error might make you think otherwise:

{% highlight ruby %}
  1) site administration dashboard access accesses the dashboard
     Failure/Error: visit root_path
     ActionView::Template::Error:
       undefined method `each' for nil:NilClass
     # ./app/views/articles/index.html.erb:12:in `_app_views_articles_index_html_erb__2178912144400596172_70320923088300'
     # ./spec/requests/admin_spec.rb:11:in `block (3 levels) in <top (required)>'
{% endhighlight %}

What's going on here? The scaffolded `articles_controller.rb` creates a collection of `@articles` for the view to process, but our `rails generate controller`-generated one does not. Let's tell the *index* method what to do:

{% highlight ruby %}
  # app/controllers/articles_controller.rb
  
  class ArticlesController < ApplicationController
    def index
      @articles = Article.all
    end
  end
{% endhighlight %}

Yet another new failure from our spec:

{% highlight ruby %}
  Failures:

    1) site administration article management adds an article
       Failure/Error: click_link 'Manage Articles'
       ActionView::MissingTemplate:
         Missing template admin/articles/index, application/index with {:locale=>[:en], :formats=>[:html], :handlers=>[:erb, :builder, :coffee]}. Searched in:
           * "/Users/asumner/Sites/Rails/admin_demo/app/views"
       # ./app/controllers/admin/articles_controller.rb:7:in `index'
       # (eval):2:in `click_link'
       # ./spec/requests/admin_spec.rb:42:in `block (3 levels) in <top (required)>'
{% endhighlight %}

This signals the start to our last big chunk of work. First we need to move the scaffolded views for articles into the `admin` namespace:

{% highlight bash %}
  mv app/views/articles/ app/views/admin/articles
{% endhighlight %}

Argh, another failure:

{% highlight ruby %}
  Failures:

    1) site administration dashboard access accesses the dashboard
       Failure/Error: visit root_path
       ActionView::MissingTemplate:
         Missing template articles/index, application/index with {:locale=>[:en], :formats=>[:html], :handlers=>[:erb, :builder, :coffee]}. Searched in:
           * "/Users/asumner/Sites/Rails/admin_demo/app/views"
       # ./spec/requests/admin_spec.rb:11:in `block (3 levels) in <top (required)>'
{% endhighlight %}

OK, now we can create a simple, public-facing view to pass the spec:

{% highlight erb %}
  # app/views/articles/index.html.erb
  
  <h1>Articles</h1>

  <% @articles.each do |article| %>
    <div>
      <h2><%= article.name %></h2>
      <%= simple_format article.body %>
    </div>
  <% end %>
{% endhighlight %}

From here on out, we'll just be cleaning up the controller and views we moved into the admin namespace, to make sure routes are pointing to their new locations. For example, the next failure:

{% highlight ruby %}
  1) site administration article management adds an article
     Failure/Error: click_link 'New Article'
     AbstractController::ActionNotFound:
       The action 'new' could not be found for ArticlesController
     # (eval):2:in `click_link'
     # ./spec/requests/admin_spec.rb:46:in `block (4 levels) in <top (required)>'
     # ./spec/requests/admin_spec.rb:45:in `block (3 levels) in <top (required)>'
{% endhighlight %}

means that the *New Article* link in `app/views/admin/articles/index.html.erb` needs to be updated:

{% highlight erb %}
  # app/views/admin/articles/index.html.erb
  <%= link_to 'New Article', new_admin_article_path %>
{% endhighlight %}

And the next error:

{% highlight ruby %}
  Failures:

    1) site administration article management adds an article
       Failure/Error: click_button 'Create Article'
       AbstractController::ActionNotFound:
         The action 'create' could not be found for ArticlesController
       # (eval):2:in `click_button'
       # ./spec/requests/admin_spec.rb:49:in `block (4 levels) in <top (required)>'
       # ./spec/requests/admin_spec.rb:45:in `block (3 levels) in <top (required)>'
{% endhighlight %}

Is telling us to fix the path our form points to:

{% highlight erb %}
  # app/views/admin/articles/_form.html.erb
  <%= form_for([:admin,@article]) do |f| %>
{% endhighlight %}

One more failure:

{% highlight ruby %}
  Failures:

    1) site administration article management adds an article
       Failure/Error: click_button 'Create Article'
       AbstractController::ActionNotFound:
         The action 'show' could not be found for ArticlesController
       # (eval):2:in `click_button'
       # ./spec/requests/admin_spec.rb:49:in `block (4 levels) in <top (required)>'
       # ./spec/requests/admin_spec.rb:45:in `block (3 levels) in <top (required)>'
{% endhighlight %}

We need to update the route our controller redirects to upon successfully creating a new article:

{% highlight ruby %}
  # app/controllers/admin/articles_controller.rb
  
  def create
    @article = Article.new(params[:article])

    respond_to do |format|
      if @article.save
        format.html { redirect_to admin_articles_url,
          notice: 'Article was successfully created.' }
        format.json { render json: @article,
          status: :created,
          location: [:admin,@article] }
      else
        format.html { render action: "new" }
        format.json { render json: @article.errors, 
          status: :unprocessable_entity }
      end
    end
  end
{% endhighlight %}

And with that, the core functionality is complete, and our spec should pass! (If it doesn't, don't fret--take another look at your spec, your code, and your test log to look for clues.) A quick review of what we did:

* First, we created a set of namespaced routes for administering articles.
* Next, we moved the controller and views into their new namespaced locations.
* Then we created new public-facing views and a controller for articles.
* Finally, we edited the pre-existing controller and views to point to the proper namespaced routes.

## Some cleanup

Before we call this feature complete we should address a couple of final issues. First, our full-blown articles controller--the one we moved into `controllers/admin`--isn't secure. If a non-logged-in person guessed the URI he could add, edit, and delete your articles. Not good, so let's fix it with a quick `before_filter`:

{% highlight ruby %}
  # app/controllers/admin/articles_controller.rb
  before_filter :authorize
{% endhighlight %}

We'll want to make sure this is properly addressed in our controller specs; see the source for how to do this.

One last, easily overlooked thing. Remember early on when I said to leave the original `resources :articles` route declaration in `config/routes.rb`? It's working fine as-is, but it's also generating routes for methods we don't use anymore--namely, any CRUD method that's not `articles#index`. (Remember, the other CRUD methods used by the application are now namespaced under `admin`). Removing unused routes reduces the app's memory footprint, so let's address that now:

{% highlight ruby %}
  # config/routes.rb
  
  resources :articles, only: [ :index ]
{% endhighlight %}
    
While you're at it, go ahead and remove the `get "articles/index"` route that `rails generate controller` gave us earlier--the resourced route is cleaner (at least in my opinion).

However, removing the other CRUD actions at this level introduces a new failure, which should look familiar:

{% highlight ruby %}
  1) site administration article management adds an article
     Failure/Error: click_button 'Create Article'
     ActionView::Template::Error:
       undefined method `edit_article_path' for #<#<Class:0x007f8edb990180>:0x007f8edcdf67f0>
{% endhighlight %}

Yes, another incorrect route in one of the pre-generated views.

## Next steps

One administration activity down, two to go--we can create articles, but we still want to be able to edit and delete them. I'm going to leave that as an exercise for you. [Take a look at the source on GitHub](https://github.com/ruralocity/admin_demo) to see how I've implemented this.

## Summary

Like I said, the process of moving scaffold-generated controllers and views into a namespace looks more time-intensive than it is. However, it's a good way to build administration tools from code you may already have in your application. On the other hand, if you need to administer a model but presently lack the controllers and views to go with it, you'll probably be better off building them up by hand. We'll cover that in the next post in this series.