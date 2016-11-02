(function ($, TextHighlighter, Hilitor) {
  var highlight

  function highlight_question_words (e) {
    var question_text = $(e).find('.question').text().replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, '').removeStopWords()
    highlight.apply(question_text, false)
  }

  var answer_color = 'rgba(10, 230, 100, 0.7)'

  function highlight_answer (e) {
    highlight.apply($(e).text(), true, answer_color)
  }

  function add_answer_style (e) {
    $(e).css('background-color', answer_color)
  }

  function remove_answer_style (e) {
    $(e).css('background-color', '')
  }

  $('.qa-wrap')
  .mouseenter(function () {
    var outer = this // reference to this object
    highlight = new Hilitor($(this).closest('.para-wrap').find('pre')[0])

    var apply_highlight = function (answer) {
      if (answer) {
        highlight_answer(answer)
        add_answer_style(answer)
      }
      highlight_question_words(outer)
    }
    apply_highlight($(this).find('.answer').first()) // first answer

    $(this).find('.answer, .prediction')
    .mouseenter(function () {
      if (highlight) highlight.remove()
      $(outer).find('.answer, .prediction').each(function () {
        remove_answer_style(this)
      })
      apply_highlight(this)
    })
  })
  .mouseleave(function () {
    if (highlight) highlight.remove()
    $(this).find('.answer, .prediction').each(function () {
      remove_answer_style(this)
    })
  })
})(window.$, window.TextHighlighter, window.Hilitor)
