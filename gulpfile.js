var gulp = require('gulp'),
    connect = require('gulp-connect'),
    sequence = require('run-sequence');

    gulp.task('server',function(){
       connect.server({
       root: "dist",
       port:8080,
       livereload:true
       })
    });

    gulp.task('buildFiles',function(){
       var src = ['src/**/*.js','src/**/*.html','src/**/*.css','src/**/*.json'];
       return gulp.src(src)
              .pipe(gulp.dest('dist'))
    });

    gulp.task('build',function(){
       sequence('buildFiles',"server");
    });
