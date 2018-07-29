---
layout: post
title: "Understanding REST and routes"
excerpt: "These four tutorials will get you up to speed quickly on the ins and outs of RESTful routing in Rails."
---

In conversations I have with folks who are working to improve their Rails chops, as well as in comments I've received in the short time I've been writing this blog, it seems that RESTful routing still causes some grief. With that in mind, I thought I'd provide a list of resources that may help anybody still scratching their heads over the contents of `routes.rb`, the output of `rake routes`, or view code that looks like `form_for([@item.parent,@item])`.

### RESTful Rails tutorial

As someone who never studied computer science or seriously use a framework prior to Rails, I'll admit that when REST and its effects on routing hit the scene with version 1.2 (and took center stage in version 2.0) I was confused. I fumbled around for a little while before finding the English translation of the <a href="http://www.b-simple.de/documents">RESTful Rails Tutorial</a> by Ralf Wirdemann and Thomas Baustert. After reading through this 38-page PDF, I got it. If you're looking for a primer on the concept of REST and the cool things it lets you do with routing, it's a good start.

Disclaimer: This tutorial is really old. I debated including it in this list, but for an explanation of REST, nested routes, and member routes, the narrative still works pretty well. Just note that some of the code doesn't apply in Rails 2.3 or Rails 3 (technically, most of it _will_ work with Rails 2.3, but some things have been refined), but I think overall it's still a good introduction to the concept.

You can <a href="http://www.b-simple.de/documents">download the RESTful Rails tutorial PDF</a> in English, German, and Spanish.

### Rails Routing from the Outside In

Next, read the more or less official guide to Rails Routing, _Rails Routing from the Outside In_. There are two versions that cover <a href="http://guides.rubyonrails.org/routing.html">routing in Rails 2.3</a> and <a href="http://guides.rails.info/routing.html">routing in Rails 3</a>. You might want to read them both, even if you're focusing on Rails 3 at this point&mdash;the 2.3 version provides some background knowledge that I think might be assumed for the Rails 3 version.

### Nested Resources Railscast

At this point you should have a decent handle on how routing in Rails works. This <a href="http://railscasts.com/episodes/139-nested-resources">Railscasts episode on nested routes</a> demonstrates a very important facet of routing. Nested routes let you do things like convert a URL from something like `/business/653?employee_id=4349` to something much cleaner like `/business/653/employee/4349`, while simplifying your views and controllers in the process. This episode also covers another useful feature called _shallow_ routes, which would add `/employee/4349` to the mix for actions that don't require a `business_id` to them (e.g., `:show`, `:edit`, `:destroy`).

### Routing in Rails 3 Railscast

To wrap things up, let's look at a more recent episode of Railscasts that focuses on  <a href="http://railscasts.com/episodes/203-routing-in-rails-3">the changes to routing in Rails 3</a> (also available <a href="http://asciicasts.com/episodes/203-routing-in-rails-3">in ASCIIcast format</a>). Things are different, both above and below the surface, but not so much that you'll get confused if you need to work day-to-day with Rails 2.3.x and tinker with Rails 3 at night. 