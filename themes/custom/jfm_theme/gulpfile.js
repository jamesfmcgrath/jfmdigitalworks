const gulp = require("gulp");
const postcss = require("gulp-postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const concat = require("gulp-concat");
const sass = require("gulp-sass")(require("sass"));

// Compile Tailwind CSS
gulp.task("css", function () {
  return gulp
    .src("assets/css/tailwind.css")
    .pipe(postcss([tailwindcss("./tailwind.config.js"), autoprefixer()]))
    .pipe(gulp.dest("dist/css"));
});

// Concatenate JavaScript files
gulp.task("js", function () {
  return gulp
    .src("assets/js/**/*.js")
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest("dist/js"));
});

// Watch files for changes
gulp.task("watch", function () {
  gulp.watch("assets/css/**/*.css", gulp.series("css"));
  gulp.watch("assets/js/**/*.js", gulp.series("js"));
});

// Default task
gulp.task("build", gulp.parallel("css", "js"));
// Build task
gulp.task("default", gulp.series("build"));
