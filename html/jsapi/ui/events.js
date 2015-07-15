$(document).on('click', '.sidebar-tag-expand', function(e) {
  e.preventDefault();
  var tid = $(this).parent().data('tid');
  Mailpile.UI.Sidebar.SubtagsToggle(tid);
});


$(document).on('click', '.is-editing', function(e) {
  e.preventDefault();
});


$(document).on('click', '#button-sidebar-organize', function(e) {
  e.preventDefault();
  Mailpile.UI.Sidebar.OrganizeToggle();
});


$(document).on('click', '.sidebar-tag-archive', function(e) {
  e.preventDefault();
  Mailpile.UI.Sidebar.TagArchive();
});


$(document).on('click', '#button-sidebar-add', function(e) {
  e.preventDefault();
  Mailpile.UI.Modals.TagAdd({ location: 'sidebar' });
});


$(document).on('click', '#button-modal-add-tag', function(e) {
  e.preventDefault();
  Mailpile.UI.Modals.TagAddProcess($(this).data('location'));
});


$(document).on('click', '.hide-donate-page', function(e) {
  Mailpile.API.settings_set_post({ 'web.donate_visibility': 'False' }, function(e) {
    window.location.href = '/in/inbox/';
  });
});


$(document).on('click', 'span.checkbox, div.checkbox', function(e) {
  $(this).prev().trigger('click');
});

// FIXME: this is in the wrong place
Mailpile.auto_modal = function(params) {
  var jhtml_url = Mailpile.API.jhtml_url(params.url);
  if (params.flags) {
    jhtml_url += ((jhtml_url.indexOf('?') != -1) ? '&' : '?') +
                  'ui_flags=' + params.flags.replace(' ', '+');
  }
  return Mailpile.API.with_template('modal-auto', function(modal) {
    $.ajax({
      url: jhtml_url,
      type: params.method,
      success: function(data) {
        var mf = $('#modal-full').html(modal({
          data: data,
          icon: params.icon,
          title: params.title,
          header: params.header,
          flags: params.flags
        }));
        if (params.reload && !params.callback) {
          params.callback = function(data) { location.reload(true); };
        }
        if (params.callback) {
          // If there is a callback, we override the form's default behavior
          // and use AJAX instead so our callback can handle the result.
          mf.find('form').submit(function(ev) {
            ev.preventDefault();
            var url = mf.find('form').attr('action');
            if ('{{ config.sys.http_path }}' != '') url = url.substring('{{ config.sys.http_path }}'.length);
            url = '{{ config.sys.http_path }}/api/0' + url;
            $.ajax({
              type: "POST",
              url: url,
              data: mf.find('form').serialize(),
              // FIXME: Errors are not handled at all here!
              success: function(data) {
                mf.modal('hide');
                return params.callback(data);
              }
            });
            return false;
          });
        }
        mf.modal(Mailpile.UI.ModalOptions);
      }
    });
  }, undefined, params.flags);
};

$(document).on('click', '.auto-modal', function(e) {
  var elem = $(this);
  var title = elem.data('title') || elem.attr('title');
  Mailpile.auto_modal({
    url: this.href,
    method: elem.data('method') || 'GET',
    title: title,
    icon: elem.data('icon'),
    flags: elem.data('flags'),
    header: elem.data('header'),
    reload: elem.data('reload') || elem.hasClass('auto-modal-reload')
  });
  return false;
});
