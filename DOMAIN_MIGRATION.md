# Domain Migration Plan: Everyday Rails → Left of the Dev

## Overview

This document outlines the plan to rename "Everyday Rails" to "Left of the Dev" and migrate from everydayrails.com to leftofthe.dev while preserving SEO rankings and maintaining existing traffic.

**Old Domain**: everydayrails.com
**New Domain**: leftofthe.dev
**Hosting**: Netlify (staying)
**Priority**: Maintain SEO rankings through proper 301 redirects

## Critical SEO Preservation Tasks

### 1. Domain & Redirect Configuration (HIGHEST PRIORITY)

Create `netlify.toml` in the repository root with 301 permanent redirects:
- All traffic from everydayrails.com → leftofthe.dev
- Preserve exact URL structure: `/YYYY/MM/DD/post-slug.html`
- Redirect both www and non-www versions
- Include redirects for all static pages (about, contact, archives, etc.)

**In Netlify Dashboard:**
- Add leftofthe.dev as the primary domain
- Add everydayrails.com as a domain alias with automatic redirect enabled
- Configure SSL certificates for both domains
- Test redirects before making DNS changes

### 2. Feed/RSS Updates

**Current state**: atom.xml has hardcoded everydayrails.com URLs and references Feedburner (feeds.feedburner.com/EverydayRails)

**Actions needed:**
- Update atom.xml to use new domain (leftofthe.dev)
- Update feed title to "Left of the Dev"
- Update author email if applicable (currently aaron@everydayrails.com)
- **Feedburner decision**: Either update Feedburner to redirect to new feed URL, or migrate away from Feedburner entirely
- Keep old feed redirecting for 12+ months for existing subscribers

### 3. Google Search Console Migration

**Steps:**
1. Add leftofthe.dev to Google Search Console as a new property
2. Verify ownership
3. Submit new sitemap (https://leftofthe.dev/sitemap.xml or atom.xml)
4. Use "Change of Address" tool in Search Console on the everydayrails.com property
5. Monitor for crawl errors and index status for 3-6 months

## Code Changes Required

### Configuration Files

**`_config.yml`**
- Line 12: `feed:` URL (currently Feedburner)
- Line 13: `twitter:` URL
- Line 14: `facebook:` URL

**`package.json`**
- Line 4: `description` field
- Line 11: Repository URL

**`CLAUDE.md`**
- Update site name and description throughout

### Template Files

**`_includes/header.html`**
- Line 13: Page title (currently "Everyday Rails")
- Line 18: og:image URL (https://everydayrails.com/images/logo-square.png)
- Line 19: rel="image_src" URL
- Line 36: Plausible Analytics domain (`data-domain="everydayrails.com"`)

**`_includes/footer.html`**
- Line 11: Site name reference ("Everyday Rails is written by...")

**`atom.xml`**
- Line 7: Feed title
- Lines 8-11: All domain URLs
- Line 14: Author email
- Lines 20, 22: Post URLs

### Content Files

**`about.markdown`**
- Line 3: Title
- Line 4-5: Excerpt
- Line 8: Site description and mission
- Lines 18-21: Background references to site name

**Posts** (118+ files in `_posts/`)
- Convert internal everydayrails.com links to relative URLs where possible
- This provides flexibility for future domain changes
- External references in post content can remain (they're historical context)

### Asset Files

**Images to create/replace:**
- `/images/logo-square.png` (Open Graph image)
- `/images/logo-small.png`
- `/images/banner.png`
- Apple touch icons (4 files in root: apple-icon-*-precomposed.png)
- Favicon

## External Service Updates

### Analytics & Tracking
- **Plausible Analytics**: Add leftofthe.dev as tracked domain, update script src in header.html
- **Google Search Console**: Add new property, submit sitemap, use Change of Address tool

### Social & Community
- **utteranc.es** (social.html): Currently uses repo "everydayrails/everyday-rails"
  - May need to update GitHub repo name or keep current for comment continuity
- **Twitter/X**: Update profile to reference new domain
- **Facebook**: Update page to reference new domain
- **Mastodon**: Update profile
- **Bluesky**: Update profile

### Email & Feeds
- **Newsletter service** (Mailchimp - eepurl.com/nRW0z link in social.html): Update branding, domain references, and sender information
- **Feedburner**: Update or migrate

### Repository
- **GitHub repo settings**: Consider renaming from "everyday-rails" to match new brand (optional, may break things)
- **GitHub repo description**: Update
- **GitHub repo URL** (in package.json, about pages, etc.)

## Recommended Timeline

### Week 1: Preparation & Code Changes
- [ ] Create netlify.toml with redirect rules
- [ ] Update all template files (_includes/, _layouts/)
- [ ] Update configuration files (_config.yml, package.json)
- [ ] Update about.markdown and other static pages
- [ ] Create/commission new logo and branding assets
- [ ] Test locally with `just serve`

### Week 2: Domain Setup & Testing
- [ ] Set up leftofthe.dev DNS to point to Netlify
- [ ] Add leftofthe.dev in Netlify as primary domain
- [ ] Add everydayrails.com as domain alias with redirects
- [ ] Configure SSL for both domains
- [ ] Deploy changes to Netlify
- [ ] Test redirects thoroughly (all post URLs, static pages, feed, images)
- [ ] Test site functionality on new domain

### Week 3: Search & External Services
- [ ] Add leftofthe.dev to Google Search Console
- [ ] Submit sitemap to Google Search Console
- [ ] Use Change of Address tool for everydayrails.com
- [ ] Update Plausible Analytics configuration
- [ ] Update newsletter service
- [ ] Update Feedburner or migrate away
- [ ] Update social media profiles
- [ ] Create and publish announcement post about rebrand

### Ongoing: Monitoring (3-6 months)
- [ ] Monitor Google Search Console for crawl errors
- [ ] Monitor analytics for traffic patterns
- [ ] Check search rankings for key pages
- [ ] Update any discovered external backlinks you control
- [ ] Monitor feed subscriber counts

## Key SEO Best Practices

1. **Keep 301 redirects permanent** - At minimum 12 months, preferably forever
2. **Don't change URL structure** - Keep date-based permalinks exactly as they are
3. **Update backlinks you control** - GitHub profiles, social media, email signatures, etc.
4. **Announce the change** - Write a blog post explaining the rebrand
5. **Monitor closely** - Watch Search Console and analytics for issues
6. **Be patient** - Full SEO transfer can take 3-6 months
7. **Keep old domain active** - Don't let everydayrails.com expire for at least 1-2 years

## Checklist Summary

### Code Repository Changes
- [ ] Create netlify.toml with redirects
- [ ] Update _config.yml
- [ ] Update atom.xml
- [ ] Update _includes/header.html
- [ ] Update _includes/footer.html
- [ ] Update _includes/social.html (if needed)
- [ ] Update about.markdown
- [ ] Update package.json
- [ ] Update CLAUDE.md
- [ ] Convert hardcoded URLs in posts to relative links
- [ ] Create/update logo and favicon images

### Netlify Configuration
- [ ] Add leftofthe.dev as primary domain
- [ ] Configure SSL for leftofthe.dev
- [ ] Add everydayrails.com as domain alias
- [ ] Enable automatic redirect from alias
- [ ] Test all redirects

### External Services
- [ ] Update Plausible Analytics
- [ ] Add to Google Search Console
- [ ] Submit sitemap
- [ ] Use Change of Address tool
- [ ] Update/migrate Feedburner
- [ ] Update newsletter service
- [ ] Update social media profiles
- [ ] Update GitHub repo settings

### Content
- [ ] Create announcement post
- [ ] Update email signature
- [ ] Update any external profiles/bios

### Monitoring
- [ ] Watch Search Console for errors
- [ ] Monitor analytics traffic
- [ ] Check feed subscribers
- [ ] Monitor search rankings
- [ ] Update controlled backlinks as discovered

## Notes & Decisions to Make

1. **GitHub repository name**: Keep as "everyday-rails" for stability, or rename? (Renaming may break utteranc.es comments)
2. **Feedburner**: Update existing feed or migrate to new platform?
3. **Email address**: Keep aaron@everydayrails.com or create new address?
4. **Historical references**: Posts that reference "Everyday Rails" can stay as historical context
5. **Old logo usage**: Consider keeping old brand assets in repo for archival purposes

## Resources

- [Netlify Redirects Documentation](https://docs.netlify.com/routing/redirects/)
- [Google Change of Address Tool](https://support.google.com/webmasters/answer/9370220)
- [301 Redirects for SEO](https://moz.com/learn/seo/redirection)
