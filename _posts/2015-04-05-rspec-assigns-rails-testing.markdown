---
layout: post
title: "How do assigns and reload work in Rails tests?"
excerpt: "Rails offers a couple of methods to access persisted test data, but how do they work? Let's get some answers, with the help of Pry."
tags: rspec
---

I recently got a question from a reader of
*[Everyday Rails Testing with RSpec](https://leanpub.com/everydayrailsrspec)*,
asking for clarification on how `assigns` and `reload` work in tests. This isn't the first time I've received this question, so I decided to write an article about it.

Whenever I have questions about why a test is behaving differently than I'd
expect (or just want to learn more about the state of my test data), I like to
leverage Pry, a powerful developer console for Ruby projects. You may know
about using Pry in your application code, but it's also a great way to debug
tests. In Rails projects, I include Pry via the `pry-rails` gem, by adding it
to my Gemfile:

{% highlight ruby %}
gem 'pry-rails'
{% endhighlight %}

Again, Pry is a powerful tool, and worthy of many blog posts on its own. There
are some great tutorials and talks available--I always recommend Conrad Irwin's
[Pry—the Good Parts!](https://www.youtube.com/watch?v=jDXsEzOHb2M) from
Railsconf 2013. In this exploration, we'll use the simplest of Pry's features
to see what happens to data and variables as they make their way through a typical RSpec controller test.

First, let's use Pry's `binding.pry` to add a breakpoint in the test in
question. In this case, I'm going to use a controller spec example from chapter five of the book. The original test looks like this:

{% highlight ruby %}
describe 'PATCH #update' do
  before :each do
    @contact = create(:contact,
      firstname: 'Lawrence',
      lastname: 'Smith'
    )
  end

  context "valid attributes" do
    it "changes the contact's attributes" do
      patch :update, id: @contact,
        contact: FactoryGirl.attributes_for(:contact,
          firstname: 'Larry',
          lastname: 'Smith'
        )
      @contact.reload
      expect(@contact.firstname).to eq 'Larry'
      expect(@contact.lastname).to eq 'Smith'
    end
  end
end
{% endhighlight %}

This is a simple test--it persists a Contact named *Lawrence Smith*, passes new Contract attributes for *Larry Smith*, then verifies that the persisted Contact's name fields have been updated accordingly.

Let's use `binding.pry` to start a new Pry session inside the test:

{% highlight ruby %}
it "changes the contact's attributes" do
  patch :update, id: @contact,
    contact: FactoryGirl.attributes_for(:contact,
      firstname: 'Larry',
      lastname: 'Smith'
    )
  binding.pry
  @contact.reload
  expect(@contact.firstname).to eq 'Larry'
  expect(@contact.lastname).to eq 'Smith'
end
{% endhighlight %}

Now, running the spec with `bin/rspec
spec/controllers/contacts_controller_spec.rb:171` will kick off a Pry REPL and
give us a chance to look around. To start, let's look at `@contact`:

    [1] pry(#<RSpec::ExampleGroups::ContactsController::AdministratorAccess::BehavesLikeFullAccessToContacts::PATCHUpdate::ValidAttributes>)> @contact
    => #<Contact id: 1, firstname: "Lawrence", lastname: "Smith", email: "maximus@skiles.com", created_at: "2015-04-05 01:41:36", updated_at: "2015-04-05 01:41:36">

At this point, our test's `@contact` is the same as it was when we first instantiated it in the `before` block. It's important to note that this `@contact` is not the same (yet) as the `@contact` in this test's corresponding application code. We've got a couple of ways to look at this contact, as he exists in the test: `assigns` and `reload`.

## assigns(:contact) versus @contact.reload

`assigns` is a hash, accessible within Rails tests, containing all the instance variables that would be available to a view at this point. It's also an accessor that allows you to look up an attribute with a symbol (since, historically, the assigns hash's keys are all strings). In other words, `assigns(:contact)` is the same as `assigns["contact"]` here:

    [2] pry(#<RSpec::ExampleGroups::ContactsController::AdministratorAccess::BehavesLikeFullAccessToContacts::PATCHUpdate::ValidAttributes>)> assigns(:contact) == assigns["contact"]
    => true

Whichever way you use it, `assigns` offers easy access to the state of our contact at this point in the test:

    [3] pry(#<RSpec::ExampleGroups::ContactsController::AdministratorAccess::BehavesLikeFullAccessToContacts::PATCHUpdate::ValidAttributes>)> assigns(:contact)
    => #<Contact id: 1, firstname: "Larry", lastname: "Smith", email: "caleb_nikolaus@gutkowski.info", created_at: "2015-04-05 01:41:36", updated_at: "2015-04-05 01:41:36">

As you can see, this version of our Contact has been updated to reflect the attributes passed to the `update` action on the controller.

Now, compare `assigns` to the `reload` method available on objects inheriting from ActiveRecord (in a standard Rails app, the objects in the *models* directory).

    [4] pry(#<RSpec::ExampleGroups::ContactsController::AdministratorAccess::BehavesLikeFullAccessToContacts::PATCHUpdate::ValidAttributes>)> @contact.reload
    => #<Contact id: 1, firstname: "Larry", lastname: "Smith", email: "caleb_nikolaus@gutkowski.info", created_at: "2015-04-05 01:41:36", updated_at: "2015-04-05 01:41:36">

As a result of having called `reload` on `@contact`, future references to the instance variable will now return the updated version, as it now exists in the (test) database:

    [5] pry(#<RSpec::ExampleGroups::ContactsController::AdministratorAccess::BehavesLikeFullAccessToContacts::PATCHUpdate::ValidAttributes>)> @contact
    => #<Contact id: 1, firstname: "Larry", lastname: "Smith", email: "caleb_nikolaus@gutkowski.info", created_at: "2015-04-05 01:41:36", updated_at: "2015-04-05 01:41:36">

It's worth noting that, in these examples, the contact also got a new email since we created the new attributes using Factory Girl. The email address has been created for us automatically. We could also assert more control over the test conditions by passing a simple Ruby hash as a value for `params`.

And what about `assigns(:contact)`, after the reload? It's still the same:

    [6] pry(#<RSpec::ExampleGroups::ContactsController::AdministratorAccess::BehavesLikeFullAccessToContacts::PATCHUpdate::ValidAttributes>)> assigns(:contact)
    => #<Contact id: 1, firstname: "Larry", lastname: "Smith", email: "caleb_nikolaus@gutkowski.info", created_at: "2015-04-05 01:41:36", updated_at: "2015-04-05 01:41:36">

Again, whereas `assigns` is only accessible from within a controller or integration test, `reload` is available on any ActiveRecord object. The important thing to remember is that, within the confines of our test, *`@contact` will contain the same object data as it did when we first created it, back in the `before` block, until calling its `reload` method.*

With this in mind, the sample test could be rewritten as

{% highlight ruby %}
it "changes the contact's attributes" do
  patch :update, id: @contact,
    contact: FactoryGirl.attributes_for(:contact,
      firstname: 'Larry',
      lastname: 'Smith'
    )
  expect(assigns(:contact).firstname).to eq 'Larry'
  expect(assigns(:contact).lastname).to eq 'Smith'
end
{% endhighlight %}

This is a cleaner test. It disambiguates the test's `@contact` from the application's `@contact`, without sacrificing much in the way of readability. If I were to write this test today, I'd probably prefer this version over the original.

Unfortunately, there's a catch: Unless something changes,
[it looks like `assigns` will be deprecated in Rails 5](https://intercityup.com/blog/upcoming-changes-in-rails-5-0.html), meaning at
some point it will be removed entirely from the framework. In fact, it appears that [controller tests in general are on their way out](https://github.com/rails/rails/issues/18950#issuecomment-77924771), in
favor of a one-two punch of unit tests and integration tests.

Personally, I'm not upset with this development. Controller tests can be
a nuisance to write and maintain. In my opinion, if your test suite
relies heavily on controller tests to prove your application code works, you've
probably got too much logic in your controllers. Consider extracting that logic
into standalone objects, or at least into your app's models, where it can be
more easily tested.

That said, I learned a *lot* about Rails testing by building out controller
tests for my applications. They provide a great place to experiment with mocking
and stubbing, and can give you a better understanding of how REST works in
Rails. So, as long as we have them at our disposal, I recommend that developers
who are new to testing continue to write tests at this layer to improve overall
testing skills.

I hope that sheds some light on the role played by `assigns` and `reload` in Rails testing. Thanks for reading.
