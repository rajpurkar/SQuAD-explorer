var pug = require('gulp-pug')
var gulp = require('gulp')
var rename = require('gulp-rename')
var data = require('gulp-data')
var connect = require('gulp-connect')
var replace = require('gulp-replace')

gulp.task('connect', function () {
  connect.server({
    root: '.',
    livereload: true
  })
})

var articles = require('./dev-v1.1.json').data // or path to file

var build_dir = 'squad-explore/'
var tasks = []

articles.forEach(function (article) {
  gulp.task(article['title'], function () {
    return gulp.src('views/article.pug')
      .pipe(data(function () {
        return article
      }))
      .pipe(pug())
      .pipe(rename(article['title'] + '.html'))
      .pipe(gulp.dest('./' + build_dir))
  })
  tasks.push(article['title'])
})

gulp.task('generate_list', function () {
  return gulp.src('views/index.pug')
    .pipe(data(function () {
      return {'articles': tasks}
    }))
    .pipe(pug())
    .pipe(gulp.dest('./' + build_dir))
})

gulp.task('correct_link_paths', ['generate'], function () {
  return gulp.src('./' + build_dir + '**/*.html')
    .pipe(replace(/(href="\/)([^\'\"]+)(")/g, '$1' + build_dir + '$2$3'))
    .pipe(gulp.dest('./' + build_dir))
})

gulp.task('generate_articles', tasks)
gulp.task('generate', ['generate_articles', 'generate_list'])
gulp.task('default', ['generate', 'correct_link_paths'])
