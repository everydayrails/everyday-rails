---
layout: post
title: "A few things I've learned to simplify working in dev containers"
excerpt: "I'm still learning as I go, but here are some tidbits I've learned so far about using dev containers for most of my software projects these days."
tags: docker
---

After a few false starts (and a [perhaps premature, abandoned series of blog posts on the topic](/2021/02/14/docker-devcontainer-series-intro.html)), I'm all-in on development containers, my friends. I got a new computer a couple of months ago and made the decision to, as much as possible, do all my development work inside of containers. I love the idea of keeping my development projects' dependencies isolated from my laptop's operating system as much as possible, with the nice side effect of simpler onboarding for other developers.

While Visual Studio Code didn't necessarily invent the concept of development-tuned containerized environments, VS Code's top-notch support for dev containers is the feature that keeps me using it these days, over other editors or IDEs. And if VS Code isn't your cup of tea, you can try the [standalone command line application](https://github.com/devcontainers/cli) or check out Microsoft's [opened Development Containers specification](https://containers.dev) for a more editor-agnostic approach.

That said, building a great dev container experience is sometimes time-consuming. Write some configuration, rebuild containers, test, rebuild, repeat. Is it worth spending extra time to set up a development experience, when writing code, adding features, and fixing bugs is what pays our bills as software developers at the end of the day? I believe so! Putting a little work in up front to be able to do the *actual* work almost always pays off in dividends.

But we can also be smart about how we go about that up-front work, so building and maintaining dev container configurations doesn't become a full-time job. I'm still learning as I go, but here are some tidbits I've learned so far about using dev containers for most of my projects these days. These notes are primarily based on working in Ruby on Rails, but I've also applied some of these concepts to systems written in Go, Python, and other languages.

## Large images are fine for development environments

In production, it's considered best practice to build container images that use as few resources as possible. In development, though, I like to treat containers more like full-featured workstations with all the trimmings: Git, build tools, development tools, and the like.

And perhaps it's sacrilege, but I tend to treat dev containers less ephemerally than I'd treat a container used in production or CI, and more like a longer-running environment that happens to be built using Docker, rather than virtual machines or running directly on my laptop's actual operating system. Again, this approach lends itself to a larger base that has many of the tools I need out of the box, but my laptop has the capacity to handle it.

So when building out a dev container for your application, consider basing it on a the full default Linux Universal image, an Ubuntu release, or Debian, rather than a downsized image tuned to Ruby or whatever language you're using.

## Use features to simplify configuration

If you're using the *Add Dev Container Feature Files* option in VS Code, you'll get to a step inviting you to add features to the environment. I use features to install Ruby and Node for my Rails applications, rather than codifying this in a Dockerfile or elsewhere. Each feature constitutes a single line in my `devcontainer.json` file, versus potentially several steps in a typical Dockerfile.

You can also add features at any time by selecting *Configure Container Features* from VS Code's command palette. Open it up and scroll through the available options to see what you might simplify in your dev container's configuration. If you don't see what you need, consider reading up on the [Features specification](https://containers.dev/implementors/features/) to create your own!

## Build the environment iteratively

When I first started learning Docker (either for development environment purposes, or production), I had a tendency to try to do _everything_ through Docker-based setup. While that matters for containers in production, it's less important in development containers, or at least the way I use them. Instead, setup for my dev containers tends to be a mix of

- Installation and configuration handled by Docker or Visual Studio Code's Dev Container support
- Scripts run automatically as a post-build step, or manually by a user as part of a documented setup process
- Documentation that details any remaining steps the user must perform to finish setup

Again, the dev container is an ends to writing your application. Sometimes, having the process written down for others to follow is all that's necessary to make the dev container useful. Build iteratively, keep your iterations in version control, and improve as you go.

## Repurpose dev containers in CI/CD pipelines

It's still pretty new as I write this, but GitHub and Azure now support [reusing dev container setups in CI/CD pipelines](https://github.com/devcontainers/ci). This means you can use the same development container you've built for application development to run tests (or other build steps) in the cloud, without having to build out a standalone configuration for continuous integration and delivery.

I've seen mixed results with this approach so far, especially when GitHub is unstable. But the simplified end result of one container setup for both local development and external CI feels worth the early adopter risk to me. I'll keep experimenting with this tooling, and may write more as I understand it better.

## Chrome can be tricky!

I'll hopefully write about this in more depth someday, too, but getting Chrome (or Chromium) installed and running inside a container for the purposes of running Rails system tests has so far proven to be much more complicated than I would expected. I've seen plenty of tutorials out there on the subject, but I had trouble getting them to work with dev containers (or Microsoft's implementation of them, anyway).

To date, I've had the best luck with a simple setup that uses the base image's package manager to install Chromium, then configure RSpec to use it as if I were running the tests and browser locally on my computer. This feels simpler to me than the Docker Compose-based Chrome server setup I've seen in many tutorials, and more reliable when it matters for me (that is, running tests).

## No guarantees with unmaintained code bases

Finally, a word of caution—if you're building a dev container environment to try to revive an unmaintained application, you may be in for some disappointment. Let's look at an old Ruby on Rails application I wanted to revive recently as an example: The app requires Ruby 2.1, which requires an older version of OpenSSL than newer operating system versions include. Meanwhile, installing packages on older base operating systems is difficult as vendors drop support for package registries.

The takeaway: Dev containers are great for isolating your app's dependencies from your workstation's operating system, but they don't protect you from software maintenance fundamentals. Keep your app and its dependencies up-to-date to keep your dev container happy!

## Wrapping up

Development containers are still emerging as a concept and specification. I'm still learning and refining my own use of the tool, but I'll do my best to share what I learn going forward. In the meantime, I hope you've found this post helpful!
