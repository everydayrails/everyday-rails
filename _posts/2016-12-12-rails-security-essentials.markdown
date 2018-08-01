---
layout: post
title: "Rails security essentials"
excerpt: "Rails provides excellent support for software security, but you need to know how and when to apply those supports for them to work. Here's an overview of tools you can use to keep your applications safe."
tags: security
---

High-profile breaches of security are all too common in the news today. As web application developers, whether we like it or not, we need to be overly paranoid about security. All it takes is one simple slip-up to expose customer information, business secrets, or classified government documents to the world.

![Obligatory photo of a cat at a computer. Better than a guy in a hoodie, crouched over a laptop in a dark room, right?](/images/posts/hacker-cat.jpg){: .decoration}

As Rails developers, though, we're lucky. We have a great framework that has our backs, and wonderful add-on tools to help make sure we're writing safe code. But we have to know how to use these features, and how to understand what they're telling us. **Security is important**, and too easy to defer until later or sweep under the rug. If you've been ignoring security in your Rails app, it's time to put the tinfoil hat on, assume the worst, and take a look at your Rails application's code.

Don't panic--it's not that bad. We've got some wonderful resources available, with smart, generous people behind them to help. The key is to **be proactive about security**, to reduce the chances of being caught by surprise.

In this article, I'll focus on tools and techniques for maintaining secure Ruby on Rails software, but not other important security measures like network and operating system hardening. They're important aspects to application security, too, but I needed to limit my scope to keep the length of this reasonable!

## Overviews

To start, read through the **[Ruby on Rails security guide](http://guides.rubyonrails.org/security.html)**, part of the official Rails documentation. This guide outlines all the security-facing features we get for free by using Rails, with explanations of the attacks they're designed to prevent. If terms like *cross-site scripting* and *SQL injection* are new to you, this is the first place to learn more.

Next, I recommend the **[OWASP Top 10 project](https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project)**, which breaks down the most common web application vulnerabilities into an easy-to-understand and easy-to-follow list of best practices for keeping your web application secure. OWASP also provides a **[Rails-specific cheat sheet](https://www.owasp.org/index.php/Ruby_on_Rails_Cheatsheet)** of things to check in your apps.

## Scanners

![Brakeman](/images/posts/brakeman.png){: .decoration}

Feeling nervous about your app, now that you've read the checklist? Don't worry, **[Brakeman](http://brakemanscanner.org)** will help you track down potential security issues. Brakeman scans your code for potential issues, and returns a thorough report. I recommend trying the HTML format, which includes inline code samples and helpful links explaining each found vulnerability. The report may be sobering, especially if your code base has been left unchecked for a few years with nobody keeping up with good security practices--but often, the fixes are not too difficult.

Brakeman is a great tool for not only protecting your app, but also for educating developers on best practices related to security. It's one thing to read through contrived code samples; it's another thing to read code that *you're responsible for* and have to fix it.

Now you've got the tools you need to make the code you're responsible for more secure, but what about those third-party gems (including Rails) that make up the rest of your application? Add **[bundler-audit](https://github.com/rubysec/bundler-audit)** to your security toolbox and scan your app's dependencies against a database of known vulnerabilities. The report provides a brief summary of each issue, along with a remedy (typically, upgrading to a newer, patched version).

If possible, I recommend running both of these scanners as part of your application's continuous integration setup. There's a **[Jenkins plugin for Brakeman](https://github.com/jenkinsci/brakeman-plugin)** that provides some nice configuration options for determining whether a build is safe, as well as charts to help visualize code security over time.

## Staying informed

If you want to get email updates when the Rails team releases security updates, join the **[Ruby on Rails security mailing list](https://groups.google.com/forum/#!forum/rubyonrails-security)**. The only people allowed to post are core Rails team members working on security efforts, so it's both a reliable source of news, and very low noise (you'll only get an email if there's a problem). The **[Ruby security announcements mailing list](https://groups.google.com/forum/#!forum/ruby-security-ann)** operates the same way, and covers the same turf as the Rails security list, along with other popular Ruby libraries.

If you're curious about how the Rails team handles potential security reports and patches, or you think you've found an issue yourself, read the **[Rails security policy document](http://rubyonrails.org/security/)**. It's important that you go through proper channels when reporting vulnerabilities, so that the security team can make patches ready before news of the issue spreads too far.

## More information

Brakeman's maintainer, Justin Collins, has shared some great security-focused talks at recent Railsconfs:

- **[... But Doesn't Rails Take Care of Security For Me?](https://www.youtube.com/watch?v=3P9naxOfUC4)**: This talk from Railsconf 2016 covers what can happen when developers don't take advantage of security support included with Rails.
- **[The World of Rails Security](https://www.youtube.com/watch?v=AFOlxqQCTxs)**: From Railsconf 2015, a nice overview of how Rails handles a number of potential security issues, and where it falls short.

You may also like these talks:

- **[The State of Web Security](https://www.youtube.com/watch?v=tfvkC-L69xc)** (Mike Milner, Railsconf 2016)
- **[Rails Application Security in Practice](https://www.youtube.com/watch?v=TGbeIxf5RnI)**: (Bryan Helmkamp, Ruby Midwest 2013)
