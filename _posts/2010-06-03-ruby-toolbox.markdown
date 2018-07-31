---
layout: post
title: "Finding the best time-saving gems for your Rails app with Ruby Toolbox"
excerpt: "How do you find the best gems to add features to your applications? Save a lot of search time with a new-ish index of Ruby gems."
---

Rails developers of all skill levels take advantage of a good gem or plugin (or two, or three, or five) to add critical features to apps. There's no shame in taking advantage of the generosity of others--maybe in addition to DRY we should have DRTWOO (don't repeat the work of others). In the past, my method of finding the right add-ons consisted of a combination of Google and GitHub's basic keyword search, then reviewing the candidate projects' activity history (when was the last commit?) and popularity (how many people are watching it?) to help assess whether it will be a good fit in my application. (It also helps if Ryan Bates has talked about it in [Railscasts](http://railscasts.com/)). Come to find out, there's a site that takes care of the GitHub part of the search for you.

[Ruby Toolbox](http://www.ruby-toolbox.com/) has been around for more than a year, but somehow I missed it until last week when I was interested in current best practices for adding tagging functionality to an application. I've implemented tags several times, but figured how I'd done things in the past might be dated.

My Google search found a page that ranked [four tagging projects](http://www.ruby-toolbox.com/categories/rails_tagging.html) by a score based on their respective GitHub watchers and forks. Each project's last commit, total downloads, and downloads of the current version are also listed to help you judge whether a project is solid enough to include alongside your own work.

Ruby Toolbox has also helped me find gems to solve problems I had but didn't realize I had. For example, I have an app that relies heavily on [recurring events](http://www.ruby-toolbox.com/categories/recurring_events.html). At the moment I have basic code for writing and duplicating events in a calendar-like application (I tell people it's not a calendar; it's a data collection system that looks like a calendar). The next time I put my app through a round of updates I've got several options to consider for (hopefully) cleaning up my code. Take a look at the [list of gem categories](http://www.ruby-toolbox.com/) to get a top-level view of add-ons for your application--this is a great way to find tools to help get uncommon tasks (say, not authentication or tagging) into your app and out of the way.

<div class="alert alert-info" markdown="1">
Thanks again to those of you who are following _Everyday Rails_ on Twitter or left feedback since I shared a link to the site on [RubyFlow](http://www.rubyflow.com/). New content is coming next week--look for a series on how I do authentication and authorization in Rails apps to begin.
</div>