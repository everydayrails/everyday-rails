---
layout: post
title: "Docker containers for Rails development environments, part 2: Setup"
excerpt: "In our first experiment, let's see what it takes to get a Rails app to boot in a Visual Studio Code devcontainer."
image:
tags: docker legacy
---

I’m ready for my first experiment with Visual Studio Code’s Remote-Container extension, and a more pleasant container-based Rails development environment. As mentioned in [part one of this series], I won’t be building out a fully functioning environment in a single article, but rather, slowly build one up incrementally.

By the time I'm through with this particular experiment, I want my Rails app to boot inside the development container, both via the Rails console and as a server prcoess, and be accessible via a browser on the host computer. There will still be a long way to go, but booting the app seems like good, demonstrable progress.

Let's go!

<div class="alert alert-info">
  <a href="https://gist.github.com/ruralocity/ff0a562d360fafd689dc183a6cb79f3f">Full versions of each relevant file</a>, as they exist by the end of this experiment, are available as a gist—but I encourage you to read on to understand the thinking that went into those files and their current state. Because that's pretty much the whole point of this exercise.
</div>

[part one of this series]:/2021/02/14/docker-devcontainer-series-intro.html


## Create a devcontainer configuration

Even though the Remote-Container plugin offers the option to use existing Docker configurations that might be present in the application, I'm resisting the temptation to use that, and starting fresh. I want to lean on VS Code's functionality as much as possible for this experiment, at least initially, so let's run with the basic configuration files it provides for a devcontainer. Via the command palette, Select _Add Development Container Configuration Files_ and select _Ruby on Rails_ from the many available options. (It looks like the plugin is smart enough to narrow the choices for you automatically if it finds common Ruby files in the working directory.) Then, select the Ruby version your project uses. At this writing, I don't see support for Ruby 3, but since I'm working with older apps anyway, that's not a problem for me just yet.

This yields a new directory, _.devcontainer_, with two files in it. First is a simple _Dockerfile_:

{% highlight text %}
# [Choice] Ruby version: 2, 2.7, 2.6, 2.5
ARG VARIANT=2
FROM mcr.microsoft.com/vscode/devcontainers/ruby:0-${VARIANT}

# Install Rails
RUN gem install rails webdrivers 

ARG NODE_VERSION="lts/*"
RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} 2>&1"

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment this line to install additional gems.
# RUN gem install <your-gem-names-here>

# [Optional] Uncomment this line to install global node packages.
# RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && npm install -g <your-package-here>" 2>&1
{% endhighlight %}

There's also a _devcontainer.json_ file, which will help VS Code integrate with the new container:

{% highlight json %}
// For format details, see https://aka.ms/devcontainer.json. For config options, see the README at:
// https://github.com/microsoft/vscode-dev-containers/tree/v0.158.0/containers/ruby-rails
{
	"name": "Ruby on Rails",
	"build": {
		"dockerfile": "Dockerfile",
		"args": { 
			// Update 'VARIANT' to pick a Ruby version: 2, 2.7, 2.6, 2.5
			"VARIANT": "2.6",
			"NODE_VERSION": "lts/*"
		}
	},

	// Set *default* container specific settings.json values on container create.
	"settings": { 
		"terminal.integrated.shell.linux": "/bin/bash"
	},

	// Add the IDs of extensions you want installed when the container is created.
	"extensions": [
		"rebornix.Ruby"
	],
	
	// Use 'forwardPorts' to make a list of ports inside the container available locally.
	// "forwardPorts": [],

	// Use 'postCreateCommand' to run commands after the container is created.
	// "postCreateCommand": "ruby --version",

	// Comment out connect as root instead. More info: https://aka.ms/vscode-remote/containers/non-root.
	"remoteUser": "vscode"
}
{% endhighlight %}

For the rest of this experiment, and at least the immediate future, I want to see how far we can get by building off of these defaults.


## A tiny bit of cleanup

Since this experiment targets an existing application, let's first remove the default that explicitly adds Rails and Webdrivers from _Dockerfile_. We'll install these based on the contents of the app's _Gemfile_, just as we would in an old-school development context. Let's not worry about the Node stuff and commented-out stuff; that's for another time.

I also like the idea of renaming the devcontainer to something besides the default "Ruby on Rails" in _devcontainer.json_--maybe name it to match the application's name, instead, or the name of its repository. VS Code shows this name in its UI, in the bottom left corner of the window, so make it something that's useful, without being too verbose. Everything else in the file can stay the same for now.

{% highlight json %}
{
  "name": "Yet Another To-do List App",
  // rest of file ...
}
{% endhighlight %}

Let's see how far we've gotten to this point! Back in the command palette, select _Reopen in Container_ to build the container. This can take a few moments, but once it's done, we'll hopefully see a new prompt in the VS Code terminal pane. Depending on your project's name and the state of its Git repository, it'll look something akin to this:

{% highlight text %}
vscode ➜ /workspaces/my_project (main) $
{% endhighlight %}

Typing `ls` confirms the container has access to the application's files. And thanks to Remote-Container, we've done this without typing `docker-compose run` this and `docker-compose run` that. I'm still deciding how I feel about that, but for now, it seems pretty neat. I like having to not type so much, if nothing else. Let's keep running with it a little longer, and get some gems installed.


## Start setting up

Did you know that for years, a stock Rails installation has included a basic bootstrapping script? In a lot of the legacy projects I pick up, though, it's often never been touched since the project's very first commit to version control. It's actually been deleted in one or two. That's too bad, because the smart people who continue to make Rails a thing put it there for a reason: It helps developers get to work on the project more quickly! I like the idea of letting Docker do what Docker does best, and letting Ruby do what Ruby does best. Maybe we can leverage the script for a nicer development experience.

By default, _bin/setup_ installs gems, prepares databases, and does a tiny bit of housekeeping in the development environment. For now, let's just worry about the installing gems part.

{% highlight ruby %}
#!/usr/bin/env ruby
require 'fileutils'
include FileUtils

# path to your application root.
APP_ROOT = File.expand_path('..', __dir__)

def system!(*args)
  system(*args) || abort("\n== Command #{args} failed ==")
end

chdir APP_ROOT do
  # This script is a starting point to setup your application.
  # Add necessary setup steps to this file.

  puts '== Installing dependencies =='
  system! 'gem install bundler --conservative'
  system('bundle check') || system!('bundle install')

  # Comment out the rest of the script for now ...

  # ...
end
{% endhighlight %}

Run the rails `bin/setup` script to install gem dependencies into the container. A quick `rails -v` should show that the version of Rails indicated in your project's _Gemfile_ should now be installed!

I think we can do better, though. _devcontainer.json_ has a configuration option for `postCreateCommand`. What would happen if it were set to run `bin/setup` automatically on container creation? Too controversial? Let's find out. Make the change to _devcontainer.json_, and rebuild the container again.

{% highlight json %}
"postCreateCommand": "bin/setup",
{% endhighlight %}

Now, running `rails -v` and `gem list` should provide reasonable-looking output, based on the app's _Gemfile_, without manually running `bin/setup` first.

But will this thing boot?


## Test in the console

What we've got so far _should_ be enough to allow `bin/rails console` to boot in the container. I say _should_ because, for one app in particular, I had to build out a barebones _.env_ file with some environment configurations. This was an artifact of the app's existing development environment, which is atypical of anything I've seen otherwise in Rails. At any rate, give `bin/rails console` a go. Does the app boot? Awesome! If not, your app may have something atypical of its own. Sorting that out by getting the console to boot can often be a lot more straightforward than going straight to the browser.


## Test in the browser

Before wrapping up this experiment, let's test one more thing--can we see our container-based app in an actual browser? If you've done much work with Docker, you may be familiar with the concept of forwarding ports from your host computer to a container. We need to do that here--Remote-Container doesn't set it up automatically, but it does guide us to where to make a small configuration change.

I want to set this in _devcontainer.json_, at least for now. I know conventional wisdom suggests doing this in _Dockerfile_ (or _docker-compose.yml_), but the fact that Remote-Container suggests setting it in _devcontainer.json_ is intriguing. So humor me, please; we may change it later.

{% highlight json %}
// Use 'forwardPorts' to make a list of ports inside the container available locally.
"forwardPorts": [3000],
{% endhighlight %}

Rebuild the devcontainer once more. Once it's started, fire up the app with `bin/rails server` in the VS Code terminal pane. Then hit <http://localhost:3000> in your favorite browser, and it may just work! Sort of, anyway--if the app relies on the database or some other service we haven't yet set up for its root page, you'll likely see an error. But trust me, this is progress.


## Begin documentation

What good is building an onramp to ease future developers into working on your project, if they don't know the onramp exists? During this process, I've been taking a few extra minutes to add a note to each application's documentation (usually its _README_) to prompt them to check it out. I point out that it's experimental, and invite collaboration to help improve it.


## Next steps

Let's reflect for a moment: With three generated files and a few tweaks, the app's building in a container and booting far enough that we can see it running in a console and a browser. We've learned that VS Code's Remote-Container extension abstracts away a lot of boilerplate Docker setup, but not all of it. And we might be able to leverage _bin/setup_ from Rails to finish the job, in a Ruby-like way.

<div class="alert alert-info">
  If you're following along with your own project and want to check your work, I've provided <a href="https://gist.github.com/ruralocity/ff0a562d360fafd689dc183a6cb79f3f">full versions of all the files we've experimented with so far</a>.
</div>

For now, I think we're at a good stopping point. Step away from the computer, go outside if you can, and reflect a bit on what we've accomplished and learned. See you in the next post, where we'll try [connecting to a database from the container](/2021/03/07/docker-devcontainer-series-database-sqlite.html).
