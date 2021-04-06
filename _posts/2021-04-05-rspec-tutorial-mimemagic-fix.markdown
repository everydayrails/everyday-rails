---
layout: post
title: "Working around the mimemagic issue in my RSpec testing book"
excerpt: "The book's sample source no longer installs due to a dependency change. Here's how to fix it."
tags: rspec-book
---

As you may have heard, the Rails community has a brief moment of panic and drama a few weeks ago, when the _mimemagic_ gem’s version number was bumped while addressing a licensing concern. Previous versions of the gem with an incorrect license were yanked and no longer downloadable.

This change affected thousands of Rails applications—even tiny ones like the sample source for my introductory book about Rails testing, _[Everyday Rails Testing with RSpec](https://leanpub.com/everydayrailsrspec)_. The subject matter of the book itself doesn’t depend on mimemagic, but I used the Paperclip gem to add file upload support in order to demonstrate how to test such functionality--and Paperclip (at least the version I used) depends on mimemagic.

Due to the structure of the book’s sample code, I do not plan on updating it at this time to address the version change. Each chapter builds upon the previous one. In the sample code, this is handled by a long-running git branch for each chapter. Making a change to the core application requires a change to the first chapter’s branch; then, I merge the changes on up through each subsequent branch. Since many chapters’ branches make changes to the project’s _Gemfile_ and _Gemfile.lock_, this approach is prone to error. And I would rather spend my time thinking about what a version of the tutorial might look like for a more modern version of Rails.


## Working around the problem

Junichi Ito, who leads the team responsible for the Japanese translation of the book, has [reported a workaround](https://images-na.ssl-images-amazon.com/images/I/51LfqgkrQRL._SX382_BO1,204,203,200_.jpg): Instead of running `bundle install` to set up the initial application, run `bundle update mimemagic` instead. This will pull down a version of mimemagic with its updated license, so you can complete the exercises in the book.

Thank you very much to Junichi for his diligence on this matter, and sharing the solution. I apologize for the confusion and frustration	this no doubt caused many of you, and appreciate your support.
