$.getScript("//cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.js").done(function() {
  quickView();
});

//Quick View
function quickView() {
  $(".quick-view-button .quick-view").unbind('click');
  $(".quick-view-button .quick-view").off('click');
  $(document).on('click',".quick-view-button .quick-view",function (e) {
    e.preventDefault();
    var variant_length = 0;
    if ($('#quick-view').length == 0){$("body").append('<div id="quick-view"></div>');}
    var product_handle = $(this).data('handle');
    var $product = $(this).closest('.aa-product');
    $('#quick-view').addClass(product_handle);
    jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
      getQuickViewProductData(product);
      var title = product.title;
      var type = product.type;
      var price = 0;
      var original_price = 0;
      var desc = product.description;
      var images = product.images;
      var variants = product.variants;
      var options = product.options;
      var url = '/products/' + product_handle;
      $('.qv-product-title').text(title);
      $('.qv-product-type').text(type);
      $('.qv-product-description').html(desc);
      $('.view-product').attr('href', url);
      var imageCount = $(images).length;
      $(images).each(function (i, image) {
        if (i == imageCount - 1) {
          var image_embed = '<div><img src="' + image + '"></div>';
          image_embed = image_embed.replace('.jpg', '_800x.jpg').replace('.png', '_800x.png');
          $('.qv-product-images').append(image_embed);

          $('.qv-product-images').slick({
            'dots': true,
            'arrows': true,
            'respondTo': 'min',
            'useTransform': false
          }).css('opacity', '1');

        } else {
          image_embed = '<div><img src="' + image + '"></div>';
          image_embed = image_embed.replace('.jpg', '_800x.jpg').replace('.png', '_800x.png');
          $('.qv-product-images').append(image_embed);
        }
      });
      
      $(options).each(function (i, option) {
        var opt = option.name;
        var selectClass = '.option.' + opt.toLowerCase();
        $('.qv-product-options').append('<div class="option-selection-' + opt.toLowerCase() + '"><span class="option">' + opt + '</span><select class="option-' + i + ' option ' + opt.toLowerCase() + '"></select></div>');
        $(option.values).each(function (i, value) {
          $('.option.' + opt.toLowerCase()).append('<option value="' + value + '">' + value + '</option>');
        });
      });
      $(options).each(function (i, option) {
        var opt = option.name;
      
        var selectClass = '.option.' + opt.toLowerCase();
        var cls = '';
        console.log(option);
        var title = opt;
        if(title == 'size' || title == 'Size' ){
         title = 'Pick your US size';
        }
        $('.qv-product-swatch').append('<div class="ctm_swatches hide swatch-option-selection-' + opt.toLowerCase() + '"><span class="option">' + title+ '<a href="javascript:void(0);" class="coll_size_btn"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><path d="M148.454,147.934c-1.664-5.291-7.303-8.23-12.59-6.564c-5.289,1.664-8.227,7.301-6.564,12.589c0.802,2.55,1.209,5.214,1.209,7.923c0,14.536-11.822,26.363-26.353,26.363c-14.536,0-26.363-11.826-26.363-26.363c0-14.532,11.826-26.353,26.363-26.353c2.618,0,5.201,0.381,7.677,1.132c5.306,1.61,10.912-1.384,12.523-6.689c1.61-5.306-1.384-10.912-6.69-12.523c-4.367-1.326-8.912-1.999-13.509-1.999c-25.608,0-46.441,20.829-46.441,46.431c0,25.608,20.833,46.441,46.441,46.441c25.602,0,46.431-20.833,46.431-46.441C150.588,157.129,149.87,152.436,148.454,147.934z"/><path d="M501.961,379.482c-5.545,0-10.039,4.496-10.039,10.039v8.031c0,5.544,4.495,10.039,10.039,10.039S512,403.097,512,397.553v-8.031C512,383.978,507.505,379.482,501.961,379.482z"/><path d="M501.961,369.443c5.545,0,10.039-4.496,10.039-10.039V256c0-5.544-4.495-10.039-10.039-10.039H165.553c25.898-18.966,42.752-49.589,42.752-84.078c0-57.426-46.72-104.147-104.147-104.147C46.725,57.736,0,104.456,0,161.882v188.235c0,57.426,46.725,104.147,104.157,104.147h397.804c5.545,0,10.039-4.496,10.039-10.039v-16.555c0-5.544-4.495-10.039-10.039-10.039s-10.039,4.496-10.039,10.039v6.515h-80.314V266.039h80.314v93.365C491.922,364.948,496.416,369.443,501.961,369.443z M104.157,77.814c46.355,0,84.068,37.712,84.068,84.068c0,46.361-37.713,84.078-84.068,84.078c-46.361,0-84.078-37.717-84.078-84.078C20.078,115.526,57.796,77.814,104.157,77.814zM391.529,434.186h-36.141v-26.815c0-5.544-4.495-10.039-10.039-10.039s-10.039,4.496-10.039,10.039v26.815h-34.806v-8.384c0-5.544-4.495-10.039-10.039-10.039s-10.039,4.496-10.039,10.039v8.384H245.63v-26.815c0-5.544-4.495-10.039-10.039-10.039c-5.545,0-10.039,4.496-10.039,10.039v26.815h-34.806v-8.384c0-5.544-4.495-10.039-10.039-10.039c-5.545,0-10.039,4.496-10.039,10.039v8.384h-34.806v-26.815c0-5.544-4.495-10.039-10.039-10.039c-5.545,0-10.039,4.496-10.039,10.039v26.815h-11.625c-8.037,0-15.805-1.156-23.17-3.273v-11.786c0-5.544-4.495-10.039-10.039-10.039c-5.545,0-10.039,4.496-10.039,10.039v3.053c-24.443-14.721-40.83-41.511-40.83-72.063V223.283c18.966,25.901,49.589,42.756,84.078,42.756h11.625v26.815c0,5.544,4.495,10.039,10.039,10.039c5.545,0,10.039-4.496,10.039-10.039v-26.815h89.69v26.815c0,5.544,4.495,10.039,10.039,10.039c5.545,0,10.039-4.496,10.039-10.039v-26.815h89.68v26.815c0,5.544,4.495,10.039,10.039,10.039s10.039-4.496,10.039-10.039v-26.815h36.141V434.186z"/><path d="M451.765,323.012c-14.946,0-27.106,12.159-27.106,27.106c0,14.946,12.159,27.106,27.106,27.106c14.946,0,27.106-12.16,27.106-27.106C478.871,335.171,466.711,323.012,451.765,323.012z M451.765,357.145c-3.875,0-7.027-3.153-7.027-7.027s3.152-7.027,7.027-7.027s7.027,3.153,7.027,7.027S455.64,357.145,451.765,357.145z"/></svg> <span>Size Guide</span></a>' + '</span><div class="option-' + i + ' option ' + opt.toLowerCase() + '"></div></div>');
        $(option.values).each(function (i, value) {
          var cls = '';
          var len = product.variants.length
          var sold_out = false;
          for(var i = 0; i<len;i++){
           var second_opt =  product.variants[i].option2;
            if(second_opt == value){
              if(!product.variants[i].available){
                sold_out = true;
              }
            }
          }
          if(i==0){
//             cls = "ctm_active";
            cls="";
          }
          if(sold_out){
            cls="soldout"
          }
          $('.option.' + opt.toLowerCase()).append('<div class="ctm_radios '+cls+'" data-value="' + value + '">' + value + '</div>');
        });
      });
      $(product.variants).each(function (i, v) {
        if (v.inventory_quantity == 0) {
          $('.qv-add-button').prop('disabled', true).val('Sold Out');
          $('.qv-add-to-cart').hide();
          $('.qv-product-price').text('Sold Out').show();
          return true
        } else {
          price = parseFloat(v.price / 100).toFixed(2);
          original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
          $('.qv-product-price').text('$' + price);
          if (original_price > 0) {
            $('.qv-product-original-price').text('$' + original_price).show();
          } else {
            $('.qv-product-original-price').hide();
          }
          $('select.option-0').val(v.option1);
          $('select.option-1').val(v.option2);
          $('select.option-2').val(v.option3);
          return false
        }
      });
      variant_length = product.variants.length;
    });

    $(document).on("change", "#quick-view select", function () {
      var selectedOptions = '';
      $('#quick-view select').each(function (i) {
        if (selectedOptions == '') {
          selectedOptions = $(this).val();
        } else {
          selectedOptions = selectedOptions + ' / ' + $(this).val();
        }
      });
      jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
        $(product.variants).each(function (i, v) {
          if (v.title == selectedOptions) {
            var price = parseFloat(v.price / 100).toFixed(2);
            var original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
            var v_qty = v.inventory_quantity;
            var v_inv = v.inventory_management;
            $('.qv-product-price').text('$' + price);
            $('.qv-product-original-price').text('$' + original_price);
            if (v_inv == null) {
              $('.qv-add-button').prop('disabled', false).val('Add to Cart');
            } else {
              if (v.inventory_quantity < 1) {
                $('.qv-add-button').prop('disabled', true).val('Sold Out');
              } else {
                $('.qv-add-button').prop('disabled', false).val('Add to Cart');
              }
            }
          }
        });
      });
    });
    $.fancybox({
      href: '#quick-view',
      maxWidth: 1040,
      maxHeight: 600,
      fitToView: true,
      width: '75%',
      height: '70%',
      autoSize: false,
      closeClick: false,
      openEffect: 'none',
      closeEffect: 'none',
      'beforeLoad': function () {
        setTimeout(function(e){
          var product_handle = $('#quick-view').attr('class');
          
          (function(algolia) {
            var aa = algolia.externals.aa;
            var product = document.querySelector('[data-handle="' + product_handle + '"]')
            var clickData = {
              index: algolia.config.index_prefix + 'products',
              eventName: 'Product Quickview Clicked',
              objectIDs: [product.dataset.algoliaObjectid],
              positions: [parseInt(product.dataset.algoliaPosition)],
              queryID: product.dataset.algoliaQueryid,
            };

            if (typeof ShopifyAnalytics.lib.user().id === 'function') {
              clickData.userToken = ShopifyAnalytics.lib.user().id();
            }

            aa.clickedObjectIDsAfterSearch(clickData);
            clickData.productId = product.dataset.productId;
            algolia.saveForConversionTracking(clickData);
          })(window.algoliaShopify);
          
          $(".qv-add-button").unbind('click');
          $(".qv-add-button").off('click');
          $(".qv-add-button").on("click", function (e) {
            e.preventDefault();
            var qty = $('.qv-quantity').val();
            var selectedOptions = '';
            var var_id = '';
            $('#quick-view select').each(function (i) {
              if (selectedOptions == '') {
                selectedOptions = $(this).val();
              } else {
                selectedOptions = selectedOptions + ' / ' + $(this).val();
              }
            });
            jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
              $(product.variants).each(function (i, v) {
                if (v.title == selectedOptions) {
                  var_id = v.id;
                  processCart();
                }
              });
            });
            
            function processCart() {
              $.ajax({
                type: "post",
                url: "/cart/add.js",
                data:{
                  quantity: qty,
                  id: var_id
                },
                dataType: "json",
                success: function(data){
                  pushAddedQuickViewItemDataToGTM(data);
                  $('.qv-add-button #AddToCartText').text('Added');
                  $('.qv-add-to-cart-response').addClass('success').html('<span>' + $('.qv-product-title').text() + ' has been added to your cart. <a href="/cart">Click here to view your cart.</a>');
//                   var inter = setInterval(function(e){
//                     $('html,body').removeClass('js-drawer-open');
//                     $('html,body').removeClass('js-drawer-open-right');
//                     if($('html,body').hasClass('js-drawer-open-right')){
//                       clearInterval(inter);
//                     }
//                   });
                  $('body').trigger('afterAddItem.ajaxCart', [data]);
                  /*(function(algolia) {
                    var aa = algolia.externals.aa;
                    var product = document.querySelector('[data-handle="' + data.handle + '"]')
                    var clickData = {
                      index: algolia.config.index_prefix + 'products',
                      eventName: 'Product Added to Cart (PLP)',
                      objectIDs: [String(var_id)],
                      queryID: product.dataset.algoliaQueryid,
                    };

                    if (typeof ShopifyAnalytics.lib.user().id === 'function') {
                      clickData.userToken = ShopifyAnalytics.lib.user().id();
                    }

                    aa.convertedObjectIDsAfterSearch(clickData);
                    algolia.saveForConversionTracking(clickData);
                  })(window.algoliaShopify);*/
                  
                  setTimeout(function(e){
                    ShopifyAPI.getCart(window.buildCart);
//                     $('.desktop__header .header__cart a.site-header__cart-toggle')[0].click();
                  },600);
                  
                  setTimeout(function(e){
                    $('.fancybox-close').trigger('click');
                    $('body').addClass('ctm_mini_cart_active');
                  },800);
                },
                error: function(err){
                  var data = err.responseJSON;
//                   $('.qv-add-to-cart-response').addClass('error').html('<span><b>ERROR: </b>' + data.description);
                  $('.qv-add-to-cart-response').addClass('error').html('<span>The last size of this item has already been added to your cart!</span>');
                }
              })
              //             jQuery.post('/cart/add.js', {
              //               quantity: 1,
              //               id: var_id
              //             },
              //                         null,
              //                         "json"
              //                        ).done(function () {
              //               $('.qv-add-to-cart-response').addClass('success').html('<span>' + $('.qv-product-title').text() + ' has been added to your cart. <a href="/cart">Click here to view your cart.</a>');
              //               $('.site-header__cart-toggle')[0].click();
              //               var inter = setInterval(function(e){
              //                 $('html,body').removeClass('js-drawer-open');
              //                 $('html,body').removeClass('js-drawer-open-right');
              //                 if($('html,body').hasClass('js-drawer-open-right')){
              //                  clearInterval(inter);
              //                 }
              //               });
              //               setTimeout(function(e){
              //                 $('.fancybox-overlay .fancybox-close').trigger('click');
              //                 $('body').addClass('ctm_mini_cart_active');
              //               },500)          
              //             })
              //             .fail(function ($xhr) {
              //               var data = $xhr.responseJSON;
              //               $('.qv-add-to-cart-response').addClass('error').html('<span><b>ERROR: </b>' + data.description);
              //             });
            }
          });
          $('.fancybox-wrap').css('overflow', 'hidden !important');
		},2000)
      },
      'afterShow': function () {
        window.st.initialize();
        setTimeout(function(e){
          if(variant_length < 2){
            $('.fancybox-wrap .qv-content .qv-add-to-cart .ctm_btn_action').hide();
            $('.fancybox-wrap .qv-content .qv-add-to-cart .qv-add-button').removeClass('hide');
          }
        },450)
        $('#quick-view').hide().html(content).css('opacity', '1').fadeIn(function () {
          $('.qv-product-images').addClass('loaded');
        });
      },
      'afterClose': function () {
        $('#quick-view').removeClass().empty();
      }
    });
    
    setTimeout(function(e){
      $('.qv-product-swatch .ctm_swatches').each(function(e){
        var len = $(this).find('.ctm_radios').length;
        if(len == 1){
//           $(this).closest('.ctm_swatches').addClass('hide');
        }else{
          $(this).closest('.ctm_swatches').removeClass('hide');
        }
      })
    },600)
    
    $(document).on('click','.swatch-option-selection-colour .ctm_radios',function(e){
      var val = $(this).data('value');
      $(this).closest('.swatch-option-selection-colour').find('.ctm_radios').removeClass('ctm_active')
      $(this).addClass('ctm_active');
      $(this).closest('.qv-add-to-cart').find('.qv-product-options .option-selection-colour select').val(val);
    });
    
    $(document).on('click','.swatch-option-selection-size .ctm_radios',function(e){
      var val = $(this).data('value');
      $(this).closest('.swatch-option-selection-size').find('.ctm_radios').removeClass('ctm_active')
	  $(this).addClass('ctm_active');
      $(this).closest('.qv-add-to-cart').find('.qv-product-options .option-selection-size select').val(val);
      $('.qv-add-to-cart .ctm_btn_action').hide();
      $('.qv-add-to-cart .ctm_btn_trigger.qv-add-button').removeClass('hide');
    });
    return false;
  });
};

$(window).resize(function () {
  if ($('#quick-view').is(':visible')) {
    $('.qv-product-images').slick('setPosition');
  }
});
$(window).on('load',function(e){
  $('.selector-wrapper select').each(function(e){
    var len = $(this).find('option').length;
    if(len == 1){
      $(this).closest('.selector-wrapper').addClass('hide');
    }
  });
  $(document).on('click','.ctm_btn_action',function(e){
    $(this).closest('.qv-add-to-cart').find('.err').remove();
    var _this = $(this);
    $(this).closest('.qv-add-to-cart').find('.qv-product-swatch').append('<p class="err">Please select a size</p>');
    setTimeout(function(e){
      _this.closest('.qv-add-to-cart').find('.err').remove();
    },3000)
  });
  
  $('.sizeguide_btn').on('click',function(e){
    $.fancybox({
      href: '#sizeguide_popup',
//       maxWidth: 1040,
//       maxHeight: 600,
      fitToView: true,
//       width: '75%',
//       height: '70%',
      autoSize: false,
      closeClick: false,
      openEffect: 'none',
      closeEffect: 'none',
      'beforeLoad': function () {

      },
      'afterShow': function () {

      },
      'afterClose': function () {

      }
    });
  })
  
   $(document).on('click','.coll_size_btn',function(e){
     e.preventDefault();
     console.log('12345')
    $.fancybox.open({
      href: '#coll_sizeguide_popup',
//       maxWidth: 1040,
//       maxHeight: 600,
      fitToView: true,
//       width: '75%',
//       height: '70%',
      autoSize: false,
      closeClick: false,
      openEffect: 'none',
      closeEffect: 'none',
      'beforeLoad': function () {

      },
      'afterShow': function () {

      },
      'afterClose': function () {

      }
    });
     return false
  })
  
})


// Added to quickview.js
// Call getQuickViewProductData(product) within jQuery.getJSON of quickView()

// On quick view modal open, this will send product data to GTM

const getQuickViewProductData = (data) => {
    console.log('data: ', data);
    const productData = data;
    let itemName;
    let itemSku;
    let itemBrand;
    let itemCategory = '';
    let itemSize;
    let itemColor;
    let thisItemData;
    let tagProductType;
    let tagProductCategory;
    let tagProductSubCategory;
    let itemTagCategory;
    let itemTagSubCategory;
    let itemTagProductType;
    let listName = document.querySelector('body').classList.value.replace('template-','') + '-reco';
    const itemPrice = productData.price && typeof productData.price === 'number' ? (productData.price / 100).toFixed(2) : '';
    const firstAvailableVariant = productData.variants.filter(obj => {
        return obj.available === true
    })

    if (document.querySelector('body').classList.contains('template-product')) {
        listName = 'pdp-reco';
    }
    if (document.querySelector('body').classList.contains('template-collection')) {
        listName = 'plp-reco';
    }
    if (document.querySelector('body').classList.contains('template-cart')) {
        listName = 'cart-reco';
    }

    if (typeof productData.tags !== 'string') {
        tagProductType = productData.tags.filter(item => {
            return item.includes('Product Type_');
        });
        if (typeof tagProductType != 'undefined' && tagProductType.length>0 && tagProductType[0].includes('Product Type_')) itemTagProductType = tagProductType[0].replace('Product Type_','');
        tagProductCategory = productData.tags.filter(item => {
            return item.includes('Category_');
        });
        if (typeof tagProductCategory != 'undefined' && tagProductCategory.length>0 && tagProductCategory[0].includes('Category_')) itemTagCategory = tagProductCategory[0].replace('Category_','');
        tagProductSubCategory = productData.tags.filter(item => {
            return item.includes('Sub Category_');
        });
        if (typeof tagProductSubCategory != 'undefined' && tagProductSubCategory.length>0 && tagProductSubCategory[0].includes('Sub Category_','')) itemTagSubCategory = tagProductSubCategory[0].replace('Sub Category_','');
        if (typeof itemTagProductType != 'undefined' && itemTagProductType.length>0) {
            itemCategory += itemTagProductType + ' / ';
        }
        if (typeof itemTagCategory != 'undefined' && itemTagCategory.length>0) {
            itemCategory += itemTagCategory + ' / ';
        }
        if (typeof itemTagSubCategory != 'undefined' && itemTagSubCategory.length>0) {
            itemCategory += itemTagSubCategory;
        }
    }
    console.log('firstAvailableVariant: ', firstAvailableVariant);
    itemCategory = itemCategory.toLowerCase();
    itemName = productData.title.toLowerCase();
    itemSku = firstAvailableVariant[0].sku.toLowerCase();
    itemBrand = productData.vendor.toLowerCase();
    itemSize = firstAvailableVariant[0].option2.toLowerCase();
    itemColor = firstAvailableVariant[0].option1.toLowerCase();
    
    thisItemData = {
        'name': itemName,
        'id': itemSku,
        'price': itemPrice,
        'brand': itemBrand,
        'category': itemCategory,
        'variant': itemSize,
        'list': 'pdp-reco',
        'position': 1,
        'dimension2': itemColor
    }

    console.log('thisItemData:');
    console.log(thisItemData);

    dataLayer.push({       
        event: 'productDetail',
        uaCategory: 'quick view', //  event location
        uaAction: 'product detail',
        uaLabel: listName, //original list name
        ecommerce: {
            detail: {
                actionField:{'list':listName},
                'products': [thisItemData]
        }}
    })
}

const pushAddedQuickViewItemDataToGTM = (data) => {
  	console.log('pushAddedQuickViewItemDataToGTM');
    let fetchPath = '/products/' + data.handle;
    if (data.url.includes('?variant=')) {
        fetchPath = data.url.split("?variant=")[0];
    }
    let itemName;
    let itemSku;
    let itemBrand;
    let itemCategory = '';
    let itemSize;
    let itemColor;
    let thisItemData;
    let itemProductType;
    let collectionOrigin = '';
    $.getJSON(fetchPath + '.js', (product) => {    
    }).done(function( data ) {
        const productData = data;
        let tagProductType;
        let tagProductCategory;
        let tagProductSubCategory;
        let itemTagCategory;
        let itemTagSubCategory;
        let itemTagProductType;
        const itemPrice = productData.price ? (productData.price/100).toFixed(2) : '';
        const firstAvailableVariant = productData.variants.filter(obj => {
            return obj.available === true
        })
        collectionOrigin = document.querySelector('.collection__header .section-header__title') ? document.querySelector('.collection__header .section-header__title').innerText.toLowerCase() : '';
        const listValue = 'plp-' + collectionOrigin;
        let finalListValue;

        if (collectionOrigin.length>0) {
            finalListValue = {
                list: listValue
            }
        }

        if (typeof productData.tags !== 'string') {
            tagProductType = productData.tags.filter(item => {
                return item.includes('Product Type_');
            });
            if (typeof tagProductType != 'undefined' && tagProductType.length>0 && tagProductType[0].includes('Product Type_')) itemTagProductType = tagProductType[0].replace('Product Type_','');
            tagProductCategory = productData.tags.filter(item => {
                return item.includes('Category_');
            });
            if (typeof tagProductCategory != 'undefined' && tagProductCategory.length>0 && tagProductCategory[0].includes('Category_')) itemTagCategory = tagProductCategory[0].replace('Category_','');
            tagProductSubCategory = productData.tags.filter(item => {
                return item.includes('Sub Category_');
            });
            if (typeof tagProductSubCategory != 'undefined' && tagProductSubCategory.length>0 && tagProductSubCategory[0].includes('Sub Category_','')) itemTagSubCategory = tagProductSubCategory[0].replace('Sub Category_','');
            if (typeof itemTagProductType != 'undefined' && itemTagProductType.length>0) {
                itemCategory += itemTagProductType + ' / ';
            }
            if (typeof itemTagCategory != 'undefined' && itemTagCategory.length>0) {
                itemCategory += itemTagCategory + ' / ';
            }
            if (typeof itemTagSubCategory != 'undefined' && itemTagSubCategory.length>0) {
                itemCategory += itemTagSubCategory;
            }
        }
      	itemCategory = itemCategory.toLowerCase();
        itemName = productData.title.toLowerCase();
        itemSku = firstAvailableVariant[0].sku.toLowerCase();
        itemBrand = productData.vendor.toLowerCase();
        itemSize = firstAvailableVariant[0].option2.toLowerCase();
        itemColor = firstAvailableVariant[0].option1.toLowerCase();
        
        thisItemData = {
            'name': itemName,
            'id': itemSku,
            'price': itemPrice,
            'brand': itemBrand,
            'category': itemCategory,
            'variant': itemSize,
            'quantity': 1,
            'position': 1,
            'dimension2': itemColor
        }

        let thisItemObj;

        if (collectionOrigin.length>0) {
            thisItemObj = {
                event: 'addToCart',
                uaCategory: 'product page', // event location
                uaAction: 'add to cart',
                uaLabel: listValue, //original list name
                ecommerce: {
                    currencyCode: 'CAD',
                    add: {
                        actionField: finalListValue,
                        products: [thisItemData]
                    }
                }
            }
        } else {
            thisItemObj = {
                event: 'addToCart',
                uaCategory: 'product page', // event location
                uaAction: 'add to cart',
                // uaLabel: 'plp-sweatshirts', //original list name
                ecommerce: {
                    currencyCode: 'CAD',
                    add: {
                        products: [thisItemData]
                    }
                }
            }
        }

        console.log('thisItemData: ', thisItemData);
        console.log('thisItemObj: ', thisItemObj);
            dataLayer.push(thisItemObj)
    });
}