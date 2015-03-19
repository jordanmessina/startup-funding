var gulp              = require('gulp'),
    concat            = require('gulp-concat'),
    connect           = require('gulp-connect'),
    angularTemplates  = require('gulp-angular-templates');

var vendor    = require('./vendor');

gulp.task('templates', function() {
  gulp.src('src/app/templates/**/*.html')
    .pipe(angularTemplates({
      basePath: 'templates',
      module: 'fundingApp.templates',
      standalone: false
    }))
    .pipe(gulp.dest('tmp/templates'))
})

gulp.task('js:vendor', function() {
  gulp.src(vendor.scripts.src)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('assets/js'))
});

gulp.task('js:application', ['templates'], function() {
  gulp.src(['src/app/**/_module.js', 'src/app/**/*.js', 'tmp/templates/**/*.js'])
    .pipe(concat('application.js'))
    .pipe(gulp.dest('assets/js'))
    .pipe(connect.reload())
});

gulp.task('css:vendor', function() {
  gulp.src(vendor.styles.src)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('assets/css'))
});

gulp.task('css:application', function() {
  gulp.src('src/stylesheets/**/*.css')
    .pipe(concat('application.css'))
    .pipe(gulp.dest('assets/css'))
    .pipe(connect.reload())
});

gulp.task('js', ['js:vendor', 'js:application']);
gulp.task('css', ['css:vendor', 'css:application']);

gulp.task('build', ['js', 'css']);

gulp.task('serve', ['build'], function() {
  connect.server({ livereload: true });
  gulp.watch('src/app/**/*.js', ['js:application'])
  gulp.watch('src/stylesheets/**/*.css', ['css:application'])
})
