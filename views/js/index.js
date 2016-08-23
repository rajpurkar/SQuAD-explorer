(function ($) {
  $('body').on('submit', '#registerForm', function (e) {
    var that = this
    e.preventDefault()
    var form = $(e.target)
    // send xhr request
    $.ajax({
      type: form.attr('method'),
      url: form.attr('action'),
      data: form.serialize(),
      success: function (data) {
        $(that).slideUp()
        $('.registerMessage').text('Successful. We will keep you notified of major updates through email.')
      }
    })
    return false
  })
})(window.$)
