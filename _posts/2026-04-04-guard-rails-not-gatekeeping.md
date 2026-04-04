---
layout: post
title: "Guard rails, not gatekeeping"
tags: developer-experience code-review agentic-coding
excerpt: "More people than ever are contributing to software projects. Here's how to keep quality high without keeping people out."
---

<a data-flickr-embed="true" href="https://www.flickr.com/photos/27346873@N04/26077148932" title="Foggy Morning Sunrise"><img src="https://live.staticflickr.com/1691/26077148932_5f3bb26310_h.jpg" width="1600" height="900" alt="Foggy Morning Sunrise"/></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

Agentic coding tools are lowering the barrier to contributing to software projects. People who've never touched a codebase before are submitting pull requests. Developers who are new to a language or framework are getting meaningful work done on day one. I am here for it.

But I know many people disagree.

Because it also means more code is flowing into projects from people who might not know the conventions, the security pitfalls, or the little things that keep a codebase maintainable. And I've noticed a knee-jerk reaction from some experienced developers: tighten the gates. Demand that every contributor "learn the hard way" first. Pile on the code review feedback until newcomers feel like they'll never get it right.

There's a better way. Stop gatekeeping and set up guard rails--automated checks that catch the easy stuff before it ever reaches a human reviewer.

None of what I'm about to suggest is particularly new or novel. These tools have been around for years. But I'm continually surprised by how many software teams _don't_ put them into practice. And with agentic coding making contributions more accessible than ever, there's never been a better time to start.


## Formatting and linting

Consistent code formatting is the low-hanging fruit. It eliminates an entire class of code review nitpicks ("wrong indentation," "missing trailing newline," "single quotes vs. double quotes") and lets reviewers focus on what the code _does_ rather than how it _looks_.

For Ruby, I'm a big fan of [Standard](https://github.com/standardrb/standard). It's an opinionated wrapper around RuboCop that makes most of the style decisions for you. No more bikeshedding over whether to use `&&` or `and`--Standard picks one, and you move on. If you're working in Python, [Ruff](https://docs.astral.sh/ruff/) has quickly become the go-to linter and formatter. It's incredibly fast (it's written in Rust) and replaces a whole pile of tools like flake8, isort, and black in a single package.

The specific tools matter less than the habit. If your team already has style conventions, great! If not, just pick a pre-existing one that you like _enough_. (Like, I don't completely agree with Standard, but I know smart people have put a lot of thought into it already, and I have other things to worry about than code formatting.) Whatever language you're working in, find a formatter and a linter, configure them once, and let them do their thing. The goal is to make _correct_ formatting the path of least resistance.


## Security scanning

Formatting is about aesthetics and readability. Security scanning is about not shipping vulnerabilities to production. Long-time readers know, I think about security a lot.

[Brakeman](https://brakemanscanner.org) has been _the_ standard for Rails security analysis for years. It catches common issues like SQL injection, cross-site scripting, and mass assignment vulnerabilities--things that are easy to introduce, especially if you're new to a framework or if an AI agent generated the code without full context of your application's security model.

For Python/Django, [Bandit](https://bandit.readthedocs.io/) fills a similar role, scanning for common security issues in Python code. I don't think it's as solid as Brakeman, but it's fine.

Regardless of your stack, [Gitleaks](https://github.com/gitleaks/gitleaks) can catch hardcoded secrets and API keys before they make it into your repository's history--something that's especially important when agents are generating code that might include placeholder credentials or example API keys that turn out to be real.

These tools won't catch everything. They're not a substitute for understanding security. But they'll catch the stuff that's embarrassing to miss, and they'll catch it before a human has to.


## Enforce it per commit

Here's where the real leverage comes in: run these checks automatically, _before_ code even gets pushed.

I'm partial to [Prek](https://github.com/nicholaides/prek), a lightweight pre-commit hook manager. It's simple, it's Ruby-friendly, and it does what it says on the tin. But you have options:

- [pre-commit](https://pre-commit.com) is probably the most popular option, with a huge ecosystem of hooks for practically any language or tool you'd want to run. It's Python-based, but don't let that stop you--it manages its own environments.
- [Lefthook](https://github.com/evilmartians/lefthook) is fast (written in Go), configurable, and works well in monorepos.
- [Overcommit](https://github.com/sds/overcommit) is another Ruby-friendly option with lots of built-in hooks.
- Manage the commit hooks yourself.

The key is catching problems at the earliest possible moment. When a developer (or an agent acting on behalf of a developer) attempts to commit code that doesn't pass the formatter or has a security finding, they get immediate feedback. No waiting for CI. No context-switching. Fix it now, commit again, move on.

But don't _only_ rely on pre-commit hooks. They can be skipped (intentionally or accidentally), and they don't run on automated PRs from tools like Dependabot or Renovate. So run the same checks in CI, too. Think of pre-commit hooks as your fast feedback loop and CI as your safety net. This is another selling point for Prek--it is dead simple to add to a GitHub Actions (or compatible) CI workflow.


## Not just for robots

So everything I've described benefits _all_ contributors, not just AI agents.

I've been writing Ruby for more than twenty years, and I still occasionally write code that Brakeman flags. I've submitted PRs with inconsistent formatting because humans make mistakes. These tools help me, too. They help everyone.

My team at my day job is responsible for nearly fifty codebases, some that were started as early as the year 2000. Seriously. They're written in Perl, old Python, Java, Ruby, new Python, and Go. We are an extremely small team, but by building guard rails, _any_ of us can pick up most tickets with the help of an agent, and feel good about opening a pull request that isn't wasting our Perl/Python/Java/Ruby/Go expert's time.

When automated processes handle the mechanical stuff, humans can spend their review time on design, intent, and the things that actually require judgment.


## Rethinking code reviews

I still think about code review as a practice. A lot. I wrote about [code reviewing as a mindset](/2017/01/16/code-review-mindset.html) nearly ten years ago, and I still believe the core of it: reviews are about understanding the software and building a better team, not about proving how much smarter the reviewer is. It took software engineering as a profession to get to this point, past using code review as an opportunity to belittle contributors.

That's changed over the past couple of years, as the sheer volume of code has overwhelmed open source maintainers, and introduced embarrassing bugs as individuals and teams try to keep up. I am not discounting this as a problem. But some developers treat AI-generated or AI-assisted code as inherently suspect--holding it to a higher standard than code written by a senior engineer, or dismissing it out of hand because an agent helped write it. It bums me out even more when that attitude extends to the _people_ using these tools, too.

This is gatekeeping, and it's counterproductive.

Look, I don't care how the code was written. I care that it works, that it's secure, that it's maintainable, and that it fits the architecture of the project. If automated checks have already verified formatting and flagged security issues, a reviewer can focus entirely on those higher-level concerns. That's a good use of a senior developer's time and expertise. Not arguing about indentation. Not performing gatekeeping rituals.

If your team's code review process is mostly catching things that a linter or security scanner could catch, that's a sign you need better tooling--not stricter reviews. Set up the guard rails, then trust them. Free up your humans to review the things that actually need a human.


## Next steps

Like I said, these are not new concepts. Code quality tools and pre-commit hooks have been around forever. Pick one tool, add it to one project, and see how it feels. You don't need a grand plan or full buy-in from your team to start. A pre-commit hook running Standard or Ruff on your own machine costs nothing and helps immediately.

The goal isn't perfection. It's making it easier for more people to contribute good code to your projects--whether they're seasoned developers, newcomers learning their way around, or AI agents acting on someone's behalf. Guard rails make that possible. Gatekeeping doesn't.
