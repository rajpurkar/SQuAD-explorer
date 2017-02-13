var cheerio = require('cheerio')
var fs = require('fs')
var $ = cheerio.load(fs.readFileSync('./saved.html'))

function getEntries (split) {
  var parent = $('h2#' + split + '-set-leaderboard').closest('.ws-item').next()
  var entries = []
  $(parent).find('tbody > tr').each(function () {
    var entry = {}
    var cells = $(this).find('td')
    entry.description = cells.eq(1).text()
    entry.f1 = parseFloat(cells.eq(4).text())
    entry.em = parseFloat(cells.eq(3).text())
    entry.date = cells.eq(2).text().trim()
    entries.push(entry)
  })
  return entries
}

getEntries('development')
console.log(getEntries('test'))
