/* Search - Tooltips */

Mailpile.Search.Tooltips.MessageTags = function() {
  $('.pile-message-detail').qtip({
    content: {
      title: false,
      text: function(event, api) {

        console.log(Mailpile.instance.search_terms.join('+'));

        var tooltip_data = {
          mid: $(this).data('mid'),
          current_search: Mailpile.instance.search_terms,
          in_search: false
        }

        // Is Tag
        if ($(this).data('type') == 'tag') {

          var tag = _.findWhere(Mailpile.instance.tags, { tid: $(this).data('tid').toString() });
          _.extend(tooltip_data, tag);
          tooltip_data.type = 'tag';

          if (_.indexOf(Mailpile.instance.search_terms, 'in:' + tag.slug) > -1) {
            tooltip_data.in_search = true;
            tooltip_data.current_search = _.without(Mailpile.instance.search_terms, 'in:' + tag.slug);
          }

        } else if ($(this).data('type') == 'contact') {

          var contact = _.findWhere(Mailpile.instance.addresses, { address: $(this).data('address') });
          _.extend(tooltip_data, contact);
          tooltip_data.type = 'contact';

          if (_.indexOf(Mailpile.instance.search_terms, 'from:' + $(this).data('address')) > -1) {
            tooltip_data.in_search = true;
            tooltip_data.current_search = _.without(Mailpile.instance.search_terms, 'from:' + $(this).data('address'));
          } else if (_.indexOf(Mailpile.instance.search_terms, 'to:' + $(this).data('address')) > -1) {
            tooltip_data.in_search = true;
            tooltip_data.current_search = _.without(Mailpile.instance.search_terms, 'to:' + $(this).data('address'));
          }
        }

        var tooltip_template = _.template($('#tooltip-pile-details').html());
        return tooltip_template(tooltip_data);
      }
    },
    style: {
      classes: 'qtip-thread-crypto',
      tip: {
        corner: 'bottom center',
        mimic: 'bottom center',
        border: 0,
        width: 10,
        height: 10
      }
    },
    position: {
      my: 'bottom center',
      at: 'top left',
			viewport: $(window),
			adjust: {
				x: 7,  y: -4
			}
    },
    show: {
      event: 'click',
      delay: 50
    },
    hide: {
      event: false,
      inactive: 1500
    }
  });
};