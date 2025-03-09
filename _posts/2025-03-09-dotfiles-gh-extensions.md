---
layout: post
title: "Newly open-sourced development setup tools"
excerpt: "Recover from laptop disasters a little faster through automation!"
tags: developer-experience
image: "/images/posts/sad-mac.png"
---

Last month, I literally dunked my work laptop in coffee. (Check your bag for standing liquid before dropping your laptop in it, kids!) I took this opportunity to tune up my workstation setup process--first with the loaner, then with the repaired laptop when it returned a couple of weeks later. (Aside: I almost always set up new workstations from scratch instead of restoring from backup images.)

Here are the results of my work, which I'm happy to have open sourced last week.

- **[ruralocity/dotfiles]:** I've had my dotfiles stored in a private repository for years, and have found chezmoi the best solution for me for managing them. I am still guilty of letting my dotfiles get out of sync across computers, but that's my fault, not chezmoi's. Anyway, I found it's a lot simpler to set up a new workstation from a chezmoi repository if that repo's public, and there wasn't really a reason for me to keep mine private. So here you go, world.

  My dotfiles are still a little messy, and in some places Mac-specific, but they're out there now for reference. If you take nothing else away from them, I strongly suggest installing all the things you can via a `Brewfile`--even apps you'd typically install via the Mac app store.

- **[ruralocity/gh-clone-team-repos]:** At my team, we use [GitHub Teams] to help organize our organization's many repositories. On top of that, my team in particular is responsible for up to ten times more repositories than other, more focused teams. I wanted a way to pull down a bunch of repositories without all the manual `git clone`s that would've otherwise been involved. So I spun up an extension for the [GitHub CLI] to help me with this. It's a little ugly, but it works! My first iteration was in Ruby; I rewrote it in Bash for better portability.

  Someday I want to look at another rewrite in the [Bubble Tea] TUI framework for Go, just for fun. In the meantime, it does exactly what I needed, and could be useful for onboarding to others.

- One more broad change--most of our code bases at work use dev containers, but I did begin using **[mise-en-place]** to manage my Rubies, Nodes, and even environment configurations. I've been really happy with it so far.

I know these aren't Ruby-specific tools, but I hope some of you find them helpful or inspirational!

[ruralocity/dotfiles]:https://github.com/ruralocity/dotfiles
[chezmoi]:https://github.com/twpayne/chezmoi
[ruralocity/gh-clone-team-repos]:https://github.com/ruralocity/gh-clone-team-repos
[GitHub Teams]:https://docs.github.com/en/organizations/organizing-members-into-teams/about-teams
[GitHub CLI]:https://cli.github.com
[Bubble Tea]:https://github.com/charmbracelet/bubbletea
[mise-en-place]:https://mise.jdx.dev
