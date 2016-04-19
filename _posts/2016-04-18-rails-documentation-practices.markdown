---
layout: post
title: Improving Rails application documentation
excerpt: "I've been thinking about how to improve the quality of Rails code bases through better documentation practices. Here are some steps I'm taking in my own projects."
---

I've been reading and writing some Python and Elixir code lately. It's gotten me thinking about how documentation is treated in code bases. In those languages, *documentation is a first-class citizen*. In Ruby and Rails, not so much. We rely on self-documenting code and robust test suites to explain the code's intent to humans. self-documenting code and robust test suites are important, but I've been wondering lately if they're sufficient means of explaining what our software does, especially to newcomers to a project.

I also spend a lot of time working on a large, legacy Rails application. The other day I was removing some outdated code from it, and realized that the generated HTML docs in *doc/app* weren't in sync with the code. They were so out-of-date that, when I regenerated them, the new docs used a whole new theme. *We had updated the app's Rails version more frequently than we'd generated its docs!*

That's a shame, for at least a couple of reasons:

- It's a shame that I didn't afford the same attention to the generated docs as I did the code it describes.
- It's a shame I personally never bothered to look in the documentation directory, to understand what this beast of an application does.

Now I'm working on improving documentation for my Rails projects, and in the process have been thinking a lot about my approach to documenting Rails applications in general.

## How I'm documenting my Rails code

Below are the practices I've been working on to build reliable documentation for my Rails projects.

### Start with the README

Your application's README is still its gateway, the first thing new developers will likely read when they access its source code. If your app's README consists of the default given to every new Rails app, it's time to change it.

Your README should include:

- **A brief description** of what the application does.
- **How to install dependencies**, especially those that are more complex than a simple `bundle install`. For example, if I need to to install Redis or ImageMagick to work on the app, or configure environment variables to talk to external services, let me know up front.
- **How to run the application's test suite**, to verify that setup was successful. Again, note special external dependencies, like PhantomJS.
- **How to generate the docs**, to get to a more detailed description of the application's code. That'll probably just be `rake doc:app`, but as we've already covered, we've gotten pretty good at forgetting that step, as Rails developers.

### Remove generated documentation from source control

The HTML version of your Rails docs will need to be regenerated regularly, in order to keep up with the code they explain. I am finding that ignoring the *doc/app* directory makes sure that stale documentation doesn't stick around from commit to commit, and just makes commits cleaner in general. This is why it's important to mention how to generate the docs in your README--they won't be easily accessible, otherwise.

### Use the default tools

There are a handful of documentation generators available for Rails apps, but I've stuck with the default RDoc for projects I'm currently documenting. It does the job, and I can always swap it out later if I need something more robust. No sense in overthinking it in the meantime. That said, if you already have a preferred documentation gem, then by all means, use it!

### Document the right things

So, what do you document in a Rails application, then? I looked to the command line output from running `rake doc:app` in a much smaller application:

{% highlight ruby %}
Files:       82

Classes:     75 ( 25 undocumented)
Modules:      8 (  2 undocumented)
Constants:   15 ( 11 undocumented)
Attributes:  13 ( 13 undocumented)
Methods:    192 (175 undocumented)

Total:      303 (226 undocumented)
{% endhighlight %}

Using that as a guide, I'm focusing these documentation efforts on my application's classes, modules, constants, attributes, and methods. As you can see, I'm not very far into documenting this particular application.

I'm also a fan of  [Reek](https://github.com/troessner/reek), and like to use it on my code prior to committing it and sharing it with my team. Its [Irresponsible Module](https://github.com/troessner/reek/blob/master/docs/Irresponsible-Module.md) checker specifically focuses on the documentation issue, by making sure your classes and modules are documented.

### Write clear documentation

We know what to document; now let's talk about how to document. What should your documentation look like? I've got a few thoughts and suggestions.

- **Don't assume knowledge of the business:** I've found that learning the business rules behind the application logic go a long way toward learning a code base. If you've been working in the application for awhile, the names you've given your classes and methods may seem obvious, but to a newcomer they can be the another hurdle to overcome. Help explain why things are called what they are.
- **Do assume knowledge of Rails:** The rule of thumb is to document *why*, not *how*. Document under the assumption that the reader can read Ruby code, or at least knows how to search Google or Stack Overflow to learn more about specific methods.

In addition, the [Rails API documentation guide](http://guides.rubyonrails.org/api_documentation_guidelines.html) is worth reading, for an understanding of what the Rails team looks for in documentation of the framework itself. While it's not focused on documenting applications, it has several good suggestions on how to make your writing as clear and usable as possible. If you find yourself struggling to write in this style, check out the [Hemingway Editor](http://www.hemingwayapp.com).

### Treat documentation as first-class during code review

Finally, and most importantly, treat your documentation like it matters. I have written in the past about [my code review practices](/2015/02/17/pronto-ruby-code-review.html), and now, I've added a step to check for documentation during the process. It only takes a couple more minutes during code review to verify that documentation exists and explains the new or modified code sufficiently.

## A work in progress

I am actively applying documentation to some existing projects using this approach. It's by no means final. I am curious to hear what you think about these ideas, and about how you handle documentation in your own Rails applications. Or, if you work with a different stack, how do you approach the challenge of documentation? What can the Rails community learn from yours?

Thanks for reading!

