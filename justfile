alias run := serve

# List available recipes
default:
  @just --list

# Setup dependencies
[group("development")]
setup:
  bundle install

# Serve site locally
[group("development")]
serve:
  bundle exec jekyll serve

# Build site
[group("maintenance")]
build:
  npm run build
  bundle exec jekyll build

# Clean up generated site files
[group("maintenance")]
clean:
  rm -rf _site

# Create new post
[group("content")]
@create-post TITLE:
  touch "_posts/{{datetime('%Y-%m-%d')}}-{{kebabcase(lowercase(TITLE))}}.md"

  echo "---" > "_posts/{{datetime('%Y-%m-%d')}}-{{kebabcase(lowercase(TITLE))}}.md"
  echo "layout: post" >> "_posts/{{datetime('%Y-%m-%d')}}-{{kebabcase(lowercase(TITLE))}}.md"
  echo "title: \"{{TITLE}}\"" >> "_posts/{{datetime('%Y-%m-%d')}}-{{kebabcase(lowercase(TITLE))}}.md"
  echo "tags:" >> "_posts/{{datetime('%Y-%m-%d')}}-{{kebabcase(lowercase(TITLE))}}.md"
  echo "---" >> "_posts/{{datetime('%Y-%m-%d')}}-{{kebabcase(lowercase(TITLE))}}.md"
  echo "" >> "_posts/{{datetime('%Y-%m-%d')}}-{{kebabcase(lowercase(TITLE))}}.md"
