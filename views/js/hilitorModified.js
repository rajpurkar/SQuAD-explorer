// Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.

window.Hilitor = function Hilitor (dom_object, tag) {
  var targetNode = dom_object || document.body
  var hiliteTag = tag || 'EM'
  var skipTags = new RegExp('^(?:' + hiliteTag + '|SCRIPT|FORM|SPAN)$')
  var colors = ['rgba(100, 190, 200, 0.3)', 'rgba(90, 150, 200, 0.3)', 'rgba(30, 200, 200, 0.3)', 'rgba(140, 230, 230, 0.3)']
  var wordColor = []
  var colorIdx = 0
  var matchRegex = ''

  this.setRegex = function (input, dont_split) {
    if (!dont_split) {
      input = input.replace(/^[^\w]+|[^\w]+$/g, '')
      input = input.replace(/[^\w'-]+/g, '|')
      input = input.replace(/^\||\|$/g, '')
    }
    if (input) {
      var re = '(' + input + ')'
      matchRegex = new RegExp(re, 'i')
      return true
    }
    return false
  }

  this.getRegex = function () {
    var retval = matchRegex.toString()
    retval = retval.replace(/(^\/(\\b)?|\(|\)|(\\b)?\/i$)/g, '')
    retval = retval.replace(/\|/g, ' ')
    return retval
  }

  // recursively apply word highlighting
  this.hiliteWords = function (node, dont_split, color) {
    if (node === undefined || !node) return
    if (!matchRegex) return
    if (skipTags.test(node.nodeName)) return

    if (node.hasChildNodes()) {
      for (var i = 0; i < node.childNodes.length; i++) {
        this.hiliteWords(node.childNodes[i], dont_split, color)
      }
    }
    if (node.nodeType === 3) { // NODE_TEXT
      if ((nv = node.nodeValue) && (regs = matchRegex.exec(nv))) {
        if (!wordColor[regs[0].toLowerCase()]) {
          wordColor[regs[0].toLowerCase()] = color || colors[colorIdx++ % colors.length]
        }

        var match = document.createElement(hiliteTag)
        match.appendChild(document.createTextNode(regs[0]))
        match.style.backgroundColor = dont_split ? color : wordColor[regs[0].toLowerCase()]
        match.style.fontStyle = 'inherit'
        match.style.color = '#000'
        if (dont_split) {
          // match.style.textDecoration = 'underline'
        }

        var after = node.splitText(regs.index)
        after.nodeValue = after.nodeValue.substring(regs[0].length)
        node.parentNode.insertBefore(match, after)
      }
    }
  }

  // remove highlighting
  this.remove = function () {
    var arr = document.getElementsByTagName(hiliteTag)
    while (arr.length && (el = arr[0])) {
      var parent = el.parentNode
      parent.replaceChild(el.firstChild, el)
      parent.normalize()
    }
  }

  // start highlighting at target node
  this.apply = function (input, dont_split, color) {
    // this.remove()
    if (input === undefined || !input) return
    if (this.setRegex(input, dont_split)) {
      this.hiliteWords(targetNode, dont_split, color)
    }
  }
}
