---
layout: post
title: "3 Rails refactoring tools"
excerpt: "Refactoring a Rails project can be a daunting task for new developers. Here are three tools to help ease the pain."
---

Refactoring&mdash;the practice of making your working code better and more manageable through better design choices&mdash;is an important part of software development. It's core to test-driven and behavior-driven methods, but if you're not yet following the _red-green-recycle_ mantra in your development, you may have yet to experience refactoring in practice. There are [plenty of resources](http://www.refactoring.com/sources.html) on refactoring; today I want to share three tools to help you get started with this technique in your Ruby on Rails projects.

In addition to making your code more maintainable, refactoring is an excellent learning opportunity. You can read about good design principles, but seeing how code _you_ wrote breaks them&mdash;and then fixing your errors&mdash;can drive home these principles and make them second nature to you. It can (and should) also be a humbling experience. We can always improve on our craft as developers, and routine refactoring exercises can keep skills sharp (and egos in check).

While a suite of tests for your application is not _strictly_ a prerequisite to refactoring, it will make the task significantly easier. I throw this out there because I know most resources for learning Rails talk about testing, but don't cover it with the significance it's given in true TDD/BDD approaches. I can talk more about my philosophies of getting started with testing another time, but for now let me point out that if you don't have any tests for your application, be prepared for a lot of browser refreshing as you move forward with refactoring.

### metric_fu

The Swiss army knife of Rails refactoring is [metric_fu](http://metric-fu.rubyforge.org)/, a do-it-all (with shiny graphs) utility by Jake Scruggs. metric_fu includes a stable of Ruby and Rails metric reporting tools, all just a rake task away. metric_fu is relatively easy to install (walk through the steps on the project page linked above; a slightly dated [Railscasts tutorial](http://railscasts.com/episodes/166-metric-fu) is also available). Then, run the provided rake tasks to generate easy-to-read reports on issues on design issues within your code.

So, metric_fu is a powerful tool for refactoring your code. Its reports can also be pretty daunting, especially if (a) you're relatively new to Rails development, or (b) you've let a project go on a little too long without refactoring. With that in mind, I want to look a little closer at two of the tools used by metric_fu, and how they can be used independently to help clean up your project.

### Rails Best Practices

I think the best tool to start refactoring with is [Rails Best Practices](http://github.com/flyerhzm/rails_best_practices), a gem that checks your code for violations of&mdash;you guessed it&mdash;widely-accepted practices for good Rails code design. Rails Best Practice is command line-based, but it's easy to use and provides an easy-to-read list of potential problems with your code. The best thing is the tie-in with the [Rails Best Practices](http://rails-bestpractices.com)/ website and community, where you can get solid advice on _why_ you're getting warnings about your code, and how to go about cleanup.

### Reek

Once your Rails code makes the grade (or at least comes closer to it), install Kevin Rutherford's [Reek](http://github.com/kevinrutherford/reek). Reek looks for more Ruby-specific issues in your code. The [Reek project wiki](http://wiki.github.com/kevinrutherford/reek/code-smells) on GitHub is a great resource for explaining the "code smells" Reek finds in your application. Some of these might seem esoteric to new developers, but the sooner you become familiar with these good practices, the easier your refactoring tasks will be in the long run.

### Parting thoughts on metrics and refactoring

Keep in mind that tools like metric_fu, Rails Best Practices, and Reek are good, but not perfect. Their analyses may yield false alarms. As noted in the [ASCIIcasts version of the metric_fu tutorial](http://asciicasts.com/episodes/166-metric-fu), "they should all be used as an aid to help you find the areas of your code that might need some work not as an absolute instruction that you must refactor a part of your application." Use metrics as guides, and strive for perfect reports knowing that, in many cases, they're not attainable.

Start with a small project before going after larger ones for more manageable refactoring tasks. I also suggest going after the low-hanging fruit first (things like database indices and descriptive comments for methods are easy to add), then tackle more advanced issues as your Ruby and Rails chops develop. Above all, do make time for routine reviews of your code, because if you're doing things right you should be a better developer next week than you are today, and new knowledge drives refactoring and good practice more than anything.