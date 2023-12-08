---
layout: post
title: "Write resilient tests with matchers that take other matchers"
excerpt: "Here's a short, neat trick to help save time when updating RSpec specs to reflect new test data."
tags: rspec
---

I recently needed to update some old RSpec tests that use VCR fixtures in a Rails application. [VCR] is a wonderful tool for recording transactions with external HTTP services. It can help make your tests faster by bypassing the potential slowness and flakiness of external services on every run. Instead, it saves a fixture of the HTTP transaction(s) made when the test is run, then uses that fixture for future runs of the test.

But over time, there's risk in the fixtures getting stale. The best way I've found to check for fixture staleness is to delete the fixture (a "cassette" in VCR parlance) and re-record.

Anyway, my test covered a method that hits an external API (called _widgets_ in this example loosely adapted from the actual code). The original version tested the result against hard-coded strings and integers.

```ruby
require "rails_helper"

describe "WidgetAPI" do
  describe ".all" do
    it "returns a collection of widgets", vcr: true do
      widgets = WidgetsAPI.all

      expect(widgets.length).to eq 2

	  expect(widgets.first).to have_attributes(
        name: "Embossing Widget",
        id: 1,
        description: "Description of embossing wiedget",
        widget_identifier: "abc-de-fghi"
      )

      expect(widgets.second).to have_attributes(
        name: "Engraving Widget",
        id: 2,
        description: "Description of engraving widget",
        widget_identifier: "jkl-mn-opqr"
      )
    end
  end
end
```

Due to a lower level change in the code, I needed to replace this fixture but found the initial widget data had changed upstream--updated names and descriptions, and additional widgets returned by the API. Of course, this meant that pretty much everything my test expected was obsolete and wrong. I could have fixed this by just updating the test itself to expect the newer values, but that approach isn't compatible with the good practice of replacing cassette fixtures on a regular basis.

Instead, I reached for RSpec's `be_a` matcher. For my needs, I just need to know that a returned value is a string (or integer, or whatever), not its actual value. Since I was already using the `have_attributes` matcher in the original test, and `have_attributes` accepts other matchers, I could rewrite the test to be simpler and more resilient.

The new test is a little more abstract. But it's far more tolerant to changes in the data being returned, such as the widget names and total count like I referenced earlier. And being RSpec, it's still very readable:

```ruby
require "rails_helper"

describe "WidgetsAPI" do
  describe ".all" do
    it "returns a collection of widgets", vcr: true do
      widgets = WidgetsAPI.all

      expect(widgets.length).to be > 1

      expect(widgets.first).to have_attributes(
        name: be_a(String),
        id: be_a(Integer),
        description: be_a(String),
        widget_identifier: be_a(String)
      )
    end
  end
end
```

I love that RSpec's maintainers put thought into issues like this, and continue to build tools that make tests simple, yet sustainable over time! Take a look at your tests and see if you can find places to make them more robust. My example uses `have_attributes` and `be_a`, but try it with `include`, `all`, and `match`, too. This likely won't work for every scenario, but if the tradeoff of less exact matches in return lower test code churn is one you're open to making, give it a try!


_Gentaro "hibariya" Terada also wrote about [Matchers That Can Take Other Matchers] in RSpec._

[VCR]:https://github.com/vcr/vcr
[Matchers That Can Take Other Matchers]:https://rip.hibariya.org/post/rspec-matchers-take-matchers/
