var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");

var config = {
  bootstrapDir: "./bower_components/bootstrap-sass",
  fontAwesomeDir: "./bower_components/font-awesome"
}

gulp.task("build-css", function() {
  gulp.src("./scss/site.scss")
      .pipe(sass({
        includePaths: [
          config.bootstrapDir + "/assets/stylesheets",
          config.fontAwesomeDir + "/scss"
        ]
      }))
      .pipe(gulp.dest("css"));
});

gulp.task("fonts", function() {
  gulp.src([config.fontAwesomeDir + "/fonts/fontawesome-webfont.*"])
      .pipe(gulp.dest('fonts/'));
});

gulp.task("watch", function() {
  gulp.watch("scss/*.scss", ["build-css"]);
});

gulp.task("default", ["build-css", "watch"]);
