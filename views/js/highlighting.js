(function ($, TextHighlighter, Hilitor) {
  var qHilitor
  $('.qa-wrap')
  .mouseenter(function () {
    qHilitor = new Hilitor($(this).closest('.para-wrap').find('pre')[0])
    $(this).find('.prediction, .answer').each(function (index) {
      var colors = ['rgba(100, 200, 100, 0.7)', 'rgba(10, 230, 100, 0.7)', 'rgba(100, 230, 30, 0.7)']
      qHilitor.apply($(this).text(), true, colors[index % colors.length])
    })
    var question_text = $(this).find('.question').text().replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, '').removeStopWords()
    qHilitor.apply(question_text, false)
  })
  .mouseleave(function () {
    if (qHilitor) qHilitor.remove()
  })
})(window.$, window.TextHighlighter, window.Hilitor)
