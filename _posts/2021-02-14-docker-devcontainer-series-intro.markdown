---
layout: post
title: "Docker containers for Rails development environments, part 1: Introduction"
excerpt: "Let's experiment with building sensible devcontainers for Rails. Here's the plan."
image: "/images/posts/docker/boxes.jpg"
---

We need to talk about using Docker and containers as Rails development environments. Yes, they are super-convenient for setting up an environment in minutes--not hours, or days! And configurations kept in version control remove guesswork when rebuilding environments gone bad. I don’t need to tell you this; there are any number of blog posts, videos, tutorials, and books on leveraging the power of containers in your Rails apps.

But let’s face it: Docker can be pretty fussy and slow sometimes, especially outside of server environments. And all those blog posts, videos, and the like often [cargo cult] examples from other blog posts and videos, reapplying the "right" ways of doing things without questioning them, or questioning whether they’re "right" for every circumstance.

So in effect, while containers are supposed to fix the "works on my machine" problem, without care, they just abstract it to a different layer.

I'm all for applying a good Stack Overflow answer to a problem and meet a deadline, but to become proficient as creators and maintainers of software, we need to dig in, test assumptions, and build a deeper understanding of our tools.

That's what I'm going to do with Docker in this series, and hope you'll follow along.

[cargo cult]:https://en.wikipedia.org/wiki/Cargo_cult_programming


## Containers for mature Rails applications

Many Rails applications may not even _need_ everything espoused in a typical Docker tutorial. Maybe your app’s a few years old and trucking along just fine with the Asset Pipeline--you don’t need to mess with the overhead of Webpacker. Or maybe your test suite is a little behind the times, and still relies on PhantomJS instead of ChromeDriver. Or perhaps the app's still on an older version of Ruby, and you’ve put off upgrading your computer’s operating system for fear that you’ll no longer be able to build the outdated gems it depends on (as was my case, when I was asked to help out with an old Ruby 2.1 app last year).

Situations like these are great use cases for containers as development environments! Containers isolate these oddball dependencies from your host computer and your other apps, so you can develop (and upgrade!) with the confidence that low-level dependency changes are unlikely to make life rough. Installing older applications in the confines of a container helps keep your workstation’s host operating system cruft-free, using forward-facing technology that can grow with the application as needed. And, conversely, they help isolate experimenting with tomorrow's technologies, without messing up the tools you rely on today.


## Let’s dig into Docker

![Ruby box](/images/posts/docker/ruby-box.jpg){: .decoration}

Over the past few months, I’ve been working on building out container-based development environments for some of the older Rails applications I work on, to hopefully make it a little easier for other developers to work on without spending lots of time setting up their workstations for it. I’ve been working on understanding--and questioning--the "right" ways of doing this. And I’m starting a new series of posts on Everyday Rails to share my findings.

These posts will primarily focus on my experiments building out development containers for pre-existing Rails applications. I won't talk about `rails new` within a container or shipping images to production, though ideally, concepts learned will inform those situations.

I’m going to start with the super-handy _[Remote-Containers]_ extension for Visual Studio Code. Even if VS Code isn’t your coding app of choice, I think Remote-Containers is a great way to ease into container-based development environments, and I urge you to give it a go. If you’re unfamiliar with the extension, you can get up to speed through a [tutorial on using containers in development on VS Code] before moving forward with my series. It uses Python in its example, but the basics all apply to what I plan to do in this series.

Each experiment in the series will work toward a _checkpoint_ at which progress may be visibly demonstrated. Some may be short; some may be long. Experiments will build on top of previous entries in the series, refining as necessary, until we get to a workable, reliable, repeatable solution to container-based Rails development.

Let me reiterate: _These are all experiments!_ I will definitely have ideas that work better in some cases than others. And I’ll be honest, some may end up being dead ends, or just flat-out bad. But experimenting with ideas is how we’re going to learn these concepts, and not just accept something as the "right" way only because we read it on the first search result.

In the end, we won’t have a one-size-fits-all configuration for Rails and containers, but we’ll have a good collection of techniques to use--and more importantly, when and why they work, and when and why to try other approaches.

[Remote-Containers]: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers
[tutorial on using containers in development on VS Code]:https://docs.microsoft.com/en-us/learn/modules/use-docker-container-dev-env-vs-code/


## Next steps

With the basic tools installed, and a mindset for learning, we’ll be ready to move on to part two of this series: initial setup of our devcontainer in VS Code. Look for it in mid-February 2021. See you then.
