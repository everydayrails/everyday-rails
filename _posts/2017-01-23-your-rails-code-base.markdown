---
layout: post
title: "Ask the reader: What versions of Rails do your apps currently use?"
excerpt: "An experiment! This week, let's have an open floor discussion about Rails versions in production, and what keeps us from upgrading sooner."
---

I had to travel this weekend, and the twelve hours or so I spent driving over the last couple of days meant I didn't have time to write a new post for the week. So I thought it would be a good opportunity to try a different format I've been thinking about, to learn more about people who read this blog. I want to hear your stories!

**I'm really curious about which version of Rails people use these days.** Are your apps built on the latest and greatest version of the framework? (At the time of this writing, that'd be 5.0.1.) If so, and you didn't start at the latest, how difficult was it to upgrade? And if not, which version of Rails are you using? What's holding you back from upgrading to the latest version?

**If you'd like to share your story, please leave a comment below.** I'll prime the discussion: I currently maintain three applications in production environments, excluding personal projects. Two are on the current patch level for Rails 4.2. One of those was upgraded from 3.2 last summer, and I intend to upgrade them to 5.0 in the next few months (possibly in time for 5.1 to arrive). The other is at Rails 3.2, and is actively being updated to 4.2. The main challenge with getting it upgraded is complexity: It's an older app, and many techniques it employs have been deprecated along the way. My hope is that the changes being made now will help make future Rails upgrades easier.

**Thanks in advance for your participation.** If this goes well, I may do this again from time to time, with different questions.
