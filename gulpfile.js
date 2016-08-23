var pug = require('gulp-pug')
var gulp = require('gulp')
var rename = require('gulp-rename')
var data = require('gulp-data')
var connect = require('gulp-connect')

gulp.task('connect', function () {
  connect.server({
    root: '.',
    livereload: true
  })
})

var articles = require('./dev-v1.1.json').data // or path to file

var build_dir = basedir = 'squad-explore'
var tasks = []

articles.forEach(article => {
  gulp.task(article['title'], function () {
    return gulp.src('views/article.pug')
      .pipe(data(function () {
        return article
      }))
      .pipe(pug())
      .pipe(rename(article['title'] + '.html'))
      .pipe(gulp.dest(build_dir))
  })
  tasks.push(article['title'])
})

gulp.task('list_articles', function () {
  return gulp.src('views/index.pug')
    .pipe(data(function () {
      return {'articles': tasks, 'basedir': basedir}
    }))
    .pipe(pug())
    .pipe(gulp.dest(build_dir))
})

gulp.task('generate_articles', tasks)
gulp.task('default', ['generate_articles', 'list_articles'])
