;(function ($, window) {
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
  var version = getUrlParameter('version')
  if (model_name) {
    $.getJSON('/SQuAD-explorer/models/' + version + '/' + model_name + '.json', function (data) {
      $('.model-title-holder > h1').text('Predictions by ' + model_name)
      $('.model-title-holder').show()
      $('.prediction-holder').show()
      var f1_scores = []
      var exact_scores = []
      $('.qa-wrap').each(function () {
        var id = $(this).attr('data-id')
        var prediction = data[id]
        var display_pred = prediction
        if (prediction === '') {
          display_pred = '<No Answer>'
        }
        $(this).find('.prediction').text(display_pred)
        if (prediction === '') {
          $(this).find('.prediction').addClass('no-answer')
        }
        var ground_truths = []
        $(this).closest('.qa-wrap')
          .find('.answer').each(function () {
            ground_truths.push($(this).text())
          })
        /* var scores
        if (prediction && prediction.length > 0 && ground_truths.length > 0) {
          scores = window.evaluate_on_metrics(prediction, ground_truths)
        } else {
          scores = [0, 0]
        }*/
        var scores = window.evaluate_on_metrics(prediction, ground_truths)
        exact_scores.push(scores[0])
        var f1_score = scores[1]
        f1_scores.push(f1_score)
        if (f1_score === 1.0) {
          $(this).addClass('correct-qa')
        } else if (f1_score > 0.5) {
          $(this).addClass('partial-qa')
        } else {
          $(this).addClass('wrong-qa')
        }
      })
      function getAvg (scores) {
        return scores.reduce(function (p, c) {
          return p + c
        }) / scores.length * 100
      }
      $('.model-title-holder > h2').text('Article EM: ' + getAvg(exact_scores).toFixed(1) + ' F1: ' + getAvg(f1_scores).toFixed(1))
    })
  }
})(window.$, window)
