---
layout: post
title: "Creating a Rails admin panel from scratch, part 3: Other resources"
excerpt: "In the final part of this series, we'll create a fresh controller and views to manage an ActiveAdmin resource within our namespaced admin panel."
---

Over the past couple of weeks I've been sharing a technique for building namespaced administration interfaces into Rails applications. So far in this series we've [created a basic administration dashboard](http://everydayrails.com/2012/07/31/rails-admin-panel-from-scratch.html) and [leveraged Rails scaffolds](http://everydayrails.com/2012/08/07/rails-admin-panel-from-scratch-2.html) to add some functionality to it. In this final post we'll add another round of functionality--this time, for a model that already exists in an application.

The incredibly simple blogging application includes a `User` model to allow authors to log in and create posts. However, so far the application doesn't yet have any functionality to manage those users. We'll add that now, once again following a test-driven approach with RSpec. (As a reminder-slash-shameless plug, if you're interested in a simple way to get going with RSpec and TDD, [check out my book](https://leanpub.com/everydayrailsrspec) on the subject to get started). The [application's source](https://github.com/ruralocity/admin_demo) can be seen in its entirety on GitHub; see the the [resources branch](https://github.com/ruralocity/admin_demo/tree/resource) for code specific to this post.

## Adding a user

Let's get going: We'll start with an interface for adding new users. Here's the request spec we'll make pass:

{% highlight ruby %}
  # spec/requests/admin_spec.rb

  describe 'user management' do
    before :each do
      user = FactoryGirl.create(:user)
      sign_in user
    end
    
    it "adds a user" do
      click_link 'Manage Users'
      current_path.should eq admin_users_path
      
      expect{
        click_link 'New User'
        fill_in 'Email', with: 'aaron@everydayrails.com'
        fill_in 'Password', with: 'secret'
        fill_in 'Password confirmation', with: 'secret'
        click_button 'Create User'
      }.to change(User, :count).by(1)
      
      current_path.should eq admin_users_path
      page.should have_content 'aaron@everydayrails.com'
    end
  end
{% endhighlight %}

If you read the previous post in this series, this should look pretty familiar; we'll create a similar interface for user management now. Following test-driven development, our spec fails pretty quickly:

    1) site administration user management adds a user
       Failure/Error: current_path.should eq admin_users_path
       NameError:
         undefined local variable or method `admin_users_path' for #<RSpec::Core::ExampleGroup::Nested_4::Nested_3:0x007f83c940d658>

Again, these failures should look pretty familiar by now. In this case we need to add a namespaced route for managing users:

{% highlight ruby %}
  # config/routes.rb

  namespace :admin do
    get '', to: 'dashboard#index', as: '/'
    resources :articles
    resources :users
  end
{% endhighlight %}

The next failure points to the fact that the dashboard we created back in the first post in this series is missing a complete link for managing users.

    1) site administration user management adds a user
       Failure/Error: current_path.should eq admin_users_path
       
         expected: "/admin/users"
              got: "/admin"
       
         (compared using ==)

Easy enough to fix:

{% highlight erb %}
  <!-- app/views/admin/dashboard/index.html.erb -->

  <h1>Administration</h1>

  <ul>
    <li><%= link_to 'Manage Users', admin_users_path %></li>
    <li><%= link_to 'Manage Articles', admin_articles_path %></li>
  </ul>
{% endhighlight %}

Another step forward, and another failed expectation:

    1) site administration user management adds a user
       Failure/Error: click_link 'Manage Users'
       ActionController::RoutingError:
         uninitialized constant Admin::UsersController

Looks like we need to add a controller. Unlike the previous post, where we moved existing files to add admin functionality, this time we'll add it from scratch:

{% highlight bash %}
  rails generate controller admin/users index
{% endhighlight %}

This creates the controller in `app/controllers/admin`, as well as an ERB template we'll get to next in `app/views/admin/users`. (It also adds the route `  get "users/index"` to `config/routes.rb`; we're not going to use that route so we can delete it.) In fact, the next failure points to something missing in this template:

    1) site administration user management adds a user
       Failure/Error: click_link 'New User'
       Capybara::ElementNotFound:
         no link with title, id or text 'New User' found

The view template will eventually include the ability to list existing users, of course, but for now let's just do the minimum amount of work to make this expectation pass:

{% highlight erb %}
  <!-- app/views/admin/users/index.html.erb -->

  <h1>Listing users</h1>

  <%= link_to 'New User', new_admin_user_path %>
{% endhighlight %}

And another failure:

    Failures:

      1) site administration user management adds a user
         Failure/Error: click_link 'New User'
         AbstractController::ActionNotFound:
           The action 'new' could not be found for Admin::UsersController

No problem--the controller we created a moment ago doesn't have a `new` method, but we can easily add that now.

{% highlight ruby %}
  # app/controllers/admin/users_controller.rb

  class Admin::UsersController < ApplicationController
    def index
    end

    def new
    end
  end
{% endhighlight %}

The next failure suggests the method needs a corresponding view:

    1) site administration user management adds a user
       Failure/Error: click_link 'New User'
       ActionView::MissingTemplate:
         Missing template admin/users/new, application/new with {:locale=>[:en], :formats=>[:html], :handlers=>[:erb, :builder, :coffee]}. Searched in:
           * "/Users/asumner/Sites/Rails/admin_demo/app/views"

So let's go ahead and add that--just a blank file at `app/views/admin/users/new.html.erb` is all we need to push the process forward. Now RSpec will complain about not finding the actual form we've told it to expect:

    1) site administration user management adds a user
       Failure/Error: fill_in 'Email', with: 'aaron@everydayrails.com'
       Capybara::ElementNotFound:
         cannot fill in, no text field, text area or password field with id, name, or label 'Email' found

I'm just going to use the general style of form as Rails' scaffold generators would provide to place the form in the `new.html.erb` template we created a second ago:

{% highlight erb %}
  <!-- app/views/admin/users/new.html.erb -->

  <h1>New user</h1>

  <%= form_for([:admin,@user]) do |f| %>
    <% if @user.errors.any? %>
      <div id="error_explanation">
        <h2><%= pluralize(@user.errors.count, "error") %> prohibited this user from being saved:</h2>

        <ul>
        <% @user.errors.full_messages.each do |msg| %>
          <li><%= msg %></li>
        <% end %>
        </ul>
      </div>
    <% end %>

    <div class="field">
      <%= f.label :email %><br />
      <%= f.text_field :email %>
    </div>
    <div class="field">
      <%= f.label :password %><br />
      <%= f.password_field :password %>
    </div>
    <div class="field">
      <%= f.label :password_confirmation %><br />
      <%= f.password_field :password_confirmation %>
    </div>
    <div class="actions">
      <%= f.submit %>
    </div>
  <% end %>
{% endhighlight %}

Which yields a fresh RSpec failure:

    1) site administration user management adds a user
       Failure/Error: click_link 'New User'
       ActionView::Template::Error:
         undefined method `model_name' for NilClass:Class

We just need something to pass to `@user` in the form--this is easily remedied in the controller:

{% highlight ruby %}
  # app/controllers/admin/users_controller.rb

  class Admin::UsersController < ApplicationController
    def index
    end

    def new
      @user = User.new
    end
  end
{% endhighlight %}

Now the spec is looking for a `create` method in the Users controller.

    1) site administration user management adds a user
       Failure/Error: click_button 'Create User'
       AbstractController::ActionNotFound:
         The action 'create' could not be found for Admin::UsersController

Again, I'm just going to follow the style this method would have had it been generated by a Rails scaffold.

{% highlight ruby %}
  # app/controllers/admin/users_controller.rb

  def create
    @user = User.new(params[:user])

    respond_to do |format|
      if @user.save
        format.html { redirect_to admin_users_url, notice: 'User was successfully created.' }
        format.json { render json: @user, status: :created, location: [:admin,@user] }
      else
        format.html { render action: "new" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end
{% endhighlight %}

We're getting really close now, but we've got a couple more things to take care of. First, a new failed expectation:

    1) site administration user management adds a user
       Failure/Error: page.should have_content 'aaron@everydayrails.com'
         expected there to be content "aaron@everydayrails.com" in "AdminDemo\n\n    Logged in as johndoe1@example.com.\n    Log Out\n\n  Listing users\n\nNew User\n\n\n"

Let's go back to the `index` template to add this.

{% highlight erb %}
  <!-- app/views/admin/users/index.html.erb -->

  <h1>Listing users</h1>

  <table>
    <tr>
      <th>Email</th>
    </tr>

  <% @users.each do |user| %>
    <tr>
      <td><%= user.email %></td>
    </tr>
  <% end %>
  </table>

  <br />

  <%= link_to 'New User', new_admin_user_path %>
{% endhighlight %}

Oops, a fresh failure:

    1) site administration user management adds a user
       Failure/Error: click_link 'Manage Users'
       ActionView::Template::Error:
         undefined method `each' for nil:NilClass

Remedied by a quick addition to the controller:

{% highlight ruby %}
  # app/controllers/admin/users_controller.rb

  def index
    @users = User.all
  end
{% endhighlight %}

And now the request spec should pass! Blog editors--anyone with an account, basically--can now add more users through the admin panel. As in the previous post, however, we've still got a little more to do. This spec tests the happy path: A known user logs in and enters a user correctly in the form. We've got some other cases to test and potential functionality to add:

1. What happens if someone accesses the form without logging in first?
2. What happens if the password and password confirmation don't match?
3. What happens if an incorrectly-formatted email address is entered?
4. What happens if a duplicate email address is entered?

I'm not going to explicitly go through these here, but you can look at the source on GitHub for more details. Short answers:

1. Test this at the controller and make sure to `authorize` the new controller.
2. The way we've implemented passwords uses the `has_secure_password` functionality built into Rails; it should therefore be adequately tested already without us adding another.
3. Add a custom validation to the `User` model and test at that level. You could get pretty detailed with this if you wish--I included a couple of examples in the full source.
4. This would also be tested at the model level (though since uniqueness validations are built into Rails, one might argue that it's not strictly necessary to test). In the interest of completion, it wouldn't hurt to add a controller-level test to make sure the controller (in this case, the `create` method) properly handles invalid form submissions, too.

## Next steps

That's about it for this exercise. Of course, you may need more functionality for your user management, such as editing existing accounts or suspending them from login. I'll leave that up to you to implement in your own applications.

The interface is also pretty spartan--you might want to spruce it up with something like Twitter Bootstrap, or add filtering functionality with [Ransack](http://rubygems.org/gems/ransack). Again, I'll leave that up to you--the point of this series has been to start with the basics and build up from there.

## Wrapping up

That will wrap up this series on creating administration interfaces for your Rails applications, without a soup-to-nuts solution like ActiveAdmin. We not only built an admin panel--we also looked at how to namespace Rails routes (pretty easily, as it turns out) and how to use RSpec request specs to drive the development. I hope you found this series useful.