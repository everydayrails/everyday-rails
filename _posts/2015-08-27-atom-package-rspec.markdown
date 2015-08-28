---
layout: post
title: "Using RSpec in Atom"
excerpt: "I love how extensible GitHub's Atom editor is. Here are some useful packages for using it to edit and run RSpec tests."
image: "/images/posts/atom-header.jpg"
---

I've been using [Atom](http://atom.io) as my primary code editor since June. My favorite feature is how easy it is to customize the editing environment with tools we know as web developers, then share those customizations with others through Atom's packages system. My first contribution to the Atom ecosystem is [atom-everydayrails-rspec](https://atom.io/packages/atom-everydayrails-rspec), a collection of snippets for writing RSpec tests--specifically, some shortcuts for spec organization, Capybara, expectations, and some Factory Girl. If you've read [my book on Rails testing](https://leanpub.com/everydayrailsrspec), these should all look familiar.

The package is intentionally light on features. I've been adding snippets as I've needed them--so if a snippet is missing, it may just be that I haven't written a spec lately that needed it. I also still prefer to run specs in a terminal window, though there are other Atom packages for those who'd prefer to stay inside the editor.

If you check it out, please let me know what you think. If you've got an idea for a snippet, pull requests are welcome!

## Other RSpec packages for Atom

If you *are* interested in running your specs from inside Atom, I suggest checking out Felipe Coury's [atom-rspec](https://atom.io/packages/rspec) package. It's a simple runner that lets you choose from running all specs in a file, only the spec at the editor's current line, or your entire suite.

Finally, there's [language-rspec](https://atom.io/packages/language-rspec), a port of TextMate's extensive RSpec plugin, and [capybara-snippets](https://atom.io/packages/capybara-snippets), which at present has some snippets that the Everyday Rails package is missing.

What are your favorite Atom packages and hacks? Please share by adding a comment.

*Photo: Cropped version of [cyclotron by Robert Couse-Baker](https://www.flickr.com/photos/29233640@N07/6781174568/).*