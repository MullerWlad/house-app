const gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const rename = require('gulp-rename');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

//Converter files from sass directory to css, it minimisates css code in .min file
function cssConvert(done){
    gulp.src('../public/src/sass/*.sass')
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .on('error', console.error.bind(console))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('../public/src/css'));
    done();
}

//Pug converter
function pugConvert(done){
    gulp.src('../public/*.pug')
        .pipe(pug({
            doctype: 'html',
            pretty: false
        }))
        .on('error', console.error.bind(console))
        .pipe(gulp.dest('../public'));
    done();
}

//To sync pug file
gulp.task('sass', () => {
    return gulp.src('../public/src/sass/*.sass')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('../public/src/css/'))
})
gulp.task('component', () => {
    return gulp.src('../public/src/pug/components/*.pug')
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('../public/src/pug/components/'))
})
gulp.task('index', () => {
    return gulp.src('../public/index.pug')
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('../public'))
})
function syncPug(done){
    browserSync.init({
        server: {
            baseDir: '../public/'
        },
        port: 3000,
        open: true
    })
    gulp.watch('../public/src/sass/*.sass', gulp.series('sass'))
        .on('change', browserSync.reload);
    gulp.watch('../public/src/pug/components/*.pug', gulp.series('component'))
        .on('change', browserSync.reload);
    gulp.watch('../public/index.pug', gulp.series('index'))
        .on('change', browserSync.reload);
    done();
}

gulp.task('css', cssConvert);
gulp.task('html', pugConvert);
gulp.task('sync', syncPug);