---
layout: post
title: "Notes on pair programming with Aider when Python isn't readily available"
excerpt: "Here's how I'm using Aider as an AI pair programming buddy in dev containers, without dealing with Python"
tags: artificial-intelligence developer-experience
---

I'm getting good returns lately from [Aider](https://aider.chat), an open source, terminal-based AI pair programming utility. Consider it an alternative to GitHub Copilot Chat.

## Wait, what's Aider?

Aider builds a map of your application's git repository, then uses that map to reference code and context within the overall codebase when making suggestions. It can also add and edit files (with your permission), removing the copy-paste tedium of other chat-based AI coding tools. I've mainly used Aider to date for small feature creation and test augmentation, and have found it far more reliable than Copilot. (I've tested with GPT-4o and Claude 3.5 Sonnet; it also works with some free and local models.) Finally, I appreciate that it notes how much each response costs in terms of tokens and money, so I can stay mindful of spending.

## Setting up Aider (without Python, sort of)

Aider is a Python application, and can be installed via `pip` as is usual for Python-based tools. But since I tend to use development containers, there's a decent chance I won't have Python available in my environment—especially when working in Ruby. I've always bristled at Python's package installation tooling. Luckily, the Python ecosystem has gone through a recent package and version management renaissance, with the Rust-based [uv](https://docs.astral.sh/uv/) emerging as a strong candidate. Aider's maintainers have taken advantage of uv to make Aider installation a one-line process:

```shell
curl -LsSf https://aider.chat/install.sh | sh
```

Once Aider's installed, add your API key (I keep it in a git-ignored `.env` file), then launch `aider` from within the container to get going!

Of course, if you're working in an environment with Python 3.8 or newer, you _can_ use traditional Python tooling to install Aider. It's also available via package managers like Homebrew. But I'd still suggest using uv to install it, either from the one-liner above or by breaking up uv and Aider installation (as I did before realizing the one-line option existed):

```shell
# First, install uv ...
curl -LsSf https://astral.sh/uv/install.sh | sh
# Then use it to install Aider ...
uv tool install aider-install
aider-install
```

If Aider fails to update files, you may need to [configure git to treat your working directory as safe](https://stackoverflow.com/a/75666957). From inside the container, run:

```shell
git config --global --add safe.directory /path/to/your/directory
```

I plan to write more soon about how I'm using Aider for Rails specifically, but wanted to get this out for anyone who might find it useful in the meantime.
