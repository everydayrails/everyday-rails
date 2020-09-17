module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    process.env.NODE_ENV === 'production' && require("@fullhuman/postcss-purgecss")({
      content: [
        "./_posts/*.markdown",
        "./_layouts/*.html",
        "./_includes/*.html",
        "./*.html",
      ],
      defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
      whitelist: ["pre"]
    }),
  ]
}