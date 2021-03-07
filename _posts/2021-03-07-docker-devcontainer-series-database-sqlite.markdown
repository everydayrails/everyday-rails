---
layout: post
title: "Using containers as a Rails development environment, part 3: SQLite databases"
excerpt: "You can't get very far with a Rails application without a database. Let's explore our options for adding one in a container."
tags: docker legacy
---

In my previous experiment, I showed [how I got a mature (that is, pre-existing) Rails app to boot in a Visual Studio Code devcontainer](/2021/02/21/docker-devcontainer-series-setup.html), leaning on the default configuration provided by VS Code's Remote-Container extension. That’s great progress and all, but I’ve never worked on a real, production Rails app that didn’t rely on a database of some kind.

So for my next batch of experiments, I explored what’s required to add database support to the development container. I'd originally planned to cover the three most common SQL-based databases in a single post, but covering the details and differences of container-based Postgres, MySQL, and SQLite setups in such a way proved to be a little too sprawling for my tastes. Instead, I'm going to break it down over multiple posts.

Here, I'll cover setting up SQLite for a Rails dev container in Visual Studio Code. Even though it's the simplest, and may even appear to _just work_ without a lot of extra setup, understanding _why_ it appears that way introduces some fundamentally important things to understand about container functionality that VS Code and Remote-Container have set up for us. So let's get started.


## Using an existing SQLite database

If you followed the [setup steps in part two of this series](/2021/02/21/docker-devcontainer-series-setup.html), and your application uses SQLite as a database, you may have observed the app just working in the Rails console or in your browser. Why is that?

Docker supports mapping a directory on your computer (the host) so that it's accessible within the container's file system. VS Code sets this up automatically as a _workspace_. Changes you make within the workspace directory on the host computer apply to the container, and vice versa.

If you're building a container environment within an existing development directory that you've been using for some time, there's a good change you already had a database file in _db/development.sqlite3_. If that's the case, then the container-based Rails app can access the data just as easily as if it were running on your host computer!


## Automate future database setup

I don't want future developers to have to manually run the steps to create a development database and populate its schema. This is a perfect step to automate, regardless of whether you're using containers, and regardless of your database engine of choice.

It's good practice to store a sample version of _config/database.yml_, sensitive and/or environment-specific information like database passwords and hosts removed, in version control as  _config/database.yml.sample_ or something similar. In apps that use SQLite for development and testing, this practice may not be as common, as the file doesn't tend to require secrets.

As discussed in part two of this series, it's also [good practice to automate setting up a new Rails development environment](/2021/02/21/docker-devcontainer-series-setup.html), using the _bin/setup_ script provided upon project creation. The steps to copy the sample file to a starter database configuration file that's readable by Rails are already in the script; we just need to uncomment them. So, in _bin/setup_:

```
chdir APP_ROOT do
	# ...

  puts "\n== Copying sample files =="
  unless File.exist?('config/database.yml')
    cp 'config/database.yml.sample', 'config/database.yml'
  end

	# ...
end

```

Take a look at the sample file to make sure it's not expecting any environment-specific values or secrets. If it's not, you should be all set. In my case, I've yet to see a Rails database configuration for SQLite that needed extra setup.

With the configuration file in place, let's add a schema and seed data! Rails has built-in support for this, too, and _bin/setup_ suggests it in these commented-out lines:

```
# puts "\n== Preparing database =="
# system! 'bin/rails db:setup'
```

But be careful! The `db:setup` task will wipe out any existing data in the database when re-run, as would be the case when rebuilding a development container that already had data. I like a workaround I found to [only reset the database schema if no database exists](/2021/02/28/rails-db-setup-persist-data.html). (And I'm glad I learned about this behavior in a development environment and not production!)


## Accessing the database console within the container

In order to use the `rails dbconsole` utility to work with data using SQL instead of Active Record, we'll need to install the `sqlite3` package into the container. One option would be to use `sudo` to become the container's `root` user, then use `apt-get` to install the package. But automating that step will keep future developers setting up container environments from having to manually install the package.

The _Dockerfile_ we've been using so far includes a commented-out section for package installations. Uncomment it and add the `sqlite3` package:

```
# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends sqlite3
```

Rebuild the development container, and when the now-familiar prompt appears in the VS Code terminal pane, type `bin/rails dbconsole` to confirm that the package has successfully installed. (Type `.quit` to exit the SQLite command line.)


## Summary

Web server? Check. Rails console? Check. Database (well, SQLite database)? Check! Our container is starting to look like a real development environment. I really like SQLite as a tool to simplify learning Rails, and it's proving to be nice for learning the ins and outs of Rails inside a container.

Splitting work between Docker (underlying dependency installations) and Ruby (database setup) is also continuing to pay off in terms of simplicity and maintainability. Will that trend continue?


## Next steps

As I mentioned in the intro to this article, using MySQL or Postgres in a container-based development environment adds complexity that we've been able to avoid so far. Let's celebrate this week's win for now. Next time, we'll set ourselves up to run multiple services inside the environment, including a database server. See you then.
