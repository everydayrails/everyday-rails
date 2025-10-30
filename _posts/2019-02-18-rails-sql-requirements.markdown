---
layout: post
title: "7 reasons why learning SQL is still important for Rails developers"
excerpt: "Active Record abstracts away much of the need to use SQL on a daily basis. But understanding what's going on behind the scenes is still important. Here's how understanding SQL can make you a better Rails developer."
tags: learning
---

I remember when I first learned SQL, back when I was writing Perl CGI scripts in a cave with my dinosaur friends. It was magical; a transformative step in my career as a software engineer. Without that initial understanding how to break business concepts down into discrete tables, then link and search across those tables with plain English (well, sort of) syntax, I wouldn't be where I am today.

Back then, my dinosaur coworkers and I had to programatically build out each `INSERT`, `UPDATE`, and `SELECT` ourselves. We didn't use an object relational mapper then (they may have existed; they just weren't on my team's radar). A lot of times, building out SQL queries was tedious and prone to error. So imagine my delight when I first picked up Rails and began replacing raw SQL with elegant Ruby code that performed the same database actions.

Today, a good 14 years after creating my first Rails app, I seldom have to write my own SQL. Active Record takes care of the tedium for me. It helps protect me from silly errors and security vulnerabilities, when used correctly. And, to be honest, my immediate recall of SQL has faded to the degree that I have to dust off some cobwebs and think a little harder for a moment about how to perform a task on those occasions Active Record _isn't_ an option.

I recently got to thinking, with Active Record as robust as it is today, how important is it for a Rails developer to know _any_ SQL?

While it's safe to say you can build an incredibly useful application with no knowledge of the language it's using to communicate with the underlying database, and leaning on Active Record is almost always preferable to handcrafted SQL in the context of a Rails application, having some degree of understanding of SQL comes in useful in at least seven scenarios.

## Craft better queries with Active Record

What happens when you want to include data from a separate table in your query? If you know SQL, then you know that this is a job for a `JOIN`. Active Record conveniently includes a `joins` method to accomplish this, too, but if you don't know the lingo, or the concept behind it, you may find yourself searching blindly for an answer.

## Perform queries that Active Record can't do

Active Record abstracts away a lot of SQL, but not all of it. For example, you couldn't do a `LEFT OUTER JOIN` using Active Record alone until Rails 5 was released. If your app is still on an older version, or you need to use a SQL function unique to your database vendor, then you'll need to write the SQL query by hand.

This comes with a downside: Part of the magic behind Active Record is the layer of abstraction it applies across multiple database vendors. Writing raw SQL in place of it can make your code less portable, meaning that if you ever choose to switch from one database engine to another, you may need to rewrite that query. Make sure you've got solid test coverage in place when taking this approach.

That said, I can only think of a couple of times when I've had to switch an application's database engine. So don't panic if you've got to write SQL by hand because Active Record doesn't support the query you need to perform directly.

## Perform ad-hoc queries

Your app may have a robust administrative dashboard with beautiful reports presented in a slick user interface--but what do you do when asked about some bit of data that's _not_ immediately available through the UI? Depending on your production setup, your only immediate access to the data may be through a database console. Knowing your way around the database through SQL alone can help answer such one-off questions promptly.

## Improve application performance

Behind the scenes, Active Record has to perform a few extra steps to convert a query from a chain of Ruby methods to a SQL command to pass along to the database engine. Usually, it's fast enough. On occasion, though, it's not. In these cases, understanding how to compose a SQL query that gets the information you need quickly and accurately is critical.

The same caveat about database vendor lock-in applies here. If you use performance tricks available only to your current database vendor, you'll need to rewrite the query if you switch engines.

## Understand legacy code

Active Record gains new features with each release of Rails. If your application has been around for awhile, you may run into queries that couldn't be performed by Active Record at the time, and thus are written by hand. With some understanding of SQL, you can understand what earlier developers needed to accomplish with the code and query in question. You can alter the query with confidence, and maybe even port it to a modern version of Active Record.

Of the reasons I've listed here, this is the one I run into most often in the codebases I work in. Raw SQL really stands out when juxtaposed against pretty Ruby code, but I know past developers didn't sneak it in there without reason. And sometimes, I'm able to rewrite the query using Active Record tools that weren't available to those past developers, and minimize context shifting for future developers.

## Work outside of Rails

I've worked professionally with Ruby, Perl, Python, PHP, ASP, JavaScript, and probably a few other languages I'm forgetting, to develop backends for web applications. In all those scenarios, a SQL-based database was the constant. If you ever find yourself working with a different language or framework than Ruby on Rails, the techniques for connecting from the framework to the database may look radically different--but under the hood, there's a good chance it'll still be SQL. And understanding the fundamentals will help you pick up what's unique about said framework's approach to database interactivity.

## Prepare for job interviews

This last one's maybe a little sassy, and definitely unsubstantiated--but it's also what got me thinking about the benefits of knowing SQL enough to write this article. As robust as Active Record is, job descriptions still often list (strong) understanding of SQL as a requirement. If you walked into an interview tomorrow morning, would you be able to demonstrate such understanding?

Now, I don't agree with the practice of grilling already nervous candidates questions about skills and concepts they'll seldom encounter on the job, but not everyone agrees with me on that. And as I've hopefully convinced you by now, there are plenty of other, legitimate reasons to keep some understanding of SQL in your back pocket, because you never know when it's going to be useful.
