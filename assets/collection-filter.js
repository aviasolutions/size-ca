/**
 * Handles filtering and sorting for collection.liquid
 * It is a mix of new & old code. Hoping it is more
 * readable than the old but no guarentee ;)
 */
$(document).ready(function() {
  // Hide all empty filters
  // TODO do this in liquid
  $('.clearfix.filter:not(:has(li))').html('');

  // jquery objects
  var $searchBox = $('#search_box');
  var $searchButton = $('#search_button');
  var $parent = $('#product-loop');
  var $loading = $('.loading_container');

  // Visually open & close filter groups
  $('.filter:not(.first) h4').click(function() {
    var open = $(this).attr('data-open');

    if (open === 'true') {
      $(this)
        .next()
        .slideUp();
      $(this).attr('data-open', 'false');
    } else {
      $(this)
        .next()
        .slideDown();
      $(this).attr('data-open', 'true');
    }
  });

  // The collection in questions handle
  var handle = $('#collection-handle').attr('data-handle');
  // The name of the store
  var store = $('#store-name').attr('data-name');

  // Create the searchable collection
  var collection = Crisp.SearchableCollection({
    handle: handle,
    collectionTemplate: '__DO-NOT-SELECT__.products',
    searchTemplate: '__DO-NOT-SELECT__',
    // Enable * searching
    exact: false,
  });

  // Generate filter groups
  var declaredFilters = $.map(
    $('#sort-me')
      .children('li')
      .toArray(),
    function(group, i) {
      var $group = $(group);

      // Generate the filters
      var children = $.map($group.find('[data-selected]').toArray(), function(
        filter
      ) {
        var $f = $(filter);

        return {
          name: $f.attr('data-filter'),
          // eslint-disable-next-line @satel/jquery-dollar-sign-reference
          context: $f,
          filter: function(payload) {
            return payload.tags.indexOf('f-' + $f.attr('data-filter')) !== -1;
          },
        };
      });

      // Compatibility filter
      if (i === 0) {
        return {
          name: 'compatibility',
          exclusive: true,
          children: children,
        };
      }

      // Other filters
      return {
        name: 'group-' + $group.attr('data-index'),
        // eslint-disable-next-line @satel/jquery-dollar-sign-reference
        context: $group,
        children: children,
      };
    }
  );

  // Create a Crisp.Filter
  var crispFilter = Crisp.Filter({
    global: [
      function(payload) {
        return !payload.skip;
      },
      function(payload) {
        return payload.tags.indexOf('no_show') === -1;
      },
    ],
    filters: declaredFilters,
  });

  // Listen to filter events
  function onFilterUpdate(e) {
    // Update checkbox
    e.context.attr('data-selected', e.selected);

    var $parent = crispFilter.context(e.parent);

    /**
     * This section is needed to do the complex show / hide
     * for the filters related to compatibility
     * 1. `data-paired=true` are only shown when corresponding compat is selected
     * 2. Everything else is shown unless a compat **is** selected and is not listed in `data-family`
     */

    if (e.parent === 'compatibility') {
      $('#sort-me')
        .children('li[data-parent]')
        .each(function(i, elem) {
          var $e = $(elem);
          var group = 'group-' + $e.attr('data-index');
          var paired = $e.attr('data-paired') === 'true';
          var parent = $e.attr('data-parent');

          /**
           * Selected:
           * 1. Show correct `data-paired`
           * 2. Hide all that don't list e.name in `data-parent`
           */
          if (e.selected) {
            if (paired && parent === e.name) {
              $e.show();
              // Open with animation
              $e.children('ul').slideDown();
              $e.children('h4').attr('data-open', 'true');

              loadProfileFilters(parent);
              return;
            }

            if (!paired && parent.indexOf(e.name) === -1) {
              crispFilter.clear(group);
              // Reset for animation
              $e.children('ul').slideUp();
              $e.children('h4').attr('data-open', 'false');
              $e.hide();
              return;
            }
          }

          /**
           * Deselected:
           * 1. Hide & clear all `data-paired`
           * 2. Show all non `data-paired`
           */
          if (!e.selected) {
            if (paired) {
              crispFilter.clear(group);
              // Reset for animation
              if (store_url != 'iwp') {
                $e.children('ul').slideUp();
                $e.children('h4').attr('data-open', 'false');
                $e.hide();
              }
              return;
            }
            $e.show();
          }
        });

      return;
    }

    /**
     * For each selected event make sure the dropdown is open
     * Only really needed when loading page with url params
     */
    if (e.selected === true && $parent) {
      $parent.children('ul').slideDown();
      $parent.children('h4').attr('data-open', 'true');
    }
  }
  crispFilter.on('update', onFilterUpdate);

  // HISTORY
  var queryString = '';

  // Set the state
  function updateHistory() {
    History.replaceState(
      { query: queryString, filters: filterString },
      store,
      '?q=' + queryString + '&filter=' + crispFilter.getQuery()
    );
  }

  // Pretend we have scope -_-
  function updateQuery(q) {
    queryString = q;
    updateHistory();
  }

  // Function to print products to screen
  function showProducts(payload) {
    var contents = $parent.html();

    // Show warnings
    if (payload.length === 0) {
      if (contents === '')
        $parent.append("<div class='error'>" + language.no_products + '</div>');
      // Assume we have hit the end of scrolling
      else if (!contents.includes('<div class="error">'))
        return $parent.append(
          "<div class='error'>" + language.no_products + '</div>'
        );
    }

    //if search returns one product, redirect to product page on IWP
    if (payload.length === 1) {
      if (store_url == 'iwp') {
        if (contents === '') {
          var product_url = payload[0].url;
          window.location.href = product_url;
        }
      }
    }
    // Render products on collection page
    payload.forEach(function(row) {
      var url = row.url;
      var image = row.image;
      var title = row.title;
      var show_price = row.show_price;
      var price_min = row.price_min;
      var price_max = row.price_max;
      var price = row.price;
      var compare = row.compare;
      var highlight = highlightTitle(row.tags);

      // truncate long product titles
      if (title.length > 60) {
        title = title.substr(0, 60) + '...';
      }

      if (highlight) {
        var title = '<span class="highlight_title">HOT! </span>' + title;
      }

      if (typeof theme == "object" && theme.accepted_locations.indexOf(theme.geo_location) == -1) {
        show_price = false;
      }

      var string =
        " \
      <div class='product_listing desktop-3 tablet-2 mobile-half'> \
        <div class='product_listing_image'> \
          <a href='" +
        url +
        "'> \
            <img src='" +
        image +
        "' /> \
          </a> \
        </div> \
        <div class='product_listing_title'> \
          <h5>" +
        title +
        "</h5> \
        </div> \
        <div class='product_listing_content'>";

      if (show_price || store_url == 'iwp') {
        if (price_min == price_max) {
          // hide prices on KMT-EMEA
          if (store_url != 'kmt_emea') {
            string += '<div class="product_listing_price">' + price + '</div>';
          }

          if (price !== compare && compare !== '' && compare > price) {
            string +=
              "<div class='product_listing_compare'>" + compare + '</div>';
          }
        } else {
          if (store_url != 'kmt_emea') {
            string +=
              '<div class="product_listing_price">' +
              price_min +
              ' - ' +
              price_max +
              '</div>';
          }
        }
      }

      string +=
        " \
          <div class='product_listing_button'> \
            <a href='" +
        url +
        "' class='button reverse'>" +
        language.buy_now +
        '</a> \
          </div> \
        </div> \
      </div>';

      var $string = $('<div />')
        .html(string)
        .contents();
      $parent.append($string);
    });

    // Disable loading animation
    $loading.hide();
  }

  // Function to handle loaded products
  function handleResponse(res) {
    // Handle errors
    if (res.error) {
      // Log if not cancellation
      if (!Crisp.isCancel(res.error)) {
        // TODO
        console.error(res.error);
      }
      return;
    }

    // Handle payload
    showProducts(res.payload);
  }

  // Load products
  function load(reset) {
    // If we want to clear the loop
    if (reset) {
      $parent.html('');
    }

    // Show animation
    $loading.show();

    // Make request
    collection.getNext({
      number: 24,
      callback: handleResponse,
    });
  }

  function loadProfileFilters(parent) {
    $('[data-default="true"]').each(function() {
      var preselect = $(this).attr('data-filter');

      if (preselect.includes(parent)) {
        crispFilter.select(preselect);
      }
    });
  }

  // Search
  function search() {
    // Extract the text
    var term = $searchBox.val();

    // Set the query
    collection.setQuery(term);

    // Update history
    updateQuery(term);

    // Display new products and reset
    load(true);
  }

  // Handle search
  $searchBox.keyup(search);
  $searchButton.click(search);

  // Filter UI
  var $filters = $('#sort-me li.filter');
  var $filterOptions = $('#sort-me [data-filter]');

  // Event listener - update filter state
  $filterOptions.click(function(e) {
    //filter-all check
    var data_selected = $(this).attr('data-selected');
    var group = $(this).attr('data-section');
    var class_name = e.currentTarget.className;
    var filter_parent = class_name.split('-')[0];

    if (class_name.indexOf('-all') != -1) {
      var data_group = '[data-section=' + group + ']';
      var is_selected =
        $(data_group + "[data-selected='true']").length == $(data_group).length;

      if (!is_selected) {
        //select all
        $(data_group).each(function() {
          var filter = $(this).attr('data-filter');
          crispFilter.select(filter);
        });

        //adds filter-all to url filter
        crispFilter.select(class_name);
      } else {
        //deselect all
        $(data_group).each(function() {
          var filter = $(this).attr('data-filter');
          crispFilter.deselect(filter);
        });

        //remove from url filter
        crispFilter.deselect(class_name);
      }
    } else if (
      $(this)
        .attr('data-filter')
        .indexOf(filter_parent) > -1
    ) {
      var filter = $(this).attr('data-filter');
      var parent_filter_all = e.currentTarget.parentElement.firstElementChild.className;
      var parent_filter_check = parent_filter_all.split('-') != '';

      if (data_selected == 'true') {
        crispFilter.deselect(filter);
        if (parent_filter_check) {
          crispFilter.deselect(parent_filter_all);
        }
      } else {
        crispFilter.select(filter);
        var all_selected =
          $("[data-section='" + group + "'][data-selected='true']").length ==
          $("[data-section='" + group + "']").length - 1;

        if (all_selected && parent_filter_check) {
          crispFilter.select(parent_filter_all);
        }
      }
    } else {
      // Get the li target
      var $target = $(e.currentTarget);

      // Get attributes
      var checked = $target.attr('data-selected') !== 'true';

      // Select / Deselect
      if (checked) {
        crispFilter.select($target.attr('data-filter'));
      } else {
        crispFilter.deselect($target.attr('data-filter'));
      }
    }

    // Update History state
    updateHistory();

    // Update the filter function
    collection.setFilter(crispFilter.fn());

    // Fetch & update ui
    load(true);
  });

  // Legacy infinite scroll calc
  var nav_to_bottom = $(document).height() - $('#pagination').offset().top;

  // Legacy infinite scroll function
  var infiniteScroll = function() {
    var window_to_bottom =
      0 + $(document).height() - $(window).scrollTop() - $(window).height();

    if (window_to_bottom - 40 < nav_to_bottom) {
      $(window).unbind('scroll', infiniteScroll);

      // HOOK
      load();

      setTimeout(function() {
        nav_to_bottom = $(document).height() - $('#pagination').offset().top;
        $(window).bind('scroll', infiniteScroll);
      }, 500);
    }
  };

  // Legacy infinite scroll start
  setTimeout(function() {
    $(window).bind('scroll', infiniteScroll);
  }, 1000);

  // Load old url filters using janky jquery snippet
  $.urlParam = function(name) {
    var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(
      window.location.href
    );
    if (results == null) {
      return null;
    } else {
      return decodeURI(results[1]) || 0;
    }
  };

  // Update history initial state
  queryString = $.urlParam('q') || '';
  filterString = $.urlParam('filter') || '';

  // Handle search term
  if ($.urlParam('q')) {
    // Set text box
    $searchBox.val($.urlParam('q'));

    // Set the query
    collection.setQuery($.urlParam('q'));
  }

  // Setup filter ui
  $('#sort-me')
    .children('li[data-paired="false"]')
    .each(function(i, elem) {
      $(elem).show();
    });

  // Set filters based on query param
  if ($.urlParam('filter')) {
    crispFilter.setQuery($.urlParam('filter'));
  }

  // Update the filter function
  collection.setFilter(crispFilter.fn());

  load(true);

  // Load saved user compatibility proile if logged in
  var load_profile_filter = $('[data-section="group0"]').attr('data-filter');
  var has_default = $('.has-default').length;
  var sale_collection = window.location.pathname.includes('all');

  // only load saved machine profile on collection/all
  if (sale_collection && has_default > 0) {
    crispFilter.select(load_profile_filter);
  }

  // Open manufacturer filter on load for IWP
  if (store_url == 'iwp') {
    $(".filter[data-index='1']")
      .css('display', 'list-item')
      .children()
      .slideDown()
      .attr('data-open', 'true');

    // no manufacturer tag search on IWP
    var $group_1 = $('li[data-section="group1"]');

    $group_1.click(function() {
      var group1_filter_selected;

      $group_1.each(function(i, el) {
        var selected = $(el).attr('data-selected');

        if (selected == 'false') {
          group1_filter_selected = false;
        } else {
          group1_filter_selected = true;
        }
      });

      if (group1_filter_selected == false) {
        crispFilter.deselect(load_profile_filter);
      }
    });
  }

  // TODO: Redo this logic

  //show the products or diagrams
  $('.byProducts span').addClass('activeCheckBox');

  var $triggerShow = $('.triggerShow');
  $triggerShow.on('click', function() {

    if ($(this).hasClass('byProducts')) {
      $('.showProducts').fadeIn();
      $('.showDiagram').fadeOut();

      $('.device-filter, .diagram-filter').css('display', 'none');

      $('.byProducts span').addClass('activeCheckBox');
      $('.byDiagram span').removeClass('activeCheckBox');
    } else {
      $('.showProducts').fadeOut();
      $('.showDiagram').fadeIn();

      $('.device-filter, .diagram-filter').css('display', 'block');
      $('.byDiagram span').addClass('activeCheckBox');
      $('.byProducts span').removeClass('activeCheckBox');
    }
  });
});