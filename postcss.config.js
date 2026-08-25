module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    process.env.NODE_ENV === 'production' && require("@fullhuman/postcss-purgecss")({
      content: [
        "./_posts/*.markdown",
        "./_posts/*.md",
        "./_layouts/*.html",
        "./_includes/*.html",
        "./*.html",
        // Comment markup is built at runtime, so its classes only appear here
        "./js/discuss.js",
      ],
      defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
      whitelist: ["pre", "html", "light", "dark"],
      // Theme classes are applied by the switcher at runtime
      whitelistPatterns: [/^theme-/, /^data-theme-choice/]
    }),
  ]
}