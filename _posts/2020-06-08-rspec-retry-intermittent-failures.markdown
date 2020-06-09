---
layout: post
title: "Work around flaky test failures in Rails with rspec-retry"
excerpt: "Nobody likes an intermittently failing test. Here's one way to keep your test suite running green, even when a test sometimes fails."
---

Most of the time, a failing test is a good thing. It points to something
wrong in your assumptions about your code, and can even guide you to a
fix. The worst kind of failing test, though, is one that only fails
sometimes. Say your test suite takes ten minutes to run, and one
intermittent failure breaks the build. Congratulations, now your test
suite takes twenty minutes to run, maybe longer.

Now, the ideal thing to do here would be to figure out why the test
fails sometimes, and address the issue so the test is reliable all the
time. But as developers, we don't always have the luxury to set aside
working on new features to deal with a flaky test. That's where
rspec-retry comes in.

[rspec-retry] is my favorite Band-Aid solution to intermittently failing
tests in Rails, for those times when you _can't_ really dig into the
issue. If a test fails, rspec-retry will attempt it again, until it
passes or it reaches a set number of attempts. I've used it in a number
of Rails applications, with good success. Even though each retry attempt
adds some time to your overall test suite run, unless your suite is in
_really_ bad shape, then there's a really good chance that it'll be less
time overall than running your whole suite twice (or more).

[rspec-retry]: https://rubygems.org/gems/rspec-retry


## Setup

To start, add `rspec-retry` to the `test` group in your Gemfile, then
`bundle install` to add it. Then, configure RSpec to use it--I prefer to
do this in a separate file like _spec/support/rspec_retry.rb_, but you
can also include it in your main _spec/rails_helper.rb_ file, as shown
in [rspec-retry's README]. Whatever works for you. Here's the
configuration that's made me happy so far:

```ruby
require "rspec/retry"

RSpec.configure do |config|
  # show retry status in spec process
  config.verbose_retry = true
  # show exception that triggers a retry if verbose_retry is set to true
  config.display_try_failure_messages = true
  # RSPEC_RETRY_SLEEP_INTERVAL isn't built into the gem, but may vary
  # from environment to environment
  config.default_sleep_interval = ENV.fetch("RSPEC_RETRY_SLEEP_INTERVAL", 0).to_i

  config.retry_callback = proc do |ex|
    # Make sure this happens automatically between retries
    Capybara.reset!
  end
end
```

Let's walk through these configurations:

- `verbose_retry` indicates whether to log the retry attempt in test
output; this is useful for seeing which tests are intermittently
failing.
- `display_try_failure_messages` logs each failure with the usual stack
trace to help with troubleshooting and, ideally, fixing the ailing test.
- `default_sleep_interval` is optional, but useful to configure if things
need a moment to breathe between retries--for example, sometimes waiting
a second or two gives an external service at the root of a problem time
to correct itself. rspec-retry doesn't offer an environment
configuration variable to set this, so I created my own, as shown in
this sample configuration.
- `retry_callback` accepts a block and runs between each retry. So far,
all I've needed to do here is ensure Capybara is reset between attempts.

Finally, I use the `RSPEC_RETRY_RETRY_COUNT` environment configuration
to set the number of times to try a failing test, as documented in
rspec-retry's README. If that value is let unset, then a test will only
be tried once. It's important to point out here that the second `RETRY`
is a misnomer; this environment variable indicates the _total_ number of
attempts, including the first failure. In other words, if
`RSPEC_RETRY_RETRY_COUNT` is set to three, then RSpec will attempt to
pass the test three times, not once plus three times.

[rspec-retry's README]: https://github.com/NoRedInk/rspec-retry


## Suggested use

Even though you can configure rspec-retry on a per-test basis, it's
counterintuitive to me--I'd expect a setting on an individual test to
override any project-wide configurations, but that's not the case. If
you set rspec-retry to try a specific test five times, but your project
environment configuration is set for three times, then it'll try three
times. With that said, I've been content to just stick to the
project-wide settings. If you've found something different, please let
me know how you've got rspec-retry configured.

What's the best setting for `RSPEC_RETRY_RETRY_COUNT`? That's really up
to you and your team. Start with two (remember, that's the first failure
and one retry) and work up from there. If you find yourself setting the
number much higher than, say, five, then consider addressing the flaky
tests in your suite sooner rather than later. Each of those retries will
add seconds to your test runs, and those seconds add up!


## Conclusion

rspec-retry has been a major win for my testing toolbox, and I hope you
find it helpful, too. If you do, try your best to treat it as a
temporary solution, and create an item in your issue tracker of choice
to get to the bottom of the intermittent failure you're working around,
and correct it!
