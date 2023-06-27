---
layout: post
title: "Test-driven development in the age of artificial intelligence"
excerpt: "How ChatGPT, GitHub Copilot, and TDD made me a professional Go programmer in less than an hour. Kind of."
tags: artificial-intelligence tdd
---

A couple of weeks ago, I picked up a non-Ruby ticket at work. Since I’m not super-familiar with Go or its tooling, I decided to lean on generative artificial intelligence tooling to see if I could at least cobble together a draft pull request for someone who _is_ more familiar to review. At the same time, I didn’t want to abandon one of my favorite tools as a software engineer--test-driven development.

At its core, the requested change was to a string concatenation step in an ETL function. (The code itself isn’t that important for the sake of this article, so I won't include it.) At a high level, my plan was to

- extract some code from an existing, reasonably well-tested function
- move it into a new function
- rely heavily on unit testing to cover multiple conditions and meet the ticket's requirements

## The process

After learning the general lay of the land from an engineer more familiar with the code itself, I cracked open Visual Studio Code and located where I generally thought a new test should go. Using the application's existing test coverage as a guide, I made some reasonable guesses about how to set up test data and perform assertions on it. (Along the way, I also learned some nuances about Go’s test runner; I’ll talk about this more in a bit.)

Following the steps of TDD (and more importantly, test-first design), I wrote my first failing test myself, rather than outsourcing to AI right away. This was intentional! I wanted to test my understanding to this point, before blindly trusting robots to write all my code. I then wrote _just enough_ code to make my new test pass:

- My new function didn’t exist yet, so I created it
- My new function didn’t return anything yet, so I made it return just the expected output--a simple string

Seeing that I'd wired up my code and its corresponding test properly (if not yet fully functional), I committed my work-in-progress. Then I turned to Open AI’s [ChatGPT] for a primer on string concatenation in Go. Rather than asking ChatGPT to, you know, just write the code for me, I asked it to bring me up to speed so I could hopefully have a semi-informed conversation with it about the process.

By asking, “how do I concatenate strings in Go?” I learned a couple of things:

- There’s more than one way to do it
- The code base I was working in used multiple concatenation techniques, so I could experiment with what would ultimately be the right approach for the task at hand

I really like using ChatGPT like this, as a condensed explanation of a concept that I understand generally (like, in programming, it’s common to have to concatenate strings), but am missing some specifics (like, how to do this in a language I haven’t used much). It’s very direct. I also appreciate that I can refine my question based on the initial output, just as I would in a real conversation with a real human, and quickly get a response. Is it accurate? That’s likely going to vary depending on your question--especially when it comes to programming. But for now, it kept me moving forward.

After committing my second batch of work-in-progress, I turned back to my test file to add a condition. This time, though, I leaned on [GitHub Copilot] to fill in some details. To be honest, I used Copilot less as "intelligence" and more as a glorified autocomplete utility. In this case, though, that's exactly what I needed; One by one, I rounded out my test with four additional, albeit simple, conditions. While the tests were short and sweet, though, they pointed me to missing functionality in my code. Of course, since I was practicing test-driven development, this was by design!

Since my admittedly basic solution for string concatenation wasn't adequate for all the cases covered in my tests, I returned to ChatGPT for another tutorial. This time, I asked how to not only combine strings, but also apply some light processing to them--for example, removing redundant blank spaces before returning the final, single string. This took a little trial in error, in part because this turned out to be more complicated in Go than I'd hoped it would be. Eventually, though, I finessed ChatGPT's suggestions into something that did the job and conformed to Go convention (while also keeping my Ruby sensibilities reasonably content).

Forty minutes or so after spinning up my development environment, I had a pull request ready to go. My code had full test coverage, passed style guides, and met all the requirements of the ticket. A human looked over my changes, signed off on them, and my new code was off to production soon after.

## The takeaways

As I mentioned, I got a lot of utility out of asking ChatGPT to summarize knowledge into succinct information. Current consumer-grade AI feels to me like a modern, more user-friendly user interface for the world's knowledge than, say, a traditional search bar. The overall experience felt like pairing with an earnest, if not necessarily experienced, developer who has all the answers, even if they're not the right ones.

I had fun trying out an unfamiliar language and ecosystem, and my AI and test-driven approach felt much more productive and pleasant than reading manuals or following tutorials. Am I a Go expert? Hardly! But I did deliver production code in a reasonably speedy fashion. By writing tests first, I was able to explore Go in small chunks, and build my understanding of it incrementally.

I'm always a fan of exploring new languages and frameworks. Even if at the end of the day you return to your favorites, chances are good that you'll find new ideas, new tricks, and new ways of solving problems back home with you. And speaking of going back home, my exploration of Go made me appreciate Ruby's syntax and tooling even more! I know that Go has plenty of fans, and adheres to very different conventions; it's just not really my thing. I still love Ruby, Rails, and the attention we put on testing as a community! But I'll happily pick up another unfamiliar ticket at work with my AI pairing buddies.

[ChatGPT]:https://openai.com/chatgpt
[GitHub Copilot]:https://github.com/features/copilot
