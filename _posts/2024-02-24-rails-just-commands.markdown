---
layout: post
title: "Why I’ve started using justfiles in my Rails apps"
excerpt: "Boost your developer experience with consistent command line interfaces. Here's how."
tags: developer-experience
---

I love that the notion of the “developer experience” is having its day. Of course, thanks to Matz, we Rubyists have embraced “developer happiness” since day one! And with Rails, we also get great, out-of-the-box support for pretty much any common command line task we need to run regularly, generally via the `rake` and `rails` command line utilities.

As apps grow and mature, though, these tasks can and will deviate from the defaults. If you work on multiple apps, you may find yourself forgetting which ones use RSpec versus Minitest, `foreman start` versus `rails server` versus `bin/dev`, and so on. And if you’re like me, you’ve also got systems written in entirely different languages and frameworks, with varying degrees of attention to the developer experience. It’s no fun having to root around documentation just to run a test suite.

That’s where a consistent user interface for applications proves beneficial. I’ve taken to using the [`just` command runner](https://github.com/casey/just) for this. In my rails apps, `rails/server`, `bin/dev`, and `foreman start` are all standardized to `just run`. Test suites kick off with `just test`. And so on. Here's a representative example of a `justfile` for a Rails application:

```
# List available commands when no command provided
default:
  @just --list

# Run the application and background processes
run:
  ./bin/run

# Open an interactive Rails console
shell:
  ./bin/rails console

# Open an interactive database console
db-shell:
  ./bin/rails dbconsole

# Set up environment for development
setup:
  ./bin/setup

# Run the full test suite
test-all:
  ./bin/rspec

# Run a specific test
test TEST:
  ./bin/rspec {{TEST}}

# Start the documentation server
docs:
  yard server -r
```

Since `just` isn’t specific to Ruby, I also create just files for other languages. I can never remember the syntax to run a Go test suite with coverage reporting, but now it’s just `just test`. This (along with [adopting dev containers as default development environments](/2023/09/05/dev-containers-best-practices)) has greatly streamlined the process for any developer on my team to pick up a ticket, regardless of the code base it touches.

`just` has a low learning curve but is quite powerful. I found a [just cheat sheet](https://cheatography.com/linux-china/cheat-sheets/justfile/) I lean on for my work with it. It may simplify your workflows, too.
