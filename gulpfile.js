var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");

var config = {
  bootstrapDir: "./bower_components/bootstrap-sass"
}

gulp.task("build-css", function() {
  gulp.src("./scss/site.scss")
      .pipe(sass({
        includePaths: [
          config.bootstrapDir + "/assets/stylesheets",
        ]
      }))
      .pipe(gulp.dest("css"));
});

gulp.task("watch", function() {
  gulp.watch("scss/*.scss", ["build-css"]);
});

gulp.task("default", ["build-css", "watch"]);
