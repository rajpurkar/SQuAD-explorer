var Nightmare = require('nightmare')
var fs = require('fs')
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

var n = new Nightmare({
  switches: {
    'ignore-certificate-errors': true
  }
})

n.goto('https://worksheets.codalab.org/worksheets/0x62eefc3e64e04430a1a24785a9293fff/')
.wait(2000)
.evaluate(function () {
  return document.body.innerHTML
})
.end()
.then(function (result) {
  fs.writeFileSync('./saved.html', result)
})
