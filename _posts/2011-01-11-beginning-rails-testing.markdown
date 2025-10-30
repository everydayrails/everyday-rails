---
layout: post
title: "Beginning Rails testing"
excerpt: "Still not writing tests for your Rails applications? Here are a few suggestions from my own experiences to get you started."
tags: tdd
---

I admit that I was guilty for a long time of not writing _any_ tests for my Rails applications. My application testing consisted of an unhealthy reliance on in-browser testing, with nothing automated. I blame this on coming from a very unstructured way of developing code before I discovered Rails; I also think the early Rails demonstrations (15-minute blog) and tutorials focused on rapid application development more than the baked-in opportunities to test your code programatically.

This wasn't the end of the world when I had one small app in production, and hardly any users&mdash;but as the apps grew in count, size, and complexity, and my user base grew along with them, manually testing every edge case, every time, in a browser became tedious. It really wasn't until I read early beta versions of a couple of books on testing that I finally got with the program.

Below are five things I did to get in the swing of testing my Rails applications. These aren't coming from a hardcore TDD/BDD guy (more on that in a minute); if you are, or if you've been writing tests for awhile, you probably won't benefit from this list too much. However, if you've got additional suggestions for Rails developers who are dragging their feet on writing tests in their own software, please share them in the comments at the end of the post.

### 1. Write tests!

The best thing you can do to get in the habit of testing your software is to actually write tests. A couple of tips:

* Write tests to test functionality you're pretty confident works because you've been using it for awhile without tests. This is a good way to learn because, if a test fails, it's apt to be due to your test and not your code. Try to write as many cases as you can to test as many nuances of your app as possible. If you're not sure how to write a given test, that's OK&mdash;mark it as a pending test. Then revisit your tests regularly to fill in the gaps as you become more proficient at your test suite of choice.
* As your application grows, or as you fix bugs in your existing code, remember to keep up with writing tests to verify bugs, verify that you've squashed said bugs, and confirm that new features don't break anything.

### 2. Don't worry about TDD

Like I said, I'm not hardcore into Test Driven Development or Behavior Driven Development. I write tests for my code, but my process is much more back and forth than outwards-inwards. Depending on what I'm writing, I may start with tests for my model, then make my way to controllers and views. The most important thing is that you're writing tests and using them to make sure your software is as reliable as possible. Don't feel like you have to change your entire approach to development to make this a reality&mdash;it's probably just a matter of injecting a couple of good habits.

### 3. Start with your scaffolds

Scaffolds are a great way to learn Rails (and to continue to write Rails code quickly), and they're also good for learning to write tests. In particular, Ryan Bates' [Nifty Generators](https://github.com/ryanb/nifty-generators) will write starter tests for you using your choice of Test::Unit or RSpec. You can use Ryan's generated tests to get a handle on what you should be testing and how, then build on those with your own tests.

### 4. Use factories liberally

I'm a big fan of factories&mdash;they make it simple to specify exactly what your data should look like in each of your tests. I currently use [Factory Girl](https://github.com/thoughtbot/factory_girl). The [Railscasts](http://railscasts.com/episodes/158-factories-not-fixtures) episode is a good primer (though slightly outdated, so refer to Factory Girl's documentation for the latest syntax). I use factories in RSpec to test my models and my controllers alike. I'm also a big fan of using the inheritance feature:

{% highlight ruby %}
  # spec/factories.rb
  
  factory :article do |f|
    f.name { Faker::Lorem.words(3) }
    f.body { Faker::Lorem.paragraphs(3) }
  end
  
  factory :invalid_article, :parent => :article do |f|
    f.name nil
  end
{% endhighlight %}

Now, as long as an `article` is invalid without a name, I can use the `invalid_article` factory in any test that has something to do with, you guessed it, an invalid article (for example, testing to make sure a `create` controller method doesn't process an incomplete entry).

The other part of the code above that might look new is the use of the Faker gem in factories. A [Railscast on populating databases](http://railscasts.com/episodes/126-populating-a-database) showed how to use this handy gem; I've taken to using [Fast Faker](https://github.com/EmmanuelOga/ffaker), which has the same API but is much speedier.

### 5. Structure your tests

Your tests should be easy to read. They should also test one thing at a time. The best resource I've found that explains how to put this in practice is [RSpec Best Practices](http://blog.carbonfive.com/2010/10/21/rspec-best-practices/), written last October by Jared Carroll at Carbon Five. Read this article, then revisit the tests you've written to figure out how you can make them cleaner.

I also like to switch my RSpec output format to _documentation_ so I can see a nice outline of my tests. To do this in RSpec 2, edit your project's `.rspec` file and add the line

{% highlight ruby %}
  --format documentation
{% endhighlight %}

### Next steps

First and foremost, I'll reiterate that the best way to move forward with testing your Rails applications is to start writing tests. Write tests on code you know to work and build up from there.

I also like a couple of books in particular about testing in Rails. The first, _[Rails Test Prescriptions: Keeping Your Application Healthy](http://amzn.to/ofN37q)_ by Noel Rappin is a good overview of the entire Rails testing ecosystem (it's technically in beta right now but will be released soon&mdash;follow the [Rails Test Prescriptions Blog](http://railsrx.com/) to keep current on the book's status). The second book is specific to RSpec and is called, fittingly, _[The RSpec Book: Behaviour-Driven Development with RSpec, Cucumber, and Friends](http://amzn.to/qoeTvR)_. This one's by David Chelimsky, Dave Astels, Zach Dennis, Aslak Helles&oslash;y, Bryan Helmkamp, Dan North&mdash;the folks behind RSpec itself.

One last thought: If you're brand new to Rails, or haven't gotten up to speed on Rails 3 yet, I recommend getting started with Michael Hartl's [Rails Tutorial](http://railstutorial.org/) ([also available in book form](http://amzn.to/ovOHFn)). Unlike other Rails primers, this one gets you off on the right foot by having you write tests alongside your code, to help you get into that good habit.

Good luck with your Rails testing!