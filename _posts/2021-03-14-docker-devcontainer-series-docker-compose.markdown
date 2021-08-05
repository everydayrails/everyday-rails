---
layout: post
title: "Using containers as a Rails development environment, part 4: Composing services"
excerpt: "Before integrating additional services into a container-based development environment, we need to start thinking about the app as a collection of services. Here's how to begin that process."
tags: docker legacy
---

In my notes on my previous experiment, I demonstrated that [SQLite can be integrated into a Rails development container with minimal fuss](/2021/03/07/docker-devcontainer-series-database-sqlite.html). However, other common database engines _do_ require some extra effort to integrate. It's not uncommon to run  multiple _services_ in a container-based development environment—for example, a database, a background job processor, and the actual application software being developed.

To make this all work, I'll need to break out of some of the default settings provided by Visual Studio Code's Remote-Container extension. So I'll do that in this article: A relatively quick refactor the configuration to use Docker Compose, so it'll be ready for additional services in future experiments. This experiment will be on the shorter side, but it will set up more complex additions to the setup going forward.

<div class="alert alert-info">
  This post is part of my ongoing series of experiments on <a href="/tag/docker.html">seeking developer happiness through Rails, Docker, and Visual Studio Code's Remote-Container feature</a>. You may find background information from earlier posts useful here.
</div>


## Making the change easy

Right now, _.devcontainer/devcontainer.json_ does a lot of the lifting for our development container. The interesting part for this experiment is the `build` key:

{% highlight json %}
{
 	"name": "my-app",
	"build": {
 		"dockerfile": "Dockerfile",
 		"args": { 
 			// Update 'VARIANT' to pick a Ruby version: 2, 2.7, 2.6, 2.5
 			"VARIANT": "2.5",
 			"NODE_VERSION": "lts/*"
 		}
 	},
	// ...
}
{% endhighlight %}

For more complicated builds, [VS Code supports integrating Docker Compose](https://code.visualstudio.com/docs/remote/create-dev-container#_use-docker-compose). Here's what my first pass looks like. Note that it sits inside the _.devcontainer_ directory, to communicate that it's specific to development environments.

{% highlight yml %}
version: '3'

services:
  my-app:
    user: vscode

    build:
      context: ..
      dockerfile: .devcontainer/Dockerfile
      args:
        # Update 'VARIANT' to pick a Ruby version: 2, 2.7, 2.6, 2.5
        VARIANT: 2.6
        NODE_VERSION: lts/*

    volumes:
      - ..:/workspace

    # don't shut down after the process ends
    command: sleep infinity
{% endhighlight %}

This may look familiar if you've worked with Docker in the past:

- The file defines a _service_ called _my-app_ (for illustration purposes only here; name it something that makes sense to you).
- Actions inside the container will be performed by the _vscode_ user to match VS Code's defaults.
- The _build context_ is one directory up from the location of _.devcontainer/docker-compose.yml_, or the root of the Rails application.
- Use the _Dockerfile_ that's already in place for the development container.
- Apply _args_ that were previously set in _devcontainer.json_ for Ruby and Node versions.
- Map the local path to the Rails app (`..`) to the `/workspace` _volume_ in the container, so edits made in the application code will be reflected within the container.
- Use `command` to keep the container running after it's spun up. My understanding is this is is necessary for Remote-Container to be able to shell into the container via the VS Code terminal. My understanding is fuzzy and could be wrong.

Now, I can replace `build`  in _.devcontainer/devcontainer.json_ to use the new Docker Compose setup:

{% highlight json %}
{
 	"name": "my-app",
	"dockerComposeFile": "docker-compose.yml",
 	"service": "my-app",
 	"workspaceFolder": "/workspace",
	// ...
}
{% endhighlight %}

Here's a rundown of the new keys:

- _dockerComposeFile_ is the file created earlier, the one inside _.devcontainer_.
- _service_ is the service that VS Code will shell into. This value needs to match the Rails app's _service_ name in the Docker Compose file.
- _workspaceFolder_ tells VS Code and Remote-Container where to mount the Rails application inside the VS Code terminal. The end result will be slightly different than what was in place before (_/workspace_ vs. _/workspace/my-app_), but seems to work fine.

With this change, I can rebuild the dev container, and aside from _workspaceFolder_ being a little different in my terminal prompt, I'm back in business!


## Summary

People who work with me know I love [Kent Beck's summation of refactoring](https://twitter.com/kentbeck/status/250733358307500032?lang=en): "for each desired change, make the change easy (warning: this may be hard), then make the easy change."

In this experiment, making the change easy didn't turn out to be that hard, but I'm hoping it'll still make the changes (additional functionality in the development container) relatively easy.

And thinking a little longer-term, will this change make breaking out of Visual Studio Code at some point easier? Time will tell. That's what's cool about treating all of this as an experiment!


## Next steps

Okay, with this change in place, I'm ready to really, _really_ get Postgres or MySQL wired in (or Redis, for that matter), and will start on that next unless I find another yak to shave. Thanks for reading, and see you in the next post.
