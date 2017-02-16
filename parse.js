var cheerio = require('cheerio')
var fs = require('fs')
var $ = cheerio.load(fs.readFileSync('./saved.html'))
var jsonfile = require('jsonfile')

function getEntries (split) {
  var parent = $('h2#' + split + '-set-leaderboard').closest('.ws-item').next()
  var entries = []
  $(parent).find('tbody > tr').each(function () {
    var entry = {}
    var cells = $(this).find('td')
    entry.description = cells.eq(1).text().trim()
    entry.f1 = parseFloat(cells.eq(4).text())
    entry.em = parseFloat(cells.eq(3).text())
    entry.date = cells.eq(2).text().trim()
    entries.push(entry)
  })
  entries.sort(function (a, b) {
    var f1Diff = b.f1 - a.f1
    if (f1Diff === 0) {
      var emDiff = b.em - a.em
      return emDiff
    } else {
      return f1Diff
    }
  })

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

jsonfile.writeFileSync('./development.json', getEntries('development'))
jsonfile.writeFileSync('./test.json', getEntries('test'))
