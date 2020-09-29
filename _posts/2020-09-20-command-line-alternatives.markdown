---
layout: post
title: "Modern command line alternatives"
excerpt: "As Ruby developers, we spend much of our programming time in terminal emulators, at a command line. Here are some of my favorite alternatives to traditional command line tools, and how I've got them configured to my personal taste."
---

We're living in a golden age of command line tools, thanks in part to modern, accessible system programming languages like Go and Rust, making it much simpler to write applications that run super-fast on just about any developer workstation. And packaging utilities like Homebrew generally make distribution and compilation of these apps a snap.

As Ruby developers, we spend much of our programming time in terminal emulators, at a command line. Beyond commands like `ruby`, `rails`, or `rspec`, we navigate directories, search through files, manage version control, and more. And while tried-and-true tools like `ls` and `cat` have been included on computers for decades, in this golden age, we're not limited to them!

Here are some of my favorite alternatives to traditional command line tools, and how I've got them configured to my personal taste. I use them every day, and not just in my Ruby work. Unless otherwise noted, I installed all of these on my Mac workstations with Homebrew. Consult each project's documentation for your operating system and/or preferred method of software installation.

## Prompt customization (Starship)

After years of setting up my prompt through a series of control sequences and the venerable-but-outdated vcprompt utility, I switched to [Starship] a few months ago. Now, my prompt is informative, configured via a simple, TOML-formatted settings file, and is lightning-fast. I use bash, but Starship supports all the hip shells.

To make the most of Starship, I recommend choosing a [Nerd Font] for your terminal. Nerd fonts are developer-friendly to begin with--for example, if ligatures are your thing, many of them have you covered. But they're also augmented with robust icons like the ones you may have used when designing user interfaces--meaning you can integrate graphics into your prompt, without resorting to emoji. My terminal currently sports Meslo Nerd Font--you can preview it and tons of other fonts on [ProgrammingFonts.org].

During your visit to the Nerd Fonts site, make note of the [Nerd Fonts cheat sheet], which can assist in finding cool glyphs to interpolate into your custom prompt. Search by text (for example, _ruby_), and hover over your favorite and click _icon_ to copy it to your clipboard. Not all nerd fonts support all icons, but I've had pretty good luck so far.

By default, Starship adds a lot of detail to your command line prompt--and if that's what you like, great! It didn't take me long to find I preferred a more terse prompt, though, and on a single line. Over a couple of days, I gradually pared down my prompt to be relatively simple, showing

- A truncated path to the current working directory
- The version control branch name, if applicable, with a Git branch glyph
- A visual indicator that background processes are running in the current terminal

I dropped support for individual languages, since I don't find myself constantly wondering what version of Ruby (or JavaScript, or Python, or whatever) I'm working with at the moment. Before I dropped them, I also found that using emoji as a visual indicator was kind of distracting, and used the Nerd Fonts cheat sheet to find suitable glyphs for each.

I've posted my current [Starship configuration] as a gist. Keep in mind that certain symbols from Nerd fonts may not display properly in your browser, but will render correctly in a terminal or editor with a supporting font enabled.

[Starship]:https://starship.rs
[Nerd Font]:https://www.nerdfonts.com
[ProgrammingFonts.org]:https://www.programmingfonts.org
[Nerd Fonts cheat sheet]:https://www.nerdfonts.com/cheat-sheet
[Starship configuration]:https://gist.github.com/ruralocity/f910550b6419883f00e41850c7f712ce


## Directory listing (exa)

I really like [exa] as an alternative to `ls`. In fact, it might be what kicked off my interest in modernizing my terminal to the degree that I have. Exa is colorful, fast, Git-aware, and super-configurable. I've aliased `ls` and `la` in bash to show files in a human-readable format (`la` includes hidden files:

```shell
alias ls="exa -lhgbH --git"
alias la="exa -lahgbH --git"
```

Unfortunately, it looks like exa's maintenance status is unclear as I write this, with issues and pull requests piling up unanswered on GitHub. It still works just fine for almost all of my daily use, though I've seen errors with some features, like the `--tree` flag. I haven't found any suitable replacements, but am keeping my eyes open--though my preference would be for someone to take over maintenance of the project, because it's a really nice tool.

[exa]:https://the.exa.website


## Viewing text files (bat)

Unlike the strictly utilitarian `cat`, [bat] provides a ton of features--but I'm mainly interested in its colorful syntax highlighting, line numbering, paged output, and `cat`-like behavior when piped into other command line tools. I've aliased `cat` to use `bat`, but my muscle memory tends to default to `less` until I notice how much nicer a file would look in full color. Peruse bat's README for the many ways it integrates with other command line utilities, and note a potential naming conflict if installing on Ubuntu.

[bat]:https://github.com/sharkdp/bat


## Viewing commit and file differences (diff-so-fancy and icdiff)

You may have sensed a theme so far: I like color in my terminal! I use terminal Git pretty much exclusively, and this includes viewing commits and diffs across branches via the command line. I've been using [diff-so-fancy] instead of `diff` for a few years now. I like its simple, clean output, especially as applied to Git. In my `.gitconfig`, I have diff-so-fancy configured like

```
[pager]
  diff = diff-so-fancy | less --tabs=1,5 -RFX
  show = diff-so-fancy | less --tabs=1,5 -RFX
  log = diff-so-fancy | less --tabs=1,5 -RFX
```

For viewing differences outside of Git, I have the `diff` command aliased to use the alternative [icdiff], which provides both color and a side-by-side comparison I find easier to follow.

[diff-so-fancy]:https://github.com/so-fancy/diff-so-fancy
[icdiff]:https://github.com/jeffkaufman/icdiff


## Searching through files (ripgrep)

I love ripgrep, or `rg`, as a replacement to the likes of `grep`. It's super-fast and aware of your `.gitignore` (so it won't dig into a project's `node_modules` folder, for example, if you don't want it to). Its output is really easy to read. And have I mentioned the speed?

I often use `rg` to quickly search all of a Ruby project's dependencies, [with the help of Bundler].

[ripgrep]:https://github.com/BurntSushi/ripgrep
[with the help of Bundler]:https://everydayrails.com/2018/06/11/bundler-shortcuts.html


## HTTP requests (HTTPie)

Curl is an amazing piece of software, but with so many options, I usually have to refer to its documentation every time I need to do something with it. That's why I like [HTTPie] for making HTTP requests via a command line client--it's got a very simple interface, yet still handles most use cases I throw at it. It's got great support for JSON out of the box, automatic output formatting and syntax highlighting, and (as I just learned) a plugin architecture to make specific authentication mechanisms easy, and non-HTTP protocols possible.

For processing JSON responses I get back via HTTPie, I find [jq] to be super-useful, though I admittedly don't use it frequently enough to keep its interface in my head. Luckily, following the brief [jq tutorial] is almost always enough to get me what I need.

[HTTPie]:https://httpie.org
[jq]:https://stedolan.github.io/jq/
[jq tutorial]:https://stedolan.github.io/jq/tutorial/


## Documentation (tldr)

Confession time: When [tldr] first came across my radar, I misread it and thought I'd be responsible for maintaining my own set of approachable documentation files for command line utilities. Then I realized that's not the case! tldr's contents are maintained by the community, and a nice, simple alternative to `man` when you just need to remember the typical use cases. Almost all of the utilities I've mentioned here are represented in tldr--and if any of your favorites are missing, you can contribute via a pull request.

[tldr]:https://github.com/tldr-pages/tldr


## Summary

These are my favorite modern command line alternatives today, though I always enjoy finding new ones through my [favorite programming newsletters]. I hope you've found this information helpful, and use it to customize your own command line environment for more productivity, beauty, and fun. Thanks for reading!

[favorite programming newsletters]:/2020/05/25/newsletters-for-rails-developers.html
