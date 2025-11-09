---
layout: post
title: "My go-to prompt for legacy code exploration"
excerpt: "Old software systems can be scary. Learn their quirks and conventions with some agentic assistance."
tags: artificial-intelligence agentic-coding legacy
---

I spend the majority of my coding time working in legacy software systems. Some of the code is decades old, written in myriad languages, by other developers who've long since moved on from my employer. (And, yes, some of that head-scratcher code was written by me.)

When I dive into a new-to-me code base, or one I haven't worked in recently, I like to have a high-level map of the data flow, architectural patterns, and areas of technical concern. I start with this prompt:

> You are a senior software engineer conducting a thorough codebase analaysis.
> Your task is to create SYSTEM_OVERVIEW.md with the following structure:
>
> CORE ANALYSIS (Required):
>
> - Tools, frameworks, and design patterns used across the repository
> - Data models and API design
> - Include a Mermaid architecture diagram to illustrate the system and its
>   dependencies at a high level
>
> SYSTEM DESIGN (Required):
>
> - Explain each file in detail and how they are linked
> - Include a Mermaid sequence diagram to illustrate data flow
> - Include Mermaid flow charts to illustrate complex data flows
>
> LEGACY ASSESSMENT (If applicable):
>
> - Identify inconsistencies in architectural patterns
> - Identify deviations from language/framework best practices or con- Distinguish
>   between old and new architectural approaches
>
> Focus your analysis on providing a good high-level introduction to a senior
> engineer who's new to this system. This is the primary goal of this research.

Let your agent/LLM of choice chew on things for a couple of minutes, then take time to review the document in a Markdown preview tool with Mermaid support. (LLMs are pretty good at Mermaid syntax, but not always.) Or maybe you've got some context about why patterns were used, or inconsistencies exist, that would benefit future readers. Update the overview accordingly, then commit the document. (At work, we have standardized on naming the file `SYSTEM_OVERVIEW.md`, and saving it at the root level of a repository.)

This iteration of my go-to code exploration prompt has worked well so far for software written in Ruby, Python, Java, Go, JavaScript, and Perl. My brain finds the diagrams especially useful. The defined structure gives my team reasonable consistency as we move from system to system, depending on the task at hand.

## It's a starting point

This document will not be perfect. But from my experience, it will be a _good enough_ baseline for building human and agentic understanding of old, obtuse systems. Unless there are glaring errors, don't dwell on making it just right.

## It'll grow stale

Now that you have a general understanding of your system, perhaps you're emboldened to do something about those scary corners of the code, to make them less scary. Or tackle that long-overdue framework upgrade. Hey, go for it. (I'll write some other time about planning for these big swings so they're less likely to be AI-generated messes.) But as you make changes big or small, your code base will evolve, and the system overview should evolve with it. As does any documentation, really.

I haven't tried this yet, but I imagine including some rules for your agent of choice along the lines of _When finishing coding work, review `SYSTEM_OVERVIEW.md` and make sure it is still current_ would help automate this.

## Context still matters

Okay, fellow human. We've got a good-enough understanding of a system that had been a black box of mere moments ago. We've got an agent standing by, eager to blow away years of technical debt. But is that the next most important thing to do?

The guidance _be the human in the loop_ has become trite. But, sorry, it still applies. And sorry again, you'll probably need to talk to other humans to build context—not just the _how_, but the usually more important _why_. Ahe system overview and a little [git spelunking](https://leftofthe.dev/2017/01/02/git-command-line-log-search) can help build historical context—like, _oh, that's how things were done in Rails 2.0_, or _yeah, turns out that's an in-house framework someone developed, put on their résumé, and used to land a better gig._ You can learn some neat things.

Good software engineering is still tough work! A well-prompted LLM can help fill in knowledge gaps, but you'll still need to use your smarts, and make sound decisions about what to do with that knowledge. You might even decide it's best to go forth _without_ your agentic coding buddy, or even to do nothing at all.

Good luck out there, and thanks for reading!

## References

I've spent much of this year focused on understanding some scary old codebases, and getting better at the process along the way. The current prompt borrows heavily from Alex Chesser's article [Attention Is the New Big-O. A Systems Design Approach to Prompt Engineering](https://alexchesser.medium.com/attention-is-the-new-big-o-9c68e1ae9b27), which coincidentally used legacy code exploration as a case study.

Prior to that, I'd read Ari LiVigni's article [Modernizing legacy code with GitHub Copilot](https://github.blog/ai-and-ml/github-copilot/modernizing-legacy-code-with-github-copilot-tips-and-examples/), which pointed out that LLMs are pretty good at generating Mermaid diagrams. But the simpler prompts weren't sufficient for full-stack systems—like, it'd see some jQuery and run with the notion that it was looking at a front-end-only application.
