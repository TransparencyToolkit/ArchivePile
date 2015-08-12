Mailpile.UI.Sidebar.SubtagsToggle = function(tid) {
  if ($('#sidebar-subtags-' + tid).hasClass('hide')) {
    $('#sidebar-tag-' + tid).find('a.sidebar-tag span.sidebar-tag-expand').html('-');
    $('#sidebar-subtags-' + tid).removeClass('hide').slideDown('fast');
  } else {
    $('#sidebar-tag-' + tid).find('a.sidebar-tag span.sidebar-tag-expand').html('+');
    $('#sidebar-subtags-' + tid).addClass('hide').slideUp('fast');
  }
};