---
layout: post
title: "Notes from migrating from Minitest to RSpec, with help from GitHub Copilot"
excerpt: "Artificial intelligence hasn't replaced us yet, but how does it handle the boring parts of our jobs?"
tags: rspec artificial-intelligence
---

After some discussion, my team at work decided to port our newest Ruby on Rails application's test suite from the default Minitest to RSpec. I picked up the ticket not because I enjoy tedious work, but because I thought it'd be a good excuse to test generative AI's ability to do the boring parts for me. Here are some observations and takeaways from the task.

I used the [chat feature of GitHub Copilot] for this work since it's integrated into my editor (Visual Studio Code), making it easy to provide the AI most of the necessary context and to apply results directly to the code. I loaded each test file in the editor, then prompted Copilot to convert it to RSpec syntax for me. Even after some slight tweaking, the final, effective prompt was relatively simple:

```
Please convert this file from Minitest syntax to RSpec.
Note that we use fixtures for test data, not factories.
```

Without that bit of extra information, Copilot assumed that we were using FactoryBot. We are not.

Copilot hit roughly 90% accuracy on its first attempt. Errors were mostly incomplete responses, particularly on larger test files. In some cases, running the same prompt a second time fixed the issue; in others, I had to make small, manual corrections. (Though in some of these, I was still able to use Copilot's inline suggestions to help correct the problems.) And I was pleasantly surprised that it converted this Minitest-based approach I used to distinguish contexts:

```ruby
require "test_helper"

class ProductsControllerTest < ActionDispatch::IntegrationTest
  setup do
    # ...
  end

  class AuthenticatedUserTest < ProductsControllerTest
    setup do
      # ...
    end

    # ...
  end

  class UnauthenticatedUserTest < ProductsControllerTest
    # ...
  end
end
```

Into RSpec's built-in `describe`/`context` syntax:

```ruby
require "rails_helper"

RSpec.describe ProductsController, type: :controller do
  context "Authenticated User" do
    before do
      # ...
    end

    describe "GET #index" do
      # ...
    end

    describe "GET #show" do
      # ...
    end
  end

  context "Unauthenticated User" do
    describe "GET #index" do
      # ...
    end

    describe "GET #show" do
      # ...
    end
  end
end
```

That said, after the first pass, I noticed our test coverage dropped slightly—this was my first clue that Copilot had missed something. If you try this on your own code, make sure you've got test coverage reporting in place. And, ideally, only make changes to test code, not application code. Refactoring changes should be to one or the other, but not both.

I committed the work as a series of git fixups and squashes, and left the branch unsquashed for code review. I generally like this approach for breaking down complexity during the review process, but if I had it to do over again, I would have deleted each Minitest file in the same commit I added its RSpec replacement. Instead, I saved deleting all the old test files for a single commit toward the end. I think being able to see each file migration side-by-side would have made it easier for my reviewers to follow along with what was a relatively large overall change.

All in all, I spent about one hour reconfiguring the application to use RSpec to match our Minitest configuration, one hour total prompting Copilot to convert each file, and an hour on fixing issues and general cleanup. My rough guess is this would have taken at least twice as long if I'd taken a purely manual approach, and likely longer if I'd attempted to automate the conversion some other way.

I feel that it's important to note, this was an effective, efficient process because it's something I _could_ have done myself, but chose to delegate to AI. If I were unfamiliar with RSpec, I may have been more apt to blindly trust the output I got. Also, my team decided to make the change from Minitest to RSpec while our application is still relatively new. Trying this with a larger, more mature test suite would likely be more complicated, and maybe not even worth the effort.

That said, I was overall impressed with the results I got, and pleased with the process enough that I want to try it for similar tasks. Can I convert code from one CSS framework to another, for example? Or even move RSpec specs to Minitest? Experiments for another time.

[chat feature of GitHub Copilot]:https://docs.github.com/en/copilot/github-copilot-chat/about-github-copilot-chat
