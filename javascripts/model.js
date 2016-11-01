(function ($, window) {
  // from http://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
  var getUrlParameter = function getUrlParameter (sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1))
    var sURLVariables = sPageURL.split('&')
    var sParameterName
    var i

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=')

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1]
      }
    }
  }
  var model_name = getUrlParameter('model')
  if (model_name) {
    $.getJSON('/SQuAD-explorer/models/' + model_name + '.json', function (data) {
      $('.prediction-holder').show()
      $('.qa-wrap').each(function () {
        var id = $(this).attr('data-id')
        $(this).find('.prediction').text(data[id])
        var prediction = data[id]
        var ground_truths = []
        $(this).closest('.qa-wrap')
          .find('.answer').each(function () {
            ground_truths.push($(this).text())
          })
        var f1_score = window.evaluate_on_metrics(prediction, ground_truths)[1]
        if (f1_score === 1.0) {
          $(this).addClass('correct-qa')
        } else if (f1_score > 0.5) {
          $(this).addClass('partial-qa')
        } else {
          $(this).addClass('wrong-qa')
        }
      })
    })
  }
})(window.$, window)
