---
layout: post
title: "Everyday Git: Clean up and start over"
excerpt: "Git makes it easy to experiment with ideas before committing them for posterity. Here's one way to get rid of those experiments when they go bad."
tags: git
---

Yes, this is still a Rails blog--but being productive in Rails means a lot more than just knowing Ruby and the framework. You also need to know your way around a version control system. That (hopefully) means Git. There are lots of excellent introductions to Git already available. If there's interest I can put together a list of some of my favorites. In the meantime, I thought I'd share some other Git workflows I use on a regular basis. Today, I want to share my process for those times when I've spiked some code I don't care to keep--or just made such a mess I want to back up and start over.

This short workflow assumes you're already tracking a project with Git. It uses the following Git commands:

- `git diff`
- `git reset`
- `git clean`

This process will wipe out all uncommitted work. To hold onto this work for future reference, I like to save out a diff file:

    $ git diff > ~/Desktop/spike-cool-new-feature.diff

Don't forget, `git diff` won't include new, untracked files unless you've staged them with `git add` first.

To start cleaning, remove changes to files you're already tracking in your repository:

    $ git reset --hard HEAD

This resets the contents of your project to their state at your most recent commit (`HEAD`). Again, the `--hard` flag is destructive--if you don't have a backup of your work-in-progress, it's gone!

If you haven't added any new, untracked files since the previous commit, you're done. If you have, you can remove them all at once with

    $ git clean -fd

The `-f` flag forces the clean; the `-d` tag applies it to untracked directories, too. These flags do not clean up files you're ignoring in your `.gitignore` file; you can add those with

    $ git clean -fdx

**Take caution with the `-x` flag to `git clean`!** It's handy for cleaning out junk like temp files and old development logs, but it will also delete any other file you've specified Git to ignore. For example, your Rails project's *database.yml* file could get wiped out if you're not careful. I almost always find `git clean -fd` does what I need.

After `git clean`, your workspace is as fresh as it was following your most recent commit:

    $ git status
    # On branch add-cool-new-feature
    nothing to commit, working directory clean

I hope this little Git productivity boost has been helpful. If you have a different way to accomplish this task, I'd love to hear about it in the comments. Thanks for reading!
