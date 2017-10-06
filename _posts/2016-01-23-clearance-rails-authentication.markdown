---
layout: post
title: "Clearance: The other Rails authentication gem"
excerpt: "Looking for a well-balanced authentication solution? Check out Clearance as an alternative to Devise and has_secure_password."
tags: security
---

When adding email-and-password-based authentication to a Rails application, I have historically reached for the built-in `has_secure_password` mixin over the likes of the popular [Devise](https://github.com/plataformatec/devise) gem. Devise is very powerful and extensible, but a lot of times I find that it does way more than I need. Or I need to do something slightly different in a way that goes against the Devise way, and wind up fighting to get it to do what I want. Instead, I've opted to let `has_secure_password` take care of the complicated stuff like secure password hashing, and built up bespoke authentication systems from there.

That said, a lot of times my authentication layers don't *need* to be unique, and in fact really *aren't*. After finding myself borrowing large chunks of controller and view code from another app's authentication layer recently, I decided to revisit the Ruby community's offerings in this area. I rediscovered the wonderful [Clearance](https://github.com/thoughtbot/clearance) gem from thoughtbot. It's a nice, down-the-middle alternative to `has_secure_password` and Devise. It's been around a long time, but for whatever reason doesn't get the word-of-mouth that the others do. That's too bad, because for a lot of the type of work I do with Rails, it fits the authentication layer needs nicely.

I created a super-simple [Rails application with Clearance authentication added](https://github.com/everydayrails/clearance-example), if you'd like to follow along. Below are some of the features that impressed me about the approach it takes to authenticating Rails apps. If you're looking for a tutorial, the [Clearance README](https://github.com/thoughtbot/clearance/blob/master/README.md) will get you up and running in short order.

### Sensible defaults

The README states that Clearance is opinionated, but easy to override. So far I've found this to be the case, but I've also found that I agree with most of its opinions out of the box. I found the default, long life for the cookie interesting, as an alternative to a *remember me* checkbox. I'm trying this approach in an application now, but it's [relatively straightforward to implement the checkbox method](https://github.com/thoughtbot/clearance/commit/5cf2139eeba67d0da5f0ad309a962a743f3521d2) if needed.

### Authorization routing

Most applications need some sort of authorization to determine what users can do with their accounts. Clearance lets you determine this in your routes, via constraints (Devise provides this, too, with its `authenticated` method).

To be honest, I'm not sure how I feel about this--I typically apply logic at the controller layer to check this, and depending on the app's complexity, I like to leverage a dedicated authorization library like [Pundit](https://github.com/elabs/pundit). However, if your application's authorization needs are super-lightweight, you might give this approach a try.

{% highlight ruby %}
constraints Clearance::Constraints::SignedIn.new { |user| user.admin? } do
  root to: "admin#index", as: "admin_root"
end

constraints Clearance::Constraints::SignedIn.new do
  root to: "items#index", as: "signed_in_root"
end

constraints Clearance::Constraints::SignedOut.new do
  root to: "marketing#index"
end
{% endhighlight %}

### Interface overrides

Clearance's default views for signing in, signing up, and resetting forgotten passwords are functional, but they're not pretty. You'll almost certainly want to add CSS to the default markup. If you're rolling your own CSS, or using a tool like [Bourbon](http://bourbon.io), you may be able to work with the default views' markup as-is. If you're going the Bootstrap or Foundation route, you'll want to use the provided Rails generator to copy the view files into your own *app/views* directory, and style them however you'd like. For example, I used Bootstrap to style my sign-in form:

{% highlight erb %}
<%= form_for :session, url: session_path do |form| %>
  <div class="form-group">
    <%= form.label :email %>
    <%= form.text_field :email, type: "email", class: "form-control" %>
  </div>

  <div class="form-group">
    <%= form.label :password %>
    <%= form.password_field :password, class: "form-control" %>
  </div>

  <%= form.submit class: "btn btn-primary" %>

  <% if Clearance.configuration.allow_sign_up? %>
    <%= link_to t(".sign_up"), sign_up_path, class: "btn btn-link" %>
  <% end %>
  <%= link_to t(".forgot_password"), new_password_path, class: "btn btn-link" %>
<% end %>
{% endhighlight %}

You may notice that the view uses Rails's built-in support for internationalization to set a couple of links. Like Devise, Clearance keeps these values in a locale configuration file, making it simple to change their values or provide multilingual support to your authentication layer.

### Testing support

I've saved my favorite feature for last. Clearance provides really nice support for testing, in a couple of ways. First, the included Backdoor middleware lets you quickly sign in as a designated test user. Once implemented, your tests can get authentication out of the way and focus on what makes your app special:

{% highlight ruby %}
scenario "Admin adds an item" do
  user = FactoryGirl.create(:user, admin: true)
  visit root_path(as: user)

  # Compare to ...
  # visit root_path
  # click_link "Sign in"
  # fill_in "Email", with: user.email
  # fill_in "Password", with: "password"
  # click_button "Sign in"

  # ...
{% endhighlight %}

However, to make sure your application's authentication layer *is* covered by tests, Clearance also provides a set of integration layer specs. These run alongside the rest of your app's tests, and help prevent against regressions as you develop. This is a really nice touch. As an aside, spend a few minutes to read through the provided specs. They are excellent examples of RSpec feature tests, both in terms of coverage and overall structure.

### Summary

Swapping out the authentication layer in a Rails app is not a trivial process, so making an informed decision up-front about the right tool to use is critical. There are lots of options to choose from, each with tradeoffs to consider. If you find yourself reinventing the wheel too often with `has_secure_password` or fighting Devise's conventions more than you'd like, consider Clearance as an alternative in your next app.

Thanks for reading! Let me know if you'd like to see more about Clearance in future posts by leaving a comment below.
