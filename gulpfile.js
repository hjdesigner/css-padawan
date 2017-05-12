var gulp         = require('gulp'),
    clean        = require('gulp-clean'),
    browserSync  = require('browser-sync'),
    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer');

var config = {  
  srcPath: 'src/',
  distPath: 'dist/'
};
var paths = {
 styles: ['css/**/*.css'],
 html: ['index.html'],
 images: ['images/**/*.jpg'], 
};
gulp.task('copy', ['clean'], function(){
 gulp.src(paths.html, {cwd: config.srcPath})
     .pipe(gulp.dest(config.distPath));
 gulp.src(paths.styles, {cwd: config.srcPath})
     .pipe(gulp.dest(config.distPath + 'css'));
 gulp.src(paths.images, {cwd: config.srcPath})
     .pipe(gulp.dest(config.distPath + 'images'));
});
gulp.task('clean', function(){
 return gulp.src(config.distPath)
            .pipe(clean());
});
gulp.task('sass', function(){
 return gulp.src(config.srcPath+'sass/style.+(scss|sass)')
            .pipe(sourcemaps.init())
            .pipe(sass({
             outputStyle: 'compressed'
            }).on('error',sass.logError))
            .pipe(autoprefixer())
            .pipe(sourcemaps.write(''))            
            .pipe(gulp.dest(config.srcPath+'css'))
            .pipe(browserSync.reload({
             stream: true
        }));
});
gulp.task('browserSync', function(){
 browserSync.init({
  server: {
   baseDir: './src'
  },
  port: 8080,
  startPath: 'index.html'
 });
 gulp.watch('src/**/*').on('change', browserSync.reload);
});
gulp.task('default', ['browserSync'], function() {  
    gulp.watch(config.srcPath+'sass/**/*.+(scss|sass)', ['sass']);
});
gulp.task('prod', ['copy'], function() {});