//document ready
$(function() {

  var oldFlickityCreate = window.Flickity.prototype._create;

  window.Flickity.prototype._create = function(){
    var that = this;
    if(this.element.addEventListener){
      this.element.addEventListener('load', function(){
        that.onresize();
      }, true);
    }
    this._create = oldFlickityCreate;
    return oldFlickityCreate.apply(this, arguments);
  };

  objectFitImages();
  header.loadMegaMenu();
  header.init();
  
  utils.pageBannerCheck();
  slideshow.init();
  testimonial.init();
  videoSection.init();
  gallery.init();
  featuredPromotions.init();
  featuredCollectionSection.init();
  collectionSidebarFilter.init();
  cart.init();
  mapFunction.init();


  productPage.initializeQuantityBox();
  productPage.init();
  productPage.relatedProducts();

  recentlyViewed.init();

  // Setup a timer
  var resizeTimeout;

  // Listen for resize events
  window.addEventListener('resize', function ( event ) {

    // If timer is null, reset it to 66ms and run your functions.
    // Otherwise, wait until timer is cleared
    if ( !resizeTimeout ) {
      resizeTimeout = setTimeout(function() {

        // Reset timeout
        resizeTimeout = null;

        // Run our resize functions
        if($(window).width() <= 798) {
          cart.init();
          header.unload();
          header.init();
        }

      }, 66);
    }
  }, false);

  //Lightbox default options
  //https://fancyapps.com/fancybox/3/docs/#options
  $.fancybox.defaults.animationEffect = 'fade';
  $.fancybox.defaults.transitionEffect = 'fade';
  $.fancybox.defaults.hash = false;
  $.fancybox.defaults.infobar = false;
  $.fancybox.defaults.toolbar = false;
  $.fancybox.defaults.arrows = false;
  $.fancybox.defaults.loop = true;
  $.fancybox.defaults.smallBtn = true;
  $.fancybox.defaults.live = false;
  $.fancybox.defaults.zoom = false;
  $.fancybox.defaults.mobile.preventCaptionOverlap = false;
  $.fancybox.defaults.mobile.toolbar = true;
  $.fancybox.defaults.mobile.buttons = ['close'];
  $.fancybox.defaults.mobile.clickSlide = 'close';
  $.fancybox.defaults.mobile.clickContent = 'zoom';
  $.fancybox.defaults.afterLoad = function(instance, slide) {
    if (instance.current.type == 'image'){
      slide.$content.wrapInner( "<div class='fancybox-image-wrap'></div>" )
    }
    if (instance.group.length > 1){
      slide.$content.find('.fancybox-image-wrap').append('<a title="Previous" class="fancybox-item fancybox-nav fancybox-prev" href="javascript:;" data-fancybox-prev><span>'+ svgArrowSizeLeft +'</span></a><a title="Next" class="fancybox-item fancybox-nav fancybox-next" href="javascript:;" data-fancybox-next><span>'+ svgArrowSizeRight +'</span></a>')
    }
  }

  //backwards compatibility with custom lightboxes
  $('.lightbox[rel="gallery"]').fancybox();

  //Search input hiding
  //get current input
  var currentValue = $(".search_form input[name='q']").val()
  //return amount without *
  if ($(".search_form input[name='q']").length > 0){
    $(".search_form input[name='q']").val( currentValue.replace('*', '') );
  }

  $('#sort-by').val($('#sort-by').data('default-sort'));

  $('body')
    .on('change', '#tag_filter, #sort-by', function() {
      quickFilter.init();
  });

  $('body')
    .on('change', '#blog_filter', function() {
      var url = $(this).val();
      window.location = url;
  });

  $('input, select, textarea').on('focus blur', function(event) {
    $('meta[name=viewport]').attr('content', 'width=device-width,initial-scale=1,maximum-scale=' + (event.type == 'blur' ? 10 : 1));
  });

  //Collection sidebar filter
  //Check the checkbox values
  $('body').on('change', '[data-option-filter] input', function(){
    quickFilter.init();
    $("html, body").animate({
      scrollTop: ($('#pagecontent').offset().top)
    }, 500);
  })

  $('body').on('click', '[data-reset-filters]', function(){
    collectionSidebarFilter.clearAllFilters();
  });

  $('body').on('click', '[data-clear-filter]', function(){
    var selectedOption = $(this).parents('.filter-active-tag');
    collectionSidebarFilter.clearSelectedFilter(selectedOption);
  });

  $('body').on('change', '.currencies', function(e) {
      $('[data-initial-modal-price]').attr('data-initial-modal-price', '');
  });

  $('body').on('change', '.js-quick-shop select', function(e) {
      var currentVariant = $('.js-quick-shop select[name="id"]').val();
      if (currentVariant && globalQuickShopProduct){
        quickShop.updateVariant(currentVariant);
      }
  });

  

  var touchStartPos = 0;

  //Detecting swipe vs tap
  $(document).bind("touchstart", function (e) {
    touchStartPos = $(window).scrollTop();
  }).bind("touchend", function (e) {
      var distance = touchStartPos - $(window).scrollTop();
      if (distance > 20 || distance < -20) {
          e.preventDefault;
      }
  });

  $('body').on('click', '.sidebar .parent-link--false', function(e) {
    e.preventDefault();
    $menu = $(this).parent('li');
    $menu.find('.menu-toggle').toggleClass('active');
    $menu.find('ul').slideToggle();
  });

  

  if(window.location.pathname.indexOf('/comments') != -1) {
    $('html,body').animate({scrollTop: $("#new-comment").offset().top-140},'slow');
  }

  $('body').on('mouseenter', '.icon-search', function() {
    $('.search-terms').focus();
  });

  $('body').on('click', '.icon-search', function() {
    $('input.search-terms').focus();
  });

  $('body').on('click', '.search-submit', function() {
    $(this).parent().submit();
  });

  if ($(window).width() > 798) {
    $(".animate_right").waypoint(function() {
      $(this.element).addClass("animated fadeInRight");
    }, { offset: '70%' });
    $(".animate_left").waypoint(function() {
      $(this.element).addClass("animated fadeInLeft");
    }, { offset: '70%' });
    $(".animate_up").waypoint(function() {
      $(this.element).addClass("animated fadeInUp");
    }, { offset: '70%' });
    $(".animate_down").waypoint(function() {
      $(this.element).addClass("animated fadeInDown");
    }, { offset: '70%' });
  }

  //backwards compatibility with flexslider
  $('.slider, .flexslider').find('li').unwrap();
  $('.slider, .flexslider').flickity({
    pageDots: usePageDots,
    imagesLoaded: true,
    arrowShape: arrowSize,
    lazyLoad: 2
  });

  utils.createAccordion('.toggle-all--true', 'h4.toggle', 'ul.toggle_list');
  utils.createAccordion('.footer_menu', 'h6', 'ul');
  utils.createAccordion('.footer_content', 'h6', 'div.toggle_content');
  utils.createAccordion('.product_section .accordion-tabs', '.tabs li > a', '.tabs-content li');

  utils.mobileParentActiveAccordion('#mobile_menu', 'li.sublink > a.parent-link--true span', 'li.sublink ul');
  utils.mobileAccordion('#mobile_menu', 'li.sublink > a.parent-link--false', 'li.sublink ul');

  utils.initializeTabs();
  utils.resizeActionButtons();
  faqAccordion.init();

  $(window).on('resize', function() {
    utils.resizeActionButtons();
  });

  //Sidebar toggle check
  if ($(window).width() <= 798) {
    utils.createAccordion('.toggle-all--false', 'h4.toggle', 'ul.toggle_list');
  }

  $('body').on('click', '.menu-toggle', function(e) {
    var $content = $(this).next('ul');
    $content.slideToggle();
    $(this).toggleClass('active');
    $(this).attr('aria-expanded', $(this).attr('aria-expanded') == 'true' ? 'false' : 'true');
  });

  if ($(window).width() >= 959) {
    var modal_width = '870px';
    if($(window).width() >= 1200 || $('html').hasClass('ie')) {
      modal_width = '1110px'
    }
  }

  

  //Terms of service settings for minicart
  
    $('body').on('click touchstart', '.cart_content .tos_label', function() {
      $(this).prev('input').prop('checked', true);
    });
  

  
      $('body').on('click', ".cart_content .action_button", function(e) {
        // Redirect to cart page
        e.preventDefault();
        document.location.href = "/cart";
      });
    


  

  var $contact_form = $('.newsletter .contact-form');
  $contact_form.each(function() {
    var $cf = $(this);
    $cf.on('submit', function (e) {
      if($('input[name="challenge"]', $cf).val() !== "true") {
        $.ajax({
          type: $cf.attr('method'),
          url: $cf.attr('action'),
          data: $cf.serialize(),
          success: function (data) {
            $cf.fadeOut("slow", function(){
              $cf.prev('.message').html("Thank you for joining our mailing list!");
            });
          },
          error: function(data) {
            $('input[name="challenge"]', $cf).val('true');
            $cf.submit();
          }
        });
        e.preventDefault();
      }
    });
  });

  $('.maps').click(function () {
    $('.maps iframe').css("pointer-events", "auto");
  });

  
    enableLoadMoreProducts();
  

  

  

  
    enableInfiniteSearchScroll();
  

  /*============================================================================
    Start of cart-related functionality
  ==============================================================================*/

  function ajaxSubmitCart(cart) {
    $cart = cart;
    $.ajax({
      url: '/cart/update.js',
      dataType: 'json',
      cache: false,
      type: 'post',
      data: $cart.serialize(),
      success: function (data) {
        refreshCart(data);
      }
    });
  }

  function ajaxUpdateCart(lineID, quantity, parent) {
    $.ajax({
      url: '/cart/change.js',
      dataType: 'json',
      cache: false,
      type: 'post',
      data: { quantity: quantity, line: lineID },
      success: function (data) {
        refreshCart(data);

        var lineIDIndex = lineID - 1;

        //check to see if there are correct amount of products in array
        if (typeof data.items[lineIDIndex] === "undefined"){
          var updated_quantity = 0;
        } else {
          var updated_quantity = data.items[lineIDIndex].quantity;
        }

        if(quantity > 0 && quantity != updated_quantity) {
          if (updated_quantity == 1) {
            items_left_text = "item left";
          } else {
            items_left_text = "items left";
          }

          $('.warning--quantity').remove();

          var warning = '<p class="warning warning--quantity animated bounceIn">' + updated_quantity + ' ' + items_left_text + '</p>';
          parent.find("input[data-line-id='" + lineID + "']").parent().after(warning);
          parent.find("input[data-line-id='" + lineID + "']").val(updated_quantity);
        } else if (parent.is('#cart_form')) {
          $("#cart_form").submit();
        }
      }
    });
  }

  function refreshCart(cart) {
    $(".cart_count").empty();
    $cartBtn = $(".cart_count");
    var value = $cartBtn.text() || '0';
    var cart_items_html = "";
    var cart_action_html = "";
    var cart_savings_html = "";
    var $cart = $(".cart_content form");
    var discounted_price_total = 0;
    var total_savings = 0;

    $cartBtn.text(value.replace(/[0-9]+/,cart.item_count));

    if (cart.item_count == 0) {
      $('.js-empty-cart__message').removeClass('hidden');
      $('.js-cart_content__form').addClass('hidden');
    } else {
      $('.js-empty-cart__message').addClass('hidden');
      $('.js-cart_content__form').removeClass('hidden');

      $.each(cart.items, function(index, item) {
        var line_id = index + 1;
        cart_items_html += '<li class="cart_item clearfix">' +
          '<a href="' + item.url +'">';
        if (item.image) {
          cart_items_html += '<div class="cart_image">' +
              '<img src="' + item.image.replace(/(\.[^.]*)$/, "_compact$1").replace('http:', '') + '" alt="' + htmlEncode(item.title) + '" />' +
            '</div>';
        }

        cart_items_html += '<div class="cart_item__title"><div class="item_title">' + item.title;

        if(item.properties) {
          $.each(item.properties, function(title, value) {
            if (value) {
              cart_items_html += '<div class="line-item">' + title +': ' + value + '</div>';
            }
          });
        }
        cart_items_html += '</div></a>';

        cart_items_html += '<div class="left product-quantity-box">' +
            '<span class="ss-icon product-minus js-change-quantity" data-func="minus"><span class="icon-minus"></span></span>' +
            '<input type="number" min="0" class="quantity" name="updates[]" id="updates_' + item.id + '" value="' + item.quantity +'" data-line-id="' + line_id +'" />' +
            '<span class="ss-icon product-plus js-change-quantity" data-func="plus"><span class="icon-plus"></span></span>' +
          '</div>' +
        '</div>';

        cart_items_html += '<strong class="right price">';

        

        cart_items_html += '<span class="money">' + Shopify.formatMoney(item.price, $('body').data('money-format')) + '</span></strong>' + '</div>';

      });

      cart_action_html += '<span class="right"><span class="money">' + Shopify.formatMoney(cart.total_price, $('body').data('money-format')) + '</span></span>' +
          '<span>Subtotal</span>';

      if(total_savings > 0 ) {
        cart_savings_html = '<span class="right"><span class="money">' + Shopify.formatMoney(total_savings - discounted_price_total, $('body').data('money-format')) + '</span></span>' +
            '<span>Total Savings</span>';
      } else {
        cart_savings_html = "";
      }
    }

    $('.js-cart_items').html(cart_items_html);
    $('.js-cart_subtotal').html(cart_action_html);
    $('.js-cart_savings').html(cart_savings_html);

    
  }

  $('body').on("change", "#cart_form input.quantity", function() {
    ajaxUpdateCart($(this).data('line-id'), $(this).val(), $(this).parents('#cart_form'));
  });

  $('body').on("change", ".cart_content input.quantity", function() {
    ajaxUpdateCart($(this).data('line-id'), $(this).val(), $(this).parents('.cart_content'));
  });

  if (settings.cart_action == 'ajax'){
    $('body').on('submit', ".product_form form, .shopify-product-form", function(e) {
      e.preventDefault();
      var $addToCartForm = $(this);
      var $addToCartBtn = $addToCartForm.find('.add_to_cart');

      $.ajax({
        url: '/cart/add.js',
        dataType: 'json',
        cache: false,
        type: 'post',
        data: $addToCartForm.serialize(),
        beforeSend: function() {
          $addToCartBtn.attr('disabled', 'disabled').addClass('disabled');
          $addToCartBtn.find('span').removeClass("fadeInDown").addClass('animated zoomOut');
        },
        success: function(itemData) {
          $addToCartBtn.find('.checkmark').addClass('checkmark-active');

          window.setTimeout(function(){
            $addToCartBtn.removeAttr('disabled').removeClass('disabled');
            $addToCartBtn.find('.checkmark').removeClass('checkmark-active');
            $addToCartBtn.find('span').removeClass('zoomOut').addClass('fadeInDown');
          }, 1000);

          $.ajax({
            url: '/cart.js',
            dataType: "json",
            cache: false,
            success: function(cart) {
              refreshCart(cart);
              if($('body').hasClass('fancybox-active')) {
                $.fancybox.close();
              }

              if($('#header').is(':visible')) {
                $('#header .cart_container').addClass('active_link');
              } else if ($('.sticky_nav--stick').length) {
                $('.sticky_nav .cart_container').addClass('active_link');
              } else {
                $('.top_bar .cart_container').addClass('active_link');
              }

              //block scrolling on mobile
              if ($(window).width() <= 798) {
                var $cart_container = $(this).parent();
                if($cart_container.hasClass('active_link')) {
                  $('body').addClass('blocked-scroll');
                } else {
                  $('body').addClass('blocked-scroll');
                }
              }
            }
          });
        },
        error: function(XMLHttpRequest) {
          var response = eval('(' + XMLHttpRequest.responseText + ')');
          response = response.description;
          $('.warning').remove();

          var warning = '<p class="warning animated bounceIn">' + response.replace('All 1 ', 'All ') + '</p>';
          $addToCartForm.after(warning);
          $addToCartBtn.removeAttr('disabled').removeClass('disabled');
          $addToCartBtn.find('span').text("Add to Bag").removeClass('zoomOut').addClass('zoomIn');
        }
      });

      return false;
    });
  }

  productPage.productSwatches();

});

/*============================================================================
  Swatch options - second and third swatch 'sold-out' will update based on availability of previous options selected
==============================================================================*/
Shopify.updateOptionsInSelector = function(selectorIndex, parent) {

  switch (selectorIndex) {
    case 0:
      var key = 'root';
      var selector = $(parent + ' .single-option-selector:eq(0)');
      break;
    case 1:
      var key = $(parent + ' .single-option-selector:eq(0)').val();
      var selector = $(parent + ' .single-option-selector:eq(1)');
      break;
    case 2:
      var key = $(parent + ' .single-option-selector:eq(0)').val();
      key += ' / ' + $(parent + ' .single-option-selector:eq(1)').val();
      var selector = $(parent + ' .single-option-selector:eq(2)');
  }

  var availableOptions = Shopify.optionsMap[key];
  $(parent + ' .swatch[data-option-index="' + selectorIndex + '"] .swatch-element').each(function() {
    if ($.inArray($(this).attr('data-value'), availableOptions) !== -1) {
      $(this).removeClass('soldout').find(':radio').removeAttr('disabled','disabled').removeAttr('checked');
    }
    else {
      $(this).addClass('soldout').find(':radio').removeAttr('checked').attr('disabled','disabled');
    }
  });

};

Shopify.linkOptionSelectors = function(product, parent) {
    // Building our mapping object.
    Shopify.optionsMap = {};
    for (var i=0; i<product.variants.length; i++) {
      var variant = product.variants[i];
      if (variant.available) {
        // Gathering values for the 1st drop-down.
        Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];
        Shopify.optionsMap['root'].push(variant.option1);
        Shopify.optionsMap['root'] = Shopify.uniq(Shopify.optionsMap['root']);
        // Gathering values for the 2nd drop-down.
        if (product.options.length > 1) {
          var key = variant.option1;
          Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
          Shopify.optionsMap[key].push(variant.option2);
          Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
        }
        // Gathering values for the 3rd drop-down.
        if (product.options.length === 3) {
          var key = variant.option1 + ' / ' + variant.option2;
          Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
          Shopify.optionsMap[key].push(variant.option3);
          Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
        }
      }
    }
    // Update options right away.
    Shopify.updateOptionsInSelector(0, parent);
    if (product.options.length > 1) Shopify.updateOptionsInSelector(1, parent);
    if (product.options.length === 3) Shopify.updateOptionsInSelector(2, parent);
    // When there is an update in the first dropdown.
    $(parent + " .single-option-selector:eq(0)").change(function() {
      Shopify.updateOptionsInSelector(1, parent);
      if (product.options.length === 3) Shopify.updateOptionsInSelector(2, parent);
      return true;
    });
    // When there is an update in the second dropdown.
    $(parent + " .single-option-selector:eq(1)").change(function() {
      if (product.options.length === 3) Shopify.updateOptionsInSelector(2, parent);
      return true;
    });
};

//Used for cart functionality
function htmlEncode(value){
    if (value) {
        return $('<div/>').text(value).html();
    } else {
        return '';
    }
}

//Check if device is touch-enabled
function is_touch_device() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
};

/* option_selection.js */
function floatToString(t,e){var o=t.toFixed(e).toString();return o.match(/^\.\d+/)?"0"+o:o}if("undefined"==typeof Shopify)var Shopify={};Shopify.each=function(t,e){for(var o=0;o<t.length;o++)e(t[o],o)},Shopify.map=function(t,e){for(var o=[],i=0;i<t.length;i++)o.push(e(t[i],i));return o},Shopify.arrayIncludes=function(t,e){for(var o=0;o<t.length;o++)if(t[o]==e)return!0;return!1},Shopify.uniq=function(t){for(var e=[],o=0;o<t.length;o++)Shopify.arrayIncludes(e,t[o])||e.push(t[o]);return e},Shopify.isDefined=function(t){return"undefined"==typeof t?!1:!0},Shopify.getClass=function(t){return Object.prototype.toString.call(t).slice(8,-1)},Shopify.extend=function(t,e){function o(){}o.prototype=e.prototype,t.prototype=new o,t.prototype.constructor=t,t.baseConstructor=e,t.superClass=e.prototype},Shopify.locationSearch=function(){return window.location.search},Shopify.locationHash=function(){return window.location.hash},Shopify.replaceState=function(t){window.history.replaceState({},document.title,t)},Shopify.urlParam=function(t){var e=RegExp("[?&]"+t+"=([^&#]*)").exec(Shopify.locationSearch());return e&&decodeURIComponent(e[1].replace(/\+/g," "))},Shopify.newState=function(t,e){var o;return o=Shopify.urlParam(t)?Shopify.locationSearch().replace(RegExp("("+t+"=)[^&#]+"),"$1"+e):""===Shopify.locationSearch()?"?"+t+"="+e:Shopify.locationSearch()+"&"+t+"="+e,o+Shopify.locationHash()},Shopify.setParam=function(t,e){Shopify.replaceState(Shopify.newState(t,e))},Shopify.Product=function(t){Shopify.isDefined(t)&&this.update(t)},Shopify.Product.prototype.update=function(t){for(property in t)this[property]=t[property]},Shopify.Product.prototype.optionNames=function(){return"Array"==Shopify.getClass(this.options)?this.options:[]},Shopify.Product.prototype.optionValues=function(t){if(!Shopify.isDefined(this.variants))return null;var e=Shopify.map(this.variants,function(e){var o="option"+(t+1);return void 0==e[o]?null:e[o]});return null==e[0]?null:Shopify.uniq(e)},Shopify.Product.prototype.getVariant=function(t){var e=null;return t.length!=this.options.length?e:(Shopify.each(this.variants,function(o){for(var i=!0,r=0;r<t.length;r++){var n="option"+(r+1);o[n]!=t[r]&&(i=!1)}return 1==i?void(e=o):void 0}),e)},Shopify.Product.prototype.getVariantById=function(t){for(var e=0;e<this.variants.length;e++){var o=this.variants[e];if(t==o.id)return o}return null},Shopify.money_format="$",Shopify.formatMoney=function(t,e){function o(t,e){return"undefined"==typeof t?e:t}function i(t,e,i,r){if(e=o(e,2),i=o(i,","),r=o(r,"."),isNaN(t)||null==t)return 0;t=(t/100).toFixed(e);var n=t.split("."),a=n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+i),s=n[1]?r+n[1]:"";return a+s}"string"==typeof t&&(t=t.replace(".",""));var r="",n=/\{\{\s*(\w+)\s*\}\}/,a=e||this.money_format;switch(a.match(n)[1]){case"amount":r=i(t,2);break;case"amount_no_decimals":r=i(t,0);break;case"amount_with_comma_separator":r=i(t,2,".",",");break;case"amount_with_apostrophe_separator":r=i(t,2);break;case"amount_no_decimals_with_comma_separator":r=i(t,0,".",",")}return a.replace(n,r)},Shopify.OptionSelectors=function(t,e){return this.selectorDivClass="selector-wrapper",this.selectorClass="single-option-selector",this.variantIdFieldIdSuffix="-variant-id",this.variantIdField=null,this.historyState=null,this.selectors=[],this.domIdPrefix=t,this.product=new Shopify.Product(e.product),this.onVariantSelected=Shopify.isDefined(e.onVariantSelected)?e.onVariantSelected:function(){},this.replaceSelector(t),this.initDropdown(),e.enableHistoryState&&(this.historyState=new Shopify.OptionSelectors.HistoryState(this)),!0},Shopify.OptionSelectors.prototype.initDropdown=function(){var t={initialLoad:!0},e=this.selectVariantFromDropdown(t);if(!e){var o=this;setTimeout(function(){o.selectVariantFromParams(t)||o.fireOnChangeForFirstDropdown.call(o,t)})}},Shopify.OptionSelectors.prototype.fireOnChangeForFirstDropdown=function(t){this.selectors[0].element.onchange(t)},Shopify.OptionSelectors.prototype.selectVariantFromParamsOrDropdown=function(t){var e=this.selectVariantFromParams(t);e||this.selectVariantFromDropdown(t)},Shopify.OptionSelectors.prototype.replaceSelector=function(t){var e=document.getElementById(t),o=e.parentNode;Shopify.each(this.buildSelectors(),function(t){o.insertBefore(t,e)}),e.style.display="none",this.variantIdField=e},Shopify.OptionSelectors.prototype.selectVariantFromDropdown=function(t){var e=document.getElementById(this.domIdPrefix).querySelector("[selected]");if(e||(e=document.getElementById(this.domIdPrefix).querySelector('[selected="selected"]')),!e)return!1;var o=e.value;return this.selectVariant(o,t)},Shopify.OptionSelectors.prototype.selectVariantFromParams=function(t){var e=Shopify.urlParam("variant");return this.selectVariant(e,t)},Shopify.OptionSelectors.prototype.selectVariant=function(t,e){var o=this.product.getVariantById(t);if(null==o)return!1;for(var i=0;i<this.selectors.length;i++){var r=this.selectors[i].element,n=r.getAttribute("data-option"),a=o[n];null!=a&&this.optionExistInSelect(r,a)&&(r.value=a)}return"undefined"!=typeof jQuery?jQuery(this.selectors[0].element).trigger("change",e):this.selectors[0].element.onchange(e),!0},Shopify.OptionSelectors.prototype.optionExistInSelect=function(t,e){for(var o=0;o<t.options.length;o++)if(t.options[o].value==e)return!0},Shopify.OptionSelectors.prototype.insertSelectors=function(t,e){Shopify.isDefined(e)&&this.setMessageElement(e),this.domIdPrefix="product-"+this.product.id+"-variant-selector";var o=document.getElementById(t);Shopify.each(this.buildSelectors(),function(t){o.appendChild(t)})},Shopify.OptionSelectors.prototype.buildSelectors=function(){for(var t=0;t<this.product.optionNames().length;t++){var e=new Shopify.SingleOptionSelector(this,t,this.product.optionNames()[t],this.product.optionValues(t));e.element.disabled=!1,this.selectors.push(e)}var o=this.selectorDivClass,i=this.product.optionNames(),r=Shopify.map(this.selectors,function(t){var e=document.createElement("div");if(e.setAttribute("class",o),i.length>1){var r=document.createElement("label");r.htmlFor=t.element.id,r.innerHTML=t.name,e.appendChild(r)}return e.appendChild(t.element),e});return r},Shopify.OptionSelectors.prototype.selectedValues=function(){for(var t=[],e=0;e<this.selectors.length;e++){var o=this.selectors[e].element.value;t.push(o)}return t},Shopify.OptionSelectors.prototype.updateSelectors=function(t,e){var o=this.selectedValues(),i=this.product.getVariant(o);i?(this.variantIdField.disabled=!1,this.variantIdField.value=i.id):this.variantIdField.disabled=!0,this.onVariantSelected(i,this,e),null!=this.historyState&&this.historyState.onVariantChange(i,this,e)},Shopify.OptionSelectorsFromDOM=function(t,e){var o=e.optionNames||[],i=e.priceFieldExists||!0,r=e.delimiter||"/",n=this.createProductFromSelector(t,o,i,r);e.product=n,Shopify.OptionSelectorsFromDOM.baseConstructor.call(this,t,e)},Shopify.extend(Shopify.OptionSelectorsFromDOM,Shopify.OptionSelectors),Shopify.OptionSelectorsFromDOM.prototype.createProductFromSelector=function(t,e,o,i){if(!Shopify.isDefined(o))var o=!0;if(!Shopify.isDefined(i))var i="/";var r=document.getElementById(t),n=r.childNodes,a=(r.parentNode,e.length),s=[];Shopify.each(n,function(t,r){if(1==t.nodeType&&"option"==t.tagName.toLowerCase()){var n=t.innerHTML.split(new RegExp("\\s*\\"+i+"\\s*"));0==e.length&&(a=n.length-(o?1:0));var p=n.slice(0,a),l=o?n[a]:"",c=(t.getAttribute("value"),{available:t.disabled?!1:!0,id:parseFloat(t.value),price:l,option1:p[0],option2:p[1],option3:p[2]});s.push(c)}});var p={variants:s};if(0==e.length){p.options=[];for(var l=0;a>l;l++)p.options[l]="option "+(l+1)}else p.options=e;return p},Shopify.SingleOptionSelector=function(t,e,o,i){this.multiSelector=t,this.values=i,this.index=e,this.name=o,this.element=document.createElement("select");for(var r=0;r<i.length;r++){var n=document.createElement("option");n.value=i[r],n.innerHTML=i[r],this.element.appendChild(n)}return this.element.setAttribute("class",this.multiSelector.selectorClass),this.element.setAttribute("data-option","option"+(e+1)),this.element.id=t.domIdPrefix+"-option-"+e,this.element.onchange=function(o,i){i=i||{},t.updateSelectors(e,i)},!0},Shopify.Image={preload:function(t,e){for(var o=0;o<t.length;o++){var i=t[o];this.loadImage(this.getSizedImageUrl(i,e))}},loadImage:function(t){(new Image).src=t},switchImage:function(t,e,o){if(t&&e){var i=this.imageSize(e.src),r=this.getSizedImageUrl(t.src,i);o?o(r,t,e):e.src=r}},imageSize:function(t){var e=t.match(/_(1024x1024|2048x2048|pico|icon|thumb|small|compact|medium|large|grande)\./);return null!=e?e[1]:null},getSizedImageUrl:function(t,e){if(null==e)return t;if("master"==e)return this.removeProtocol(t);var o=t.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);if(null!=o){var i=t.split(o[0]),r=o[0];return this.removeProtocol(i[0]+"_"+e+r)}return null},removeProtocol:function(t){return t.replace(/http(s)?:/,"")}},Shopify.OptionSelectors.HistoryState=function(t){this.browserSupports()&&this.register(t)},Shopify.OptionSelectors.HistoryState.prototype.register=function(t){window.addEventListener("popstate",function(e){t.selectVariantFromParamsOrDropdown({popStateCall:!0})})},Shopify.OptionSelectors.HistoryState.prototype.onVariantChange=function(t,e,o){this.browserSupports()&&(!t||o.initialLoad||o.popStateCall||Shopify.setParam("variant",t.id))},Shopify.OptionSelectors.HistoryState.prototype.browserSupports=function(){return window.history&&window.history.replaceState};

$(document)
  .on('shopify:block:select', function(e){

    var blockId = e.detail.blockId;
    var $parentSection = $('#shopify-section-' + e.detail.sectionId);

    if ($parentSection.hasClass('slideshow-section') || $parentSection.hasClass('testimonial-section')){
      sliderBlock.select(blockId, $parentSection);
    }

    if($parentSection.hasClass('page-details-section')){
      if($('.map-section').length) {
        mapFunction.init();
      }
    }

    if ($parentSection.hasClass('cart-section')){
      if ($('.block__featured_collection').length){
        featuredCollectionSection.init();
      }
    }

    if ($parentSection.hasClass('product-template')){
      
    }

    utils.resizeActionButtons();

});

$(document)
  .on('shopify:block:deselect', function(e){

    var $parentSection = $('#shopify-section-' + e.detail.sectionId);

    if ($parentSection.hasClass('slideshow-section') || $parentSection.hasClass('testimonial-section')){
      sliderBlock.deselect($parentSection)
    }

});

$(document)
  .on('shopify:section:reorder', function(e){

    utils.pageBannerCheck();

});

$(document)
  .on('shopify:section:load', function(e){

    var $parentSection = $('#shopify-section-' + e.detail.sectionId);

    utils.pageBannerCheck();

    

    if ($parentSection.hasClass('image-gallery-section')){
      gallery.init($parentSection);
    }

    if ($parentSection.hasClass('social-feeds-section')){
      $('.social-feeds-wrap').each(function (index, value) {

        social.twitter();

        var $target = $(this).find(".js-instafeed");
        instagram.loadContent({
          el: $target,
          clientID: $target.data('client-id'),
          limit: $target.data('count'),
          column: $target.data('column')
        });
      });
    }

    if ($parentSection.hasClass('faq-section')){
      faqAccordion.init();
    }

    if ($parentSection.hasClass('cart-section')){
      cart.init();
      if ($('.block__featured_collection').length){
        featuredCollectionSection.init();
      }
    }

    if ($parentSection.hasClass('featured-promotions-section')){
      featuredPromotions.init();
    }

    if ($parentSection.hasClass('slideshow-section')){
      slideshow.init();
    }

    


    if ($parentSection.hasClass('testimonial-section')){
      testimonial.init();
    }

    if ($parentSection.hasClass('featured-products-section')){
      productPage.initializeQuantityBox();
      productPage.productSwatches();
      productPage.init();
      
    }

    if($parentSection.hasClass('map-section')){
      mapFunction.init();
    }

    if ($parentSection.hasClass('featured-collection-section')){
      featuredCollectionSection.init();
    }

    if ($parentSection.hasClass('video-section')){
      videoSection.init();
    }

    if ($parentSection.hasClass('recently-viewed__section')){
      recentlyViewed.init();
    }

    if ($parentSection.hasClass('product-template')){
      productPage.init();
      productPage.productSwatches();
      productPage.relatedProducts();
      recentlyViewed.init();
      
    }

    if ($parentSection.hasClass('article-template-section')){
      if(window.location.pathname.indexOf('/comments') != -1) {
        $('html,body').animate({scrollTop: $("#new-comment").offset().top-140},'slow');
      }
    }

    if ($parentSection.hasClass('collection-template-section')){
      collectionSidebarFilter.init();
    }

    if($parentSection.hasClass('contact-section')){
      mapFunction.init();
    }

    if ($parentSection.hasClass('search-template-section')){
      
      collectionSidebarFilter.init();
    }

    if ($parentSection.hasClass('header-section')){
      header.init();
      header.loadMegaMenu();
    }

    if ($parentSection.hasClass('mega-menu-section')){
      header.loadMegaMenu();
    }

    if ($parentSection.hasClass('page-details-section')) {
      featuredCollectionSection.init();
      videoSection.init();
      if($('.block__image_gallery').length) {
        gallery.init();
      };
      recentlyViewed.init();
    }

    if ($parentSection.hasClass('product-details-section')) {
      featuredCollectionSection.init();
      videoSection.init();
      mapFunction.init();
      if($('.block__image_gallery').length) {
        gallery.init();
      };
      recentlyViewed.init();
    }
});


$(document)
  .on('shopify:section:unload', function(e){

    var $target = $(e.target);
    var $parentSection = $('#shopify-section-' + e.detail.sectionId);

    if ($parentSection.hasClass('header-section')){
      header.unload($target);
      header.unloadMegaMenu();
    }

    if ($parentSection.hasClass('slideshow-section')){
      slideshow.unload($target);
    }

    if ($parentSection.hasClass('testimonial-section')){
      testimonial.unload($target);
    }

    if ($parentSection.hasClass('video-section')){
      videoSection.unload($target);
    }

    if ($parentSection.hasClass('search-section')){
      searchAutocomplete.unload($target);
    }

    if ($parentSection.hasClass('product-template')){
      productPage.unload($target);
    }

    if ($parentSection.hasClass('mega-menu-section')){
      header.unloadMegaMenu();
    }

    if ($parentSection.hasClass('page-details-section')) {
      videoSection.unload($target);
    }

    if ($parentSection.hasClass('product-details-section')) {
      videoSection.unload($target);
    }

});

$(document)
  .on('shopify:section:select', function(e){

    var $parentSection = $('#shopify-section-' + e.detail.sectionId);

    if ($parentSection.hasClass('social-feeds-section')){
      $('.social-feeds-wrap').each(function (index, value) {
        social.twitter();
      });
    }

    if ($parentSection.hasClass('mega-menu-section')){
      var megaMenuParent = $('.header .' + e.detail.sectionId).data('dropdown');
      setTimeout(function() {
        $('a.mega-menu-parent[data-dropdown-rel="' + megaMenuParent + '"]').trigger('mouseenter');
        $('a.mega-menu-parent[data-dropdown-rel="' + megaMenuParent + '"]').parents('header').addClass('editor-hover--true');
        header.removeDataAttributes('.header .mega-menu.dropdown_container .dropdown_column');
      }, 10);
    }

    if ($parentSection.hasClass('featured-collection-section')){
      featuredCollectionSection.unload($parentSection);
      featuredCollectionSection.init();
    }

    utils.pageBannerCheck();
    var evt = document.createEvent('UIEvents');
    evt.initUIEvent('resize', true, false, window, 0);
    window.dispatchEvent(evt);
});

$(document)
  .on('shopify:section:deselect', function(e){

    var $parentSection = $('#shopify-section-' + e.detail.sectionId);

    if ($parentSection.hasClass('mega-menu-section')){
      var megaMenuParent = $('.header .' + e.detail.sectionId).data('dropdown');
      $('a.mega-menu-parent[data-dropdown-rel="' + megaMenuParent + '"]').trigger('mouseout');
      $('a.mega-menu-parent[data-dropdown-rel="' + megaMenuParent + '"]').parents('header').removeClass('editor-hover--true');
    }
});


/*FAQ PAGE*/
                 
$( document ).ready(function() {
           $('.a1').hide();
                 $('.q1').on('click', function(){
                   $('.a1').slideToggle();
                 });  
  
             $('.a2').hide();
                 $('.q2').on('click', function(){
                   $('.a2').slideToggle();
                 });  
  
             $('.a3').hide();
                 $('.q3').on('click', function(){
                   $('.a3').slideToggle();
                 });  
  
             $('.a4').hide();
                 $('.q4').on('click', function(){
                   $('.a4').slideToggle();
                 }); 
  
             $('.a5').hide();
                 $('.q5').on('click', function(){
                   $('.a5').slideToggle();
                 });
  
             $('.a6').hide();
                 $('.q6').on('click', function(){
                   $('.a6').slideToggle();
                 });
  
             $('.a7').hide();
                 $('.q7').on('click', function(){
                   $('.a7').slideToggle();
                 });
  
             $('.a8').hide();
                 $('.q8').on('click', function(){
                   $('.a8').slideToggle();
                 });  
  
             $('.a9').hide();
                 $('.q9').on('click', function(){
                   $('.a9').slideToggle();
                 });  
  
             $('.a10').hide();
                 $('.q10').on('click', function(){
                   $('.a10').slideToggle();
                 });  
  
             $('.a11').hide();
                 $('.q11').on('click', function(){
                   $('.a11').slideToggle();
                 });  
  
             $('.a12').hide();
                 $('.q12').on('click', function(){
                   $('.a12').slideToggle();
                 });  
  
             $('.a13').hide();
                 $('.q13').on('click', function(){
                   $('.a13').slideToggle();
                 }); 
  
             $('.a14').hide();
                 $('.q14').on('click', function(){
                   $('.a14').slideToggle();
                 }); 
  
             $('.a15').hide();
                 $('.q15').on('click', function(){
                   $('.a15').slideToggle();
                 });
  
             $('.a16').hide();
                 $('.q16').on('click', function(){
                   $('.a16').slideToggle();
                 });  
  
             $('.a17').hide();
                 $('.q17').on('click', function(){
                   $('.a17').slideToggle();
                 });  
  
             $('.a18').hide();
                 $('.q18').on('click', function(){
                   $('.a18').slideToggle();
                 }); 
  
             $('.a19').hide();
                 $('.q19').on('click', function(){
                   $('.a19').slideToggle();
                 }); 

             $('.a20').hide();
                 $('.q20').on('click', function(){
                   $('.a20').slideToggle();
                 });   
});


/*HomePage Collection filter*/
$('#kids-c').on('click', function(){
  $('.kids-collection').show();
  $('.men-collection').hide();
  $('.women-collection').hide();
  $('#kids-c').css('color','#f70e0e');
  $('#kids-c').css('background','#fff');
  $('#kids-c').css('border','1px solid #f70e0e');
  $('#men-c, #women-c').css('color','#fff');
  $('#men-c, #women-c').css('background','#f70e0e');
});

$('#men-c').on('click', function(){
  $('.kids-collection').hide();
  $('.men-collection').show();
  $('.women-collection').hide();
  $('#men-c').css('color','#f70e0e');
  $('#men-c').css('background','#fff');
  $('#men-c').css('border','1px solid #f70e0e');
  $('#women-c, #kids-c').css('color','#fff');
  $('#women-c, #kids-c').css('background','#f70e0e');
});

$('#women-c').on('click', function(){
  $('.kids-collection').hide();
  $('.men-collection').hide();
  $('.women-collection').show();
  $('#women-c').css('color','#f70e0e');
  $('#women-c').css('background','#fff');
  $('#women-c').css('border','1px solid #f70e0e');
  $('#men-c, #kids-c').css('color','#fff');
  $('#men-c, #kids-c').css('background','#f70e0e');
});


"use strict";

$('#btn').on('click', function(){
	var selector = document.getElementById('country');
  	var value = selector[selector.selectedIndex].value;
  if(value == 'USA'){
  	$("#USA-stores").slideToggle();
  }else{
  	$("#USA-stores").hide();
  }
  if(value == 'Austria'){
  	$("#Austria-stores").slideToggle();
  }else{
  	$("#Austria-stores").hide();
  }
  if(value == 'Australia'){
  	$("#Australia-stores").slideToggle();
  }else{
  	$("#Australia-stores").hide();
  }
  if(value == 'Belgium'){
  	$("#Belgium-stores").slideToggle();
  }else{
  	$("#Belgium-stores").hide();
  }
  if(value == 'Canada'){
  	$("#Canada-stores").slideToggle();
  }else{
  	$("#Canada-stores").hide();
  }
  if(value == 'Chile'){
  	$("#Chile-stores").slideToggle();
  }else{
  	$("#Chile-stores").hide();
  }
  if(value == 'Czechia'){
  	$("#Czechia-stores").slideToggle();
  }else{
  	$("#Czechia-stores").hide();
  }
  if(value == 'Denmark'){
  	$("#Denmark-stores").slideToggle();
  }else{
  	$("#Denmark-stores").hide();
  }
  if(value == 'France'){
  	$("#France-stores").slideToggle();
  }else{
  	$("#France-stores").hide();
  }
  if(value == 'Germany'){
  	$("#Germany-stores").slideToggle();
  }else{
  	$("#Germany-stores").hide();
  }  
  if(value == 'Greece'){
  	$("#Greece-stores").slideToggle();
  }else{
  	$("#Greece-stores").hide();
  }
  if(value == 'Ireland'){
  	$("#Ireland-stores").slideToggle();
  }else{
  	$("#Ireland-stores").hide();
  }
  if(value == 'Israel'){
  	$("#Israel-stores").slideToggle();
  }else{
  	$("#Israel-stores").hide();
  }
  if(value == 'Italy'){
  	$("#Italy-stores").slideToggle();
  }else{
  	$("#Italy-stores").hide();
  }
  if(value == 'Japan'){
  	$("#Japan-stores").slideToggle();
  }else{
  	$("#Japan-stores").hide();
  }
  if(value == 'Luxembourg'){
  	$("#Luxembourg-stores").slideToggle();
  }else{
  	$("#Luxembourg-stores").hide();
  }
  if(value == 'MENA'){
  	$("#Mena-stores").slideToggle();
  }else{
  	$("#Mena-stores").hide();
  }
  if(value == 'Netherlands'){
  	$("#Netherlands-stores").slideToggle();
  }else{
  	$("#Netherlands-stores").hide();
  }
  if(value == 'New Zealand'){
  	$("#New-Zealand-stores").slideToggle();
  }else{
  	$("#New-Zealand-stores").hide();
  }
  if(value == 'Norway'){
  	$("#Norway-stores").slideToggle();
  }else{
  	$("#Norway-stores").hide();
  }
  if(value == 'Panama'){
  	$("#Panama-stores").slideToggle();
  }else{
  	$("#Panama-stores").hide();
  }
  if(value == 'Philippines'){
  	$("#Philippines-stores").slideToggle();
  }else{
  	$("#Philippines-stores").hide();
  }
  if(value == 'Poland'){
  	$("#Poland-stores").slideToggle();
  }else{
  	$("#Poland-stores").hide();
  }
  if(value == 'Singapore'){
  	$("#Singapore-stores").slideToggle();
  }else{
  	$("#Singapore-stores").hide();
  }
  if(value == 'Slovenia'){
  	$("#Slovenia-stores").slideToggle();
  }else{
  	$("#Slovenia-stores").hide();
  }
  if(value == 'South Africa'){
  	$("#South-Africa-stores").slideToggle();
  }else{
  	$("#South-Africa-stores").hide();
  }
  if(value == 'South Korea'){
  	$("#South-Korea-stores").slideToggle();
  }else{
  	$("#South-Korea-stores").hide();
  } 
  if(value == 'Spain'){
  	$("#Spain-stores").slideToggle();
  }else{
  	$("#Spain-stores").hide();
  }
  if(value == 'Switzerland'){
  	$("#Switzerland-stores").slideToggle();
  }else{
  	$("#Switzerland-stores").hide();
  }  
  if(value == 'Thailand'){
  	$("#Thailand-stores").slideToggle();
  }else{
  	$("#Thailand-stores").hide();
  }
});


//$('.search-top-div span').on('click', function(){
//  $('#search-mega-menu').slideToggle();
//});

     /*HOME PAGE NEWS SLIDER*/
                             
$(document).ready(function () {
    //rotation speed and timer
    var speed = 5000;
    
    var run = setInterval(rotate, speed);
    var slides = $('.slide');
    var container = $('#slides ul');
    var elm = container.find(':first-child').prop("tagName");
    var item_width = container.width();
    var previous = 'prev'; //id of previous button
    var next = 'next'; //id of next button
    slides.width(item_width); //set the slides to the correct pixel width
    container.parent().width(item_width);
    container.width(slides.length * item_width); //set the slides container to the correct total width
    container.find(elm + ':first').before(container.find(elm + ':last'));
    resetSlides();
    
    
    //if user clicked on prev button
    
    $('#buttons a').click(function (e) {
        //slide the item
        
        if (container.is(':animated')) {
            return false;
        }
        if (e.target.id == previous) {
            container.stop().animate({
                'left': 0
            }, 1500, function () {
                container.find(elm + ':first').before(container.find(elm + ':last'));
                resetSlides();
            });
        }
        
        if (e.target.id == next) {
            container.stop().animate({
                'left': item_width * -2
            }, 1500, function () {
                container.find(elm + ':last').after(container.find(elm + ':first'));
                resetSlides();
            });
        }
        
        //cancel the link behavior            
        return false;
        
    });
    
    //if mouse hover, pause the auto rotation, otherwise rotate it    
    container.parent().mouseenter(function () {
        clearInterval(run);
    }).mouseleave(function () {
        run = setInterval(rotate, speed);
    });
    
    
    function resetSlides() {
        //and adjust the container so current is in the frame
        container.css({
            'left': -1 * item_width
        });
    }
    
});
//a simple function to click next link
//a timer will call this function, and the rotation will begin

function rotate() {
    $('#next').click();
}   
   

/*Mobile*/
                             
$(document).ready(function () {
    //rotation speed and timer
    var speed2 = 5000;
    
    var run2 = setInterval(rotate2, speed2);
    var slides2 = $('.slide2');
    var container2 = $('#slides2 ul');
    var elm2 = container2.find(':first-child').prop("tagName");
    var item_width2 = container2.width();
    var previous2 = 'prev2'; //id of previous button
    var next2 = 'next2'; //id of next button
    slides2.width(item_width2); //set the slides to the correct pixel width
    container2.parent().width(item_width2);
    container2.width(slides2.length * item_width2); //set the slides container to the correct total width
    container2.find(elm2 + ':first').before(container2.find(elm2 + ':last'));
    resetSlides2();
    
    
    //if user clicked on prev button
    
    $('#buttons2 a').click(function (e) {
        //slide the item
        
        if (container2.is(':animated')) {
            return false;
        }
        if (e.target.id == previous2) {
            container2.stop().animate({
                'left': 0
            }, 1500, function () {
                container2.find(elm2 + ':first').before(container2.find(elm2 + ':last'));
                resetSlides2();
            });
        }
        
        if (e.target.id == next2) {
            container2.stop().animate({
                'left': item_width2 * -2
            }, 1500, function () {
                container2.find(elm2 + ':last').after(container2.find(elm2 + ':first'));
                resetSlides2();
            });
        }
        
        //cancel the link behavior            
        return false;
        
    });
    
    //if mouse hover, pause the auto rotation, otherwise rotate it    
    container2.parent().mouseenter(function () {
        clearInterval(run2);
    }).mouseleave(function () {
        run2 = setInterval(rotate2, speed2);
    });
    
    
    function resetSlides2() {
        //and adjust the container so current is in the frame
        container2.css({
            'left': -1 * item_width2
        });
    }
    
});
//a simple function to click next link
//a timer will call this function, and the rotation will begin

function rotate2() {
    $('#next2').click();
}   
     



/*
$('.cart_container').on('click', function(){
	window.location.href="https://freedomoses.myshopify.com/cart";
});
*/

	$(window).scroll(function(){
		if ($(this).scrollTop() > 100) {
			$('.top-button').fadeIn();
		} else {
			$('.top-button').fadeOut();
		}
	});
	
	//Click event to scroll to top
	$('.top-button').click(function(){
		$('html, body').animate({scrollTop : 0},800);
		return false;
	});

/*
if($("#home-page-shop-all-buttom-wrap").offset()) {
  $(window).scroll(function(){
      var homePageShopAllButton = document.getElementById("home-page-shop-all-buttom");
      var homePageWrapperOffset = $("#home-page-shop-all-buttom-wrap").offset().top / 1.22;
      
	  if ($(this).scrollTop() > 120 && $(this).scrollTop() < homePageWrapperOffset) {
		homePageShopAllButton.classList.add("home-page-shop-all-button");
      } else {
		homePageShopAllButton.classList.remove("home-page-shop-all-button");
	  }
	});
}


    $(window).scroll(function(){
      var shopAllButton = document.getElementById("five_reasons_landing_page_shop_button");
      var wrapperOffset = $("#five_reasons_landing_page_shop_button_wrap").offset().top / 1.27;
      
      if ($(this).scrollTop() > 150 && $(this).scrollTop() < wrapperOffset) {
        shopAllButton.classList.add("home-page-shop-all-button");
	  } else {
		shopAllButton.classList.remove("home-page-shop-all-button");
	  }
	});



function checkDevice() {
  if (navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)) {
    return "mobile";
  } else {
    return "desktop";
  }
}
// Call the function to check the device type
var deviceType = checkDevice();

if($("#photoshoot_img_logo_wrapp").offset() && deviceType === "mobile") {
  $(window).scroll(function(){
      var homePageShopAllButton = document.getElementById("photoshoot_img_logo_wrapp");
      var homePageWrapperOffset = $("#photoshoot_img_logo_wrapp").offset().top / 1.09;
		if ($(this).scrollTop() > 350 && $(this).scrollTop() < homePageWrapperOffset) {
			homePageShopAllButton.classList.add("photoshoot_img_logo_scroll");
		} else {
			homePageShopAllButton.classList.remove("photoshoot_img_logo_scroll");
		}
	});
} else if ($("#photoshoot_img_logo_wrapp").offset() && deviceType === "desktop") {
  $(window).scroll(function(){
      var homePageShopAllButton = document.getElementById("photoshoot_img_logo_wrapp");
      var homePageWrapperOffset = $("#photoshoot_img_logo_wrapp").offset().top / 1.0595;
		if ($(this).scrollTop() > 1200 && $(this).scrollTop() < homePageWrapperOffset) {
			homePageShopAllButton.classList.add("photoshoot_img_logo_scroll");
		} else {
			homePageShopAllButton.classList.remove("photoshoot_img_logo_scroll");
		}
	});
}
*/

var bannernl = $('a[href="##"]');
bannernl.click(function(){
  window._klOnsite = window._klOnsite || [];
  window._klOnsite.push(['openForm', 'SXLrnR']);
});

window.document.onkeydown = function(e) {
  if (!e) {
    e = event;
  }
  if (e.keyCode == 27) {
    lightbox_close();
  }
}

function lightbox_open() {
  var lightBoxVideo = document.getElementById("VisaChipCardVideo");
  window.scrollTo(0, 0);
  document.getElementById('light').style.display = 'block';
  document.getElementById('fade').style.display = 'block';
  lightBoxVideo.play();
}

function lightbox_close() {
  var lightBoxVideo = document.getElementById("VisaChipCardVideo");
  document.getElementById('light').style.display = 'none';
  document.getElementById('fade').style.display = 'none';
  lightBoxVideo.pause();
}

//Q-biz header search first and second click toggle
var clicks = 0;

	$('#top-search').submit( function(event){
      if(clicks == 0){
        $("#bc-sf-search-box-1").focus();
        event.preventDefault();
        
      	clicks += 1;
        
      }else{
        $('#top-search').unbind('submit').submit();
      };
});


    if ($(window).width() > 798) {
      if ($('.header').hasClass('header-fixed--true')){
        if (!$('.main_nav_wrapper').hasClass('sticky_nav')) {
          $( window ).scroll(function() {
            if ($(this).scrollTop() > 350) {
            $( ".sticky_login" ).show();
            $( ".sticky_search" ).show();
            $( ".sticky_logo" ).show();
            $( ".menu" ).addClass('sticky_menu')
            $( ".sticky_login" ).addClass('sticky_login-align');
            $( ".mini_cart" ).addClass('sticky_cart-align');
            }
            if($(this).scrollTop() < 350){
              $( ".sticky_login" ).hide();
              $( ".sticky_search" ).hide();
              $( ".sticky_logo" ).hide();
              $( ".menu" ).removeClass('sticky_menu');
              $( ".sticky_login" ).removeClass('sticky_login-align');
              $( ".mini_cart" ).removeClass('sticky_cart-align');
            }
          });
        }
      }
    }


$('.see-more').on('click', function(){
	$('.see-more-content').slideToggle();
  	$('.see-more').html($('.see-more').html() == 'See More' ? 'See Less' : 'See More');
});
