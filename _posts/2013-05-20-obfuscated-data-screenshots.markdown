---
layout: post
title: "Obfuscating data in Rails applications for screenshots and demonstrations"
excerpt: "Faker isn't just for testing; here's how I used it to use real data in demonstrations (without revealing anything sensitive)."
---

I recently had a need to demonstrate a data-heavy application to potential customers. Demonstrating the application with bogus numbers is one thing, but everything looks much more realistic when I'm using *real* data. I can't reveal any real information, though, so I needed a quick way to obfuscate real names. [Faker](http://rubygems.org/gems/faker) to the rescue!

In the past I've shown [how to use Faker in tests](http://everydayrails.com/2012/03/19/testing-series-rspec-models-factory-girl.html), but it's got other uses as well. In this case, I used it to change the names of the innocent in my application, while keeping the interesting numbers intact. The result: No way to identify anything to a given user or group, but a realistic demonstration of the data all the same.

To pull this off, I copied production data over to my development setup, then built some simple Rake tasks to obfuscate my data in development. Check it out:

<script src="https://gist.github.com/ruralocity/5615322.js">//</script>

Here, I only obfuscate non-admin users (so I can continue to sign in with my usual credentials), and since I'm working with schools I augment Faker's returned results with some of my own. I also show a couple of ways you could make sure the tasks aren't errantly run in production, because that would be bad.

And obviously, this won't apply to every situation--you may not have access to production data, or your data might not be as easily obfuscatable. It would also need some tweaking to make work in any situation besides mine, since I'm working directly with my Rails models in the rake tasks.

But it's a fast way to get realistic data for demos and screenshots. If you don't care about using real data, you can also try [this approach for populating a database with lots of test data](http://railscasts.com/episodes/126-populating-a-database). It's a few years old but still applicable.
