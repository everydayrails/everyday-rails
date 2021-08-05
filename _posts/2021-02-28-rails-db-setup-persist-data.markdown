---
layout: post
title: "Persist existing data when setting up a Rails development environment"
excerpt: "Rails support for automating development environment setup includes a behavior that may surprise you! Here's how I addressed it in my applications."
tags: docker
---

<div class="alert alert-info">
  I stumbled upon this problem and solution while working on my <a href="/2021/02/14/docker-devcontainer-series-intro.html">Docker containers for Rails development environments series</a>, but it applies to any Rails development setup.
</div>

Does your Rails app take advantage of the _bin/setup_ script to ease onboarding new developers to your project? If it doesn’t, it’s often worth the effort to automate the process as much as possible. The default version provided by `rails new` is a great starting point. Doing so can save valuable ramp-up time for future developers, and identify potential holes in the setup process in the meantime. And as I've been learning, it's super-handy for container-based development environments in Visual Studio Code.


## But there’s a problem lurking!

The sample _bin/setup_ provided by Rails includes a step for setting up new development and test databases, using the `db:setup` rake task. This task actually performs a few distinct tasks:

- Create the databases (development and test)
- Build out the schema on those databases, as defined in _db/schema.rb_ (or _.sql_) 
- Seed the development database with data in _db/seeds.rb_, if provided

One of these steps, though, is not idempotent, and will wipe out any development data in place on subsequent runs!

Building the schema from the definition file is faster than migrations, and avoids the potential problem of deleted migration files. But, by design, it drops existing tables and recreates them based on the latest definitions provided in the schema file. The fact that documentation for the `db:reset` task explicitly states that the database gets wiped out, yet `db:setup`'s documentation makes no such mention, makes this even more surprising and confusing!

Anyway, this likely isn’t an issue when running _bin/setup_ (or `rails db:setup`) as a one-off process when setting up a traditional development environment the first time, but what about in a [Docker container-based development environment], where rebuilding from scratch may occur much more frequently?

[Docker container-based development environment]:/2021/02/14/docker-devcontainer-series-intro.html


## Keep your development data!

I found a solution: Add a rake task that checks for the existence of a development database by checking to see if Active Record can establish a connection to it. Then, determine whether to run `db:setup` based on the results.

Here’s the task, courtesy of [penguincoder on Stack Overflow]. I put it in _lib/tasks/db.rake_.

{% highlight ruby %}
namespace :db do
  desc "Checks to see if the database exists"
  task :exists do
    begin
      Rake::Task["environment"].invoke
      ActiveRecord::Base.connection
    rescue
      exit 1
    else
      exit 0
    end
  end
end
{% endhighlight %}

Then, update _bin/setup_ with a little extra bash in the `system!` call that does the actual database setup: Check to see if a database already exists, and if it does, just run migrations to bring it up-to-speed with the current schema. If not, do a full setup, including rebuilding the database from the app's current schema definition.

{% highlight ruby %}
puts "\n== Preparing database =="
system! 'bin/rails db:exists && bin/rails db:migrate || bin/rails db:setup'
{% endhighlight %}

I like this approach for a couple of reasons. First, making it a rake task means I can reuse it in other workflows, and even extract to a gem. Second, it keeps _bin/setup_ close to its original spirit—just a lightweight Ruby script that performs lower-level requirements to prepare a development environment. As long as Ruby is installed, it should be able to do its work.

I also tested an interactive approach—prompting the developer for whether or not to reset the database—but that doesn’t work with setting _bin/setup_ as the `postCreateCommand` in a VS Code _devcontainer.json_ file. It may be possible to have it both ways by incorporating a third party CLI application gem, but again, I wanted to keep _bin/setup_ simple.

[penguincoder on Stack Overflow]:https://stackoverflow.com/a/35732641


## Summary

As I continue to build and refine container-based development environments in the name of programmer happiness, I’m leaning hard on making Ruby and Rails do what they’re good at, and using Docker for the rest. I’m happy that this solution allows me to continue with that approach.

Whether you’re building a [Docker container-based development environment] for your application, or beefing up the onboarding experience in other ways, I hope this approach is useful. Thanks for reading!
