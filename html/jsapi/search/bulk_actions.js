Mailpile.bulk_actions_update_ui = function() {
  Mailpile.hide_message_hints();
  if (Mailpile.messages_cache.length > 0) {
    var message = ('<span id="bulk-actions-selected-count">' +
                     Mailpile.bulk_cache_human_length('messages_cache') +
                   '</span> ');
    if (_.indexOf(Mailpile.messages_cache, '!all') > -1) {
      message = ('<a onclick="javascript:Mailpile.unselect_all_matches();">' +
                   '<span class="icon-new"></span> ' +
                   $('#bulk-actions-message').data('unselect_all') +
                 '</a>');
    }
    else if ($("#pile-select-all-action").attr('checked')) {
      // This extra check is necessary, because some actions don't
      // untick the select-all box.
      var checkboxes = $('#pile-results input[type=checkbox]');
      if (Mailpile.messages_cache.length == checkboxes.length) {
        message = ('<a onclick="javascript:Mailpile.select_all_matches();">' +
                     message + ' ' +
                     $('#bulk-actions-message').data('select_all') +
                   '</a>');
      }
      else {
        message += $('#bulk-actions-message').data('bulk_selected');
      }
    }
    else {
      message += $('#bulk-actions-message').data('bulk_selected');
      if (Mailpile.messages_cache.length == 1) Mailpile.show_message_hints();
    }
    $('#bulk-actions-message').html(message);
    Mailpile.show_bulk_actions($('.bulk-actions').find('li.hide'));
  }
  else {
    var message = $('#bulk-actions-message').data('bulk_selected_none');
    $('#bulk-actions-message').html(message);
    Mailpile.hide_bulk_actions($('.bulk-actions').find('li.hide'));
  }
};


Mailpile.hide_message_hints = function() {
  $('div.bulk-actions-hints').html('');
};


Mailpile.show_message_hints = function() {
  $.each(Mailpile.messages_cache, function(key, mid) {
    if (mid != '!all') {
      var $elem = $('#pile-message-' + mid);
      var hint = $elem.data('context-hint');
      if (hint) {
        var icon = $elem.data('context-icon');
        var url = $elem.data('context-url');
        var html = '';
        if (icon) html += '<span class="icon icon-' + icon + '"></span> ';
        html += hint;
        if (url) html = '<a href="' + url + '">' + html + '</a>';
        $('div.bulk-actions-hints').html(html);
      }
    }
  });
};


Mailpile.select_all_matches = function() {
  Mailpile.bulk_cache_add('messages_cache', '!all');
  Mailpile.bulk_actions_update_ui();
  return false;
};


Mailpile.unselect_all_matches = function() {
  Mailpile.bulk_cache_remove('messages_cache', '!all');
  Mailpile.bulk_actions_update_ui();
  return false;
};


Mailpile.bulk_action_read = function() {
  Mailpile.API.tag_post({ del: 'new', mid: Mailpile.messages_cache }, function(result) {
    $.each(Mailpile.messages_cache, function(key, mid) {
      if (mid != '!all') $('#pile-message-' + mid).removeClass('in_new');
    });
  });
};


Mailpile.bulk_action_unread = function() {
  Mailpile.API.tag_post({ add: 'new', mid: Mailpile.messages_cache }, function(result) {
    $.each(Mailpile.messages_cache, function(key, mid) {
      if (mid != '!all') $('#pile-message-' + mid).addClass('in_new');
    });
  });
};


Mailpile.bulk_action_select_target = function() {
  var target = this.search_target;
  var mid = $('#pile-results li').eq(target).data('mid');
  Mailpile.bulk_cache_add('messages_cache', mid);
  $('#pile-message-' + mid).addClass('result-on').find('input[type=checkbox]').prop('checked', true);
  this.bulk_actions_update_ui();
  return true;
};


Mailpile.bulk_action_deselect_target = function() {
  var target = this.search_target;
  var mid = $('#pile-results li').eq(target).data('mid');
  Mailpile.bulk_cache_remove('messages_cache', mid);
  $('#pile-message-' + mid).removeClass('result-on').find('input[type=checkbox]').prop('checked', false);
  this.bulk_actions_update_ui();
  return true;
};


Mailpile.bulk_action_toggle_target = function() {
  var target = this.search_target;
  // No Target
  if (target === 'none') {
    var mid = $('#pile-results li').eq(0).data('mid');
    if ($('#pile-message-' + mid).find('input[type=checkbox]').is(':checked')) {
      Mailpile.pile_action_unselect($('#pile-message-' + mid));
    } else {
      Mailpile.pile_action_select($('#pile-message-' + mid));
    }
  }
  // Has Target
  else {
    var mid = $('#pile-results li').eq(target).data('mid');
    if ($('#pile-message-' + mid).find('input[type=checkbox]').is(':checked')) {
      Mailpile.bulk_action_deselect_target();
    } else {
      Mailpile.bulk_action_select_target();
    }
  }
  return true;
};


Mailpile.bulk_action_select_all = function() {
  var checkboxes = $('#pile-results').find('input[type=checkbox]');
  $.each(checkboxes, function() {
    Mailpile.pile_action_select($('#pile-message-' + $(this).data('mid')));
  });
  $("#pile-select-all-action").attr('checked','checked');
  Mailpile.bulk_actions_update_ui();
};


Mailpile.bulk_action_select_none = function() {
  var checkboxes = $('#pile-results').find('input[type=checkbox]');
  $.each(checkboxes, function() {
    Mailpile.pile_action_unselect($('#pile-message-' + $(this).data('mid')));
  });
  $("#pile-select-all-action").removeAttr('checked');
  Mailpile.bulk_cache_remove('messages_cache', '!all');
  Mailpile.bulk_actions_update_ui();
};


Mailpile.bulk_action_select_invert = function() {
  var checkboxes = $('#pile-results input[type=checkbox]');
  $.each(checkboxes, function() {
    if ($(this).is(":checked")) {
      Mailpile.pile_action_unselect($(this).parent().parent());
    } else {
      Mailpile.pile_action_select($(this).parent().parent());
    }
  });
  if (this['messages_cache'].length == checkboxes.length) {
    $("#pile-select-all-action").attr('checked','checked');
  } else if (this['messages_cache'].length == 0) {
    $("#pile-select-all-action").removeAttr('checked');
    Mailpile.bulk_cache_remove('messages_cache', '!all');
  }
  Mailpile.bulk_actions_update_ui();
};


Mailpile.bulk_action_select_between = function() {
  alert('FIXME: Will select messages between two points');
};


Mailpile.bulk_action_selection_up = function() {
  var checkboxes = $('#pile-results').find('input[type=checkbox]');
  if (this['messages_cache'].length == 0) {
    Mailpile.pile_action_select($(checkboxes[checkboxes.length-1]).parent().parent());
    return;
  }
  $.each(checkboxes, function() {
    if ($(this).parent().parent().next().children().children("input").is(":checked")) {
      Mailpile.pile_action_select($(this).parent().parent());
    } else {
      Mailpile.pile_action_unselect($(this).parent().parent());
    }
  });
};


Mailpile.bulk_action_selection_down = function() {
  var checkboxes = $('#pile-results').find('input[type=checkbox]');
  if (this['messages_cache'].length == 0) {
    Mailpile.pile_action_select($(checkboxes[0]).parent().parent());
    return;
  }
  $(checkboxes.get().reverse()).each(function() {
    if ($(this).parent().parent().prev().children().children("input").is(":checked")) {
      Mailpile.pile_action_select($(this).parent().parent());
    } else {
      Mailpile.pile_action_unselect($(this).parent().parent());
    }
  });
};


Mailpile.open_selected_thread = function() {
  if (Mailpile.messages_cache.length === 1) {
    $("#pile-results input[type=checkbox]:checked").each(function() {
      window.location.href = $(this).parent().parent()
                                    .children(".subject")
                                    .children("a").attr("href");
    });
  }
  else if (Mailpile.search_target !== 'none') {
    var target = this['search_target'];
    var mid = $('#pile-results li').eq(target).data('mid');
    window.location.href = Mailpile.urls.message_sent + mid + '/';
  }
};
