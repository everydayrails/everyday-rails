---
layout: post
title: "Simple, user-friendly cancel links for your Rails forms"
excerpt: "Let your users opt out of a form and return to the page they came from with this simple helper."
---

The default Rails view generator includes _back_ links on form-related view templates, so if users change their mind they can easily get out of the form and on to something else. However, these links are static. What do you do if you allow users to access the form from multiple views (say, an index and a show).

Here's a simple but effective solution I came up with: Instead of passing a static URL, I pass the HTTP referrer environment variable as the location. That way users are taken back to the page from which they opened the form to begin with. 

Here's how it works. Most of the code resides in the `application_helper.rb` file:

{% highlight ruby %}
  module ApplicationHelper
    include Rails.application.routes.url_helpers

    def cancel_link
      return link_to 'Cancel', request.env["HTTP_REFERER"], 
        :class => 'cancel', 
        :confirm => 'Are you sure? Any changes will be lost.'
    end
  end
{% endhighlight %}

You'll need to include `Rails.application.routes.url_helpers` in order to access `link_to` from a helper method. Then you add the helper method itself, which does nothing more than return a cancel link. Mine uses an old-style `:confirm` message; you can spruce it up with some less obtrusive if you'd like.

If I need a cancel link in a view, I just add

{% highlight erb %}
  <%= cancel_link %>
{% endhighlight %}

The result: a flexible, reusable cancel option that's much more user-friendly. Not bad for just a few lines of code.