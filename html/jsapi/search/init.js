/* Search */

Mailpile.Search = {};
Mailpile.Search.Tooltips = {};

Mailpile.Search.init = function() {

  // Render Display Size
  if (!localStorage.getItem('view_size')) {
    localStorage.setItem('view_size', Mailpile.config.web.display_density);
  }

  var search = ($('#search-query').attr('value') + ' ');
  if (search.match(/^\s*in:\S+\s*$/)) {
    $('.btn-activity-save_search').remove();
  }
  else {
    $('.btn-activity-edit_tag').remove();
  }

  Mailpile.pile_display(localStorage.getItem('view_size'));

  // Display Select
  $.each($('a.change-view-size'), function() {
    if ($(this).data('view_size') == localStorage.getItem('view_size')) {
      $(this).addClass('view-size-selected');
    }
  });

  // Tooltips
  Mailpile.Search.Tooltips.MessageTags();

};
