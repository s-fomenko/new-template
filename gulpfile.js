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
const rename = require("gulp-rename");
const gulpIf = require("gulp-if");
const browserSync = require("browser-sync").create();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task("styles", function() {

  return gulp.src("src/style.scss")
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass())
    .pipe(postcss([
          autoprefixer({browsers: [
            "> 1%",
            "last 2 versions",
            "Firefox ESR"
          ]})
        ]))
    .pipe(cssnano())
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest("build/css"));

});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("assets", function() {
  return gulp.src("src/**/*.html", {since: gulp.lastRun('assets')})
      .pipe(newer("build"))
      .pipe(gulp.dest("build"));
});

gulp.task("images", function() {
  return gulp.src("src/blocks/**/*.{png,jpg,svg}", {since: gulp.lastRun("images")})
      .pipe(newer("build"))
      .pipe(rename(function(path) {
        path.dirname = "";
        return path;
      }))
      .pipe(gulp.dest("build/img"));
});

gulp.task("video", function() {
  return gulp.src("src/blocks/**/*.{mp4,flv,ogv,webm,avi}", {since: gulp.lastRun("video")})
      .pipe(newer("build"))
      .pipe(rename(function(path) {
        path.dirname = "";
        return path;
      }))
      .pipe(gulp.dest("build/video"));
});

gulp.task("build", gulp.series(
  "clean",
  gulp.parallel("styles", "assets", "images", "video"))
);

gulp.task("watch", function() {
  gulp.watch("src/blocks/**/*.*", gulp.series("styles"));

  gulp.watch("src/**/*.html", gulp.series("assets"));

  gulp.watch("src/blocks/**/*.{png,jpg,svg}", gulp.series("images"));
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
