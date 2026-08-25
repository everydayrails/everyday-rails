# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Left of the Dev (formerly Everyday Rails) is a blog about Ruby on Rails development, built using Jekyll static site generator. The blog features posts on Rails testing, development practices, and related topics. It uses Tailwind CSS for styling and is deployed via Netlify.

## Technology Stack

- **Ruby**: 3.1 (managed via mise)
- **Jekyll**: ~4.4 (static site generator)
- **CSS Framework**: Tailwind CSS 1.8.6 with PostCSS for processing
- **Task Runner**: Just (justfile for common commands)
- **Plugins**:
  - Custom jekyll-tagging fork (allows posts with no tags)
  - jekyll-gist (for GitHub gist embeds)
  - rouge (syntax highlighting)

## Development Commands

### Setup
```bash
just setup              # Install Ruby dependencies (bundle install)
npm install            # Install Node dependencies for CSS processing
```

### Local Development
```bash
just serve             # Start Jekyll development server on port 4000
just run               # Alias for serve
bundle exec jekyll serve   # Direct Jekyll command
```

### Building
```bash
just build             # Build the site to _site/ directory
npm run build          # Rebuild Tailwind CSS from _css/tailwind.css to css/tailwind.css
```

### Maintenance
```bash
just clean             # Remove generated _site/ directory
```

### Content Creation
```bash
just create-post "Post Title"   # Create new post with proper naming and frontmatter
```

## Site Architecture

### Directory Structure

- **_posts/**: Blog posts in Markdown format with YAML frontmatter. Named as `YYYY-MM-DD-slug.markdown`
- **_layouts/**: HTML templates for different page types (default, post, wide, tags, main)
- **_includes/**: Reusable HTML partials (header, footer, nav, sidebar, theme_toggle, book_cta, discuss, referrals)
- **_plugins/**: Custom Jekyll plugins (loads jekyll-tagging)
- **_css/**: Tailwind source CSS (`tailwind.css`)
- **css/**: Compiled CSS output (generated, not committed)
- **_site/**: Generated static site (not committed)

### Post Format

Posts use Jekyll frontmatter with the following structure:
```yaml
---
layout: post
title: "Post Title"
excerpt: "Brief description for listings"
tags: tag1 tag2 tag3
---
```

### CSS Processing Pipeline

1. Source: `_css/tailwind.css` contains Tailwind directives
2. Build: `npm run build` runs PostCSS with Tailwind and Autoprefixer
3. Production: `NODE_ENV=production npm run build` additionally runs PurgeCSS to remove unused styles
4. PurgeCSS scans: `_posts/*.markdown`, `_layouts/*.html`, `_includes/*.html`, `*.html`

### Netlify Build Process

Production builds on Netlify run: `NODE_ENV=production npm run build && jekyll build`

This ensures CSS is optimized and purged before Jekyll generates the final site.

## Configuration Files

- **_config.yml**: Jekyll configuration (markdown processor, permalink style, plugins, exclusions)
- **tailwind.config.js**: Tailwind configuration (minimal, uses defaults)
- **postcss.config.js**: PostCSS pipeline including Tailwind, Autoprefixer, and conditional PurgeCSS
- **mise.toml**: Ruby version management (Ruby 3.1)
- **justfile**: Task automation recipes

## Sharing and Comments

Posts end with a "Discuss this post" block (`_includes/discuss.html`, behavior in
`js/discuss.js`), which does two things:

1. **Share links** to Bluesky and Mastodon. Bluesky is a plain intent URL.
   Mastodon has no central address, so that control asks the reader which
   instance they're on and remembers it in `localStorage`.
2. **Comments**, which are the public replies to the post's own Bluesky and
   Mastodon threads, fetched in the reader's browser from
   `public.api.bsky.app` and the instance's `/api/v1/statuses/:id/context`.
   Both APIs are unauthenticated and CORS-enabled — there is no key to manage
   and no build step involved.

The accounts shared to are configured under `social:` in `_config.yml`. A post
opts into comments by adding either thread URL to its frontmatter:

```yaml
discuss_bluesky: https://bsky.app/profile/you.bsky.social/post/3abc123
discuss_mastodon: https://your.instance/@you/113456789
```

Workflow: publish the post, announce it on Bluesky and/or Mastodon, then paste
those thread URLs back into the frontmatter. Posts with neither key still get
the share buttons. Nothing here blocks publishing — the block degrades to share
links if an API is unreachable.

Replies arrive as untrusted input. Bluesky text is rebuilt from its facets
(whose offsets are UTF-8 byte positions, not character indexes); Mastodon HTML
goes through the allowlist sanitizer in `js/discuss.js`. Keep new rendering
inside those paths rather than assigning to `innerHTML`.

Classes for the comment markup are generated at runtime, so `js/discuss.js` is
in the PurgeCSS `content` list in `postcss.config.js`. Adding a class in that
file without it being scanned means it gets purged from production CSS.

## Tagging System

Uses a custom fork of jekyll-tagging that allows posts without tags. Tag pages are generated automatically at `/tag/[tag-name]` using the `tags.html` layout.

## When Working on Posts

- Posts are dated with format `YYYY-MM-DD-slug.markdown` in `_posts/`
- Use `just create-post "Title"` to scaffold new posts correctly
- Tags are optional (due to custom plugin fork)
- Syntax highlighting via rouge supports many languages with GFM-style code blocks
