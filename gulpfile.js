'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'), //SASS
    plumber = require('gulp-plumber'), //prevent gulp breaking on error
    browserSync = require('browser-sync').create(),
    include = require('gulp-include'), //include separated files 
    sourcemaps = require('gulp-sourcemaps'), //sourcemaps for debugging purposes 
    autoprefixer = require('gulp-autoprefixer'), //auto prefixes for css declarations
    uglify = require('gulp-uglify'), //js minification  
    cssnano = require('gulp-cssnano'), //css minification
    imagemin = require('gulp-imagemin'), //images minification
    cache = require('gulp-cache'), //cache 
    runSequence = require('run-sequence'), //sequence for task calling
    spritesmith = require('gulp.spritesmith'),
    del = require('del'),
    jade = require('gulp-jade'); //jade 

// main tasks
gulp.task('html', function(){
  gulp.src('app/**/*.html')
    .pipe(plumber())
    .pipe(include())
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('jade', function(){
  gulp.src('app/jade/*.jade')
    .pipe(plumber())
    .pipe(jade())
    .pipe(include())
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('sass', function(){
  gulp.src('app/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())  
    .pipe(autoprefixer())
    .pipe(cssnano())  
    .pipe(sourcemaps.write('./'))  
    .pipe(gulp.dest('dist/css/'))    
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('js', function(){
  gulp.src('app/js/*.js')
    .pipe(plumber())
    .pipe(include())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('images', function(){
  gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
/*    .pipe(imagemin({
      interlaced: true,
    }))*/
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('sprite', function() {
  var spriteData = 
    gulp.src('app/images/sprite/*.*') 
      .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite.scss',
        algorithm: 'top-down',
        imgPath: '../images/sprite.png'
      }));
  spriteData.img.pipe(gulp.dest('dist/images/')); 
  spriteData.css.pipe(gulp.dest('app/scss/components/')); 
});

gulp.task('fonts', function() {
  gulp.src(['app/fonts/**/*.*', 'node_modules/font-awesome/fonts/fontawesome-webfont.*'])
    .pipe(gulp.dest('dist/fonts/'))
});

// localhost
gulp.task('browserSync', function(){
  browserSync.init({
    server: {
      baseDir: './dist',
      index: "index.html"
    },
    host: 'localhost',
    port: 8000
  })
});

// watching
gulp.task('watch', function(){
  gulp.watch('app/**/*.html', ['html']);
  gulp.watch('app/**/*.jade', ['jade']);
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/js/**/*.js', ['js']);
  gulp.watch('app/images/**/*.*')
});

// get all tasks for building
gulp.task('dist', [
  'html', 
  'jade',
  'sass',
  'js',
  'images',
  'fonts',
  'sprite'
]);

// Building
gulp.task('default', function(callback) {
  runSequence(['dist', 'browserSync'], 'watch',
    callback
  )
});

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    ['html', 'js' ,'images', 'fonts'],
    callback
  )
})

// Cleaning 
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);    
  });
})

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});
