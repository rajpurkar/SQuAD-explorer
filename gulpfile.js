var pug = require('gulp-pug')
var gulp = require('gulp')
var rename = require('gulp-rename')
var data = require('gulp-data')
var connect = require('gulp-connect')
var replace = require('gulp-replace')
var ghPages = require('gulp-gh-pages')
var bower = require('gulp-bower')
var image = require('gulp-image')
var stylus = require('gulp-stylus')
var minify = require('gulp-minify')

var build_dir = 'SQuAD-explorer/' // good to have this be the same as the repo name for gh-pages purposes

gulp.task('bower', function () {
  return bower()
    .pipe(gulp.dest('./' + build_dir + 'bower_components/'))
})

gulp.task('image', function () {
  return gulp.src('./views/images/*')
    .pipe(image())
    .pipe(gulp.dest('./' + build_dir))
})

gulp.task('js', function () {
  return gulp.src('./views/js/*')
    .pipe(minify())
    .pipe(gulp.dest('./' + build_dir + 'javascripts/'))
})

gulp.task('connect', function () {
  connect.server({
    root: '.',
    livereload: true
  })
})

var articles = require('./dev-v1.1.json').data // or path to file
var tasks = []
var prefix = 'article/'

articles.forEach(function (article) {
  gulp.task(article['title'], function () {
    return gulp.src('views/article.pug')
      .pipe(data(function () {
        return article
      }))
      .pipe(pug())
      .pipe(rename(article['title'] + '.html'))
      .pipe(gulp.dest('./' + build_dir + prefix))
  })
  tasks.push(article['title'])
})

gulp.task('generate_list', function () {
  return gulp.src('views/explore.pug')
    .pipe(data(function () {
      return {'articles': tasks, 'prefix': prefix}
    }))
    .pipe(pug())
    .pipe(gulp.dest('./' + build_dir))
})

gulp.task('generate_index', function () {
  return gulp.src('views/index.pug')
    .pipe(pug())
    .pipe(gulp.dest('./' + build_dir))
})

gulp.task('correct_link_paths', ['generate'], function () {
  return gulp.src('./' + build_dir + '**/*.html')
    .pipe(replace(/((?:href|src)=[\'\"]\/)([^\'\"]*)([\'\"])/g, '$1' + build_dir + '$2$3'))
    .pipe(gulp.dest('./' + build_dir))
})

gulp.task('css', function () {
  return gulp.src('./views/styles/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./' + build_dir + 'stylesheets'))
})

gulp.task('deploy', function () {
  return gulp.src('./' + build_dir + '**/*')
    .pipe(ghPages())
})

gulp.task('generate_articles', tasks)
gulp.task('generate', ['bower', 'generate_articles', 'generate_list', 'generate_index'])
gulp.task('default', ['generate', 'correct_link_paths', 'image', 'js', 'css'])
