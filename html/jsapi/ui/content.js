/* UI - Show specific elements */
Mailpile.show_bulk_actions = function(elements) {
  $.each(elements, function(){    
    $(this).css('visibility', 'visible');
  });
};


/* UI - Hide specific elements */
Mailpile.hide_bulk_actions = function(elements) {
  $.each(elements, function(){    
    $(this).css('visibility', 'hidden');
  });
};


/* UI - Update sub navigation .navigation-on class state */
$(document).on('click', '.button-sub-navigation', function() {

  var filter = $(this).data('filter');

  $('.sub-navigation ul li').removeClass('navigation-on');
  $(this).parent().addClass('navigation-on');

  if (filter == 'in_unread') {

    $('#display-unread').addClass('navigation-on');
    $('tr').hide('fast', function() {
      $('tr.in_new').show('fast');
    });
  }
  else if (filter == 'in_later') {

    $('#display-later').addClass('navigation-on');
    $('tr').hide('fast', function() {
      $('tr.in_later').show('fast');
    });
  }
  else {
    $('#display-all').addClass('navigation-on');
    $('tr.result').show('fast');
  }
  return false;
});
