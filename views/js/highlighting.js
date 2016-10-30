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
    highlight_question_words(this)
    var first_answer = $(this).find('.answer').first() // default
    highlight_answer(first_answer)
    add_answer_style(first_answer)

    $(this).find('.answer, .prediction')
    .mouseenter(function () {
      remove_answer_style(first_answer) // remove default
      highlight_answer(this)
      add_answer_style(this)
    })
    .mouseleave(function () {
      if (highlight) highlight.remove()
      highlight_question_words(outer)
      remove_answer_style(this)
    })
  })
  .mouseleave(function () {
    var first_answer = $(this).find('.answer').first()
    if (highlight) highlight.remove()
    remove_answer_style(first_answer)
  })
})(window.$, window.TextHighlighter, window.Hilitor)
