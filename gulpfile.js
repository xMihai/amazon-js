var gulp = require('gulp')
var ts = require('gulp-typescript')
var tsProject = ts.createProject('tsconfig.json')
var exec = require('child_process').exec

gulp.task('default', ['compile'], function() {
  gulp.watch('*.ts', ['compile'])
})

gulp.task('compile', function() {
  return gulp
    .src('*.ts', { base: '.' })
    .pipe(tsProject())
    .js.pipe(gulp.dest('./'))
})

gulp.task('run', ['compile'], function() {
  exec('node index', function(err, stdout, stderr) {
    console.log(stdout)
    console.log(stderr)
  })
})
