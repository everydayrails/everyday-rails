---
layout: post
title: "Simple data transfer with YamlDB"
excerpt: "Ever need to transfer data from one database to another? Here's a solution that worked for me."
tags: data-migration
---

I've got a very small side project going. So far, it's only been for my benefit--but last night I decided I'd like to go ahead and deploy it at some point soon, so I'd need to switch out the simple SQLite database with something more robust. I also had test data I wanted to migrate over, though. What was the simplest way to get data out of my preliminary SQLite database and into something I could eventually move up to my production server?

Luckily, I'm not the first Ruby developer to run into this problem. And, there's already a nice Ruby library to handle this use case. Within a few minutes, I'd found [YamlDB](https://github.com/yamldb/yaml_db), exported my initial dataset, and restored it into a new database.

I'd write up the process, but to be honest, there's not much to write. The YamlDB README pretty much covers the whole procedure. In my case:

1. I added `yaml_db` to my Gemfile.
2. I ran the `db:data:dump` Rake task.
3. I replaced `sqlite3` with my production database adapter (in this case, `mysql2`), and updated my *database.yml* file as needed.
4. I ran `rake db:create` to create my new development database.
5. I ran `rake db:migrate` to build out my new database and update the schema for a different ORM.
6. I ran the `db:data:load` Rake task to copy the exported data into the new database.
7. I removed `yaml_db` from my Gemfile, ran `bundle check` to clean up *Gemfile.lock*, and committed the changes (omitting the *data.yml* file created by the process).

The whole process took less than five minutes. Now, this project is admittedly simple, with just a few data models and a couple thousand records at this point. I'll try it again in the future when I need to migrate a larger dataset, but in the meantime I was pleased enough with my initial results that I wanted to pass it along.
