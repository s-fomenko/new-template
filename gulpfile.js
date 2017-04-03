"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const debug = require("gulp-debug");
const del = require("del");
const newer = require("gulp-newer");
const cssnano = require("gulp-cssnano");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const browserSync = require("browser-sync").create();

gulp.task("styles", function() {

  return gulp.src("src/sass/style.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
          autoprefixer({browsers: [
            "last 2 versions"
          ]})
        ]))
    .pipe(cssnano())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("build/css"));

});

gulp.task("clean", function() {
  return del("build");
});

gulp.task('assets', function() {
  return gulp.src('src/assets/**', {since: gulp.lastRun('assets')})
      .pipe(newer('build'))
      .pipe(gulp.dest('build'));
});

gulp.task("build", gulp.series(
  "clean",
  gulp.parallel("styles", "assets"))
);

gulp.task("watch", function() {
  gulp.watch("src/sass/**/*.*", gulp.series("styles"));

  gulp.watch("src/assets/**/*.*", gulp.series("assets"));
});

gulp.task("serve", function() {
  browserSync.init({
    server: "build"
  });

  browserSync.watch("build/**/*.*").on("change", browserSync.reload);
});

gulp.task("dev",
    gulp.series("build", gulp.parallel("watch", "serve"))
);