---
layout: post
title: "Application templates in Rails 3"
excerpt: "Here are some thoughts on bootstrapping Rails 3 apps with customized templates."
---

Rails 3 has been out for a few months now, and one of the many changes was an update to the API for generators and templates. If you're not familiar, you'll now use the [Thor](https://github.com/wycats/thor) utility for these purposes, and overall the process is much more modular and customizable. Here's how to get started.

Why would you want to use an application template, given how customizable and modular Rails 3 is? Exactly for those reasons&mdash;once you've figured out how you like to set up your apps, you can set them up the same way every time via a template.

I actually got started by learning how to create generators in Rails 3 (used to create custom code in an existing Rails application), then extended that to Rails templates (used to create new Rails applications, pre-baked with my favorite gem installations and other tweaks). The best resources I've found to date are Railscasts episodes on [how generators work in Rails 3](http://railscasts.com/episodes/216-generators-in-rails-3) and [creating your own generators in Rails 3](http://railscasts.com/episodes/218-making-generators-in-rails-3), followed by [Thor's documentation](http://rdoc.info/github/wycats/thor) and [the Rails guide on generators and templates](http://guides.rubyonrails.org/generators.html#application-templates).

If you want to, you can make your templates [highly modular](http://blog.madebydna.com/all/code/2010/10/11/cooking-up-a-custom-rails3-template.html) and useful for specifying gem installations from app to app. However, depending on your needs, that may be overkill. For my purposes, a single configuration has done everything I need. I'm able to quickly get an app up and running, do whatever experimentation I need to do in it, and move from there.

For the record, here's what I'm using at the moment. Feel free to get ideas from it, or even use it as is&mdash;but I really think you'll get more out of it if you customize it to your own preferences. Keep in mind, also, that as the tools available to me as a Rails developer change over time, my template will change. And that's OK.

{% highlight ruby %}
# create rvmrc file
create_file ".rvmrc", "rvm gemset use #{app_name}"

gem "haml-rails"
gem "sass"
# hpricot and ruby_parser required by haml
gem "hpricot", :group => :development
gem "ruby_parser", :group => :development
gem "nifty-generators"
gem "simple_form"
gem "jquery-rails"

# authentication and authorization
gem "devise"
gem "cancan"

# rspec, factory girl, webrat, autotest for testing
gem "rails3-generators", :group => [ :development ]
gem "rspec-rails", :group => [ :development, :test ]
gem "factory_girl_rails", :group => [ :development, :test ]
gem "webrat", :group => :test
gem "ffaker", :group => :test
gem "autotest", :group => :test

run 'bundle install'

rake "db:create", :env => 'development'
rake "db:create", :env => 'test'

generate 'nifty:layout --haml'
remove_file 'app/views/layouts/application.html.erb' # use nifty layout instead
generate 'simple_form:install'
generate 'nifty:config'
remove_file 'public/javascripts/rails.js' # jquery-rails replaces this
generate 'jquery:install --ui'
generate 'rspec:install'
inject_into_file 'spec/spec_helper.rb', "\nrequire 'factory_girl'", :after => "require 'rspec/rails'"
inject_into_file 'config/application.rb', :after => "config.filter_parameters += [:password]" do
  <<-eos
    
    # Customize generators
    config.generators do |g|
      g.stylesheets false
      g.form_builder :simple_form
      g.fixture_replacement :factory_girl, :dir => 'spec/factories'
    end
  eos
end
run "echo '--format documentation' >> .rspec"

# authentication and authorization setup
generate "devise:install"
generate "devise User"
generate "devise:views"
rake "db:migrate"
generate "cancan:ability"

# clean up rails defaults
remove_file 'public/index.html'
remove_file 'rm public/images/rails.png'
run 'cp config/database.yml config/database.example'
run "echo 'config/database.yml' >> .gitignore"

# commit to git
git :init
git :add => "."
git :commit => "-a -m 'create initial application'"

say <<-eos
  ============================================================================
  Your new Rails application is ready to go.
  
  Don't forget to scroll up for important messages from installed generators.
eos
{% endhighlight %}