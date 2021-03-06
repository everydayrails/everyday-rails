---
layout: post
title: "3 Rails documentation tools"
excerpt: "Even in Rails, documenting your code is important. It's also pretty easy with these tools."
tags: documentation
---

If you've been using [Reek](http://github.com/kevinrutherford/reek/wiki) to help in [refactoring your Rails applications](/2010/09/27/rails-refactoring-tools.html), you might run across warnings of _Irresponsible Modules_&mdash; that is, code with no comments to help explain what it does. A common knock on the Rails community is that we don't document our code. I hate to admit it, but it's fair. My own Rails project folders are full of uncommented methods and mysterious model attributes. If I can't remember specifics about my code, how can I expect someone else to pick it up?

The good news is there are quite a few documentation tools out there. Here are three you can get started with quickly to bring your application's code documentation up to speed.

### annotate-models

The first tool is an oldie, but still works great: The [annotate-models](http://annotate-models.rubyforge.org/) gem refers to your database schema and adds field details in the comments of the corresponding model. Install the gem, `cd` into your Rails project directory, and type `annotate` to add this documentation to your models. You can also document your tests, specs, and factories&mdash;see the [GitHub repository](http://github.com/ctran/annotate_models) for more details.

### RDoc

Now that you've got your models annotated (and have added some descriptive comments to your controllers, right?) you can turn it into browser-friendly HTML using the following built-in Rake task:

{% highlight bash %}
  $ rake doc:app
{% endhighlight %}

Be sure to also edit the file `doc/READ_ME_FOR_APP`; that's what the Rake task uses for your documentation's starter file. Open `doc/app/index.html` in your browser to access your app's documentation.

### Rails ERD

Finally, how about some visual documentation of how your models relate to one another? Check out [Rails ERD](http://rails-erd.rubyforge.org/) a new gem that creates nice PDF entity-relationship diagrams for your apps. It's easy to install, customizable, and very well documented. Take a look at the [gallery of ERD examples from popular open source Rails projects](http://rails-erd.rubyforge.org/gallery.html) to get a feel for how it works. The rendered PDF saves to your application root by default&mdash;I check this into my source control for other developers (not to mention for my own reference).

### Other tools

This list is by no means exhaustive. Refer to Ruby Toolbox's [list of Ruby documentation tools](http://ruby-toolbox.com/categories/documentation_tools.html) for more options.