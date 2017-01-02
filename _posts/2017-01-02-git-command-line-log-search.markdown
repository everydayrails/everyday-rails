---
layout: post
title: "Everyday Git: Search the git log from the command line"
excerpt: "Your project's git log can tell you stories, but you have to know how to look for them. Here's how I explore a code base's history, using built-in command line tools."
---

![](/images/posts/git-log-header-large.jpg){.img-responsive}

*Photo credit: [H. Michael Karshis via Flickr](https://www.flickr.com/photos/48889115061@N01/29330647181/) ([license](https://creativecommons.org/licenses/by/2.0/))*

Version control tools like git are wonderful. They let you easily pass code around with other developers working on your project. They provide a safety net, so if you make a mistake, you can quickly revert back to a known, working version. But they can also provide valuable clues about how your software became the thing of beauty (or horrible mess) that it is today. You just need to know where to look.

I do almost all of my work with git from the command line, but until recently, I would open a graphical client for tasks like searching and viewing the long-term commit history. It just seemed easier. In particular, I liked that I could quickly jump from commit to commit with my up and down arrow keys, using a tool like gitx. Then I realized a simple trick that lets me do all of that in the command line.

I'll share that trick at the the end of the article--but before that, you may find it useful to understand the common tools I use to review a project's git log.

## Viewing the git log

This list isn't complete, but the commands shown here are the handful that I use on a day-to-day basis. They should all work in a recent version of git on Linux or macOS (I don't have access to a Windows computer anymore, but if you know something I don't, please leave a comment and I'll amend this article).

- **`git log`**: On its own, `git log` displays a list of commits and their commit messages in reverse chronological order (most recent commits at the top).
- **`git log --reverse`**: Display the output in reverse, so the earliest commits appear at the top of the output.
- **`git log --oneline`**: Passing `--oneline` results in a terse, two-column list of commit titles and SHA identifiers.
- **`git log -p`**: Passing the `-p` flag adds a full patch, or diff, to each commit--the code you added and removed.
- **`git log -p <filename>`**: Passing a file name restricts log output to changes to that file (for example, `git log -p app/models/user.rb`). You can remove the `-p` flag if you don't care about the code changes in each commit, or use `--oneline` instead to get a quick list. I find that I'm almost always interested in the actual code changes, though. If there's a chance that git could confuse the filename for a branch name, include `--` to disambiguate (`git log -p -- app/models/user.rb`).
- **`git log -p -S <query>`**: Use the `-S` flag (also known as the *git pickaxe*) along with a search term to restrict log output to code changes matching the search (for example, `git log -p -S password`). Again, this will work without `-p`, or with `--oneline`, but this is how I typically use it.
- **`git log -p --grep <query>`**: The `--grep` flag searches only the commit messages for the provided query. Wrap the query in quotes if it contains spaces. (You and your team are hopefully [writing useful commit messages](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)!)
- **`git log <commit1>..<commit2>`**: Restrict output to only the differences between two specific commits by passing them with a `..` (and no spaces) between them. This works with SHA identifiers (`git log 660bfa2..922b5d2`) as well as branch names (`git log rails-4.1..rails-4.2`). Leave either side blank to imply the current branch (`git log rails-4.2..`). Use with `-p`, `-S`, and `--grep` as outlined above to filter the results further.
- **`git log --stat`**: Add a brief list of the files that were altered in each commit, with a count of lines that were added or removed. As you may have guessed by now, `--stat` can be used alongside the other flags listed here to narrow results.
- **`git log --no-merges`**: Omit merge commits from the log output (use `--merges` to show *only* merge commits). I don't use these as often.

As I mentioned, this is just a list of the tools I use most often to look at the git log. If you want to learn more, Atlassian's article on [advanced git logging](https://www.atlassian.com/git/tutorials/git-log) is a great next step.

## Searching git log output

Since git's log output dumps to a [Unix pager utility](https://en.wikipedia.org/wiki/Terminal_pager) by default, you can scroll and search through it with common, keyboard-based search triggers. Here are the ones I use most often in the `less` utility:

- **`<spacebar>`**: Tap the space bar to jump to the next page of output.
- **`b`**: Go back a page.
- **`/<term>`**: Search the output for the provided term (`/password`). The next occurrence of the term will be bumped to the top of the terminal and highlighted.
- **`?<term>`**: Search the log output in reverse. This is useful when you're partway through the output, and want to find a term you may have already scrolled or searched past (`?password`).
- **`n`**: Find the next occurrence of the searched term. If searching with `/`, this will move forward in the output; with `?`, it moves backward.
- **`N`**: Find the previous occurrence of the searched term. It basically works the opposite of `n`.
- **`q`**: Quit out of the pager and return to your shell prompt.

## Navigating commits

If you write good commit messages, and [keep individual commits concise](http://johnkary.net/blog/git-add-p-the-most-powerful-git-feature-youre-not-using-yet/), you'll find that your commit history tells stories about your software. As you scroll from commit to commit, you can see how your code evolved to what it is today. This is one of my favorite things about writing software!

**And now my trick:** While viewing the log, to find the next commit, type `/^commit`, then use `n` and `N` to move to the next or previous commit. To search for the previous commit, use `?^commit`. The `^` between the search trigger and the term makes sure that the word `commit` starts at the beginning of the line, ignoring occurrences of the term in the commit messages themselves, or code, or stats output. No extra software required!

Simple, right? Did you find this useful, or do you have other tips to add? Please leave a comment below to let me know what you think, and thanks for reading.
