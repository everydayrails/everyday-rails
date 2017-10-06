---
layout: post
title: "Automating code review with Pronto (and friends)"
excerpt: "Pronto helps streamline the code review process by automating what can be automated, so you can focus on the code's intent and design. Here's one example of how to use it."
tags: code-review
---

I've been thinking about the code review process recently. It's a great way to
get a second opinion on your code, while also spreading knowledge of how the
code works within your organization. In particular, I've become a fan of the
[approach to code
reviews](https://alexgaynor.net/2013/sep/26/effective-code-review/) advocated
by Alex Gaynor. Alex suggests looking at code at four levels:

* **Intent**: What does this change address?
* **Architecture/design**: Is the approach appropriate to the change needed?
* **Implementation**: Does it work? Are there unintended side effects? Is test
  coverage adequate?
* **Grammar**: Are variables, methods, and arguments appropriately named and
  assigned? Does the code adhere to style guides and best practices?

In this post, I want to focus on that last question: **Does the code adhere to
style guides and best practices**? From my experience, this step of a review
can take the longest, though in reality much of that work can be automated. In
fact, the developer requesting a review can check that issues of style and good
practice before the review begins. When writing Ruby code, a tool I've started
using more is Pronto.

[Pronto](https://github.com/mmozuras/pronto) works by comparing your commit(s)
to the Git branch you'd like to merge them into. For the developer, it lists
any issues it finds in your code so that you can address them. For the
reviewer, it provides a list of potential issues the original developer may
have missed. Pronto assumes you're using Git, and works well if your team uses
pull requests as part of your merging approach.

Actually, Pronto itself doesn't do the checking. A series of add-on runners do.
Here are my favorites, so far:

* [pronto-rubocop](https://github.com/mmozuras/pronto-rubocop): Check your code
  for adherence to the Ruby community style guide. Rubocop finds
  issues that can be easy to miss when you're focusing on other
  aspects of coding.
* [pronto-reek](https://github.com/mmozuras/pronto-reek): Check your code for
  "code smells," such as unused variables and oversized classes.
* [pronto-flay](https://github.com/mmozuras/pronto-flay): Detect possible code
  duplications inviting refactoring.
* [pronto-brakeman](https://github.com/mmozuras/pronto-brakeman): Make sure you
  haven't accidentally introduced any new security issues in your application.
* [pronto-poper](https://github.com/mmozuras/pronto-poper): Are your [commit
  messages
  well-formed](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)?
  Don't forget this step!

You can install them by adding them to the `:development` group in your
project's Gemfile, or via `gem install`. One aside: On my Mac, I had to install
`cmake` via Homebrew.

Of course, the tools themselves aren't new. If you've been developing Ruby for
awhile you've probably come across some or all of them. Yet, it can be easy
to forget to run them on your changes. That's what makes Pronto so useful.
Before pushing your changes, run Pronto on them. For example, if I want my
change to be merged into master, I'd compare it like this:

    $ pronto run -c origin/master

If any of the runners find issues, Pronto will report them. You can then do any
remaining cleanup, then push your branch and open a pull request.  I use Pronto
in this manner to compare local changes, but you may want to configure it to
interact directly with GitHub or GitLab, and post comments directly on the
offending commit or pull request. I'll let you review [Pronto's
README](https://github.com/mmozuras/pronto) for more on how to do that. 

Is it perfect? Not always. Sometimes one of the runners will raise a false
alarm. Other times it may miss something entirely. In those cases, you'll need
a human to intervene. More often than not, though, they work pretty well--or,
if nothing else, help you think about your code one last time before opening
that pull request.
