---
layout: post
title: "Creating a Rails admin panel from scratch, part 1: The dashboard"
excerpt: "Add-ons like ActiveAdmin and RailsAdmin are both solid solutions for building feature-rich administration systems for Rails applications, but what if you want a more custom solution? In this series we'll cover the test-driven development of a namespaced admin solution built just for your application."
---

In the past, I've written about [ActiveAdmin](http://everydayrails.com/2011/11/11/active-admin.html) and [RailsAdmin](http://everydayrails.com/2010/12/17/rails-admin-panel.html), two gems for adding Django-like administrative systems to Rails applications. However, they're not for everybody or every application. Let me state up front that I *do* like both of these products. I've got more experience with the former, but they're both solid solutions for adding user-friendly backends to your applications.

So why not just use them, rather than build something from scratch? Three big reasons:

* **Limit additional dependencies:** ActiveAdmin and RailsAdmin are full-blown Rails applications in their own right. With each comes a long list of requirements of other gems you need to install to get them running. At best, this adds to your app's memory footprint. At worst, these gem dependencies can conflict with those of the business side of your application, create hassles with the asset pipeline, or cause other unforeseen problems as you develop and deploy.
* **Easier to maintain:** By building an administration backend that only does what you need it to do, and isn't a generalized solution, you'll be better able to keep it running for the long haul--both for adding features and keeping your application secure.
* **A good learning opportunity:** Nothing in this process is rocket science, but it does involve a few Rails techniques you might not deal with on a day-to-day basis.

In this series, I want to walk through creating a custom administration panel for a Rails application. For beginners, it should be a good deviation from the basic approach to application-via-scaffolds, including namespacing and creating some files without generators. Intermediate Rails developers can get exposure to test-driven development.

This post assumes you know how to create Rails 3.x applications, either via scaffold generators, hand-editing of MVC-type files, or a combination of the above. (For the record, I typically use generators to create bare controllers and models, and add views and other files by hand as I need them.) This implies you've got the basic command line chops, know how to manage gem dependencies with Bundler, and so on.

We're going to use RSpec to do a little test-driving in this project. Strictly speaking, you don't *need* to know RSpec, but you should probably at least grasp some of the concepts behind testing if you want to follow along with that aspect of the series. You can [check out my earlier series on RSpec](http://everydayrails.com/2012/03/12/testing-series-intro.html) for a short primer, or (shameless plug alert) get a bit deeper introduction by [purchasing my self-published book on RSpec](http://leanpub.com/everydayrailsrspec) for $9.

### The application

Behind the scenes, I've built a simple little blogging application with an articles scaffold and an authentication system. See [Authentication from Scratch (Revised)](http://railscasts.com/episodes/250-authentication-from-scratch-revised) from Railscasts (subscription required) to see the basic approach I followed to set up logins for the application. One place I've cheated: For the most part I've generated a lot of code ahead of time, and I've ignored the tests my scaffolds generated. I also wanted to show you a nice trick for adapting existing, scaffold-generated controllers and views to an admin panel interface. I typically wouldn't do that in a real Rails application, but I wanted to make this tutorial specific to admin panels.

As we work through this project we'll work up some request specs for the following tasks--and more importantly, make them pass:

* Allow registered users to access an administration dashboard
* Allow registered users to manage articles via the administration panel
* Allow registered users to manage user accounts via the administration panel

You can get the complete application from Github at TODO:GITHUB LINK

## The dashboard

Let's start with a request spec for the dashboard itself. This dashboard will allow users to hit up something like `http://sampleapp.com/admin` and access administrative functions, provided they log in correctly. Here's what the basic spec might look like:

    # spec/reqeusts/admin_spec.rb

    it "accesses the dashboard" do
      User.create(
        email: 'user@example.com',
        password: 'secret',
        password_confirmation: 'secret'
      )

      visit root_path
      click_link 'Sign In'
      fill_in 'Email', with: 'user@example.com'
      fill_in 'Password', with: 'secret'
      click_button 'Sign In'
  
      current_path.should eq admin_dashboard_path
      within 'h1' do
        page.should have_content 'Administration'
      end
      page.should have_content 'Manage Users'
      page.should have_content 'Manage Articles'
    end

I'm a big fan of using Guard to automatically run specs as they're added or edited; once we place this one in `spec/requests/admin_spec.rb` we get red, failing specs almost immediately. This is to be expected--our scaffolding and behind-the-scenes work has given us a User model and a login form, but we don't have a route for my as-yet-created dashboard. Let's create one now in the application's `routes.rb` file:

    # config/routes.rb

    namespace :admin do
      get '', to: 'dashboard#index', as: '/'
    end

We're using a *namespace* in our routes definition to create a group of related URIs. In this case, they'll all be namespaced under *admin*. The dashboard is the first step. The above route allows us to access `/admin` in our app via `admin_path`. We'll add more routes to it in a moment, but first we've got another failing test to fix:

    Failure/Error: current_path.should eq admin_path
  
      expected: "/admin"
           got: "/"
  
      (compared using ==)
    # ./spec/requests/admin_spec.rb:17:in `block (2 levels) in <top (required)>'

Can you guess the problem? It turns out the error  in `sessions_controller.rb`. The user is able to sign in, but is redirected back to root upon success, not `/admin`. We can fix that by opening the controller and redirecting to the correct address in the `create` method.

    # app/controllers/sessions_controller.rb

    def create
      user = User.find_by_email(params[:email])
      if user && user.authenticate(params[:password])
        session[:user_id] = user.id
        redirect_to admin_url, notice: "Logged in!"
      else
        flash.now.alert = "Email or password is invalid."
      end
    end

Now we get a new error:

    Failures:

      1) site administrator accesses the dashboard
         Failure/Error: click_button 'Log In'
         ActionController::RoutingError:
           uninitialized constant Admin
         # (eval):2:in `click_button'
         # ./spec/requests/admin_spec.rb:15:in `block (2 levels) in <top (required)>'

This one isn't quite as evident, but we're getting this error because we don't have a dashboard controller to route to. Let's add it from the command line:

    rails generate controller admin/dashboard index

Notice that we're creating the controller in *admin/dashboard*. This will generate the controller within the subfolder `app/controllers/admin`; its views will be in `app/views/admin/dashboard`. The generator has also added the line `get "dashboard/index"` near the top of `config/routes.rb`; go ahead and delete it now.

Our dashboard is almost done--the next failure we see is

    Failures:

      1) site administrator accesses the dashboard
         Failure/Error: page.should have_content 'Administration'
           expected there to be content "Administration" in "Admin::Dashboard#index"
         # ./spec/requests/admin_spec.rb:19:in `block (3 levels) in <top (required)>'
         # ./spec/requests/admin_spec.rb:18:in `block (2 levels) in <top (required)>'

The remaining expectations will pass when we set up a basic view in `app/views/dashboard/index`:

    <h1>Administration</h1>

    <ul>
      <li><%= link_to 'Manage Users' %></li>
      <li><%= link_to 'Manage Articles' %></li>
    </ul>

And sure enough, our first spec passes! However, we've got a couple of pending specs from what the controller generator gave us a few minutes ago, and one that's passing even though we haven't written anything. Let's leave  `spec/controllers/admin/dashboard_controller.rb` as we'll come back to it in awhile. The other pending spec files can be deleted. In fact, I typically configure RSpec to not even generate these specs, and create them as needed when testing my apps.

Let's add a second request spec to confirm that people who *aren't* logged in can't access the dashboard:

    # spec/requests/admin_spec.rb

    it "is denied access when not logged in" do
      visit admin_path

      current_path.should eq login_path
      within 'h1' do
        page.should have_content 'Please Log In'
      end
    end

And it fails:

    1) site administrator is denied access when not logged in
       Failure/Error: current_path.should eq login_path

         expected: "/login"
              got: "/admin"

         (compared using ==)
       # ./spec/requests/admin_spec.rb:28:in `block (2 levels) in <top (required)>'

A quick `before_filter` added to `dashboard_controller.rb` should fix it:

    class Admin::DashboardController < ApplicationController

      before_filter :authorize

      def index
      end
    end

OK, the request spec is passing, but that generated controller spec is failing now. Why? Because we're not specifying a logged-in user in the spec. Although we've successfully tested that people who aren't logged in can't access the dashboard, via a request spec, I prefer to test this at the controller level due to efficiency. Here's how I'd make the spec pass:

    # spec/controllers/admin/dashboard_controller_spec.rb

    require 'spec_helper'

    describe Admin::DashboardController do

      describe 'user access' do

        describe "GET 'index'" do      
          it "returns http success" do
            user = User.create(
              email: 'admin@example.com',
              password: 'secret',
              password_confirmation: 'secret'
            )
            session[:user_id] = user

            get 'index'
            response.should be_success
          end
        end
      end

      describe 'non-user access' do
        describe "GET 'index'" do
          it "redirects to the login form" do
            get 'index'
            response.should redirect_to login_url
          end
        end
      end
    end 

This is the approach I'll use down the road when we add functionality to the administration panel. In the meantime, we've got a dashboard for our application--but it's just for show so far. There's not much you can do once you've logged in. In part two we'll convert a scaffolded resource to an administration dashboard. Watch for it in the next day or two.