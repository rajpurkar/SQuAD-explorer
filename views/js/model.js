;(function ($) {
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
    $.getJSON('/SQuAD-explorer/models/' + model_name, function (data) {
      $('.prediction-holder').show()
      $('.qa-wrap').each(function () {
        var id = $(this).attr('data-id')
        $(this).find('.prediction').text(data[id])
      })
    })
  }
})(window.$)
