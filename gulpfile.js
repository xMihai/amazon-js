var gulp = require('gulp')
var ts = require('gulp-typescript')
var tsProject = ts.createProject('tsconfig.json')

gulp.task('default', ['compile'], function() {
  gulp.watch('*.ts', ['compile'])
})

gulp.task('compile', function() {
  return gulp
    .src('*.ts', { base: '.' })
    .pipe(tsProject())
    .js.pipe(gulp.dest('./'))
})
