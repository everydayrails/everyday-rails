---
layout: post
title: "Code reviewing as a mindset"
excerpt: "Code reviews are more than proper indentation and method length. They're about understanding your software, and developing a better team of developers. Here's my approach to the code review practice."
tags: security code-review
---

A couple of years ago, I shared some tools I use to help [automate the code review process](https://everydayrails.com/2015/02/17/pronto-ruby-code-review.html). Those tools are excellent for finding grammatical errors in my code--issues like improper indentation, poorly-defined variables, and under-documented commits. In this article, I want to focus more on the things that aren't as easy to automate.

As mentioned in my original article, my approach is heavily influenced by [Alex Gaynor's guidelines for effective code review](https://alexgaynor.net/2013/sep/26/effective-code-review/). Alex's approach is maybe targeted more toward open source contributors and maintainers, but I think the general rules **apply to any software project (even those managed by a single developer)**. I've put a bit of a personal spin on things, to add focus to what's important to my software. As you implement your own code review guidelines, you'll probably want to do the same.

![The Fonz](/images/posts/thumbs-up.jpg){: .decoration}
For the record, **I love code reviews, both as a reviewer and a reviewee**. I look at both as opportunities to learn more about the software I'm writing, the business it supports, and the ongoing education we're all going through as programmers. I know many are apprehensive about giving code reviews, settling for a quick "looks good to me" response after a cursory glance at the source. And *asking* for a code review can cause even more anxiety and dread, for fear that one's impostor syndrome will finally be exposed.

Please, do everyone a favor to **help mitigate this dread on both ends of a pull request**. If you're the one submitting the request, make sure it's clear why you've created this pull request. If there are particular parts of the code you're not sure about, let the reviewer know. Look at this as a learning opportunity. If you're a reviewer, don't belittle the request. Derek Prior shared some [wonderful techniques for providing polite code reviews](https://www.youtube.com/watch?v=PJjmw9TRB7s) in a presentation at RailsConf 2015. These tips apply for anyone working on a project, whether they're writing code or reviewing it. And again, look for things to learn as you're reviewing code. You may be surprised what someone else's perspective on the project can teach you!

Bottom line: **Be cool, like the Fonz**. Please. In life, and in code reviews. Know that the person at the other end of the review only wants the best for the codebase, and give or accept feedback in kind. Ayyy!

With that in mind, let's go through the actual steps I go through on any given code review. Trust me, it can be a wonderful experience for everyone involved! Even when I'm the only developer working on a project, I find it useful to go through this process when possible. If time allows, I'll open a pull request, and let it sit overnight before reviewing and merging. That helps me look at the code change with fresh eyes, and spot things I may not have seen while actively coding.

## Intent

When looking at the actual code, my first step is to **make sure I understand why this code was written, and why a pull request was created to add it to the code base**. It's as much for me as it is for the person submitting the request. Are we both clear about what problem the code in question is meant to solve? If so, then I can move forward with a well-informed review of the actual code. If not, then the submitter and I need to have further discussion.

## Design

This is where I'll start looking at the actual code. I'll typically start by **looking at the diff as a whole**, to get a feel for where the change has been implemented. Drilling a little further, I'll first look at any new test coverage, to get an understanding of how I expect the software to behave as a result of this change (this differs from Alex's approach; I tend to look for test coverage at a higher level). If there's no new test coverage, I'll make a note to review each commit, in case the submitter has stated a case for why coverage isn't necessary, or is too expensive to implement.

Next, I'll look at **where, within my software's architecture, the change has been applied**. Has a change been made in a controller, when it really belongs in a standalone class? Has a third-party dependency been introduced to the application, when a few lines of bespoke code would've sufficed? Is this an opportunity to improve the overall architecture of the code?

Now's the time to address these concerns--there's no telling when your team may have the opportunity to work with this chunk of your application again. **A good code change should leave your project in nicer shape than it was before.**

## Implementation

So now I understand what the code is supposed to do, and I see where the implementer is attempting to make it work. **Is it doing what it's supposed to do, without side effects?** Or does it introduce any new bugs, or performance issues? Does the code make sense? Will it make sense when you look at it again in three months? Would code documentation help? Do the tests adequately demonstrate real-world use cases?

## Security

Security concerns could be lumped under the implementation banner, but I think they're **important enough to call out and review separately**. (Performance could, too, but part of my job is to be concerned about security first.) Are the appropriate methods for authentication and authorization being called? Does the code change open the application up to any of the OWASP Top 10 vulnerabilities? Are any sensitive bits of data stored directly in code, instead of fetched as environment variables? Some of these question can be [found with automation](https://everydayrails.com/2016/12/12/rails-security-essentials.html), but others will require more understanding of your application's business rules.

## Grammar

Ideally, as a code reviewer, you won't have to spend a whole lot of time nitpicking over code indentation and number of lines per method. [Automate those checks](https://everydayrails.com/2015/02/17/pronto-ruby-code-review.html) as much as possible, and if you're the developer requesting a review, **do your best to address the low-hanging fruit before opening the pull request**. If you see something, though, say something. Automation isn't infallible, unfortunately.

## Documentation/other requirements

Your application may have unique requirements that need your attention during code review. For example, in the case of the software I work on at my day job, we have a built-in online help system for users of the application. Developers are responsible for keeping it current. Has the documentation for a new or modified feature been adequately updated? Even if your software doesn't have bundled user documentation like this, you can still **use this as a time to reflect on how the change will affect end users, or specific needs of the software in general**. Did you miss anything in your code review?

## Summary

I thought about writing this post as a checklist, but I think that would do us all a disservice. **Code reviewing is a mindset, not a procedure.** For code reviews to be effective, you and your team need to decide what's important for you and the software you're improving together. I hope my approach, and suggestions for people like Alex and Derek, help you and your team adopt a code reviewing mindset of your own.
