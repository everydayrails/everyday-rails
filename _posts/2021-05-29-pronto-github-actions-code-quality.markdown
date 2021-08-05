---
layout: post
title: "Automatic code review with Pronto and GitHub Actions"
excerpt: "Nobody likes to be the one to pick through your pull request for style guide and security violations. Here's how to ask robots to do the work for you, automatically!"
tags: code-review security legacy
---

Using Ruby style and formatting tools like Standard or rufo on legacy application is tricky. You make a small change to an existing file, run the linter to check your work, and--dang. So many style pre-existing style violations! Such noisy ensuing git commits! That's why I really like [Pronto](https://github.com/prontolabs/pronto)--it only checks your specific changes, not the whole file, so you can keep changes in scope.

I've written in the past about [automating code review locally with Pronto](https://everydayrails.com/2015/02/17/pronto-ruby-code-review.html), and the [mindset I like to adopt around code review](https://everydayrails.com/2017/01/16/code-review-mindset.html) (both as a reviewer and reviewee). In this article, I'll take it one step further, and show how to elevate automated code review by integrating Pronto with a CI pipeline--specifically, [GitHub Actions](https://docs.github.com/en/actions)!

<div class="alert alert-info">
  The setup shown here is specific to GitHub Actions, but Pronto can also be integrated with GitLab or Bitbucket. Refer to <a href="https://github.com/prontolabs/pronto">Pronto's README file</a> for details.
</div>


## How to set up Pronto with GitHub Actions

I'm assuming your project is already on GitHub. I recommend doing this work in a new branch, rather than pushing it up straight to your project's default branch, so you can test the integration with some intentionally bad code.

Add a configuration file to tell GitHub Actions to scan code on each pull request. This is almost verbatim from the example provided in the Pronto README, but I've modified it to share the runners I use most, along with comments to help explain a few steps.

Put the file in the _.github/workflows_ directory. You can name the file whatever you want, as long as it ends in _.yml_.

{% highlight yaml %}
name: Code quality
# Run this workflow when a pull request is created.
on: [pull_request]

jobs:
  pronto:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      # Pronto docs suggest limiting the depth of the clone
      # to speed things up.
      - run: |
          git fetch --no-tags --prune --depth=10 origin +refs/heads/*:refs/remotes/origin/*

      # If your project only specifies its Ruby version in its
      # Gemfile, you'll need to specify a version for the
      # action to use. See documentation for the
      # ruby/setup-ruby action for details.
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1

      # Install the runners you'd like Pronto to use on each
      # scan. This setup includes the Standard Ruby style
      # guide, and Brakeman security analyzer
      - name: Set up Pronto
        run: gem install pronto pronto-standardrb pronto-brakeman

      # Perform a scan on the diff between your branch and
      # your PR's target branch (e.g, staging, main ...)
      - name: Run Pronto
        run: pronto run -f github_status github_pr -c origin/${{ github.base_ref }}
        env:
          PRONTO_PULL_REQUEST_ID: ${{ github.event.pull_request.number }}
          PRONTO_GITHUB_ACCESS_TOKEN: "${{ github.token }}"
{% endhighlight %}

<div class="alert alert-info">
  I've historically kept my Pronto setup outside of an application's <em>Gemfile</em> in order to limit crossover with the app's dependencies. This example follows suit--it does not use Bundler to install Pronto and its runners. I may revisit this someday.
</div>

I like [Standard](https://github.com/testdouble/standard) (versus, say, straight-up Rubocop) because it's an opinionated style guide, and I'm on-board with pretty much all of its opinions. Any style guide that steers you toward cleaner commits is a big winner in my book. I've also included [Brakeman](https://brakemanscanner.org) here because it's simple to integrate and can find easy-to-miss security holes in your application. I recommend these as starting points regardless of your level of experience with Rails.


## Testing it out!

Now for the fun part: Let's see the setup in action. To test the new GitHub Actions workflow, create a new temporary branch from the feature branch you used to add the workflow. (You can also totally use the same development branch if you're comfortable using Git to clean up and force-push changes to your feature branch.) If you're using Standard, intentionally bad indentation (three spaces instead of two, tabs instead of spaces) or using single quotes instead of double quotes are good test cases for this setup.

Push your branch up to GitHub, open a pull request, and give the workflow a few minutes to do its job. You should receive an email notifying you of success or failure, and each runner (in this case, Standard and Brakeman) will pass or fail the PR. But here's my favorite part: Pronto reports each found violation as an in-line comment in your PR's code!

![](/images/posts/pronto-github-actions.png)

From there, you can fix the violations (ideally using [fixup commits that you can autosquash before merging](https://fle.github.io/git-tip-keep-your-branch-clean-with-fixup-and-autosquash.html)), or use GitHub's collaboration tools to discuss reported violations with teammates. Unfortunately, the _github-actions_ bot isn't yet smart enough to have a conversation with you.


## Conclusion/next steps

With one file, this GitHub Actions and Pronto integration adds a nice safety net to any Rails application, to help protect against future bad code violations. Violations are reported in a way that's just obtrusive enough for a developer to notice. Think of the integration as your super-detail-oriented robot teammate who'll find those little style issues, so you can get them fixed before turning the review over to your human teammates.

There are many more [Pronto runners](https://github.com/prontolabs/pronto#runners) you may wish to check out and add to your own setup. Thanks for reading!
