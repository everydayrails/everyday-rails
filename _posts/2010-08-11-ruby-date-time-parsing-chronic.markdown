---
layout: post
title: "Parsing dates and times in Ruby and Rails"
excerpt: "Make dates, times, and durations friendlier to users with Chronic and Chronic Duration, two must-have gems for Rails developers."
---

Out of the box, Rails' `date_select` input type and other date/time-related times are a bit ugly and not very user-friendly&mdash;just a series of pulldown menus from which to select the month, day, year, hour, minute, and so on. You can pretty these up using a number of [calendar-related plugins](http://railscasts.com/episodes/213-calendars), notably by using Javascript, but there's another way you can make date and time more user-friendly. I like going with a basic text input, let my users enter dates like "tomorrow," "8/12/10," "August 12," or "next Thursday," then parsing the entries before storing them in the database.

In this crash course in natural date/time parsing in Ruby, we're going to look at two gems called [Chronic](http://chronic.rubyforge.org/) and [Chronic Duration](http://github.com/hpoydar/chronic_duration). These gems handle almost any date or time format your users throw at them and store them in database-friendly formats without the need for Javascript on the client side or hand-coded Ruby on the server side.

### Chronic

Let's start with Chronic for parsing date/time values into something you can store in a database. First, install the gem:

{% highlight bash %}
  $ gem install chronic
{% endhighlight %}

Chronic's usage is very straightforward. Let's fire up `irb` or `script/console` to have a look:

{% highlight ruby %}
  > require 'rubygems'
    => true
  > require 'chronic'
    => true
  > Chronic::parse('tomorrow')
    => Thu Aug 12 12:00:00 -0500 2010
  > Chronic::parse('next saturday')
    => Sat Aug 14 12:00:00 -0500 2010
  > Chronic::parse('8/12/10 3pm')
    => Thu Aug 12 15:00:00 -0500 2010
{% endhighlight %}

So rather than requiring users to use Rails' default pulldown-based date picker, or enter data in forced formats (like `MM/DD/YYYY`), or click through Javascript-based calendars, your app can be smart about parsing the entered date into something meaningful to the server. For that matter, you can use it in conjunction with a Javascript calendar (like the [datepicker in JQuery UI](http://jqueryui.com/demos/datepicker/)) for further functionality.

### Chronic Duration

Say you're developing a cooking site or project management tool and want to allow users to enter spans of time like "35 minutes," "1 hour 15 minutes," "1:30," or "2 days" and store them in a consistent format. Enter Chronic Duration&mdash;it works like Chronic, but for stretches of time as opposed to actual dates or times. After parsing the entry, the duration is stored in the database as the number of seconds. First, install the gem:

{% highlight bash %}
  $ gem install chronic_duration
{% endhighlight %}

Let's look at it in action using `irb` (or `script/console`):

{% highlight ruby %}
  > require 'chronic_duration'
    => true
  > ChronicDuration::parse('15 minutes')
    => 900
  > ChronicDuration::parse('1:15') # note this is MM:SS
    => 75
  > ChronicDuration::parse('45s')
    => 45
{% endhighlight %}

And so on. Chronic Duration also provides an output method:

{% highlight ruby %}
  > ChronicDuration::output(75, :format => :short)
    => "1m 15s" 
  > ChronicDuration::output(75, :format => :long)
    => "1 minute 15 seconds" 
  > ChronicDuration::output(75, :format => :chrono)
    => "1:15"
{% endhighlight %}

### Using Chronic and Chronic Duration in Rails

Experimenting with the gems in the console is one thing, but how do we put them to use in a Rails application? Here's how I do it. Going back to the idea of a project tracker, say I've got a model named `Task` with a due date and an estimated time field. It might look like this:

{% highlight ruby %}
  # app/models/task.rb

  require 'chronic'
  require 'chronic_duration'

  class Task < ActiveRecord::Base
    attr_accessible :name, :description, :due_at, :estimated_time
    
    def before_save
      self.due_at = Chronic::parse(self.due_at_before_type_cast) if attribute_present?("due_at")
      self.estimated_time = ChronicDuration::parse(self.estimated_time_before_type_cast) if attribute_present?("estimated_time")
    end
  end
{% endhighlight %}

<div class="alert alert-info" markdown="1">
Don't forget to include Chronic and Chronic Duration in your `Gemfile` or `config/environment.rb` file, and restart your application.
</div>

There are a few ways you could use `ChronicDuration::output` in your application's views&mdash;you could either override the accessor in the model by adding something like

{% highlight ruby %}
  # app/models/task.rb
  
  def estimated_time
    ChronicDuration.output(read_attribute(:estimated_time), :format => :long)
  end
{% endhighlight %}

or use it in a view helper along the lines of

{% highlight ruby %}
  # app/helpers/tasks_helper.rb
  
  require 'chronic_duration'
  
  module TasksHelper
    def display_time(time = 0)
      ChronicDuration.output(time, :format => :long)
    end
  end
{% endhighlight %}

and use the helper in your views. It depends on what you need to do with the data, so experiment within your application to see what works best.

<div class="alert alert-info" markdown="1">
Chronic doesn't include a function to return a date value in a pretty format&mdash;just use Ruby's [strftime](http://ruby-doc.org/core/classes/Time.html#M000298) method to handle that.
</div>