---
layout: post
title: "Superpowers have changed how I write software (mostly)"
excerpt: "Software developers who think critically write better code. Here's how I've incorporated an excellent set of Claude Code skills to bake critical thinking into my agentic workflow."
tags: artificial-intelligence agentic-coding developer-experience
---

I've been having lots of fun the past few weeks chatting with people at work
about my current agentic coding setup. Since late 2025, most of my coding work
has been done with the assistance of Claude Code's agentic skills feature. In
particular, the [Superpowers](https://github.com/obra/superpowers) skills
created by Jesse Vincent have been gamechangers!

In this article, I'll share my workflow for thinking about and creating
software, using Superpowers--and why I feel they're worth checking out if you've
had poor or mixed results with AI-assisted or agentic coding tools in the past.

(Agentic skills are increasingly table stakes and now a feature in many tools,
including OpenAI's Codex and open source alternatives like Crush and OpenCode.
I've not tried these agents myself, but the general workflow should apply in
them, too.)

## The Superpowers workflow

The Superpowers skill is actually several skills, which can be used
individually. But for the most part, I use its highest-level tools to think
through problems and ideas, craft plans based on that thinking, and then do the
work to make that plan happen.

The coding session kicks off with a **brainstorm**. Here, I'll begin with
providing up-front context to the agent. Then, I'll have a conversation with the
agent, to clarify and refine its understanding of the request--and more
important, my own understanding!

For simpler tasks, the agent may suggest just doing the thing. For larger or
more complex projects, the agent transitions to the **write plan** skill. The
plan is a human-readable Markdown file, so it's reviewable, or I can implement
it myself, or I can hand it off to the agent.

Assuming I *am* tasking the agent with the work, it'll use the **execute plan**
to make it happen! I've got a couple of options:

- **Work side-by-side with the agent**, pausing for review and feedback in
  incremental steps. I really like this mode when I'm using the tools to help me
  understand a new-to-me code base or concept! In fact, I've explicitly asked
  for plans that call out teaching moments along the way. It's a nice,
  interactive alternative to more traditional learning methods.
- **Permit the agent to outsource the work to subagents**, which are tasked with
  writing tests, implementing code, reviewing the work, documenting, and,
  committing for later review. Each agent is prompted for the specific type of
  work it's doing.

I always recommend the first approach to people who are new to agentic coding,
or for work that they couldn't do totally on their own if they had to--then
trust the agents to do the work end-to-end as comfort levels grow.

## Using Superpowers beyond code

I've recently begun a systematic organization and cleanup of my Obsidian
notes--something that's always been a struggle for me. Through brainstorming, I
put together a plan to work through my notes, then (hopefully) keep them tidy. I
kicked off the session acknowledging that my current system didn't work, and
that I'm open to change. It was really neat watching the agent notice patterns
in my notes and suggest baby steps to get me toward better notes. I'm still
early in this process and may write more about it at some point.

## It can chew through tokens

Be advised--as I tackled problems of increased scope with Superpowers, I found
myself hitting the token allotment on my Claude Code Pro account pretty quickly.
I've since upgraded to a Max account and haven't run into limits. It's worth the
cost for me, but I can respect that it may be a non-starter for many. (I *am*
interested in testing superpowers with an agent running against a
locally-running model, but that is a someday project.)

## Critical thinking is your real superpower

Here's the thing: the more thought and consideration you put into a problem up
front, the more likely your agent will generate net positive results. It's the
same as working a vague feature spec or ticket: Sure, you could run with it, but
if you don't have the full context, there's a decent chance you'll come back
with a result that doesn't match the request.

Good software developers know this inherently, but it takes practice (and a good
dose of humility!) to get there. Superpowers's brainstorming skill gives us a
safe space to build these habits and strengths--to push back on fuzzy ideas, ask
_But why?_ countless times like a toddler, work through constraints, and
consider alternatives.

It's still up to us, as humans, to decide whether the resulting co-created plan
solves the problem, and just as important, _that the problem actually needs
solving._ It's still on us to look at the resulting code and sign off that it
does the thing it's supposed to do and meets expectations around
maintainability, security, and performance.

That's critical thinking. No agent is doing it for you. But brainstorming with
Superpowers can help you build and strengthen your own critical thinking
muscles--then flex them the next time a vague user request comes in.
