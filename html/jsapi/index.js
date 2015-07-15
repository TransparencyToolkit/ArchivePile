// Make console.log not crash JS browsers that do not support it...
if (!window.console) window.console = {
  log: $.noop,
  group: $.noop,
  groupEnd: $.noop,
  info: $.noop,
  error: $.noop
};


// Mailpile global Javascript state and configuration /========================
Mailpile = {
  instance:           {},
  select_between:     false,
  search_target:      'none',
  search_cache:       [],
  messages_cache:     [],
  messages_composing: {},
  crypto_keylookup:   [],
  tags_cache:         [],
  contacts_cache:     [],
  keybindings:        [
    ["normal", "/",      function() { $("#search-query").focus(); return false; }],
    ["normal", "a c",    function() { Mailpile.UI.Modals.ContactAdd(); }],
    ["normal", "a t",    function() { Mailpile.UI.Modals.TagAdd(); }],
    ["normal", "c",      function() { Mailpile.activities.compose(); }],
    ["normal", "g i",    function() { Mailpile.go("/in/inbox/"); }],
    ["normal", "g i",    function() { Mailpile.go("/in/inbox/"); }],
    ["normal", "g d",    function() { Mailpile.go("/in/drafts/"); }],
    ["normal", "g c",    function() { Mailpile.go("/contacts/"); }],
    ["normal", "g n c",  function() { Mailpile.go("/contacts/add/"); }],
    ["normal", "g t",    function() { Mailpile.go("/tags/"); }],
    ["normal", "g n t",  function() { Mailpile.go("/tags/add/"); }],
    ["normal", "g s",    function() { Mailpile.go("/settings/profiles/"); }],
    ["normal", "h",      function() { Mailpile.go("/help/"); }],
    ["normal", "command+z", function() { alert('Undo Something ') }],
    ["normal", "ctrl+z",    function() { alert('Undo Something ') }],
    ["normal", "shift+[",   function() { alert('Will move up sidebar in:tag list') }],
    ["normal", "shift+]",   function() { alert('Will move down sidebar in:tag list') }],
    ["normal", "command+z", function() { alert('Undo Something ') }],
    ["normal", "space",  function() { Mailpile.bulk_action_toggle_target(); }],
    ["normal", "s a",    function() { Mailpile.bulk_action_select_all(); }],
    ["normal", "s b",    function() { Mailpile.bulk_action_select_between(); }],
    ["normal", "s n",    function() { Mailpile.bulk_action_select_none(); }],
    ["normal", "s i",    function() { Mailpile.bulk_action_select_invert(); }],
    ["normal", "j",      function() { Mailpile.bulk_action_selection_down(); }],
    ["normal", "k",      function() { Mailpile.bulk_action_selection_up(); }],
    ["normal", "enter",  function() { Mailpile.open_selected_thread(); }],
    ["normal", "f",      function() { Mailpile.update_search(); }],
    ["normal", ["m a"],  function() { Mailpile.keybinding_move_message(''); }],
    ["normal", ["m d"],  function() { Mailpile.keybinding_move_message('trash'); }],
    ["normal", ["m s"],  function() { Mailpile.keybinding_move_message('spam'); }],
    ["normal", ["t"],    function() { Mailpile.render_modal_tags(); }],
    ["normal", ["r"],    function() { Mailpile.bulk_action_read(); }],
    ["normal", ["u"],    function() { Mailpile.bulk_action_unread(); }],
    ["normal", ["up"],   function() { Mailpile.keybinding_target('up'); }],
    ["normal", ["down"], function() { Mailpile.keybinding_target('down'); }],
    ["normal", "left",   function() { if ($('#pile-previous').length) { Mailpile.go($('#pile-previous').attr('href'));} }],
    ["normal", "right",  function() { if ($('#pile-next').length) { Mailpile.go($('#pile-next').attr('href'));} }],
    ["global", "esc",    function() {
      $('input[type=text]').blur();
      $('textarea').blur();
    }]
  ],
  nagify: 1000 * 60 * 60 * 24 * 7, // Default nag is 1 per week
  commands:      [],
  graphselected: [],
  defaults: {
    view_size: "comfy",
  },
  config: {
    web: {{config.web|json|safe}}
  },
  api: {
    compose      : "{{ config.sys.http_path }}/api/0/message/compose/",
    compose_send : "{{ config.sys.http_path }}/api/0/message/update/send/",
    compose_save : "{{ config.sys.http_path }}/api/0/message/update/",
    contacts     : "{{ config.sys.http_path }}/api/0/search/address/",
    message      : "{{ config.sys.http_path }}/api/0/message/=",
    tag          : "{{ config.sys.http_path }}/api/0/tag/",
    tag_list     : "{{ config.sys.http_path }}/api/0/tags/",
    tag_add      : "{{ config.sys.http_path }}/api/0/tags/add/",
    tag_update   : "{{ config.sys.http_path }}/api/0/settings/set/",
    search_new   : "{{ config.sys.http_path }}/api/0/search/?q=in%3Anew",
    search       : "{{ config.sys.http_path }}/api/0/search/",
    settings_add : "{{ config.sys.http_path }}/api/0/settings/add/"
  },
  urls: {
    message_draft : "{{ config.sys.http_path }}/message/draft/=",
    message_sent  : "{{ config.sys.http_path }}/thread/=",
    tags          : "{{ config.sys.http_path }}/tags/"
  },
  plugins: [],
  theme: {},
  activities: {}
};
{% set theme_settings = theme_settings() %}
Mailpile.theme = {{ theme_settings|json|safe }};


// AJAX Wappers - This is the core Mailpile JS API /==========================
{#
##
## This autogenerates JS methods which fire GET & POST calls to Mailpile
## API/command endpoints.
##
## It also name-spaces and wraps any and all plugin javascript code.
##
#}
Mailpile.API = {
  _endpoints: { {%- for command in result.api_methods %}
    {{command.url|replace("/", "_")}}_{{command.method|lower}}: "/0/{{command.url}}/"{% if not loop.last %},{% endif %}
  {% endfor -%} },
  _sync_url: "{{ config.sys.http_path }}/api",
  _async_url: "{{ config.sys.http_path }}/async",

  _ajax_error: function(base_url, command, data, method, response, status) {
    console.log('Oops, an AJAX call returned as error :(');
    console.log('status: ' + status + ' method: ' + method + ' base_url: ' + base_url + ' command: ' + command);
    console.log(response);

    // General 500 internal errors.
    // FIXME: Make this more helpful for any errors we actually expect.
    if (command !== '/0/eventlog/' && status == 'error' && response.status == 500) {
      Mailpile.notification({
        status: 'error',
        message: '{{_("Oops. Mailpile failed to complete your task.")}}',
        icon: 'icon-signature-unknown'
      });
      return;
    }

    // Handle the long-polling eventlog stuff differently
    if (command == '/0/eventlog/' && status == 'error') {
      if (response.status == 404) {
        console.log('FIXME: SHOW CONNECTION DOWN!!!');
        //$('body').append($('#template-connection-down').html());
        return;
      }
      else if (status == 'error' && response.status == 0) {
        console.log('Request aborted by browser.');
        return;
      }
    }

    // Any other error state generates this annoying popup
    Mailpile.notification({
      status: 'warning',
      message: ('{{_("Something went wrong and we are not sure what")}}' +
                ' (response.status=' + response.status +
                ' status=' + status + ')'),
      icon: 'icon-signature-unknown'
    });
  },

  _action: function(base_url, command, data, method, callback) {
    // Output format
    var output = '';
    if (data._output) {
      output = data._output;
      delete data['_output'];
    }

    // Get search context
    var context = $('#search-query').data('context');

    // Force method to GET if not POST
    if (method !== 'GET' && method !== 'POST') method = 'GET';

    if (method === 'GET') {
      // Make Querystring
      var params = data._serialized;
      if (!params) {
        for (var k in data) {
          if (!data[k] || data[k] == undefined) {
            delete data[k];
          }
        }
        params = $.param(data);
      }
      if (context) params += '&context=' + context;

      $.ajax({
        url      : base_url + command + output + "?" + params,
        type     : 'GET',
        dataType : 'json',
        success  : callback,
        error: function(response, status) {
          Mailpile.API._ajax_error(base_url, command, data, method, response, status);
        }
      });
    }
    else if (method === 'POST') {
      if (context) {
        if (data._serialized) {
          data = data._serialized + '&context=' + context;
        }
        else {
          data['context'] = context;
        }
      }
      $.ajax({
        url      : base_url + command + output,
        type     : 'POST',
        data     : data,
        dataType : 'json',
        success  : callback,
        error    : function(response, status) {
          Mailpile.API._ajax_error(base_url, command, data, method, response, status);
        }
      });
    }
    return true;
  },

  jhtml_url: function(original_url) {
    var new_url = original_url;
    var html = new_url.indexOf('.html');
    if (html != -1) {
      new_url = (new_url.slice(0, html+1) + 'j' +
                 new_url.slice(html+1));
    }
    else {
      var qs = new_url.indexOf('?');
      if (qs != -1) {
        new_url = (new_url.slice(0, qs) + 'as.jhtml' +
                   new_url.slice(qs));
      }
      else {
        var anch = new_url.indexOf('#');
        if (anch != -1) {
          new_url = (new_url.slice(0, anch) + 'as.jhtml' +
                     new_url.slice(anch));
        }
        else {
          new_url += 'as.jhtml';
        }
      }
    }
    return new_url;
  },

  with_template: function(name, action, error, flags) {
      var url = "{{ config.sys.http_path }}/jsapi/templates/" + name + ".html";
      if (flags) {
        url += '?ui_flags=' + flags.replace(' ', '+');
      }
      $.ajax({
        url: url,
        type: 'GET',
        success: function(data) { action(_.template(data)); },
        error: error
      });
  },

  _sync_action: function(command, data, method, callback) {
    return Mailpile.API._action(Mailpile.API._sync_url, command, data, method, callback);
  },

  _async_action: function(command, data, method, callback, flags) {
    function handle_event(data) {
      if (data.result.resultid) {
        subreq = {event_id: data.result.resultid, flags: flags};
        var subid = EventLog.subscribe(subreq, function(ev) {
          callback(ev.private_data, ev);
          if (ev.flags == "c") {
            EventLog.unsubscribe(data.result.resultid, subid);
          }
        });
      }
    }
    return Mailpile.API._action(Mailpile.API._async_url, command, data, method, handle_event, flags);
  },

  _method: function(method, methods) {
    if (!method || methods.indexOf(method) == -1) return methods[0];
    return method;
  },
{#- Loop through all commands, creating both sync and async API methods #}
  {%- for command in result.api_methods -%}
    {%- set n = command.url|replace("/", "_") %}
    {%- set m = command.method|lower %}
    {%- set u = command.url %}
    {%- set cm = command.method %}

  {{n}}_{{m}}: function(d,c,m){return Mailpile.API._sync_action("/0/{{u}}/",d,Mailpile.API._method(m,["{{cm}}"]),c);},
  async_{{n}}_{{m}}: function(d,c,m){return Mailpile.API._async_action("/0/{{u}}/",d,Mailpile.API._method(m,["{{cm}}"]),c);}{% if not loop.last %},{% endif %}
  {% endfor %}

};


// Plugin Javascript /========================================================
{#
## Note: we do this in multiple commands instead of one big dict, so plugin
## setup code can reference other plugins. Plugins are expected to return a
## dictionary of values they want to make globally accessible.
##
## FIXME: Make sure the order is somehow sane given dependenies.
#}
{% for js_class in result.javascript_classes %}
{% set js_classname = js_class.classname.capitalize() -%}
{% if js_class.code -%}
{{ js_classname }} = (function(){
{{ js_class.code|safe }}
})(); // End of {{ js_classname }} /----------- ---- --- -- -

{% else -%}
{{ js_classname }} = {};
{% endif %}
{% endfor %}


// JS App Files /=============================================================
{% include("jsapi/global/eventlog.js") %}
{% include("jsapi/global/activities.js") %}
{% include("jsapi/global/global.js") %}
{% include("jsapi/global/helpers.js") %}
{% include("jsapi/global/keybindings.js") %}
{% include("jsapi/global/notifications.js") %}


// JS - UI /==================================================================
{% include("jsapi/ui/init.js") %}
{% include("jsapi/ui/content.js") %}
{% include("jsapi/ui/events.js") %}
{% include("jsapi/ui/global.js") %}
{% include("jsapi/ui/topbar.js") %}
{% include("jsapi/ui/modals.js") %}
{% include("jsapi/ui/sidebar.js") %}
{% include("jsapi/ui/tooltips.js") %}

// EOF
