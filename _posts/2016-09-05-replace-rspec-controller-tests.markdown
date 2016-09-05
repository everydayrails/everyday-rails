---
layout: post
title: "Replacing RSpec controller specs, part 2: Feature specs"
excerpt: |-
  In part two of a series on ditching controller specs, let's move a complicated
  controller example into a more reasonable, future-proof feature spec.
---

One of the things I admire about the Rails team is their willingness to remove features that no longer make sense to keep in the framework. In Rails 5.0, two overused testing helpers got the axe: `assigns` and `assert_template`. These methods are commonly used when testing controllers, but often result in tests that know more about the underlying application code than they should. As [DHH pointed out in the discussion about this change](https://github.com/rails/rails/issues/18950), "testing the innards of the controller is just not a good idea." I agree. Does a browser care which view file was responsible for the HTML it got back from its request to your server? Does it need to know which instance variables got assigned as Ruby worked to craft its response? No--and chances are, your tests don't need to know this, either.

If you must use these helpers in Rails 5, you can restore them via the [rails-controller-testing gem](https://github.com/rails/rails-controller-testing).  *rails-controller-testing* will keep your test suite happy as you upgrade existing apps to Rails 5.0, but it's not recommended for new apps--and even if an upgrade to the latest and greatest Rails isn't on your immediate horizon, you can begin to rethink and refactor your test suite to move away from controller specs entirely.

In [part one of this series](/2016/08/29/replace-rspec-controller-tests.html), I converted a spec that verified an application's authentication layer, from a controller spec to an RSpec request spec. In this post, I'll share another option. Like before, I'm going to take an example from *[Everyday Rails Testing with RSpec](https://leanpub.com/everydayrailsrspec)*, modify it slightly for clarity outside of the book's context, and talk about how we can future-proof it. The original sample code is a Rails 4.1 app, and is [available on GitHub](https://github.com/everydayrails/rails-4-1-rspec-3-0).

### From controller specs to feature specs

Here we've got coverage of a controller's `index` and `show` actions, split across six tests and making heavy use of both `assigns` and `assert_template`, which gets called in RSpec via `expect(response).to render_template(...)`. It's also stubbing out a lot of the `Contact` model's behavior, boosting the test's speed and isolation, at the risk of making the test more difficult to read. And some of the examples are already hitting the database to create test data, anyway.

{% highlight ruby %}
describe 'GET #index' do
  context 'with params[:letter]' do
    it "populates an array of contacts starting with the letter" do
      smith = FactoryGirl.create(:contact, lastname: 'Smith')
      jones = FactoryGirl.create(:contact, lastname: 'Jones')
      get :index, letter: 'S'
      expect(assigns(:contacts)).to match_array([smith])
    end

    it "renders the :index template" do
      get :index, letter: 'S'
      expect(response).to render_template :index
    end
  end

  context 'without params[:letter]' do
    it "populates an array of all contacts" do
      smith = FactoryGirl.create(:contact, lastname: 'Smith')
      jones = FactoryGirl.create(:contact, lastname: 'Jones')
      get :index
      expect(assigns(:contacts)).to match_array([smith, jones])
    end

    it "renders the :index template" do
      get :index
      expect(response).to render_template :index
    end
  end
end

describe 'GET #show' do
  let(:contact) { FactoryGirl.build_stubbed(:contact,
    firstname: 'Lawrence', lastname: 'Smith') }

  before :each do
    allow(Contact).to receive(:persisted?).and_return(true)
    allow(Contact).to \
      receive(:order).with('lastname, firstname').and_return([contact])
    allow(Contact).to \
      receive(:find).with(contact.id.to_s).and_return(contact)
    allow(Contact).to receive(:save).and_return(true)

    get :show, id: contact
  end

  it "assigns the requested contact to @contact" do
    expect(assigns(:contact)).to eq contact
  end

  it "renders the :show template" do
    expect(response).to render_template :show
  end
end
{% endhighlight %}

Now, these examples are somewhat contrived, because they came from a book in which I tried to show different testing techniques with a relatively small set of files, but I've seen controller tests similar to these in real, production applications. Let's replace them with a single **feature spec**. We'll define the scenario in which a visitor accesses the site, views the full directory, filters by letter, and finally clicks a contact's name in the resulting list to view more details about that individual. Unlike the request spec example from part one of this series, we can use Capybara methods like `visit` and `click_link` to simulate browser interactions, and give us a nice, readable spec.

{% highlight ruby %}
require "rails_helper"

feature "Public access to contacts", type: :feature do
  scenario "visitor finds contact by filtering by letter" do
    smith = FactoryGirl.create(:contact, firstname: "John", lastname: "Smith")
    FactoryGirl.create(:contact, firstname: "Sally", lastname: "Jones")

    visit root_path

    expect(page).to have_content "John Smith"
    expect(page).to have_content "Sally Jones"

    click_link "S"

    expect(page).to have_content "John Smith"
    expect(page).to_not have_content "Sally Jones"

    click_link "John Smith"

    expect(current_path).to eq contact_path(smith)

    within "h1" do
      expect(page).to have_content "John Smith"
    end
  end
end
{% endhighlight %}

I like this style of test much better. It's easier to read through and reason about--I can read a single scenario to understand this feature of the application. It provides a higher level of coverage, across multiple endpoints. It's a more realistic use case. One more thing to like about it: Since the test coverage is now decoupled from a specific controller, it helps us refactor a potential design flaw in the controller. The heavy use of `assigns` in the original controller test suggests that the controller is doing more than it should. Sure enough, the `index` action, albeit small, has logic that can be extracted from the controller:

{% highlight ruby %}
def index
  if params[:letter]
    @contacts = Contact.by_letter(params[:letter])
  else
    @contacts = Contact.order('lastname, firstname')
  end
end
{% endhighlight %}

The actual extraction is beyond what I want to cover here, but I may dig into that in a future post. The outdated "fat models, skinny controllers" paradigm would suggest adding a method to the Contact model. Newer Rails conventions might move the code to a concern. Or a hexagonal approach could prompt you to create a standalone object dedicated to the app's filter-by-letter feature.

For now, I'll leave decisions like that up to you. The nice thing about testing at a higher level, though, is that you can perform these types of refactors with a reliable safety net. They ensure that your app's many moving parts are talking to each other, without the risk of incorrectly mocking out incorrect behavior.

### Conclusion

`assigns` and `assert_template` were extracted from Rails for a reason, and it's time to move on from both them and, eventually, controller-level testing. Replacing controller tests with feature-style integration tests requires a little more thought than using request specs, but I believe the effort pays off in terms of readability, flexibility, and long-term test health. Thanks for reading!

### Resources

- [RSpec 3.5 release announcement](http://rspec.info/blog/2016/07/rspec-3-5-has-been-released/)
- [RSpec feature specs documentation](https://www.relishapp.com/rspec/rspec-rails/docs/feature-specs/feature-spec)
- [Deprecate assigns() and assert_template in controller testing](https://github.com/rails/rails/issues/18950)
