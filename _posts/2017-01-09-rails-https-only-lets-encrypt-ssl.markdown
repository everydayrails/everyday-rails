---
layout: post
title: "Going HTTPS-only in Rails with Let's Encrypt"
excerpt: "Serving your Rails application over HTTP? Starting this month, your users may start receiving security warnings when visiting your site. Protect their safety and privacy quickly and easily with Let's Encrypt."
tags: security
---

This article isn't a tutorial, but rather a call to action to hopefully encourage developers serving Rails applications insecurely to make the move to HTTPS-only (with a few things to watch for when you do). If you don't, your users may soon begin receiving nasty warnings when visiting your site in Chrome.

This isn't just a concern for Rails developers--Google is pushing hard to **make the web a more secure place by encouraging the use of HTTPS instead of HTTP**. In that regard, [changes coming this month to Chrome](https://security.googleblog.com/2016/09/moving-towards-more-secure-web.html) will cause users to receive noisy warnings when forms collecting sensitive information like passwords or credit card numbers have any non-HTTPS content (including inline images, media embeds, CSS, and JavaScript). And eventually, sites not served over HTTPS will be marked as insecure!

![Let's Encrypt logo](/images/posts/letsencrypt-logo-horizontal.svg){: .decoration}

I finally got several sites on a personal server configured to serve over HTTPS-only using **[Let's Encrypt](https://letsencrypt.org)**. Let's Encrypt provides **basic, DV (domain validation) security certificates for free**. It's great for hobby projects and personal websites in particular, but works fine for any project on a budget.

My server has a small mix of static sites and a couple of small pet Rails projects. The Rails projects don't have traditional, web-based administration interfaces, so I didn't have the need to protect user input--they're read-only, from a web point of view. And if you've ever had to set up a security certificate before, you know it can be a tedious test of patience. So I let my laziness get the better of me.

This always bugged me, though. The sites and applications aren't heavily visited (mostly by me), but I should **do what I can to protect my users' online safety and privacy**, anyway. I must admit, though, that I dragged my feet on this for a long time. I assumed it wouldn't work on environments serving multiple Apache virtual hosts from the same server. I was wrong--Let's Encrypt works great for this type of setup!

I followed a tutorial provided by Digital Ocean to [set up multiple Apache virtual hosts with Let's Encrypt on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-set-up-let-s-encrypt-certificates-for-multiple-apache-virtual-hosts-on-ubuntu-14-04). It'll work outside of Digital Ocean, too--my server runs on  [Linode](https://www.linode.com/?r=d3a98e56fb377eb9f9b52455f069b0b6029908b9) (*n.b.*, affiliate link).

During the setup process for each certificate, I elected to **force all requests to redirect to HTTPS**, instead of serving up both HTTP and HTTPS. I have always worked with environments set up to handle encryption at the web server layer, and only serve HTTPS, so I tend not to worry about the [`force_ssl`](http://api.rubyonrails.org/classes/ActionController/ForceSSL/ClassMethods.html) method in Rails. If your application *does* use that method, then I'd imagine you've already got a certificate set up for it, anyway. If for some reason you need to continue serving content over both protocols, **double-check that inline images, embedded media, and CSS and JavaScript are served via HTTPS when used on an HTTPS page**, to keep Chrome happy and your users feeling safe and secure.

The process for each application took a couple of minutes to install the certificate and verify its status. Don't forget to take the suggested steps to **automate the renewal process**--Let's Encrypt certificates expire in 90 days, so you'll want a task set up to handle this for you.

At the moment, I don't use any provisioning tools to manage this server (but I know I should). There are **packages available for Chef, Puppet, and Ansible** in the places you'd normally look for such things, though. There's also a [Capistrano plugin](https://github.com/platanus/capistrano-lets-encrypt) I haven't tried, but may soon. Some people have had success configuring Heroku-hosted applications to use certificates from Let's Encrypt, too. If you have any experience using Let's Encrypt in these environments, please share in the comments below.

If you find Let's Encrypt useful, I encourage you to **[make a donation](https://letsencrypt.org/donate/) to support their work**. Keeping the web safe is an important task, and I'm glad they're making it easier for us developers to be secure.
