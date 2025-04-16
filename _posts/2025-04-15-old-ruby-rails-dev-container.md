---
layout: post
title: "Old Ruby and Rails on new hardware with dev containers"
excerpt: "How do you get an ancient Rails application running on newer hardware? Dev containers to the rescue!"
tags: developer-experience legacy docker
---

Need to work on an older Ruby or Rails application on newer hardware? Here's how I got Ruby 2.1 ([end of life: 2017](https://endoflife.date/ruby)) and Rails 4.0 running in a Visual Studio Code dev container on my Apple Silicon Mac, so I can actually start updating the app.

The hang-ups were installing an older OpenSSL on a newer Ubuntu image, making sure it would install in an ARM Linux container, and working around some `rvm` permissions jankiness. I'm guessing you can tweak it for other Ruby versions supported by `rvm`. Works on my machine; works for at least one of my coworkers, too.

Here's the `.devcontainer/Dockerfile` I eventually landed on. Maybe room for improvement, but my goal was to get this old application running quickly:

```Dockerfile
FROM mcr.microsoft.com/devcontainers/base:jammy

# Install basic requirements
RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    build-essential \
    procps \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install RVM
RUN gpg2 --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB \
    && curl -sSL https://get.rvm.io | bash -s stable

# Create directory for SSL packages
RUN mkdir -p /tmp/libssl

# Download SSL packages
WORKDIR /tmp/libssl
RUN curl -sSLO http://ports.ubuntu.com/ubuntu-ports/pool/main/o/openssl1.0/libssl1.0.0_1.0.2n-1ubuntu5.13_arm64.deb \
    && curl -sSLO http://ports.ubuntu.com/ubuntu-ports/pool/main/o/openssl1.0/libssl1.0-dev_1.0.2n-1ubuntu5.13_arm64.deb

# Remove conflicting packages
RUN apt-get remove -y libcurl4-openssl-dev libssl-dev || true

# Install SSL packages
RUN dpkg -i /tmp/libssl/libssl1.0.0_1.0.2n-1ubuntu5.13_arm64.deb
RUN dpkg -i /tmp/libssl/libssl1.0-dev_1.0.2n-1ubuntu5.13_arm64.deb

# Cleanup
RUN rm -rf /tmp/libssl
WORKDIR /

# Install Ruby 2.1
SHELL ["/bin/bash", "-c"]
RUN source /etc/profile.d/rvm.sh \
    && rvm install 2.1.1 \
    && rvm use 2.1.1 --default

# Optionally reinstall libcurl4-openssl-dev if needed
RUN apt-get update && apt-get install -y libcurl4-openssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Setup RVM for vscode user
RUN usermod -aG rvm vscode \
    && echo 'source /etc/profile.d/rvm.sh' >> /home/vscode/.bashrc \
    && echo 'source /etc/profile.d/rvm.sh' >> /home/vscode/.zshrc

# Make sure RVM is available in non-login shells
RUN echo 'source /etc/profile.d/rvm.sh' >> /etc/bash.bashrc

# Set proper permissions
RUN chown -R vscode:vscode /usr/local/rvm
```

And its corresponding `.devcontainer/devcontainer.json`:

```json
{
    "name": "Ruby 2.1 Development",
    "build": {
        "dockerfile": "Dockerfile"
    },
    "customizations": {
        "vscode": {
            "extensions": [
                "rebornix.Ruby"
            ]
        }
    },
    "remoteUser": "vscode",
    "features": {
        "ghcr.io/guiyomh/features/just:0": {}
    }
}
```

## Commentary

- I did this work with help from Anthropic's Claude 3.5-sonnet model: First as a conversation about how to get things working inside the container, then to port it a proper `Dockerfile`. Maybe spent an hour on this in total? Most of that time was on getting the OpenSSL packages to compile and install correctly.
- I erred on the side of a full-blown Ubuntu distribution over a smaller Ruby image. It's slower to build, but I know it's got pretty much all the build tools I need. And the `Dockerfile` isn't used for production, so it can be a little oversized.
- I went with `rvm` primarily because I knew that, with the proper Ubuntu packages, it could install an older Ruby. I can also use it to install newer Rubies, step by step, for upgrades. You could try `rbenv` or compiling the Ruby, if you'd like.
- You may notice I included `just` as an add-on feature to the dev container. Not necessary, but I like having a consistent developer UI, regardless of a code base's age.
