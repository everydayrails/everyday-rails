---
layout: post
title: "Deprecating code in a Rails application"
excerpt: "Here's how to add good deprecation warnings to your Rails applications, and why it might be a good idea."
tags: legacy rails-upgrades
---

When upgrading a Rails application to a newer version of the framework, you'll often see deprecation warnings pop up in your application logs and test suite output. Deprecation warnings give you time to fix an issue before it becomes an outright error. _Good_ deprecation warnings also give you a hint on _where_ and _how_ to address them.

Rails makes it pretty simple to add _good_ deprecation warnings to your actual application code, too. Let's first look at how to do this, then talk for a moment about when it might be a good idea.

## Adding the deprecation

Inside the method you want to deprecate, use `ActiveSupport::Deprecation.warn`, with a string to describe what's been deprecated, and how developers should work around the deprecation going forward.

{% highlight ruby %}
def process_widget
ActiveSupport::Deprecation.warn(
"#process_widget is deprecated. " \
 "Use #send_widget_to_processor instead."
)

# other code ...

end
{% endhighlight %}

Then, in your application logs (or even better, your test suite's output), you'll see:

{% highlight ruby %}
DEPRECATION WARNING: #process_widget is deprecated. Use
#send_widget_to_processor instead. (called from create at /path/to/
my_app/app/controllers/widgets_controller.rb:55)
{% endhighlight %}

The deprecation warning clearly marks _where_ in your application you're still using outdated code. If you _don't_ see the deprecation in your test output, and you're confident in your test coverage, then it's safe to remove the outdated code!

## Why you might deprecate your code

Why deprecate code when you could, you know, just fix it in the first place? Asking a few questions can help make that decision:

- How long will switching to the newer code take? An hour? A day? A week? Longer?
- Can your team work on switching now, or are higher priority projects more pressing?
- Do you need to communicate the deprecation across multiple teams?

The longer it'll take to stop using the deprecated code, or the more people who need to be aware of it, the more beneficial an explicit deprecation warning will be.

And personally, I like deprecation warnings because they're too noisy for me to ignore too long, and they're coupled to to code itself rather than something like Jira or Trello. Like any tool, though, it's up to you and your team to decide whether to use them in your code.

I hope you found this small tip helpful. Thanks as always for reading!
