---
layout: post
title: "Using devcontainers in GitHub Actions CI workflows"
excerpt: "It's simpler than ever to wire CI pipelines, thanks to devcontainers. Here's how I run Rails test suites these days in GitHub workflows."
tags: docker developer-experience
---

I'm a big fan of [GitHub Actions](https://github.com/features/actions), especially the robust ecosystem of actions that can be included into continuous integration pipelines with just a few lines of configuration code. And thanks to the [devcontainers/ci](https://github.com/devcontainers/ci) action, using an existing development container setup could make running a test suite or other common CI processes much, much simpler than it might have been in the past.

First off, this assumes you've already got your application set up to support devcontainer-based development, with a test suite that runs from within the container. If you don't, this is as good a time as any to set one up.

Once that's in place, create a file in _.github/workflows_ to add the workflow. Name it something like _ci.yml_. Here's what mine looks like:

```yaml
name: CI

on:
  push:
    branches:
      - main
      - staging
  pull_request:
    branches:
      - main
      - staging

jobs:
  tests:
    name: Run test suite
    runs-on: ubuntu-latest

  steps:
    - name: Check out code
      uses: actions/checkout@v3

    - name: "Create environment files"
      run: |
        cp config/database-ci.yml config/database.yml
        cp .sample.env .env

    - name: run tests
      uses: devcontainers/ci@v0.3
      with:
        runCmd: bin/rspec --format documentation
```

Let's break this down. I've set up the workflow to run any time a push is made to the _main_ or _staging_ branch, or a pull request is opened against either of those branches.

I've defined a _job_ to run tests. The job is broken into three steps:

- Check out the source code.
- Copy necessary configuration files for CI to work. This may not be necessary for your application, or you may need to copy additional files.
- Build the devcontainer, then use it to run my RSpec test suite.

That's it! It may take some trial and error to work end-to-end. Approach it scientifically—change one thing, let it run, course-correct, and try again. When I'm creating a new GitHub Actions-based workflow, or updating an existing one, I usually create a draft pull request and make incremental changes to it, sneaking up gradually on the final solution.
