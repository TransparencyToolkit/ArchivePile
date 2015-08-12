/* UI */

Mailpile.UI = {
  ModalOptions: { backdrop: true, keyboard: true, show: true, remote: false }
};

Mailpile.UI.Crypto   = {};
Mailpile.UI.Sidebar  = {};
Mailpile.UI.Modals   = {};
Mailpile.UI.Tooltips = {};
Mailpile.UI.Message  = {};
Mailpile.UI.Search   = {};


Mailpile.UI.init = function() {

  // Favicon
  var inbox = _.findWhere(Mailpile.instance.tags, {slug: 'inbox'});

  // Show Typeahead
  Mailpile.activities.render_typeahead();

  // Start Eventlog
  //EventLog.init();
  setTimeout(function() {

    // make event log start async (e.g. for proper page load event handling)
    EventLog.timer = $.timer();
    EventLog.timer.set({ time : 22500, autostart : false });
    EventLog.poll();

  }, 1000);

  /* Tooltips */
  Mailpile.UI.Tooltips.TopbarNav();
  Mailpile.UI.Tooltips.BulkActions();

};


Mailpile.UI.tag_icons_as_lis = function() {
  var icons_html = '';
  $.each(Mailpile.theme.icons, function(key, icon) {
    icons_html += '<li class="modal-tag-icon-option ' + icon + '" data-icon="' + icon + '"></li>';
  });
  return icons_html;
};


Mailpile.UI.tag_colors_as_lis = function() {
  var sorted_colors =  _.keys(Mailpile.theme.colors).sort();
  var colors_html = '';
  $.each(sorted_colors, function(key, name) {
    var hex = Mailpile.theme.colors[name];
    colors_html += '<li><a href="#" class="modal-tag-color-option" style="background-color: ' + hex + '" data-name="' + name + '" data-hex="' + hex + '"></a></li>';
  });
  return colors_html;
};
