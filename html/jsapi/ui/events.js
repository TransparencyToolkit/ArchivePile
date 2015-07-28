$(document).on('click', '.sidebar-tag.has-subtags', function(e) {
  e.preventDefault();
  var tid = $(this).data('tid');
  Mailpile.UI.Sidebar.SubtagsToggle(tid);
});


$(document).on('click', '.hide-donate-page', function(e) {
  Mailpile.API.settings_set_post({ 'web.donate_visibility': 'False' }, function(e) {
    window.location.href = '/in/inbox/';
  });
});


$(document).on('click', 'span.checkbox, div.checkbox', function(e) {
  $(this).prev().trigger('click');
});
