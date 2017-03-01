---
layout: post
title: "Generating application documentation in Rails 5"
excerpt: "Support for generating an HTML version of application documentation in Rails 5 was removed. Here's how to add it back."
---

I've written before about [my appreciation for good application documentation](/2016/04/18/rails-documentation-practices.html), especially for explaining the nuances of domain logic. I was disappointed that support for generating a nice, HTML-formatted documentation was removed in Rails 5. Luckily, it's not too difficult to reimplement this feature in an app, and customize it to your team's documentation needs.

First, add the `sdoc` gem to your Gemfile, and run `bundle` to install it. [SDoc](https://github.com/zzak/sdoc) is the same library that was bundled in previous versions of Rails. With SDoc installed, you can once again generate application documentation from the command line:

{% highlight bash %}
sdoc -o doc/app
{% endhighlight %}

Then open _doc/app/index.html_ to check it out. Unfortunately, it's pretty messy right now. SDoc provides a lot of configuration options to tidy things up (see `sdoc --help`), but it would be better to set those configurations once. While we're at it, it'd also be nice to restore the ability to generate the docs via a Rake task.

Use the task generator to create a new namespace:

{% highlight bash %}
rails g task rdoc
{% endhighlight %}

Locate the new file at _lib/tasks/doc.rake_, and add your documentation configuration. You can start by pasting in the sample code from the SDoc documentation:

{% highlight ruby %}
# Rakefile
require 'sdoc' # and use your RDoc task the same way you used it before
require 'rdoc/task' # ensure this file is also required in order to use `RDoc::Task`

RDoc::Task.new do |rdoc|
  rdoc.rdoc_dir = 'doc/rdoc' # name of output directory
  rdoc.generator = 'sdoc' # explictly set the sdoc generator
  rdoc.template = 'rails' # template used on api.rubyonrails.org
end
{% endhighlight %}

This adds three Rake tasks related to documentation:

{% highlight bash %}
rails -T doc
rails clobber_rdoc  # Remove RDoc HTML files
rails rdoc          # Build RDoc HTML files
rails rerdoc        # Rebuild RDoc HTML files
{% endhighlight %}

Run `rails rdoc`, then open _doc/rdoc/index.html_ in your browser to take a look at the results.

The output is still pretty noisy. The task still tries to document the entire Rails project directory, including tests and the public directory. It also uses the Gemfile as a default page, instead of the README.

You can tidy that up in the new Rake task file. SDoc is a wrapper around the [RDoc](https://rdoc.github.io/rdoc/) documentation library, which itself is well documented (of course). The interesting parts for this exercise are in the [`RDoc::Task`](https://rdoc.github.io/rdoc/RDoc/Task.html) docs.

To focus your app's documentation on application code only, try:

{% highlight ruby %}
require 'sdoc'
require 'rdoc/task'

RDoc::Task.new do |rdoc|
  rdoc.rdoc_dir = 'doc/rdoc'
  rdoc.generator = 'sdoc'
  rdoc.template = 'rails'
  rdoc.main = 'README.md'
  rdoc.rdoc_files.include('README.md', 'app/', 'lib/')
end
{% endhighlight %}

Run `rails rerdoc` to regenerate the files, and open _doc/rdoc/index.html_ again. Much nicer! Now the documentation defaults to the project README, and only application code is included in the output.

One last tweak: Documentation support in previous versions of Rails wrote out to the _doc/app_ directory. This can be set with the `rdoc.rdoc_dir` configuration:

{% highlight ruby %}
require 'sdoc'
require 'rdoc/task'

RDoc::Task.new do |rdoc|
  rdoc.rdoc_dir = 'doc/app'
  rdoc.generator = 'sdoc'
  rdoc.template = 'rails'
  rdoc.main = 'README.md'
  rdoc.rdoc_files.include('README.md', 'app/', 'lib/')
end
{% endhighlight %}

Wherever you wind up saving your documentation, I still recommend including that directory in your project's `.gitignore`, to avoid repository clutter. Also, tell contributors how to generate and view the application docs in the project README. Aside from having to roll out documentation support independent from the framework, [the rest of my documentation workflow still applies](/2016/04/18/rails-documentation-practices.html).

This is still a work in progress for me, but I've been happy with the results so far, using this simple configuration. If you've found alternatives that you like, please share them in the comments. Thanks for reading!

_Thanks to [Sebastian Röder](https://twitter.com/sebroeder) for suggesting this topic._
