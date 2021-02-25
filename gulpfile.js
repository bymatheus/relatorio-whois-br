const { series, parallel, watch } = require("gulp");

const gulp = require("gulp"),
    clean = require("gulp-clean"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    sass = require("gulp-sass"),
    cleanCSS = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    sourcemaps = require("gulp-sourcemaps");
sass.compiler = require("node-sass");

function createDist() {
    return gulp.src('*.*', {read:false})
        .pipe(gulp.dest('./public/dist/'));
}

function deleteDist() {
    return gulp.src("public/dist").pipe(clean());
}

function buildJs() {
    return gulp
        .src([
            "node_modules/bootstrap/dist/js/bootstrap.js"
        ])
        .pipe(sourcemaps.init())
        .pipe(concat("all.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("public/dist/js"));
}

function buildCss() {
    return gulp
        .src("resources/scss/style.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(cleanCSS())
        .pipe(rename("bundle.min.css"))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("public/dist/css"));
}


//Rotinas
exports.startProject = createDist;
exports.rollbackProject = deleteDist;

exports.scssRoutine = buildCss;

exports.compileRoutine = function () {
    watch("resources/scss/**/*.scss", buildCss);
    watch("resources/js/**/*.js", buildJs);
};

exports.defaultRoutine = series(
    deleteDist,
    createDist,
    parallel(buildJs, buildCss)
);
