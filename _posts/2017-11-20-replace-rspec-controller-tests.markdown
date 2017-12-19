---
layout: post
title: "Replacing RSpec controller tests, part 3: Removing business logic from controllers"
excerpt: "Do you need yet another reason to move code out of controllers and into service (or whatever you want to call them) objects? How about better, forward-thinking testability?"
tags: rspec
---

After the Rails core team announced major changes to controller-level testing upon the release of Rails 5.0, I wrote a couple of pieces in Everyday Rails about how to shift testing responsibility up, to either [request specs](https://everydayrails.com/2016/08/29/replace-rspec-controller-tests.html), or browser-based [feature specs](https://everydayrails.com/2016/09/05/replace-rspec-controller-tests.html) (or system specs, in the current Rails testing landscape). However, relying solely on high level tests like these can lead to slower test suites. And even if they're _reasonably_ fast, they can still require extra setup like checking for proper authentication checking or populating a database with extraneous details.

Here's an intentionally short example. It's taken from the Rails 4.1/RSpec 3.1 edition of my book, _[Everyday Rails Testing with RSpec](https://leanpub.com/everydayrailsrspec)_, but the concept applies to newer and older versions of RSpec and Rails alike. And as I'll discuss later in this article, it applies to more complicated examples, too. Let's look at the existing implementation and test coverage first.

This controller action checks for the value of `params[:letter]` and performs one of two different behaviors, depending on the parameter's presence:

{% highlight ruby %}
def index
  if params[:letter]
    @contacts = Contact.by_letter(params[:letter])
  else
    @contacts = Contact.order('lastname, firstname')
  end
end
{% endhighlight %}

If the `:letter` parameter is found, this finder is run:

{% highlight ruby %}
def self.by_letter(letter)
  where("lastname LIKE ?", "#{letter}%").order(:lastname)
end
{% endhighlight %}

The controller code is exercised through a couple of tests:

{% highlight ruby %}
describe 'GET #index' do
  context 'with params[:letter]' do
    it "populates an array of contacts starting with the letter" do
      smith = FactoryBot.create(:contact, lastname: 'Smith')
      jones = FactoryBot.create(:contact, lastname: 'Jones')
      get :index, letter: 'S'
      expect(assigns(:contacts)).to match_array([smith])
    end
  end

  context 'without params[:letter]' do
    it "populates an array of all contacts" do
      smith = FactoryBot.create(:contact, lastname: 'Smith')
      jones = FactoryBot.create(:contact, lastname: 'Jones')
      get :index
      expect(assigns(:contacts)).to match_array([smith, jones])
    end
  end
end
{% endhighlight %}

<div class="alert alert-info">
I've updated this code sample slightly to use the <a href="https://robots.thoughtbot.com/factory_bot">recently renamed</a> factory_bot gem for creating test data.
</div>

Wow, that's simple--just five lines of controller code, and a single line of code in the model, right? And thorough test coverage for both use cases (letter provided, no letter provided)? But if my 2017 self were to code review my younger self's work, I might raise the following **questions and concerns**:

- **What happens if a user provides an unexpected value**, such as a number or non-alphanumeric character?
- Hmm, it looks like the controller code and model code are in **violation of the DRY principle**--they both specify an `order` for sorting found contacts, but the order in the model appears to be incomplete. Should it sort by last name _and_ first name, too? And can this code be rewritten to remove duplication, so that ordering behavior remains consistent?
- Testing the controller code directly requires usage of the `assigns` method, which has been **soft-deprecated in Rails 5 and will eventually be removed**. Could we try writing this code so that it's **more testable at a different level?**

Let's think about the code's testability for a moment. In addition to the controller tests listed above, we also currently rely on model-level tests, explicitly interacting with `Contact.by_letter`:

{% highlight ruby %}
describe "filter last name by letter" do
  before :each do
    @smith = create(:contact,
      firstname: 'John',
      lastname: 'Smith',
      email: 'jsmith@example.com'
    )
    @jones = create(:contact,
      firstname: 'Tim',
      lastname: 'Jones',
      email: 'tjones@example.com'
    )
    @johnson = create(:contact,
      firstname: 'John',
      lastname: 'Johnson',
      email: 'jjohnson@example.com'
    )
  end

  context "with matching letters" do
    it "returns a sorted array of results that match" do
      expect(Contact.by_letter("J")).to eq [@johnson, @jones]
    end
  end

  context "with non-matching letters" do
    it "omits results that do not match" do
      expect(Contact.by_letter("J")).not_to include @smith
    end
  end
end
{% endhighlight %}

It bothers me enough that test coverage for this relatively simple feature is **spread across two levels of the application**. It bothers me even more that I have to **go through the HTTP stack** to test part of it at all. So, how to improve upon this design?

## For the sake of discussion

In the interest of keeping things as simple as possible, perhaps the next step would be to move all the logic into the `Contact` model. For example:

{% highlight ruby %}
class Contact
  # other parts of model omitted ...

  def self.search_by_letter(params={})
    if params[:letter]
      self.by_letter(params[:letter])
    else
      self.order("lastname, firstname")
    end
  end
end
{% endhighlight %}

Check out how much this simplifies the controller action:

{% highlight ruby %}
class ContactsController < ApplicationController
  before_action :authenticate, except: [:index, :show]
  before_action :set_contact, only: [:show, :edit, :update, :destroy]

  def index
    @contacts = Contact.search_by_letter(params)
  end

  # remainder of controller omitted ...
end
{% endhighlight %}

With logic removed from the controller action, we can move coverage of this functionality over to the Contact model--for example:

{% highlight ruby %}
describe ".search_by_letter" do
  context "with a letter" do
    it "populates an array of contacts starting with the letter" do
      smith = FactoryBot.create(:contact, lastname: "Smith")
      jones = FactoryBot.create(:contact, lastname: "Jones")
      params = { letter: "S" }
      results = Contact.search_by_letter(params)
      expect(results).to match_array([smith])
    end
  end

  context "without a letter" do
    it "populates an array of all contacts" do
      smith = FactoryBot.create(:contact, lastname: "Smith")
      jones = FactoryBot.create(:contact, lastname: "Jones")
      params = {}
      results = Contact.search_by_letter
      expect(results).to match_array([smith, jones])
    end
  end
end
{% endhighlight %}

I still think it's worth having _some_ coverage to indicate that everything is wired together. In 2017, that probably means a system spec (or feature or request spec, if you're not on Rails 5.1 and RSpec 3.7). But now, higher-level specs can focus more on a happy path integration, and less on the implementation details of how the query is built and performed.

Finally, we can delete the original section of coverage in the controller spec. Even though it's still passing, it's duplicate coverage now, and not needed.

And with the code more isolated, we can start to see the potential issues with redundant logic and inconsistent sorting:

{%highlight ruby%}
class Contact < ActiveRecord::Base
  # ...

  def self.by_letter(letter)
    where("lastname LIKE ?", "#{letter}%").order(:lastname)
  end

  def self.search_by_letter(params={})
    if params[:letter]
      self.by_letter(params[:letter])
    else
      self.order("lastname, firstname")
    end
  end
end
{%endhighlight%}

I can think of a few ways to rewrite this to fix the issues mentioned. Maybe `self.by_letter` can be inlined into `self.search_by_letter`, or converted to a private method. Either way, there's a good chance the test coverage for `self.by_letter` is redundant, and could be removed.

But that's outside the scope of this article. In the meantime, we've now got tests written in a way that those changes can be tested efficiently, without relying on a deprecated test layer.

----

You may be rolling your eyes at me right now. This is _too simple_, right? It sure is--and that's my point. Many times, complex controller code starts out this simple, but quickly expands. In fact, maybe we're already stressing the Contact model too much with this new method. Maybe an even _better_ solution is an object dedicated to this search by letter process, something like:

{% highlight ruby %}
class SearchContactByLetter
  def run(params)
    # perform search
  end
end
{% endhighlight %}

There's a lot to like about this approach. It gives us room to grow as our simple search-by-letter functionality becomes more complex. What if we _also_ need to check params for location, employment status, or other factors? We can test these various options directly, in isolation, without the overhead of the rest of the stack. Meanwhile, our higher-level test continues to ensure that the new object is wired to the rest of the app correctly.

I'm by no means the first person to suggest pulling code out of controllers and into standalone objects. In just the past couple of weeks, there have been a few excellent articles on the subject, ranging from Avdi Grimm's ["Enough with the Service Objects, Already"](https://avdi.codes/service-objects/), to Aaron Lasseigne's rebuttal ["Why Aren't We Using More Service Objects Already"](https://aaronlasseigne.com/2017/11/08/why-arent-we-using-more-service-objects-already/), to Tiago Farias's tutorial on [using the interactor gem to make extracting this code easy](https://goiabada.blog/interactors-in-ruby-easy-as-cake-simple-as-pie-33f66de2eb78).

<div class="alert alert-info">
Personally, I've become a fan of the term <em>workflow</em> for such objects, as described in Noel Rappin's <em><a href="http://amzn.to/2yz840D">Take My Money: Accepting Payments on the Web</a></em>.
</div>

Work to keep this type of code _out_ of controllers. Learn about moving domain logic into focused, standalone objects (whether you call them services, procedures, workflows, or something else). Isolate your test coverage so that the details of _how_ those objects do their work can be written and run quickly.

I'll admit, I balked at this general idea for too long. Rails convention (by way of the file structure that gets generated with `rails new`) suggests limiting application code to models, views, controllers, and concerns. And it _could_ be confusing to a developer new to a project to stumble upon a design that relies on unconventional (to Rails) techniques.

But as I continue to grow as a developer, I've come to realize that the chances that _I_ will have to work with a codebase in the coming weeks, months, and years are much higher than the chances of a new developer joining my team. And even when that _does_ happen, it's not like we're deviating so far off track that new developers can't pick things up in short order.

I'd argue that taking such an approach makes it _easier_ for new developers to pick up on the domain requirements of a project. If you begin to **think of each class as a tiny program** that eventually talks to other programs, you'll find that it's far simpler to reason about your application as a whole.

----

Of the three scenarios I've provided throughout this series for preparing your codebase for the eventual retirement of controller-level testing, this is my favorite. That said, I know it's not always practical to to do refactoring to this degree. That's why it may be better to start with moving high-level tests up to features or requests, then refactor application code so that it can be more easily tested in isolation, then simplify the high-level coverage to ensure that objects are communicating with each other.

<div class="alert alert-info">
Special thanks to <a href="https://github.com/phawk">Pete Hawkins</a> for <a href="https://github.com/everydayrails/everyday-rails/pull/1">addressing a couple of code errors</a> in the original version of this post.
</div>
