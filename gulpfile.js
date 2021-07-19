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
var cheerio = require('cheerio')

var build_dir = 'SQuAD-explorer/' // good to have this be the same as the repo name for gh-pages purposes

var rankEntries = function (entries) {
  entries.sort(function(a, b) {
    return (b.f1 + b.em) - (a.f1 + a.em);
  })  // First sort by average F1 + EM
/*
  entries.sort(function (a, b) {
    var f1Diff = Math.sign(b.f1 - a.f1)
    var emDiff = Math.sign(b.em - a.em)
    return f1Diff + emDiff
  }) 
  */

  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i]
    if (i === 0) {
      entry.rank = 1
    } else {
      var prevEntry = entries[i - 1]
      var rank = prevEntry.rank
      if (entry.em < prevEntry.em && entry.f1 < prevEntry.f1) rank++
      entry.rank = rank
    }
  }
  return entries
}

function assert (condition, message) {
  if (!condition) {
    throw message || 'Assertion failed'
  }
}

var parseCompEntries = function (comp_file) {
  var leaderboard = require(comp_file).leaderboard
  var entries = []

  for (var i = 0; i < leaderboard.length; i++) {
    try {
      var o_entry = leaderboard[i]
      var entry = {}
      entry.user = o_entry.submission.user_name
      var description = o_entry.submission.description.trim()
      var regex_match = description.match(/(.*) ?\((.*)\) ?\((.*)\)(.*)/);
      if (regex_match) {
        entry.model_name = regex_match[1].trim() + " (" + regex_match[2].trim() + ")";
        entry.institution = regex_match[3].trim();
        if (regex_match[4].lastIndexOf('http') !== -1) {
          entry.link = regex_match[4].trim()
        }
      } else {
        entry.model_name = description.substr(0, description.lastIndexOf('(')).trim()
        var firstPart = description.substr(description.lastIndexOf('(') + 1)
        entry.institution = firstPart.substr(0, firstPart.lastIndexOf(')'))
        if (description.lastIndexOf('http') !== -1) {
          entry.link = description.substr(description.lastIndexOf('http')).trim()
        }
      }
      entry.date = o_entry.submission.created
      entry.em = parseFloat(o_entry.scores.exact_match)
      entry.f1 = parseFloat(o_entry.scores.f1)
      try {
        var metaDescription = JSON.parse(o_entry.bundle.metadata.description);
        entry.submit_link = "https://worksheets.codalab.org/bundles/" + metaDescription.submit_id;
      } catch (e) {
        // Just don't fill the submit bundle link
      }
      if (!(entry.em >= 0)) throw 'Score invalid'
      if (entry.em < 50) throw 'Score too low'
      //if (entry.model_name === '') {
      //  entry.model_name = 'Unnamed submission by ' + entry.user
      //}
      // if (entry.em > 50 && entry.f1 > 60) {
      if (entry.model_name !== '') {
        entries.push(entry);
      }
    } catch (err) {
      console.error(err)
      console.error(entry)
    }
  }
  entries = rankEntries(entries)
  return entries
}

var parseEntries = function (htmlStr) {
  var $ = cheerio.load(htmlStr)
  var parent = $('h1#leaderboard').closest('.ws-item').next()
  var entries = []
  $(parent).find('tbody > tr').each(function () {
    var entry = {}
    var cells = $(this).find('td')
    entry.description = cells.eq(1).text().trim()
    entry.model_name = entry.description.substr(0, entry.description.lastIndexOf('(')).trim()
    var firstPart = entry.description.substr(entry.description.lastIndexOf('(') + 1)
    entry.institution = firstPart.substr(0, firstPart.lastIndexOf(')'))
    var httpPos = entry.description.lastIndexOf('http')
    if (httpPos !== -1) {
      entry.link = entry.description.substr(entry.description.lastIndexOf('http')).trim()
    }
    delete entry.description
    entry.f1 = parseFloat(cells.eq(4).text())
    entry.em = parseFloat(cells.eq(3).text())
    entry.date = cells.eq(2).text().trim()
    entries.push(entry)
  })
  entries = rankEntries(entries)
  return entries
}

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

gulp.task('scrape_website', function (cb) {
  var Nightmare = require('nightmare')
  var fs = require('fs')
  var parse
  var nightmare = new Nightmare({
    switches: {
      'ignore-certificate-errors': true
    }
  })
  nightmare.goto('https://worksheets.codalab.org/worksheets/0x62eefc3e64e04430a1a24785a9293fff/')
  .wait(2000)
  .evaluate(function () {
    return document.body.innerHTML
  })
  .end()
  .then(function (result) {
    var jsonfile = require('jsonfile')
    var after = parseEntries(result)
    jsonfile.writeFile('./test.json', after, cb)
  })
})

gulp.task('copy_models', function () {
  gulp
    .src('models/*/*.json')
    .pipe(gulp.dest('./' + build_dir + 'models/'))
})

gulp.task('connect', function () {
  connect.server({
    host: '0.0.0.0',
    root: '.'
  })
})

var dataset_folder = './dataset/'
var filepaths = [
  dataset_folder + 'dev-v1.1.json',
  dataset_folder + 'dev-v2.0.json',
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
  var models_folder = './models/' + version
  var models = fs.readdirSync(models_folder).map(
    function (a) { return a.slice(0, -5) })

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

gulp.task('process_comp_output', function (cb) {
  var jsonfile = require('jsonfile')
  var entries1 = parseCompEntries('./out-v1.1.json')
  var entries2 = parseCompEntries('./out-v2.0.json')
  jsonfile.writeFile('./results1.1.json', entries1, function (err){
    if (err) return cb(err)
    jsonfile.writeFile('./results2.0.json', entries2, cb)
  })
})

gulp.task('generate_index', ['process_comp_output'], function () {
  var test_1 = require('./results1.1.json')
  var test_2 = require('./results2.0.json')
  var moment = require('moment')
  return gulp.src('views/index.pug')
      .pipe(data(function () {
        return { 'test1': test_1,
          'test2': test_2,
          'moment': moment}
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
gulp.task('generate', ['bower', 'generate_exploration', 'generate_index', 'process_comp_output'])
gulp.task('default', ['generate', 'correct_link_paths', 'image', 'js', 'css', 'copy_dataset', 'copy_models'])
