---
layout: post
title: "Replacing RSpec controller specs, part 1: Request specs"
excerpt: |-
  Does your application's test suite rely heavily on controller specs? It's time to consider alternatives, as controller testing has changed in Rails 5.
  Here's one way to replace a common use of these specs, even if you haven't
  upgraded to Rails 5 yet.
---

Action Cable may be the new Rails 5 feature that got the most attention, but what caught my eye from this release was a big change to controller-level testing.

While controller tests themselves haven't been removed in Rails 5, a couple of commonly-used helpers, `assigns` and `assert_template`, have been deprecated. These helpers lead to brittle tests that care too much about implementation details--why should a test care that an instance variable was created, or that a specific template file is responsible for an action's output? Is there a better place to make sure your code's working?

Both the Rails and RSpec teams suggest replacing or removing your app's controller tests (also known as the functional test layer), in favor of directly testing models (units), or with higher-level integration tests. This may sound daunting, but don't worry--it's a change for the better! And even if you're not yet running Rails 5, or RSpec 3.5, you can start refactoring your test suite to replace controller tests with other types of coverage.

In this post, I'm going to take a controller spec from *[Everyday Rails Testing with RSpec](https://leanpub.com/everydayrailsrspec)*, modify it slightly for clarity outside of the context of the book, and talk about an option for converting it to a different, more future-proof type of test. The original sample code is a Rails 4.1 app, and is [available on GitHub](https://github.com/everydayrails/rails-4-1-rspec-3-0).

### From controller specs to request specs

Here we have a snippet from a controller spec written to test that a guest, or user who hasn't logged in, is redirected to a login form instead of submitting data to a database.

{% highlight ruby %}
describe "guest access" do
  describe 'GET #new' do
    it "requires login" do
      get :new
      expect(response).to redirect_to login_url
    end
  end

  describe "POST #create" do
    it "requires login" do
      post :create, contact: FactoryGirl.attributes_for(:contact)
      expect(response).to redirect_to login_url
    end
  end

  # other examples ...
end
{% endhighlight %}

Historically, I've liked using tests like these in my Rails apps, to make sure I've included a `before_action` to lock down specific controller actions, and that the methods called in those `before_action`s are doing their job. I've also liked how straightforward it is to test the `create` action directly, without having to simulate filling out a web form. This isn't just about speed--we want to make sure that, even if someone can't get to a web form to feed data into our app, they also can't get clever with their HTTP client and craft a POST request to send directly to the endpoint. We don't want that!

How can we add this same level of coverage, without relying on controller specs?

One option is to use **request specs**. These examples use Rack::Test's simple methods for passing HTTP requests, along with parameters, to your app. (If you're familiar with Capybara, note that you can't use methods like `visit` or `has_content` in request specs--you'll need to use a feature spec. More on that in part two of this series.)

Here's what a request spec with the same level of coverage as the controller spec examples might look like:

{% highlight ruby %}
require "rails_helper"

describe "Public access to contacts", type: :request do
  it "denies access to contacts#new" do
    get new_contact_path
    expect(response).to redirect_to login_url
  end

  it "denies access to contacts#create" do
    contact_attributes = FactoryGirl.attributes_for(:contact)

    expect {
      post "/contacts", { contact: contact_attributes }
    }.to_not change(Contact, :count)

    expect(response).to redirect_to login_url
  end
end
{% endhighlight %}

There's not a whole lot of difference in structure and syntax between the original controller spec and new request spec. But in addition to being more future-proof, the request spec version provides a couple of nice things not available in a controller spec. First, it actually hits your application's HTTP endpoints, as opposed to calling controller methods directly. It also adds some coverage to the app's routes file--in this case, we can see that `new_contact_path` and `login_url` are recognized by the app, and correctly pass the request along to the right places in the right controllers. This approach is optional; you can also refer to paths directly as shown in the `POST` example.

Now, this particular controller spec example doesn't use deprecated behavior I mentioned in the introduction, so we could technically keep the existing coverage in controller specs. But in the interest of maintaining a healthy test suite, and being ready for an upgrade to Rails 5, moving the examples to a request spec is a smart decision.

In the next post in this series, we'll look at a spec that *does* dig too deeply into the controller's implementation, and specifically uses those deprecated `assigns` and `assert_template` helpers.

Until then, start looking at your application's controller tests for opportunities to future proof with request specs. And if you're adding new functionality to your Rails app, consider taking this path instead of adding new tests at the controller level.

Thanks for reading!

### Resources

- [RSpec 3.5 release announcement](http://rspec.info/blog/2016/07/rspec-3-5-has-been-released/)
- [RSpec request specs documentation](https://www.relishapp.com/rspec/rspec-rails/docs/request-specs/request-spec)
- [Deprecate assigns() and assert_template in controller testing](https://github.com/rails/rails/issues/18950)
