---
layout: post
title: "Cloning Active Record objects and their associates with Deep Cloneable"
excerpt: "Here's how I created sanitized sample data from real-world data, using a few lines of Ruby code and a very useful gem."
---

I've recently noticed a couple of articles about "deep cloning" objects in Ruby. This is a technique for creating a copy of not only an object, but other data associated with it--for example, an accurate clone of an Active Record object in a Rails application might also require cloning other objects that are associated via a `has_many`. The articles reminded me of a recent experience I had with deep cloning, and the approach I took to accomplish it in short order.

One of my projects is a tool for recording data about teaching practices in middle school and high school classes. Observers record what they see a teacher doing, using handhelds and tablets, and the data get sent to a Rails application. Once there, it all gets analyzed at a school-wide level, and school leaders can make decisions on which teaching practices are effective, and which ones need to be refined or removed from classrooms.

We wanted to be able to let people from new schools be able to practice analyzing real data that had been collected at other schools already in the system. However, we also wanted to protect the privacy of those other schools, so we couldn't use real names in our example.

We decided that we could take existing information, most of which is quantitative in nature (so, just numbers, not words), and copy it over to a training area for new schools. The problem? That training was coming up in a couple of days, and I had very limited time to work on the task. A quick solution was in order, and I found one in the [Deep Cloneable](https://github.com/moiristo/deep_cloneable) gem by Reinier de Lange.

Deep Cloneable adds a method to Active Record objects to make copying them, and any desired associations, to new objects with relative ease. The gem's README is thorough, so I won't dive into setup or basics. I really just wanted to make sure more people knew about this useful tool, and show a couple of extra steps I took to solve my particular problem. In a matter of minutes, I had code I needed to select a subset of data, remove any sensitive information, and save it to the training area.

I created a quick service object to handle cloning, some of which is shared in the snippet below. I've added some comments, to help you follow along with what I did.

{% highlight ruby %}
class Duplicator
  def initialize
    # Load the training school--this is where cloned data will be assigned.
    @new_school = School.find(1)
    # Collect trainers' accounts so we can reassign sample data to them,
    # instead of the original user.
    @diane = User.find_by(email: "diane@example.com"))
    @aaron = User.find_by(email: "aaron@example.com"))
    @patty = User.find_by(email: "patty@example.com"))
    @amber = User.find_by(email: "amber@example.com"))
  end

  def duplicate_reports(source_school, start_date, end_date)
    start_date = Date.parse(start_date)
    end_date = Date.parse(end_date) + 1.day
    reports = source_school.reports
              .where("used_on >= ? and used_on < ?", start_date, end_date)
    reports.each do |report|
      # See Deep Cloneable's README and docs for more on the deep_clone method.
      # This example only had one association to include, but it can handle
      # multiple associations, and deeper ones.
      cloned_report = report.deep_clone include: [:reported_intervention_counts]
      # Now, update the clone's attributes for training purposes, using values
      # assigned in initialize.
      cloned_report.school = @new_school
      cloned_report.user = random_user # See private method, below.
      cloned_report.save!
    end
  end

  # Other data duplication methods omitted; further work on this feature might
  # lead me to pull them into additional objects.

  private

  def random_user
    [@diane, @aaron, @patty, @amber].sample
  end
end
{% endhighlight %}

Then, I exercised this code via the Rails console:

{% highlight ruby %}
source_school = School.find(434) # The school with data we want to use
Duplicator.new.duplicate_reports(source_school, "2014-01-14", "2014-03-19")
{% endhighlight %}

We had training data ready to go in about an hour.

There was one model I was unsuccessful in cloning within the time constraint. It's got some very deep associations that also contain sensitive information like names of other users. It's possible that, with more time, I could have gotten Deep Cloneable to neatly clone the data. Or I could create my own method to copy the specific data, munge it as precisely as I need, and load it back into a new object.

I would also like to give the staff in charge of training new people the ability to clone data themselves, and not have to come to me anytime they need to set up new practice data.

And finally, you may notice I didn't write any tests around this! For this initial pass at the problem, a spot-check to make sure the right data got copied was sufficient. If we wind up doing more with this feature, I will reimplement using proper, test-driven practices.

All of these issues sound like neat challenges for the future, but for now, everyone was happy with what I got done under a tight deadline. [Deep Cloneable](https://github.com/moiristo/deep_cloneable) did the job!

That's one of my favorite things about Ruby--it's so mature now, that chances are someone's already done something similar to what you need to do. Remember to search [RubyGems.org](https://rubygems.org) before doing it yourself--even if you don't use a given gem to solve your problem, you might get ideas from its source to help with your own implementation.
