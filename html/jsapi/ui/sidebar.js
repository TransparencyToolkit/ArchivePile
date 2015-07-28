Mailpile.UI.Sidebar.SubtagsToggle = function(tid) {

  // Show or Hide
  if (_.indexOf(Mailpile.config.web.subtags_collapsed, tid) > -1) {
    $('#sidebar-tag-' + tid).addClass('show-subtags');
    $('#sidebar-tag-' + tid).find('a.sidebar-tag span.sidebar-tag-expand span').removeClass('icon-arrow-left').addClass('icon-arrow-down');
    $('#sidebar-subtags-' + tid).slideDown('fast');
    var collapsed = _.without(Mailpile.config.web.subtags_collapsed, tid);
  } else {
    $('#sidebar-tag-' + tid).removeClass('show-subtags');
    $('#sidebar-tag-' + tid).find('a.sidebar-tag span.sidebar-tag-expand span').removeClass('icon-arrow-down').addClass('icon-arrow-left');
    $('#sidebar-subtags-' + tid).slideUp('fast');
    Mailpile.config.web.subtags_collapsed.push(tid);
    var collapsed = Mailpile.config.web.subtags_collapsed;
  }

  // Save to Config
  Mailpile.config.web.subtags_collapsed = collapsed;
  Mailpile.API.settings_set_post({ 'web.subtags_collapsed': collapsed }, function(result) { 

  });
};