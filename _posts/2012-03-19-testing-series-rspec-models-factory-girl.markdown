---
layout: post
title: "How I learned to test my Rails applications, Part 3: Model specs"
excerpt: "How can you make sure your application's core building blocks are doing what you expect them to? Let's start by using RSpec to test model functionality."
tags: rspec
---

<div class="alert alert-info" markdown="1">
  This is part three of an ongoing [series on getting started and comfortable with testing Rails applications](http://everydayrails.com/2012/03/12/testing-series-intro.html). I appreciate your feedback along the way.
</div>

We've got all the tools we need for building a solid, reliable test suite&mdash;now it's time to put them to work. We'll get started with the app's core building blocks&mdash;its models.

In this post, we'll complete the following tasks:

* First we'll create a model spec for an existing model&mdash;in our case, the actual `Contact` model.
* Next, we'll simplify the process of creating and maintaining test data with factories.
* Finally, we'll write passing tests for a model's validations, class, and instance methods, and organize our spec in the process.

We'll create our first spec files and factories for existing models by hand (though the handy RSpec generators we configured in [Part 2](http://everydayrails.com/2012/03/12/testing-series-rspec-setup.html) can be used as templates when adding future models to our application).

## Anatomy of a model spec

I think it's easiest to learn testing at the model level because doing so allows you to examine and test the core building blocks of an application. (An object-oriented application without objects isn't very useful, after all.) Well-tested code at this level is key&mdash;a solid foundation is the first step toward a reliable overall code base.

To get started, a model spec should include tests for the following:

* the default factory should generate a valid object (more on factories in just a moment)
* data that fail validations should not be valid
* class and instance methods perform as expected

This is a good time to look at the basic structure of an RSpec model spec. I find it helpful to think of them as individual outlines. For example, let's look at our main `Contact` model's requirements:

{% highlight ruby %}
describe Contact
  it "has a valid factory"
  it "is invalid without a firstname"
  it "is invalid without a lastname"
  it "returns a contact's full name as a string"
{% endhighlight %}

We'll expand this outline in a few minutes, but this gives us quite a bit for starters. It's a simple spec for an admittedly simple model, but points to our first three best practices:

* **Each example (a line beginning with `it`) only expects on thing.** Notice that I'm testing the `firstname` and `lastname` validations separately. This way, if an example fails, I know it's because of that _specific_ validation, and don't have to dig through RSpec's output for clues.
* **Each example is explicit.** The descriptive string after `it` is technically optional in RSpec; however, omitting it makes your specs more difficult to read.
* **Each example's description begins with a verb, not should.** _Should_ is redundant here, and clutters RSpec's output. Omitting it makes specs' output easier to read.

With these best practices in mind, let's build a spec for the `Contact` model.

## Creating a model spec

Open up the `spec` directory and, if necessary, create a subdirectory named `models`. Inside the subdirectory create a file named `contact_spec.rb` and add the following:

{% highlight ruby %}
# spec/models/contact.rb
require 'spec_helper'

describe Contact do
  it "has a valid factory"
  it "is invalid without a firstname"
  it "is invalid without a lastname"
  it "returns a contact's full name as a string"
end
{% endhighlight %}

We'll fill in the details in a moment, but if you'd like you can now run the specs from your command line:

{% highlight bash %}
$ rspec spec/models/contact_spec.rb
{% endhighlight %}

You should see output similar to the following:

{% highlight bash %}
Contact
  has a valid factory (PENDING: Not yet implemented)
  is invalid without a firstname (PENDING: Not yet implemented)
  is invalid without a lastname (PENDING: Not yet implemented)
  returns a contact's full name as a string (PENDING: Not yet implemented)

Pending:
  Contact has a valid factory
    # Not yet implemented
    # ./spec/models/contact_spec.rb:4
  Contact is invalid without a firstname
    # Not yet implemented
    # ./spec/models/contact_spec.rb:5
  Contact is invalid without a lastname
    # Not yet implemented
    # ./spec/models/contact_spec.rb:6
  Contact returns a contact's full name as a string
    # Not yet implemented
    # ./spec/models/contact_spec.rb:7

Finished in 0.00045 seconds
4 examples, 0 failures, 4 pending
{% endhighlight %}

Great! Four pending specs&mdash;let's make them pass.

As we add additional models to the contacts manager, assuming we use Rails' `model` generator to do so, this file (along with an associated factory) will be added automatically. (If it doesn't go back and configure your application's generators now.)

## Generating test data with factories

I won't spend a lot of time bad-mouthing fixtures&mdash;frankly, it's already been done. Long story short, there are two issues presented by fixtures I'd like to avoid: First, fixture data can be brittle and easily broken (meaning you spend about as much time maintaining your test data as you do your tests and actual code); and second, Rails bypasses Active Record when it loads fixture data into your test database. What does that mean? It means that important things like your models' validations are ignored. This is bad!

Enter factories: Simple, flexible, building blocks for test data. If I had to point to a single component that helped me see the light toward testing more than anything else, it would be [Factory Girl](https://github.com/thoughtbot/factory_girl), an easy-to-use and easy-to-rely-on gem for creating test data without the brittleness of fixtures. Since we've got Factory Girl installed courtesy of the `factory_girl_rails` gem we installed earlier, we've got full access to factories in our app. Let's put them to work!

Back in the `spec` directory, add another subdirectory named `factories`; within it, add the file `contacts.rb` with the following content:

{% highlight ruby %}
# spec/factories/contacts.rb
FactoryGirl.define do
  factory :contact do |f|
    f.firstname "John"
    f.lastname "Doe"
  end
end
{% endhighlight %}

This chunk of code gives us a _factory_ we can use throughout our specs. Essentially, whenever we create test data via `Factory(:contact)`, that contact's name will be John Doe. This is probably adequate for our first round of model specs, but I like to provide my specs with more random data. Enter the [Faker](http://rubygems.org/gems/faker) gem. Edit `contacts.rb` to include it:

{% highlight ruby %}
# spec/factories/contacts.rb
require 'faker'

FactoryGirl.define do
  factory :contact do |f|
    f.firstname { Faker::Name.first_name }
    f.lastname { Faker::Name.last_name }
  end
end
{% endhighlight %}

Now our specs will use random, sometimes humorous names for each generated contact. Notice that I pass Faker's `first_name` method inside a block&mdash;Factory Girl considers these "lazy attributes" as opposed to the statically-added strings our initial factory had.

Return to the `contact_spec.rb` file we set up a few minutes ago and locate the first example (`it "has a valid factory"`). We're going to write our first spec&mdash;essentially testing the factory we just created. Edit the example to look like the following:

{% highlight ruby %}
# spec/models/contact_spec.rb
require 'spec_helper'

describe Contact do
  it "has a valid factory" do
    Factory.create(:contact).should be_valid
  end
  it "is invalid without a firstname"
  it "is invalid without a lastname"
  it "returns a contact's full name as a string"
end
{% endhighlight %}

This single-line spec uses RSpec's `be_valid` matcher verify that our new factory does indeed return a valid contact.

Run RSpec from the command line again and you should see one passing example, with three pending.

## Testing validations

Validations are a good way to break into automated testing. These tests can usually be written in just a line or two of code, especially when we leverage the convenience of factories. Let's add some detail to our `firstname` validation spec:

{% highlight ruby %}
# spec/models/contact_spec.rb
it "is invalid without a firstname" do
  Factory.build(:contact, firstname: nil).should_not be_valid
end
{% endhighlight %}

Note what we're doing with Factory Girl here: First, instead of the `Factory.create()` approach, we're using `Factory.build()`. Can you guess the difference? `Factory()` builds the model and saves it, while `Factory.build()` instantiates a new model, but doesn't save it. If we used `Factory()` in this example it would break before we could even run the test, due to the validation.

Second, we use the `Contact` factory's defaults for every attribute except `:firstname`, and for that we pass `nil` to give it no value. In other words, instead of the default name of _John Doe_ our `Contact` factory would normally give us, it returns _John_. This is an incredibly convenient feature, especially when testing at the model level. You'll use it a lot in your tests&mdash;starting with models, but more in other tests, too.

Run RSpec again; we should be up to two passing specs with two pending. We can use the same approach to test the `:lastname` validation.

{% highlight ruby %}
  # spec/models/contact_spec.rb
  it "is invalid without a lastname" do
    Factory.build(:contact, lastname: nil).should_not be_valid
  end
{% endhighlight %}

You may be thinking that these tests are relatively pointless&mdash;how hard is it to make sure validations are included in a model? The truth is, they can be easier to omit than you might imagine. If you think about what validations your model should have _while_ writing tests (ideally, in a Test-Driven Development pattern), you are more likely to remember to include them.

In addition, testing validations becomes more important when they are more complex than simply validating presence or uniqueness. For example, let's say we want to make sure we don't duplicate a phone number for a user&mdash;their home, office, and mobile phones should all be unique to them. How might you test that?

In your `Phone` model spec, you might have the following example:

{% highlight ruby %}
# spec/models/phone_spec.rb
it "does not allow duplicate phone numbers per contact" do
  contact = Factory(:contact)
  Factory(:phone, contact: contact, phone_type: "home", number: "785-555-1234")
  Factory.build(:phone, contact: contact, phone_type: "mobile", number: "785-555-1234").should_not be_valid
end
{% endhighlight %}

And make it pass with this validation in your `Phone` model:

{% highlight ruby %}
# app/models/phone.rb
validates :phone, uniqueness: { scope: :contact_id }
{% endhighlight %}

<div class="alert alert-info" markdown="1">
That's not a typo in the previous sample spec&mdash;`Factory()` is a shortcut for `Factory.create()`.
</div>

Of course, validations can be more complicated than just requiring a specific scope. Yours might involve a complex regular expression or a custom method. Get in the habit of testing these validations&mdash;not just the happy paths where everything is valid, but also error conditions.

## Testing instance methods

It would be convenient to only have to refer to `@contact.name` to render our contacts' full names instead of creating the string every time; let's implement that feature in our `Contact` class now:

{% highlight ruby %}
  # app/models/contact.rb
  
  def name
    [firstname, lastname].join " "
  end
{% endhighlight %}

We can use the same basic techniques we used for our validation examples to create a passing example of this feature:

{% highlight ruby %}
# spec/models/contact_spec.rb
it "returns a contact's full name as a string" do
  contact = Factory(:contact, firstname: "John", lastname: "Doe")
  contact.name.should == "John Doe"
end
{% endhighlight %}

## Testing class methods and scopes

Let's test the `Contact` model's ability to return a list of contacts whose names begin with a given letter. For example, if I click _S_ then I should get _Smith, Sumner_, and so on, but not _Jones_. There are a number of ways I could implement this&mdash;for demonstration purposes I'll show one.

First, let's say we choose to add this functionality via a class method like the following:

{% highlight ruby %}
# app/models/contact.rb
def self.by_letter(letter)
  where("lastname LIKE ?", "#{letter}%").order(:lastname)
end
{% endhighlight %}

To test this, let's add the following to our `Contact` spec:

{% highlight ruby %}
# spec/models/contact_spec.rb
require 'spec_helper'

describe Contact do

  # validation examples ...

  it "returns a sorted array of results that match" do
    smith = Factory(:contact, lastname: "Smith")
    jones = Factory(:contact, lastname: "Jones")
    johnson = Factory(:contact, lastname: "Johnson")
  
    Contact.by_letter("J").should == [johnson, jones]
  end
end
{% endhighlight %}
    
## Organizing specs with describe and context

We've tested the happy path&mdash;a user selects a name for which we can return results&mdash;but what about occasions when a selected letter returns no results? We'd better test that, too. The following spec should do it:

{% highlight ruby %}
# spec/models/contact_spec.rb
require 'spec_helper'

describe Contact do

  # validation examples ...
  
  it "returns a sorted array of results that match" do
    smith = Factory(:contact, lastname: "Smith")
    jones = Factory(:contact, lastname: "Jones")
    johnson = Factory(:contact, lastname: "Johnson")
  
    Contact.by_letter("J").should == [johnson, jones]
  end

  it "returns a sorted array of results that match" do
    smith = Factory(:contact, lastname: "Smith")
    jones = Factory(:contact, lastname: "Jones")
    johnson = Factory(:contact, lastname: "Johnson")

    Contact.by_letter("J").should_not include smith
  end
end
{% endhighlight %}

This spec uses RSpec's `include` matcher to determine if the array returned by `Contact.by_letter("J")`&mdash;and it passes! We're testing not just for ideal results&mdash;the user selects a letter with results&mdash;but also for letters with no results. However, a problem is brewing in our spec&mdash;can you spot it?

## DRYer specs with before and after

Our spec currently has some redundancy: We create the same three objects in each example. Just as in your application code, the DRY principle applies to your tests (with some exceptions; see below). Let's use a few RSpec tricks to clean things up.

The first thing I'm going to do is create a `describe` block _within_ my `describe Contact` block to focus on the filter feature. The general outline will look like this:

{% highlight ruby %}
# spec/models/contact_spec.rb
require 'spec_helper'

describe Contact do

  # validation examples ...
  
  describe "filter last name by letter" do
    # filtering examples ...
  end
end
{% endhighlight %}

Let's break things down further by including a couple of `context` blocks&mdash;one for matching letters, one for non-matching:

{% highlight ruby %}
# spec/models/contact_spec.rb
require 'spec_helper'

describe Contact do

  # validation examples ...

  describe "filter last name by letter" do
    context "matching letters" do
      # matching examples ...
    end
    
    context "non-matching letters" do
      # non-matching examples ...
    end
  end
end
{% endhighlight %}

While `describe` and `context` are technically interchangeable, I prefer to use them like this&mdash;specifically, `describe` outlines a function of my class; `context` outlines a specific state. In my case, I have a state of a letter with matching results selected, and a state with a non-matching letter selected.

As you may be able to spot, we're creating an outline of examples here to help us sort similar examples together. This makes for a more readable spec. First, let's finish cleaning up our reorganized spec with the help of a `before` hook:

{% highlight ruby %}
# spec/models/contact_spec.rb
require 'spec_helper'

describe Contact do

  # validation examples ...

  describe "filter last name by letter" do
    before :each do
      @smith = Factory(:contact, lastname: "Smith")
      @jones = Factory(:contact, lastname: "Jones")
      @johnson = Factory(:contact, lastname: "Johnson")
    end
  
    context "matching letters" do
      # matching examples ...
    end

    context "non-matching letters" do
      # non-matching examples ...
    end
  end
end
{% endhighlight %}

RSpec's `before` hooks are vital to cleaning up unneeded redundancy from your specs. As you might guess, the code contained within the `before` block is run before _each_ example _within the `describe`_ block. Since I've indicated that the block should be run before _each_ example, RSpec will create them for each example individually. In this example, my `before` block will _only_ be called within the `describe "filter last name by letter"` block&mdash;in other words, my original validation specs will not have access to `@smith`, `@jones`, and `@johnson`.

Speaking of my three mock contacts, note that since they are no longer being created within each example, I have to assign them to instance variables, so they're accessible outside of the `before` block.

If your spec requires some sort of post-example teardown&mdash;disconnecting from an external service, say&mdash;you can also use an `after` block to clean up after your examples. Since RSpec handles cleaning up the database for me, I rarely use `after`. `before`, though, is indispensable.

Okay, let's see that full, organized spec:

{% highlight ruby %}
require 'spec_helper'

describe Contact do
  it "has a valid factory" do
    Factory(:contact).should be_valid
  end

  it "is invalid without a firstname" do
    Factory.build(:contact, firstname: nil).should_not be_valid
  end

  it "is invalid without a lastname" do
    Factory.build(:contact, lastname: nil).should_not be_valid
  end

  it "returns a contact's full name as a string" do
    Factory(:contact, firstname: "John", lastname: "Doe").name.should == "John Doe"
  end

  describe "filter last name by letter" do      
    before :each do
      @smith = Factory(:contact, lastname: "Smith")
      @jones = Factory(:contact, lastname: "Jones")
      @johnson = Factory(:contact, lastname: "Johnson")
    end

    context "matching letters" do
      it "returns a sorted array of results that match" do
        Contact.by_letter("J").should == [@johnson, @jones]
      end
    end

    context "non-matching letters" do
      it "does not return contacts that don't start with the provided letter" do
        Contact.by_letter("J").should_not include @smith
      end
    end
  end
end
{% endhighlight %}

Run the spec&mdash;if you've configured RSpec to use documentation format you should see a nice outline like this:

{% highlight bash %}
Contact
  has a valid factory
  is invalid without a firstname
  is invalid without a lastname
  returns a contact's full name as a string
  filter last name by letter
    matching letters
      returns a sorted array of results that match
    non-matching letters
      does not return contacts that don't start with the provided letter

Finished in 0.33642 seconds
6 examples, 0 failures
{% endhighlight %}

<div class="alert alert-info" markdown="1">

#### How DRY is too DRY?

We've spent a lot of time in this chapter organizing specs into easy-to-follow blocks. Like I said, `before` blocks are key to making this happen&mdash;but they're also easy to abuse.

When setting up test conditions for your example, I think it's okay to bend the DRY principle in the interest of readability. If you find yourself scrolling up and down a large spec file in order to see what it is you're testing, consider duplicating your test data setup within smaller `describe` blocks&mdash;or even within examples themselves.

That said, well-named variables can go a long way as well&mdash;for example, in the spec above we used `@jones` and `@johnson` as test contacts. These are much easier to follow than `@user1` and `@user2` would have been.

</div>

## Summary

And that's how I test models, but we've covered a lot of other important techniques you'll want to use in other types of specs moving forward:

* **Use active, explicit expectations:** Use verbs to explain what an example's results should be. Only check for one result per example.
* **Test for what _should_ and for what _should not_ happen:** Think about both paths when writing examples, and test accordingly.
* **Organize your specs for good readability:** Use `describe` and `context` to sort similar examples into an outline format, and `before` and `after` blocks to remove duplication. However, in the case of tests readability trumps DRY&mdash;if you find yourself having to scroll up and down your spec too much, it's okay to repeat yourself a bit.

With a solid collection of model specs incorporated into your app, you're well on your way to more trustworthy code. Next time we'll apply and expand upon the techniques covered here to application controllers.

