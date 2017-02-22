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
var path = require('path')
var fs = require('fs')

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

gulp.task('copy_dataset', function () {
  gulp
    .src('dataset/*')
    .pipe(gulp.dest('./' + build_dir + 'dataset/'))
})


gulp.task('copy_models', function () {
  gulp
    .src('models/*')
    .pipe(gulp.dest('./' + build_dir + 'models/'))
})

gulp.task('connect', function () {
  connect.server({
    root: '.'
  })
})

var dataset_folder = './dataset/'
var filepaths = [
  dataset_folder + 'dev-v1.1.json',
  // dataset_folder + 'train-v1.1.json',
  // dataset_folder + 'dev-v1.0.json',
  // dataset_folder + 'train-v1.0.json'
]


var exploration_tasks = []

filepaths.forEach(function (filename) {
  var article_generations = []
  var build_prefix = 'explore/'

  var json_file = require(filename)
  var version = json_file.version
  var split = path.basename(filename, '.json').split('-')[0]
  var json_data = json_file.data
  var version_and_split = version + '/' + split

  json_data.forEach(function (article) {
    var name = version_and_split + '/' + article['title']
    gulp.task(name, function () {
      return gulp.src('views/article.pug')
        .pipe(data(function () {
          return article
        }))
        .pipe(pug())
        .pipe(rename(name + '.html'))
        .pipe(gulp.dest('./' + build_dir + build_prefix))
    })
    article_generations.push(name)
    exploration_tasks.push(name)
  })

  // models
  var models_folder = './models/'
  var models = fs.readdirSync(models_folder).map(
    function (a) { return a.slice(0, -5)})

  var list_task_name = version_and_split + '/' + 'index'
  exploration_tasks.push(list_task_name)
  gulp.task(list_task_name, function () {
    return gulp.src('views/explore.pug')
      .pipe(data(function () {
        return {
          'articles': article_generations,
          'prefix': build_prefix,
          'version': version,
          'split': split,
          'models': models
        }
      }))
      .pipe(pug())
      .pipe(rename(list_task_name + '.html'))
      .pipe(gulp.dest('./' + build_dir + build_prefix))
  })
})

gulp.task('generate_index', function () {
  var test_file = require('./test.json')
  return gulp.src('views/index.pug')
      .pipe(data(function () {
        return { 'test': test_file }
      }))
    .pipe(pug())
    .pipe(gulp.dest('./' + build_dir))
})

gulp.task('correct_link_paths', ['generate'], function () {
  return gulp.src('./' + build_dir + '**/*.html')
    .pipe(replace(/([^-](?:href|src)=[\'\"]\/)([^\'\"]*)([\'\"])/g, '$1' + build_dir + '$2$3'))
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

gulp.task('generate_exploration', exploration_tasks)
gulp.task('generate', ['bower', 'generate_exploration', 'generate_index'])
gulp.task('default', ['generate', 'correct_link_paths', 'image', 'js', 'css', 'copy_dataset', 'copy_models'])
