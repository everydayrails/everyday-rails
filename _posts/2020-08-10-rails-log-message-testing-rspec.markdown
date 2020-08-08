---
layout: post
title: "2 ways to test Rails log messages with RSpec"
excerpt: "If you're like me and don't need to test log output on a
regular basis, you may not find the solutions to be immediately
obvious. Here are two ways (that I know of) to approach the problem."
---

One thing about writing about Rails for as long as I have is, sometimes
I search online to see how to do something, and a post I wrote about it
shows up in the first few results! Yet another reason to blog what you
learn--you might forget it someday.

Testing log messages is one of those things I don't do on a regular
basis, and always have to root around to find the answer. Which codebase
was it again? Which test? And on top of that, there are two (that I know
of) ways to do this!

In this article, I'd like to share two approaches to this, along with a
little exploration on how the two solutions differ. For the sake of
simplicity, I'll use an RSpec system spec--though in reality, I seldom
test log messages unless there's no other interface to test. In
practice, this may be more useful for testing code used in a background
job, for example, than in a web interface or API response.

Let's say I've got a controller that, among other things, outputs to the
Rails application log:

```ruby
class HomeController < ApplicationController
  def index
    # Does some stuff ...
    logger.info "Someone visited the site!"
    # Does some more stuff ...
  end
end
```

Naively, let's just add a line indicating that the application logger
(`Rails.logger`) should `expect` to `receive` the intended log message,
and see what happens.

```ruby
it "logs a message" do
  visit root_path

  expect(page).to have_content "Welcome to my site!"

  expect(Rails.logger).to receive(:info).with("Someone visited the site!")
end
```

Hmm, that doesn't work. The test fails with:

```
Failures:

  1) HomeLogs logs a message
     Failure/Error: expect(Rails.logger).to receive(:info).with("Someone visited the site!")

       (#<ActiveSupport::Logger:0x00007fd777f90078 @level=0, @progname=nil, @default_formatter=#<Logger::Formatter:0x00007fd777f92968 @datetime_format=nil>, @formatter=#<ActiveSupport::Logger::SimpleFormatter:0x00007fd777f90028 @datetime_format=nil, @thread_key="activesupport_tagged_logging_tags:14360">, @logdev=#<Logger::LogDevice:0x00007fd777f92918 @shift_period_suffix="%Y%m%d", @shift_size=1048576, @shift_age=0, @filename="/Users/asumner/code/examples/logging_test_demo/log/test.log", @dev=#<File:/Users/asumner/code/examples/logging_test_demo/log/test.log>, @binmode=false, @mon_data=#<Monitor:0x00007fd777f928c8>, @mon_data_owner_object_id=10440>>).info("Someone visited the site!")
           expected: 1 time with arguments: ("Someone visited the site!")
           received: 0 times



     # ./spec/system/home_logs_spec.rb:12:in `block (2 levels) in <top (required)>'
 ```

We need to stub out the Rails logger's `info` method, using RSpec's
`allow` method. This lets us then use `expect` to watch for specific
messages being passed to `info`:

```ruby
it "logs a message" do
  allow(Rails.logger).to receive(:info)

  visit root_path

  expect(page).to have_content "Welcome to my site!"
  expect(Rails.logger).to receive(:info).with("Someone visited the site!")
end
```

Wait, that still doesn't work:

```
Failures:

  1) HomeLogs logs a message
     Failure/Error: expect(Rails.logger).to receive(:info).with("Someone visited the site!")

       (#<ActiveSupport::Logger:0x00007fed5e70d110 @level=0, @progname=nil, @default_formatter=#<Logger::Formatter:0x00007fed5e70fa00 @datetime_format=nil>, @formatter=#<ActiveSupport::Logger::SimpleFormatter:0x00007fed5e70d0c0 @datetime_format=nil, @thread_key="activesupport_tagged_logging_tags:14360">, @logdev=#<Logger::LogDevice:0x00007fed5e70f9b0 @shift_period_suffix="%Y%m%d", @shift_size=1048576, @shift_age=0, @filename="/Users/asumner/code/examples/logging_test_demo/log/test.log", @dev=#<File:/Users/asumner/code/examples/logging_test_demo/log/test.log>, @binmode=false, @mon_data=#<Monitor:0x00007fed5e70f960>, @mon_data_owner_object_id=10440>>).info("Someone visited the site!")
           expected: 1 time with arguments: ("Someone visited the site!")
           received: 0 times
```


## Option 1: Expect, then act

I'll admit it, this behavior stumped me for a long time. I stumbled upon
a solution one day, while still relatively new to RSpec and desperately
trying anything. Totally by accident, I put the expectation _before_
triggering the case under test:

```ruby
it "logs a message" do
  allow(Rails.logger).to receive(:info)
  expect(Rails.logger).to receive(:info).with("Someone visited the site!")

  visit root_path

  expect(page).to have_content "Welcome to my site!"
end
```

Wait, why does that work? It's by design, as shown in the passing
examples in RSpec's documentation on [expecting messages]. From an
English grammar standpoint, this makes sense: You _expect_ something
_before_ it happens, not after. But it runs counter to the _[Arrange,
Act, Assert]_ pattern by expecting the specific log message before
actually performing an action to test. (You may also know this pattern
as _Given, When, Then_.) In a complex test, this nuance might be easy to
miss.

[Arrange, Act, Assert]:http://wiki.c2.com/?ArrangeActAssert
[expecting messages]:https://relishapp.com/rspec/rspec-mocks/docs/basics/expecting-messages


## Option 2: Spy on the log

We're writing Ruby, though, and in Ruby, we like to have more than one
way to do things. Let's test the same behavior using a [spy]. A spy
tests the same behavior, but with a slightly different syntax that lets
us `expect`, or assert, after acting.

Here's what it'd look like:

```ruby
it "logs a message" do
  allow(Rails.logger).to receive(:info)

  visit root_path

  expect(page).to have_content "Welcome to my site!"
  expect(Rails.logger).to have_received(:info).with("Someone visited the site!")
end
```

This passes just fine, and follows the Assemble, Act, Assert the
pattern. It lets us arrange the example in such a way that assembly,
action, and assertion are distinct steps within the test.

[spy]:https://relishapp.com/rspec/rspec-mocks/docs/basics/spies


## Which way is the right way?

Like I said already, this is Ruby, so we can have more than one right
way.

Consider the first approach when the test is closer to a traditional
isolated unit test:

- The code being exercised lacks a lot of external dependencies
  (including Rails)
- The test can be structured so that all assertions are kept together
  --or better yet, the log assertion is the only thing being checked

Consider a spy when the scenario is more complex:

- The code relies heavily on Rails, Active Record, or anything else
  that's not easily abstracted away
- The test asserts outcomes in addition to the log message

I typically prefer using a spy for both cases, since my brain thinks in
_Given, When, Then_, anyway. But you may prefer something else, and
that's totally cool. Just be aware that you may see either approach (or
both!) when reading source code someday.
