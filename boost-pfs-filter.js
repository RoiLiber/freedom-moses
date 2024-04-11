// Override Settings
var boostPFSFilterConfig = {
	general: {
		limit: boostPFSConfig.custom.products_per_page,
		// Optional
		loadProductFirst: false,
		// paginationType: boostPFSConfig.custom.pagination_type == 'infinite_scroll' ? 'infinite' :
		// 	(boostPFSConfig.custom.pagination_type == 'load_more' ? 'load_more' : 'default'),
        paginationTypeAdvanced: false,
        showRefineBy: true,
	},
	template: {
		loadMoreLoading: '<div class="boost-pfs-filter-load-more-loading"><div class="load-more__icon" style="width: 44px; height: 44px; opacity: 1;"></div></div>'
	},
	selector: {
		breadcrumb: '.breadcrumb-collection'
	},
  	label: {
  		error: {
			noSearchResult: 'Oops! We couldn' + "'" + 't find that...<br>Please try again.',
		},
  	},
};

// Declare Templates
var boostPFSTemplate = {
    
	'saleLabelHtml': '<div class="sale_banner thumbnail_banner">' + boostPFSConfig.label.sale + '</div>',
	'newLabelHtml': '<div class="new_banner thumbnail_banner">' + boostPFSConfig.label.new + '</div>',
	'preorderLabelHtml': '<div class="preorder_banner thumbnail_banner">' + boostPFSConfig.label.pre_order + '</div>',
	'quickViewBtnHtml': '<span data-fancybox-href="#product-{{itemId}}" class="quick_shop ss-icon" data-gallery="product-{{itemId}}-gallery">&#x002B;</span>',
	'newRowHtml': '<br class="clear product_clear" />',

	// Grid Template
	'productGridItemHtml': 	'<div class="{{itemColumnNumberClass}} thumbnail {{itemCollectionGroupSmallClass}} quick-shop-style--'+ boostPFSConfig.custom.quick_shop_style +' product-{{itemId}}" data-boost-theme-quickview="{{itemId}}">' +
                              '<div class="color_button_point" id={{itemId}}></div>' +
								'<div class="product-wrap {{flipImageClass}}"> ' +
									'<div class="relative product_image">' +
                                        '{{itemWishlist}}'+
										'<a href="{{itemUrl}}">' +
											'{{itemImages}}' +
										'</a>' +
										'{{itemProductInfoHover}}' +
										'<div class="banner_holder">' +
											'{{itemSaleLabel}}' +
											'{{itemNewLabel}}' +
											'{{itemPreorderLabel}}' +
                                            '{{customNewLabel}}' +
										'</div>' +
									'</div>' +
									'<a class="product-info__caption {{itemHiddenClass}}" href="{{itemUrl}}">' +
										'{{itemProductInfo}}' +
									'</a>' +
									'{{itemColorSwatchesInline}}' +
								'</div>' +
							'</div>',


	// Pagination Template
	'previousHtml': '<span class="prev"><a href="{{itemUrl}}">« ' + boostPFSConfig.label.paginate_prev + '</a></span>',
	'nextHtml': '<span class="next"><a href="{{itemUrl}}">' + boostPFSConfig.label.paginate_next + ' »</a></span>',
	'pageItemHtml': '<span class="page"><a href="{{itemUrl}}">{{itemTitle}}</a></span>',
	'pageItemSelectedHtml': '<span class="page current">{{itemTitle}}</span>',
	'pageItemRemainHtml': '<span>{{itemTitle}}</span>',
	'paginateHtml': '{{previous}}{{pageItems}}{{next}}',

	// Sorting Template
	'sortingHtml': '<button class="boost-pfs-filter-top-sorting-wrapper" aria-label="' + boostPFSConfig.label.sorting + '"><span aria-hidden="true"><span aria-hidden="true">' + boostPFSConfig.label.sorting +'</span></span></button><ul class="boost-pfs-filter-filter-dropdown">{{sortingItems}}</ul>',
};


(function () {
	BoostPFS.inject(this); // Add this

    boostPFSFilterConfig.general.separateRefineByFromFilter = (Utils.isMobile() > 0) ? true : false;

    /* Start boost 146711 */
    boostPFSConfig.custom.quick_shop_enabled = false;
    if (boostPFSConfig.general.collection_handle == 'packs-collection') {
      boostPFSConfig.custom.quick_shop_enabled = true;
    }
    /* End boost 146711 */
  
	// Build Product Grid Item
	ProductGridItem.prototype.compileTemplate = function (data, index) {
        // UTURN start
        console.log("this.data=" + JSON.stringify(this.data));
        // UTURN end
      
		if(!data) data = this.data;
		if (!index) index = this.index + 1;

		/*** Prepare data ***/
		var images = data.images_info;
		if (images.length > 0) {
			data.featured_image = images[0];
		} else {
			data.featured_image = {
				'height': 1,
				'width': 1
			}
		}
		// Displaying price base on the policy of Shopify, have to multiple by 100
		var soldOut = !data.available; // Check a product is out of stock
		var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
		var priceVaries = data.price_min != data.price_max; // Check a product has many prices
		// Get First Variant (selected_or_first_available_variant)
		var firstVariant = data['variants'][0];
		if (Utils.getParam('variant') !== null && Utils.getParam('variant') != '') {
			var paramVariant = data.variants.filter(function (e) {
				return e.id == Utils.getParam('variant');
			});
			if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
		} else {
			for (var iVariants = 0; iVariants < data['variants'].length; iVariants++) {
				if (data['variants'][iVariants].available) {
					firstVariant = data['variants'][iVariants];
					break;
				}
			}
		}
		/*** End Prepare data ***/

		// Get Template
		var itemHtml = boostPFSTemplate.productGridItemHtml;

		var onSaleClass = onSale ? 'sale' : '';
		//var soldOutClass = soldOut ? 'out_of_stock' : 'in_stock';
		//var availabilityProp = soldOut ? 'http://schema.org/SoldOut' : 'http://schema.org/InStock';

		// Add custom class
		var itemColumnNumberClass = '';
		var itemCollectionGroupLargeClass = '';
		var itemCollectionGroupMediumClass = '';
		var itemCollectionGroupSmallClass = (index - 1) % 2 == 0 ? 'even' : 'odd';

		switch (boostPFSConfig.custom.products_per_row) {
			case 2:
				itemColumnNumberClass = 'eight columns';
				break;
			case 3:
				itemColumnNumberClass = 'one-third column';
				break;
			case 4:
				itemColumnNumberClass = 'four columns';
				break;
			case 5:
				itemColumnNumberClass = 'one-fifth column';
				break;
			case 6:
				itemColumnNumberClass = 'one-sixth column';
				break;
			default:
				itemColumnNumberClass = 'one-seventh column';
				break;
		}

		if (boostPFSConfig.custom.mobile_products_per_row == 1) {
			itemColumnNumberClass += ' medium-down--one-half small-down--one-whole';
		} else {
			itemColumnNumberClass += ' medium-down--one-half small-down--one-half';
		}

		itemHtml = itemHtml.replace(/{{itemColumnNumberClass}}/g, itemColumnNumberClass);
		itemHtml = itemHtml.replace(/{{itemCollectionGroupLargeClass}}/g, itemCollectionGroupLargeClass);
		itemHtml = itemHtml.replace(/{{itemCollectionGroupMediumClass}}/g, itemCollectionGroupMediumClass);
		itemHtml = itemHtml.replace(/{{itemCollectionGroupSmallClass}}/g, itemCollectionGroupSmallClass);

		// Add soldOut label
		var itemSoldOutLabel = soldOut ? boostPFSTemplate.soldOutLabelHtml : '';
		itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, itemSoldOutLabel);

		// Add onSale label
		var itemSaleLabel = boostPFSConfig.custom.sale_banner_enabled && onSale ? boostPFSTemplate.saleLabelHtml : '';
		itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, itemSaleLabel);

		// Add Label (New, Coming soon, Pre order)
		var newLabel = ''
		var preorderLabel = ''
		var comingsoonLabel = ''
		if (data.collections) {
          newLabel = data.collections.filter(function (e) {
			return e.handle == 'new';
		});
          
		preorderLabel = data.collections.filter(function (e) {
			return e.handle == 'pre-order';
		});
          
		comingsoonLabel = data.collections.filter(function (e) {
			return e.handle == 'coming-soon';
		});
          
			var itemNewLabelHtml = typeof newLabel[0] != 'undefined' ? boostPFSTemplate.newLabelHtml : '';
			itemHtml = itemHtml.replace(/{{itemNewLabel}}/g, itemNewLabelHtml);

			var itemComingsoonLabelHtml = typeof comingsoonLabel[0] != 'undefined' ? boostPFSTemplate.comingsoonLabelHtml : '';
			itemHtml = itemHtml.replace(/{{itemComingsoonLabel}}/g, itemComingsoonLabelHtml);

			var itemPreorderLabelHtml = typeof preorderLabel[0] != 'undefined' ? boostPFSTemplate.preorderLabelHtml : '';
			itemHtml = itemHtml.replace(/{{itemPreorderLabel}}/g, itemPreorderLabelHtml);
		}

		var itemHiddenClass = boostPFSConfig.custom.thumbnail_hover_enabled ? 'hidden' : '';
		itemHtml = itemHtml.replace(/{{itemHiddenClass}}/g, itemHiddenClass);

		var flipImageClass = boostPFSConfig.custom.secondary_image && images.length > 1 ? 'has-secondary-media-swap' : '';
		itemHtml = itemHtml.replace(/{{flipImageClass}}/ , flipImageClass);


		//Render image-element
		var itemImagesHtml = buildImageElement(data);
		itemHtml = itemHtml.replace(/{{itemImages}}/g, itemImagesHtml);


		// Build Product Info when hovering
		var itemProductInfoHoverHtml = '';
		if (boostPFSConfig.custom.thumbnail_hover_enabled || (boostPFSConfig.custom.quick_shop_enabled && boostPFSConfig.custom.quick_shop_style == 'popup' )) {
			itemProductInfoHoverHtml = '<div class="thumbnail-overlay ' + returnBgColor(data) + '">' +
				'<a href="{{itemUrl}}" itemprop="url" class="hidden-product-link">{{itemTitle}}</a>' +
				'<div class="info">' +
				(boostPFSConfig.custom.thumbnail_hover_enabled ? '{{itemProductInfo}}' : '') +
				'</div>' +
				'</div>';
		}
		itemHtml = itemHtml.replace(/{{itemProductInfoHover}}/g, itemProductInfoHoverHtml);
      
        itemHtml = itemHtml.replace(/{{customNewLabel}}/g, newLabelCreator(data))

		// Build Product Info (product-info.liquid)
		var itemProductInfoHtml = '<div class="product-details">';
		itemProductInfoHtml += '<div class="product-title-wrap">';
        itemProductInfoHtml += '{{itemColle}}';
        itemProductInfoHtml += '</div>';
		itemProductInfoHtml += '{{itemVendor}}';
		itemProductInfoHtml += '{{itemReview}}';
		itemProductInfoHtml += '{{itemPrice}}';
		itemProductInfoHtml += '</div>';
		itemHtml = itemHtml.replace(/{{itemProductInfo}}/g, itemProductInfoHtml);

		// Add Vendor
		var itemVendorHtml = '';
		if (boostPFSConfig.custom.vendor_enable) {
			itemVendorHtml = '<span class="brand">' + data.vendor + '</span>';
		}
		itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);

		// Add Review badge
		var itemReviewHtml = '';
		if (boostPFSConfig.custom.enable_shopify_collection_badges) {
			itemReviewHtml += '<div class="shopify-reviews reviewsVisibility--' + boostPFSConfig.custom.enable_shopify_review_comments + '">';
			itemReviewHtml += '<span class="shopify-product-reviews-badge" data-id="{{itemId}}"></span>';
			itemReviewHtml += '</div>';
		}
		itemHtml = itemHtml.replace(/{{itemReview}}/g, itemReviewHtml);

		// Add Price
		var itemPriceHtml = '';
		if (typeof comingsoonLabel[0] !== 'undefined') {
			itemPriceHtml += '<span class="coming-soon">' + boostPFSConfig.label.coming_soon + '</span>';
		} else {
			itemPriceHtml += '<span class="price ' + onSaleClass + '">';
			if (!soldOut || boostPFSConfig.custom.display_price) {
				itemPriceHtml += '<span class="current_price">';
				if (priceVaries && data.price_min > 0) {
					itemPriceHtml += '<small><em>' + boostPFSConfig.label.from_price + '</em></small> ';
				}
				if (data.price_min > 0) {
					if (boostPFSConfig.custom.currency_format == 'money_with_currency_format') {
						itemPriceHtml += Utils.formatMoney(data.price_min) + ' ' + Globals.defaultCurrency;
					} else {
						itemPriceHtml += Utils.formatMoney(data.price_min);
					}
				} else {
					itemPriceHtml += boostPFSConfig.label.free_price;
				}
				itemPriceHtml += "</span>";

				if (onSale) {
					if (boostPFSConfig.custom.currency_format == 'money_with_currency_format') {
						itemPriceHtml += ' <span class="was_price">' + Utils.formatMoney(data.compare_at_price_max) + ' ' + Globals.defaultCurrency + '</span>';
					} else {
						itemPriceHtml += ' <span class="was_price">' + Utils.formatMoney(data.compare_at_price_max) + '</span>';
					}
				}
			}

			itemPriceHtml += '<div class="sold-out">';
			if (soldOut) {
              if( boostPFSConfig.label.sold_out_text ) {
              	itemPriceHtml += boostPFSConfig.label.sold_out_text;
              } else {
              	itemPriceHtml += "Sold Out";
              }
			}
			itemPriceHtml += ' </div>';
		}
		itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);
      
      // Add Collection Name
      	var itemColleHtml = '';
        var newCollectionA = '';
        var newCollectionB = '';
        var newCollectionC = '';
        if(data.collections) {
          newCollectionA = data.collections.filter(function(e) {
            return e.handle.indexOf('fm-x-solid-striped') !== -1;
          });
        	newCollectionB = data.collections.filter(function(e) {
            return e.handle.indexOf('fm-x-jonathan-simkhai') !== -1;
          });
        	newCollectionC = data.collections.filter(function(e) {
            return e.handle.indexOf('fm-x-saks-fifth-avenue-collection') !== -1;
          });
        }
        
        if (typeof newCollectionB[0] !== 'undefined') {
            itemColleHtml += '<span class="title mobile-product-thumbnail-details" itemprop="name">FM X JONATHAN SIMKHAI</span>';
        } else
      	if (typeof newCollectionA[0] !== 'undefined') {
            itemColleHtml += '<span class="title mobile-product-thumbnail-details" itemprop="name">FM X SOLID STRIPED</span>';
        } else
      	if (typeof newCollectionC[0] !== 'undefined') {
            itemColleHtml += '<span class="title mobile-product-thumbnail-details" itemprop="name">FM X SAKS FIFTH AVENUE</span>';
        } else {
          itemColleHtml += '<span class="title" itemprop="name">{{itemTitle}}</span>'
        }
      	itemHtml = itemHtml.replace(/{{itemColle}}/g, itemColleHtml);

		// Add Swatches
		var itemColorSwatchesHtml = '';
		if (boostPFSConfig.custom.collection_swatches) {
			for (var k = 0; k < data.options.length; k++) {
				var option = data['options'][k];
				var downcasedOption = option.toLowerCase();
				var colorTypes = ['color', 'colour'];
				if (colorTypes.indexOf(downcasedOption) > -1) {
					var option_index = k;
					var values = [];
					itemColorSwatchesHtml += '<div class="collection_swatches">';
					for (var i = 0; i < data.variants.length; i++) {
						var variant = data['variants'][i];
						var value = variant['options'][option_index];
						if (values.indexOf(value) == -1) {
							/*
							 var values = values.join(',');
							 values += ',' + value;
							 values = values.split(',');
							 */
							values.push(value);
							var fileColorUrl = boostPFSConfig.general.asset_url.replace('boost-pfs.js', Utils.slugify(value) + '.png');
							fileColorUrl = Utils.optimizeImage(fileColorUrl, '50x');
							itemColorSwatchesHtml += '<a href="' + Utils.buildProductItemUrl(data) + '?variant=' + variant.id + '" class="swatch" data-swatch-name="meta-' + downcasedOption + '_' + (value.replace(/\s/g, '_')).toLowerCase() + '">';
							itemColorSwatchesHtml += '<span ';
							if (boostPFSConfig.custom.products_per_row == 2) {
								itemColorSwatchesHtml += 'data-image="' + Utils.optimizeImage(variant.image, '600x') + '" ';
							} else if (boostPFSConfig.custom.products_per_row == 3) {
								itemColorSwatchesHtml += 'data-image="' + Utils.optimizeImage(variant.image, '500x') + '" ';
							} else {
								itemColorSwatchesHtml += 'data-image="' + Utils.optimizeImage(variant.image, '400x') + '" ';
							}
							itemColorSwatchesHtml += 'style="background-image: url(' + fileColorUrl + '); background-color: ' + Utils.slugify(value.split(' ').pop()) + ';">';
							itemColorSwatchesHtml += '</span>';
							itemColorSwatchesHtml += '</a>';
						}
					}
					itemColorSwatchesHtml += '</div>';
				}
			}
		}

		if (!(boostPFSConfig.custom.quick_shop_style == 'inline' && boostPFSConfig.custom.quick_shop_enabled)) {
			itemHtml = itemHtml.replace(/{{itemColorSwatchesInline}}/g, itemColorSwatchesHtml);
		} else {
			itemHtml = itemHtml.replace(/{{itemColorSwatchesInline}}/g, '');
		}
      
        var itemWishlistHtml = "<!-- include 'wishlist-button-collection' with '" + data.id + "' -->";
        itemHtml = itemHtml.replace(/{{itemWishlist}}/g, itemWishlistHtml);

		// Add main attribute
		itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
		itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);
		itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
		itemHtml = itemHtml.replace(/{{itemUrl}}/g, Utils.buildProductItemUrl(data));

		return itemHtml;
	};
    
    function newLabelCreator(data) {
        var newLabel = ''
        for (var i = 0; i < data.tags.length; i++) {
          if (data.tags[i] == 'Collection-Coming Soon') {
            newLabel = '<div class="new_banner thumbnail_banner" style="background: transparent;">' + 
                          '<span class="new_banner_span">SOON</span>' +
                     	'</div>';
            break;
          }
          else if (data.tags[i] == 'exclusive') {
            newLabel = '<div class="new_banner thumbnail_banner" style="background: transparent;">' + 
                          '<span class="new_banner_span">ONLINE EXCLUSIVE</span>' +
                     	'</div>';
            break;
          }
          else if (data.tags[i] == 'new-collection' && (boostPFSConfig.general.collection_handle !== "new-arrivals-slides-collection" && boostPFSConfig.general.collection_handle !== "uturn-collection")) {
            newLabel = '<div class="new_banner thumbnail_banner" style="background: transparent;">' + 
                          '<span class="new_banner_span">NEW</span>' +
                     	'</div>';
            break;
          }
          else if (data.tags[i] == 'collabs-collection' && (boostPFSConfig.general.collection_handle !== "collabs")) {
            newLabel = '<div class="new_banner thumbnail_banner" style="background: transparent;">' + 
                          '<span class="new_banner_span"></span>' +
                     	'</div>';
            break;
          }
          else if (data.tags[i] == 'last-sizes') {
            newLabel = '<div class="custom_sale_banner thumbnail_banner" style="background: transparent;">' + 
                          '<span class="sale_banner_span"></span>' +
                     	'</div>';
            break;
          }
          else if (data.tags[i] == 'last-items') {
            newLabel = '<div class="custom_sale_banner thumbnail_banner" style="background: transparent;">' + 
                          '<span class="sale_banner_span">LAST ITEMS !</span>' +
                     	'</div>';
            break;
          }
          else {
            newLabel = '<div class="custom_sale_banner thumbnail_banner" style="background: transparent;">' + 
                          '<span class="sale_banner_span"></span>' +
                     	'</div>';
          }
        }
        
        return newLabel
    }
    
    function returnBgColor(data) {
        var bg = ''
        
        if (data.title.includes('TestOnly')) { bg = 'test-only-hbg' }
      
        else if (data.title == 'ACID SUNGLASSES') { bg = 'acid-hbg' }
        else if (data.title == 'AMAZONIA SUNGLASSES') { bg = 'amazonia-hbg' }
        else if (data.title == 'BABY SUNGLASSES') { bg = 'baby-hbg' }
        else if (data.title == 'CHERRY BOMB SUNGLASSES') { bg = 'cherry-hbg' }
        else if (data.title == 'DUSK SUNGLASSES') { bg = 'dusk-hbg' }
        else if (data.title == 'SKY SUNGLASSES') { bg = 'sky-hbg' }
        else if (data.title == 'WHISKEY SUNGLASSES') { bg = 'whiskey-hbg' }
      
        else if (data.title.includes('ACID')) { bg = 'acid-hbg' }
        else if (data.title == 'ACID') { bg = 'acid-hbg' }
        else if (data.title == 'BANDI') { bg = 'acid-hbg' }
      
        else if (data.title.includes('ALICE')) { bg = 'alice-hbg' }
        else if (data.title == 'ALICE') { bg = 'alice-hbg' }
       
        else if (data.title.includes('AMAZONIA')) { bg = 'amazonia-hbg' }
        else if (data.title == 'AMAZONIA') { bg = 'amazonia-hbg' }
        else if (data.title == 'KELLY') { bg = 'amazonia-hbg' }
        else if (data.title == 'MAUI') { bg = 'amazonia-hbg' }

        else if (data.title.includes('APRICOT')) { bg = 'apricot-hbg' }
        else if (data.title == 'APRICOT') { bg = 'apricot-hbg' }
        else if (data.title == 'APRICOT GLITTER') { bg = 'apricot-hbg' }
      
        else if (data.title.includes('ASTRAL')) { bg = 'astral-hbg' }
        else if (data.title == 'ASTRAL') { bg = 'astral-hbg' }
      
        else if (data.title.includes('ATHENA')) { bg = 'athena-hbg' }
        else if (data.title == 'ATHENA') { bg = 'athena-hbg' }

        else if (data.title.includes('AURA')) { bg = 'aura-hbg' }
        else if (data.title == 'AURA') { bg = 'aura-hbg' }
        else if (data.title == 'PAZ AURA') { bg = 'aura-hbg' }
      
        else if (data.title.includes('AZURA')) { bg = 'azura-hbg' }
        else if (data.title == 'AZURA') { bg = 'azura-hbg' }
      
        else if (data.title.includes('BABY')) { bg = 'baby-hbg' }
        else if (data.title == 'BABY') { bg = 'baby-hbg' }
        else if (data.title == 'HAVANA') { bg = 'baby-hbg' }
        else if (data.title == 'IBIZA') { bg = 'baby-hbg' }
      
        else if (data.title == 'BLUE JEANS') { bg = 'lagoon-hbg' }
      
        else if (data.title.includes('BLUE')) { bg = 'blue-hbg' }
        else if (data.title == 'BLUE') { bg = 'blue-hbg' }
        else if (data.title == 'LUCA') { bg = 'blue-hbg' }
      
        else if (data.title.includes('BUBBLE GUM')) { bg = 'bubble-gum-hbg' }
        else if (data.title == 'BUBBLE GUM') { bg = 'bubble-gum-hbg' }
        else if (data.title == 'MALIBU') { bg = 'bubble-gum-hbg' }
      
        else if (data.title.includes('CACTUS')) { bg = 'cactus-hbg' }
        else if (data.title == 'CACTUS') { bg = 'cactus-hbg' }
      
        else if (data.title.includes('CAMEL')) { bg = 'camel-hbg' }
        else if (data.title == 'CAMEL') { bg = 'camel-hbg' }
        else if (data.title == 'HOP CAMEL') { bg = 'camel-hbg' }
        else if (data.title == 'KASH CAMEL') { bg = 'camel-hbg' }
        else if (data.title == 'ST. BART') { bg = 'camel-hbg' }
      
        else if (data.title.includes('CANDY')) { bg = 'candy-hbg' }
        else if (data.title == 'CANDY') { bg = 'candy-hbg' }
      
        else if (data.title.includes('CAPRI')) { bg = 'capri-hbg' }
        else if (data.title == 'CAPRI') { bg = 'capri-hbg' }

        else if (data.title.includes('CHAI')) { bg = 'chai-hbg' }
        else if (data.title == 'CHAI') { bg = 'chai-hbg' }
        else if (data.title == 'IKAT CHAI') { bg = 'chai-hbg' }
        else if (data.title == 'WILD CHAI') { bg = 'chai-hbg' }
        else if (data.title == 'ZIGGY CHAI') { bg = 'chai-hbg' }
      
        else if (data.title.includes('CHERRY')) { bg = 'cherry-hbg' }
        else if (data.title == 'CHERRY') { bg = 'cherry-hbg' }
        else if (data.title == 'Lily.Rose Cherry Bomb') { bg = 'cherry-hbg' }
        else if (data.title == 'OPERA') { bg = 'cherry-hbg' }
        else if (data.title == 'RUBY') { bg = 'cherry-hbg' }
      
        else if (data.title.includes('CHOCO')) { bg = 'choco-hbg' }
        else if (data.title == 'CHOCO') { bg = 'choco-hbg' }
        else if (data.title == 'VANILLA') { bg = 'choco-hbg' }
      
        else if (data.title.includes('COPPER')) { bg = 'copper-hbg' }
        else if (data.title == 'COPPER') { bg = 'copper-hbg' }
      
        else if (data.title.includes('DARLING')) { bg = 'darling-hbg' }
        else if (data.title == 'DARLING') { bg = 'darling-hbg' }

        else if (data.title == 'FREEDOM TOTE BAG') { bg = 'freedom-tote-bag-hbg' }
          
        else if (data.title.includes('FUJI')) { bg = 'fuji-hbg' }
        else if (data.title == 'FUJI') { bg = 'fuji-hbg' }
      
        else if (data.title.includes('GLOW')) { bg = 'glow-hbg' }
        else if (data.title == 'GLOW') { bg = 'glow-hbg' }
      
        else if (data.title.includes('GOLDIE')) { bg = 'goldie-hbg' }
        else if (data.title == 'GOLDIE') { bg = 'goldie-hbg' }
      
        else if (data.title.includes('GREY')) { bg = 'grey-hbg' }
        else if (data.title == 'GREY') { bg = 'grey-hbg' }
        else if (data.title == 'BANDHANI GREY') { bg = 'grey-hbg' }
        else if (data.title == 'BLING') { bg = 'grey-hbg' }
      
        else if (data.title.includes('GUNMETAL')) { bg = 'gunmetal-hbg' }
        else if (data.title == 'GUNMETAL') { bg = 'gunmetal-hbg' }
      
        else if (data.title.includes('HAPPY')) { bg = 'happy-hbg' }
        else if (data.title == 'HAPPY') { bg = 'happy-hbg' }
      
        else if (data.title.includes('HENDRIX')) { bg = 'hendrix-hbg' }
        else if (data.title == 'HENDRIX') { bg = 'hendrix-hbg' }

        else if (data.title.includes('HYDRA')) { bg = 'hydra-hbg' }
        else if (data.title == 'HYDRA') { bg = 'hydra-hbg' }
        else if (data.title == 'ALOHA HYDRA') { bg = 'hydra-hbg' }
        else if (data.title == 'KASH HYDRA') { bg = 'hydra-hbg' }
        else if (data.title == 'ZIGGY HYDRA') { bg = 'hydra-hbg' }
      
        else if (data.title.includes('JUNGLE')) { bg = 'jungle-hbg' }
        else if (data.title == 'JUNGLE') { bg = 'jungle-hbg' }
      
        else if (data.title.includes('JUPITER')) { bg = 'jupiter-hbg' }
        else if (data.title == 'JUPITER') { bg = 'jupiter-hbg' }
      
        else if (data.title.includes('KHAKI')) { bg = 'khaki-hbg' }
        else if (data.title == 'KHAKI') { bg = 'khaki-hbg' }
        else if (data.title == 'BANDHANI KHAKI') { bg = 'khaki-hbg' }
        else if (data.title == 'STARS-KHAKI') { bg = 'khaki-hbg' }
        else if (data.title == 'STROKES-KHAKI') { bg = 'khaki-hbg' }
        else if (data.title == 'PABLO') { bg = 'khaki-hbg' }

        else if (data.title == 'KUSH BLOOM') { bg = 'kush-bloom-hbg' }
        else if (data.title == 'KUSH BONBON') { bg = 'kush-bonbon-hbg' }
        else if (data.title == 'KUSH HAZE') { bg = 'kush-haze-hbg' }
        else if (data.title == 'KUSH LATTE') { bg = 'kush-latte-hbg' }
        else if (data.title == 'KUSH OLIVE') { bg = 'kush-olive-hbg' }
        else if (data.title == 'KUSH VINO') { bg = 'kush-vino-hbg' }
          
        else if (data.title.includes('LAGOON')) { bg = 'lagoon-hbg' }
        else if (data.title == 'LAGOON') { bg = 'lagoon-hbg' }
      
        else if (data.title.includes('LIME')) { bg = 'lime-hbg' }
        else if (data.title == 'LIME') { bg = 'lime-hbg' }
        else if (data.title == 'POP') { bg = 'lime-hbg' }
      
        else if (data.title.includes('LUCY')) { bg = 'lucy-hbg' }
        else if (data.title == 'LUCY') { bg = 'lucy-hbg' }
      
        else if (data.title.includes('MARLEY')) { bg = 'marley-hbg' }
        else if (data.title == 'MARLEY') { bg = 'marley-hbg' }
        else if (data.title == 'HOP MARLEY') { bg = 'marley-hbg' }
      
        else if (data.title.includes('METALLICA')) { bg = 'metallica-hbg' }
        else if (data.title == 'METALLICA') { bg = 'metallica-hbg' }
      
        else if (data.title.includes('MIAMI')) { bg = 'miami-hbg' }
        else if (data.title == 'MIAMI') { bg = 'miami-hbg' }
      
        else if (data.title.includes('MIKADO')) { bg = 'mikado-hbg' }
        else if (data.title == 'MIKADO') { bg = 'mikado-hbg' }
        else if (data.title == 'GIA MIKADO') { bg = 'mikado-hbg' }
      
        else if (data.title.includes('MINT')) { bg = 'mint-hbg' }
        else if (data.title == 'MINT') { bg = 'mint-hbg' }
        else if (data.title == 'PINA COLADA MINT') { bg = 'mint-hbg' }
        else if (data.title == 'EDEN') { bg = 'mint-hbg' }
      
        else if (data.title.includes('MOLLY')) { bg = 'molly-hbg' }
        else if (data.title == 'MOLLY') { bg = 'molly-hbg' }
      
        else if (data.title.includes('MYKONOS')) { bg = 'mykonos-hbg' }
        else if (data.title == 'MYKONOS') { bg = 'mykonos-hbg' }
      
        else if (data.title == 'NAVY STRIPE') { bg = 'white-hbg' }
      
        else if (data.title.includes('NAVY')) { bg = 'navy-hbg' }
        else if (data.title == 'NAVY') { bg = 'navy-hbg' }
        else if (data.title == 'STROKES-NAVY') { bg = 'navy-hbg' }
        else if (data.title == 'PAROS') { bg = 'navy-hbg' }
        else if (data.title == 'RAY') { bg = 'navy-hbg' }
      
        else if (data.title.includes('PARMA')) { bg = 'parma-hbg' }
        else if (data.title.includes('PINK')) { bg = 'parma-hbg' }
        else if (data.title == 'PARMA') { bg = 'parma-hbg' }
        else if (data.title == 'BAJA') { bg = 'parma-hbg' }
        else if (data.title == 'COMO PARMA') { bg = 'parma-hbg' }
        else if (data.title == 'GLITTER-PARMA') { bg = 'parma-hbg' }
        else if (data.title == 'ISLA') { bg = 'parma-hbg' }
        else if (data.title == 'SMILE PARMA') { bg = 'parma-hbg' }
      
        else if (data.title.includes('PINK MARTINI')) { bg = 'pink-martini-hbg' }
        else if (data.title == 'PINK MARTINI') { bg = 'pink-martini-hbg' }
        else if (data.title == 'CRUSH') { bg = 'pink-martini-hbg' }
      
        else if (data.title.includes('INK')) { bg = 'ink-hbg' }
        else if (data.title == 'INK') { bg = 'ink-hbg' }
        else if (data.title == 'HAWAII') { bg = 'ink-hbg' }
      
        else if (data.title.includes('PISTACCIO')) { bg = 'pistaccio-hbg' }
        else if (data.title == 'PISTACCIO') { bg = 'pistaccio-hbg' }
      
        else if (data.title.includes('PRINCE')) { bg = 'prince-hbg' }
        else if (data.title == 'PRINCE') { bg = 'prince-hbg' }
      
        else if (data.title.includes('RED')) { bg = 'red-hbg' }
        else if (data.title == 'RED') { bg = 'red-hbg' }
        else if (data.title == 'SANDRO') { bg = 'red-hbg' }
      
        else if (data.title.includes('ROSA')) { bg = 'rosa-hbg' }
        else if (data.title == 'ROSA') { bg = 'rosa-hbg' }
        else if (data.title == 'ALOHA ROSA') { bg = 'rosa-hbg' }
        else if (data.title == 'ROSIE') { bg = 'rosa-hbg' }
      
        else if (data.title.includes('SAGE')) { bg = 'sage-hbg' }
        else if (data.title == 'SAGE') { bg = 'sage-hbg' }
        else if (data.title == 'COMO SAGE') { bg = 'sage-hbg' }
        else if (data.title == 'SHROOM SAGE') { bg = 'sage-hbg' }
        else if (data.title == 'SMILE SAGE') { bg = 'sage-hbg' }
      
        else if (data.title.includes('SANDS')) { bg = 'sands-hbg' }
        else if (data.title == 'SANDS') { bg = 'sands-hbg' }
        else if (data.title == 'CALYPSO') { bg = 'sands-hbg' }
        else if (data.title == 'IKAT SANDS') { bg = 'sands-hbg' }
        else if (data.title == 'KIEFF SANDS') { bg = 'sands-hbg' }
        else if (data.title == 'KIEFF WILDCAT SANDS') { bg = 'sands-hbg' }
        else if (data.title == 'PAZ SANDS') { bg = 'sands-hbg' }
        else if (data.title == 'POPLEO SANDS') { bg = 'sands-hbg' }
        else if (data.title == 'FM X SALT LOVE') { bg = 'sands-hbg' }
        else if (data.title == 'FM X SALT ZOE') { bg = 'sands-hbg' }
        else if (data.title == 'MONSTERA') { bg = 'sands-hbg' }
      
        else if (data.title.includes('SASHIMI')) { bg = 'sashimi-hbg' }
        else if (data.title == 'SASHIMI') { bg = 'sashimi-hbg' }
      
        else if (data.title.includes('SILVERADO')) { bg = 'silverado-hbg' }
        else if (data.title == 'SILVERADO') { bg = 'silverado-hbg' }
      
        else if (data.title == 'SKY TIE DYE') { bg = 'white-hbg' }
      
        else if (data.title.includes('SKY')) { bg = 'sky-hbg' }
        else if (data.title == 'SKY') { bg = 'sky-hbg' }
      
        else if (data.title.includes('SMOKE')) { bg = 'smoke-hbg' }
        else if (data.title == 'SMOKE') { bg = 'smoke-hbg' }
        else if (data.title == 'WILD SMOKE') { bg = 'smoke-hbg' }
        else if (data.title == 'YINGYANG SMOKE') { bg = 'smoke-hbg' }

        else if (data.title == 'FM X SOLID & STRIPED') { bg = 'white-hbg' }

        else if (data.title.includes('SOL')) { bg = 'sol-hbg' }
        else if (data.title == 'SOL') { bg = 'sol-hbg' }
        else if (data.title == 'FIERCE SOL') { bg = 'sol-hbg' }
        else if (data.title == 'FLOW SOL') { bg = 'sol-hbg' }
        else if (data.title == 'HOP SOL') { bg = 'sol-hbg' }
        else if (data.title == 'ZAZU SOL') { bg = 'sol-hbg' }
      
        else if (data.title.includes('SPRING')) { bg = 'spring-hbg' }
        else if (data.title == 'SPRING') { bg = 'spring-hbg' }
      
        else if (data.title == 'DOTS STONE TOFFEE') { bg = 'toffee-hbg' }
      
        else if (data.title.includes('STONE')) { bg = 'stone-hbg' }
        else if (data.title == 'STONE') { bg = 'stone-hbg' }
        else if (data.title == 'COMO STONE') { bg = 'stone-hbg' }
        else if (data.title == 'KASH STONE') { bg = 'stone-hbg' }
        else if (data.title == 'MOON') { bg = 'stone-hbg' }
        else if (data.title == 'PRAIRIE') { bg = 'stone-hbg' }
        else if (data.title == 'RETRO ROSE') { bg = 'stone-hbg' }
        else if (data.title == 'TERRACOTTA TIE DYE') { bg = 'stone-hbg' }
        else if (data.title == 'YINLAND STONE') { bg = 'stone-hbg' }
        else if (data.title == 'CHILL DRAWSTRING BAG') { bg = 'stone-hbg' }
        else if (data.title == 'JUST CHILL TOTE BAG') { bg = 'stone-hbg' }
      
        else if (data.title.includes('STORMY')) { bg = 'stormy-hbg' }
        else if (data.title == 'STORMY') { bg = 'stormy-hbg' }
      
        else if (data.title.includes('SUGAR')) { bg = 'sugar-hbg' }
        else if (data.title == 'SUGAR') { bg = 'sugar-hbg' }
        else if (data.title == 'FLOW SUGAR') { bg = 'sugar-hbg' }
        else if (data.title == 'PINA COLADA SUGAR') { bg = 'sugar-hbg' }
      
        else if (data.title.includes('SUNNY')) { bg = 'sunny-hbg' }
        else if (data.title == 'SUNNY') { bg = 'sunny-hbg' }
      
        else if (data.title.includes('TAHITI')) { bg = 'tahiti-hbg' }
        else if (data.title == 'TAHITI') { bg = 'tahiti-hbg' }
      
        else if (data.title == 'TERRA') { bg = 'terra-hbg' }
      
        else if (data.title.includes('TOFFEE')) { bg = 'toffee-hbg' }
        else if (data.title == 'TOFFEE') { bg = 'toffee-hbg' }
        else if (data.title == 'DULCE') { bg = 'toffee-hbg' }
      
        else if (data.title.includes('TROPICOOL')) { bg = 'tropicool-hbg' }
        else if (data.title == 'TROPICOOL') { bg = 'tropicool-hbg' }
      
        else if (data.title.includes('TURTLE')) { bg = 'turtle-hbg' }
        else if (data.title == 'TURTLE') { bg = 'turtle-hbg' }
        else if (data.title == 'VELA') { bg = 'turtle-hbg' }
      
        else if (data.title.includes('TWILIGHT')) { bg = 'twilight-hbg' }
        else if (data.title == 'TWILIGHT') { bg = 'twilight-hbg' }
      
        else if (data.title.includes('ULTRA')) { bg = 'ultra-hbg' }
        else if (data.title == 'ULTRA') { bg = 'ultra-hbg' }
        else if (data.title == 'TLC') { bg = 'ultra-hbg' }
        else if (data.title == 'YINGYANG ULTRA') { bg = 'ultra-hbg' }
      
        else if (data.title.includes('VAMP')) { bg = 'vamp-hbg' }
        else if (data.title == 'VAMP') { bg = 'vamp-hbg' }
      
        else if (data.title.includes('VENUS')) { bg = 'venus-hbg' }
        else if (data.title == 'VENUS') { bg = 'venus-hbg' }
      
        else if (data.title.includes('VIRGIN')) { bg = 'virgin-hbg' }
        else if (data.title == 'VIRGIN') { bg = 'virgin-hbg' }
        else if (data.title == 'TRIP VIRGIN') { bg = 'virgin-hbg' }
        else if (data.title == 'CRUZ') { bg = 'virgin-hbg' }
      
        else if (data.title.includes('VITAMIN C')) { bg = 'vitamin-c-hbg' }
        else if (data.title == 'VITAMIN C') { bg = 'vitamin-c-hbg' }
      
        else if (data.title.includes('BLACK')) { bg = 'black-hbg' }
        else if (data.title == 'BLACK') { bg = 'black-hbg' }
        else if (data.title == 'BOND') { bg = 'black-hbg' }
        else if (data.title == 'DAISY DOT') { bg = 'black-hbg' }
        else if (data.title == 'FIERCE BLACK') { bg = 'black-hbg' }
        else if (data.title == 'FM X KOKETIT BLACK') { bg = 'black-hbg' }
        else if (data.title == 'GIA BLACK') { bg = 'black-hbg' }
        else if (data.title == 'GLITTER-BLACK') { bg = 'black-hbg' }
        else if (data.title == 'KASH BLACK') { bg = 'black-hbg' } 
        else if (data.title == 'KIEFF BLACK') { bg = 'black-hbg' }
        else if (data.title == 'KUSH JET') { bg = 'black-hbg' }
        else if (data.title == 'Lily.Rose Black') { bg = 'black-hbg' }
        else if (data.title == 'BOND') { bg = 'black-hbg' }
        else if (data.title == 'PAZ BLACK') { bg = 'black-hbg' }
        else if (data.title == 'SILVER STARS') { bg = 'black-hbg' }
        else if (data.title == 'NUNUNU') { bg = 'black-hbg' }
        else if (data.title == 'SUPERNOVA') { bg = 'black-hbg' }
        else if (data.title == 'COSMIC') { bg = 'black-hbg' }
        else if (data.title == 'GOLDUST') { bg = 'black-hbg' }
        else if (data.title == 'ANGIE') { bg = 'black-hbg' }
        else if (data.title == 'TULUM') { bg = 'black-hbg' }
        else if (data.title == 'ZAZU BLACK') { bg = 'black-hbg' }
        
        else if (data.title.includes('WHITE')) { bg = 'white-hbg' }
        else if (data.title == 'WHITE') { bg = 'white-hbg' }
        else if (data.title == 'FM X KOKETIT WHITE') { bg = 'white-hbg' }
        else if (data.title == 'GLITTER-WHITE') { bg = 'white-hbg' }
        else if (data.title == 'IKAT BLUE') { bg = 'white-hbg' }
        else if (data.title == 'STARZZZ') { bg = 'white-hbg' }
        else if (data.title == 'BAHIA') { bg = 'white-hbg' }
        else if (data.title == 'BANANAS') { bg = 'white-hbg' }
        else if (data.title == 'BROKEN STRIPES MULTI') { bg = 'white-hbg' }
        else if (data.title == 'DALMA') { bg = 'white-hbg' }
        else if (data.title == 'DENIM') { bg = 'white-hbg' }
        else if (data.title == 'FIREWORKS PUNCH') { bg = 'white-hbg' }
        else if (data.title == 'LOVE') { bg = 'white-hbg' }
        else if (data.title == 'LOVE RULES') { bg = 'white-hbg' }
        else if (data.title == 'PACHA') { bg = 'white-hbg' }
        else if (data.title == 'PARADISO') { bg = 'white-hbg' }  
        else if (data.title == 'RAINBOW STRIPE') { bg = 'white-hbg' }
        else if (data.title == 'SUN BLUE') { bg = 'white-hbg' }
        else if (data.title == 'SUN MULTI') { bg = 'white-hbg' }
        else if (data.title == 'SUN PINK') { bg = 'white-hbg' }
        else if (data.title == 'TRUE ROMANCE') { bg = 'white-hbg' }
        else if (data.title == 'UNICORN') { bg = 'white-hbg' }
        else if (data.title == 'YINPOP WHITE') { bg = 'white-hbg' }
        else if (data.title == 'YINGYANG WHITE') { bg = 'white-hbg' }
        else if (data.title == 'CHILL SOCKS (3 PACK)') { bg = 'white-hbg' }
        else if (data.title == 'JUST CHILL SOCKS') { bg = 'white-hbg' }
        else if (data.title == 'FM X SAKS 5TH AVENUE') { bg = 'white-hbg' }
        else if (data.title == 'FM X JONATHAN SIMKHAI') { bg = 'white-hbg' }
        
        return bg
    }

	// Build Image Element image-element
	//{% render 'image-element' %} -- product-thumbnail.liquid
	function buildImageElement(data) {
		var images = data.images_info;
		var maxHeight = boostPFSConfig.custom.collection_height;
		var imageWidth = data.featured_image.width;
		var imageHeight = data.featured_image.height;

		var lowQualityImage = null;
		if (boostPFSConfig.custom.image_loading_style == 'blur-up') {
			lowQualityImage = Utils.getFeaturedImage(images, '50x');
		}

		var backgroundColor = '';
		var crop_to_aspect_ratio = '';
		if (boostPFSConfig.custom.image_loading_style == 'color') {
			var dominantColorImage = Utils.getFeaturedImage(images, '1x');

			var object_fit = boostPFSConfig.custom.align_height;
			if (object_fit) {
				crop_to_aspect_ratio = 'max-height: ' + maxHeight + 'px; width: calc(' + imageWidth + ' /  ' + imageHeight + ' * ' + maxHeight + 'px);';
			}

			backgroundColor = 'background: url(' + dominantColorImage + ');';
		}

		// Get Thumbnail url
		var itemThumbUrl = Utils.getFeaturedImage(images, boostPFSConfig.custom.image_loading_style == 'blur-up' ? '50x' : '100x');

		// Get image source
		var itemImageSrc = '';
		if (lowQualityImage) {
			itemImageSrc += 'src="' + lowQualityImage + '"';
		}
		itemImageSrc += 'data-src="' + Utils.getFeaturedImage(images, '1600x') + '" ';
		itemImageSrc += 'data-srcset=" ' + Utils.getFeaturedImage(images, '5000x') + ' 5000w,';
		itemImageSrc += Utils.getFeaturedImage(images, '4500x') + ' 4500w, ';
		itemImageSrc += Utils.getFeaturedImage(images, '4000x') + ' 4000w, ';
		itemImageSrc += Utils.getFeaturedImage(images, '3500x') + ' 3500w, ';
		itemImageSrc += Utils.getFeaturedImage(images, '3000x') + ' 3000w, ';
		itemImageSrc += Utils.getFeaturedImage(images, '2000x') + ' 2000w, ';
		itemImageSrc += Utils.getFeaturedImage(images, '1800x') + ' 1800w, ';
		itemImageSrc += Utils.getFeaturedImage(images, '1600x') + ' 1600w, ';
		itemImageSrc += Utils.getFeaturedImage(images, '1400x') + ' 1400w, ';
		itemImageSrc += Utils.getFeaturedImage(images, '1200x') + ' 1200w, ';
		itemImageSrc += Utils.getFeaturedImage(images, '1000x') + ' 1000w, ';
		itemImageSrc += Utils.getFeaturedImage(images, '800x') + ' 800w, ';
		itemImageSrc += Utils.getFeaturedImage(images, '600x') + ' 600w, ';
		itemImageSrc += Utils.getFeaturedImage(images, '400x') + ' 400w, ';
		itemImageSrc += Utils.getFeaturedImage(images, '200x') + ' 200w" ';

		// Get Flip image url
		var itemFlipImageUrl = images.length > 1 ? Utils.optimizeImage(images[1]['src']) : Utils.getFeaturedImage(images, '900x');


		// Compile Template
		var itemImagesHtml = '<div class="image__container">';
		itemImagesHtml += '<div class="image-element__wrap" style="' + backgroundColor + ' ' + crop_to_aspect_ratio + ((!object_fit) ? 'max-width: ' + imageWidth + 'px;' : '') +  '">';
		itemImagesHtml += '<img ' +
			' alt="{{itemTitle}}" ' +
			' data-sizes="auto" ' +
			' data-aspectratio="' + imageWidth / imageHeight + '" ' +
			' height="' + imageHeight + '" ' +
			' width="' + imageWidth + '" ' +
			' style="" ' +
			' class="lazyload transition--' + boostPFSConfig.custom.image_loading_style + '"' +
			' srcset="data:image/svg+xml;utf8,<svg%20xmlns=\'http://www.w3.org/2000/svg\'%20width=\''+ imageWidth +'\'%20height=\'' + imageHeight + '\'></svg>" ' +
			itemImageSrc + '/>';
		itemImagesHtml += '</div>';
		itemImagesHtml += '<noscript>';
		itemImagesHtml += '<img src="' + Utils.getFeaturedImage(images, '2000x') + '" alt="{{itemTitle}}" class="noscript">';
		itemImagesHtml += '</noscript>';
		itemImagesHtml += '</div>';

		// Add Flip Image
		if (boostPFSConfig.custom.secondary_image && images.length > 1) {
			// Get image source
			var itemFlipImageSrc = 'data-src="' + Utils.optimizeImage(images[1]['src'], '1600x') + '" ';
			itemFlipImageSrc += 'data-srcset=" ' + Utils.optimizeImage(images[1]['src'], '5000x')  + ' 5000w, ';
			itemFlipImageSrc += Utils.optimizeImage(images[1]['src'], '4500x')  + ' 4500w, ';
			itemFlipImageSrc += Utils.optimizeImage(images[1]['src'], '4000x')  + ' 4000w, ';
			itemFlipImageSrc += Utils.optimizeImage(images[1]['src'], '3000x')  + ' 3000w, ';
			itemFlipImageSrc += Utils.optimizeImage(images[1]['src'], '2000x')  + ' 2000w, ';
			itemFlipImageSrc += Utils.optimizeImage(images[1]['src'], '1800x')  + ' 1800w, ';
			itemFlipImageSrc += Utils.optimizeImage(images[1]['src'], '1600x')  + ' 1600w, ';
			itemFlipImageSrc += Utils.optimizeImage(images[1]['src'], '1400x')  + ' 1400w, ';
			itemFlipImageSrc += Utils.optimizeImage(images[1]['src'], '1200x')  + ' 1200w, ';
			itemFlipImageSrc += Utils.optimizeImage(images[1]['src'], '1000x')  + ' 1000w, ';
			itemFlipImageSrc += Utils.optimizeImage(images[1]['src'], '800x')  + ' 800w, ';
			itemFlipImageSrc += Utils.optimizeImage(images[1]['src'], '600x')  + ' 600w, ';
			itemFlipImageSrc += Utils.optimizeImage(images[1]['src'], '400x')  + ' 400w, ';
			itemFlipImageSrc += Utils.optimizeImage(images[1]['src'], '200x')  + ' 200w" ';
			itemImagesHtml += '<div class="image__container">';
			itemImagesHtml += '<div class="image-element__wrap" style="width:';
			if (images.length > 1) {
				itemImagesHtml += images[1]['width'] + 'px">';
			} else {
				itemImagesHtml += data.featured_image.width + 'px">';
			}
			itemImagesHtml += '<img src="' + itemFlipImageUrl + '" ';
			itemImagesHtml += 'class="lazyload transition--blur-up secondary lazypreload lazyautosizes secondary-media-hidden" alt="{{itemTitle}}" data-sizes="auto" ' + itemFlipImageSrc + '/>';
			itemImagesHtml += '</div>';
			itemImagesHtml += '</div>';
		}
		return itemImagesHtml;
	}

	// Build Pagination
	ProductPaginationDefault.prototype.compileTemplate = function (totalProduct) {
		// Get page info
		if (!totalProduct) totalProduct = this.totalProduct;
		var currentPage = parseInt(Globals.queryParams.page);
		var totalPage = Math.ceil(totalProduct / Globals.queryParams.limit);

		if (totalPage > 1) {
			var paginationHtml = boostPFSTemplate.paginateHtml;

			// Build Previous
			var previousHtml = (currentPage > 1) ? boostPFSTemplate.previousHtml : '';
			previousHtml = previousHtml.replace(/{{itemUrl}}/g, Utils.buildToolbarLink('page', currentPage, currentPage - 1));
			paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

			// Build Next
			var nextHtml = (currentPage < totalPage) ? boostPFSTemplate.nextHtml : '';
			nextHtml = nextHtml.replace(/{{itemUrl}}/g, Utils.buildToolbarLink('page', currentPage, currentPage + 1));
			paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);

			// Create page items array
			var beforeCurrentPageArr = [];
			for (var iBefore = currentPage - 1; iBefore > currentPage - 3 && iBefore > 0; iBefore--) {
				beforeCurrentPageArr.unshift(iBefore);
			}
			if (currentPage - 4 > 0) {
				beforeCurrentPageArr.unshift('...');
			}
			if (currentPage - 4 >= 0) {
				beforeCurrentPageArr.unshift(1);
			}
			beforeCurrentPageArr.push(currentPage);

			var afterCurrentPageArr = [];
			for (var iAfter = currentPage + 1; iAfter < currentPage + 3 && iAfter <= totalPage; iAfter++) {
				afterCurrentPageArr.push(iAfter);
			}
			if (currentPage + 3 < totalPage) {
				afterCurrentPageArr.push('...');
			}
			if (currentPage + 3 <= totalPage) {
				afterCurrentPageArr.push(totalPage);
			}

			// Build page items
			var pageItemsHtml = '';
			var pageArr = beforeCurrentPageArr.concat(afterCurrentPageArr);
			for (var iPage = 0; iPage < pageArr.length; iPage++) {
				if (pageArr[iPage] == '...') {
					pageItemsHtml += boostPFSTemplate.pageItemRemainHtml;
				} else {
					pageItemsHtml += (pageArr[iPage] == currentPage) ? boostPFSTemplate.pageItemSelectedHtml : boostPFSTemplate.pageItemHtml;
				}
				pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
				pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, Utils.buildToolbarLink('page', currentPage, pageArr[iPage]));
			}
			paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);

			return paginationHtml;
		}
		return '';
	};

	ProductPaginationLoadMore.prototype.compileTotalTemplate = function() {
		/**
		 * If enable the Load previous feature and the evnet type is page:
		 * => Get the next loading page is from session storage OR get the next loading page from query param
		 */
		if (Utils.isLoadPreviousPagePaginationType() && this.parent.eventType == 'page') {
			this.nextPage = parseInt(window.sessionStorage.getItem(this.settings.sessionStorageCurrentNextPage));
		} else {
			this.nextPage = Globals.queryParams.page;
		}
		// Set from index
		var from = (this.nextPage - 1) * Globals.queryParams.limit + 1;
		if (jQ(Selector.products + ' > div').length) {
			from -= jQ(Selector.products + ' > div').length - Globals.queryParams.limit;
		}
		// Set to index
		var product_index = (this.nextPage - 1) * Globals.queryParams.limit + 1;
		var to = product_index + this.data.products.length - 1;

		return this.getTemplate('total')
			.replace(/{{progressLable}}/g, Labels.loadMoreTotal)
			.replace(/{{ from }}/g, from)
			.replace(/{{ to }}/g, to)
			.replace(/{{ total }}/g, this.totalProduct)
			.replace(/{{class.productLoadMore}}/g, Class.productLoadMore)
	};
/* Start Boost 146711  */
	// Build Sorting
	ProductSorting.prototype.compileTemplate = function() {
		var html = '';
		if (boostPFSTemplate.hasOwnProperty('sortingHtml')) {
			var sortingArr = Utils.getSortingList();
			if (sortingArr) {
				var paramSort = Globals.queryParams.sort || '';
				// Build content
				var sortingItemsHtml = '';
				for (var k in sortingArr) {
					activeClass = '';
					if (paramSort == k) {
						activeClass = 'boost-pfs-filter-sort-item-active';
					}
					sortingItemsHtml += '<li aria-label="' + sortingArr[k] + '"><a href="#" data-sort="' + k + '" class="' + activeClass + '"  title="' + sortingArr[k] + '" aria-label="' + sortingArr[k] + '">' + sortingArr[k] + '</a></li>';
				}
				html = boostPFSTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
			}
		}
		return html;
	};

	ProductSorting.prototype.render = function() {
		jQ(Selector.topSorting).html(this.compileTemplate());

		if (jQ('.boost-pfs-filter-custom-sorting').hasClass('boost-pfs-filter-sort-active')) {
			jQ('.boost-pfs-filter-custom-sorting').toggleClass('boost-pfs-filter-sort-active');
		}

		var labelSort = '';
		var paramSort = Globals.queryParams.sort || '';
		var sortingList = Utils.getSortingList();
		if (paramSort.length > 0 && sortingList && sortingList[paramSort]) {
			labelSort = sortingList[paramSort];
		} else {
			labelSort = Labels.sorting_heading;
		}

		jQ('.boost-pfs-filter-custom-sorting button span span').text(labelSort);
	}

	// Build Sorting event
	ProductSorting.prototype.bindEvents = function() {
		var _this = this;
		jQ('.boost-pfs-filter-filter-dropdown li').click(function(e) {
			e.preventDefault();
			FilterApi.setParam('sort', jQ(this).find('a').data('sort'));
			FilterApi.setParam('page', 1);
			FilterApi.applyFilter('sort');
		});

		jQ(".boost-pfs-filter-custom-sorting > button").click(function() {
      jQ('.boost-pfs-filter-filter-dropdown').toggle().parent().toggleClass('boost-pfs-filter-sort-active');
		});

		jQ(Selector.filterTreeMobileButton).click(function() {
			jQ('.boost-pfs-filter-top-sorting-mobile .boost-pfs-filter-filter-dropdown').hide();
		});

		jQ(document).on('click', function (e) {
      if (jQ(e.target).parents('.boost-pfs-filter-top-sorting').find(".boost-pfs-filter-filter-dropdown").length === 0) {
      	jQ('.boost-pfs-filter-filter-dropdown').hide().parent().removeClass('boost-pfs-filter-sort-active');
      }
    });
	};
/* End Boost 146711  */
	// Build Breadcrumb
	Breadcrumb.prototype.compileTemplate = function (colData) {
		if (!colData) colData = this.collectionData;
		if (typeof colData !== 'undefined' && colData.hasOwnProperty('collection')) {
			var colInfo = colData.collection;

			var breadcrumbHtml = '<span ><a href="' + boostPFSConfig.shop.url + '" title="' + boostPFSConfig.shop.name + '" class="breadcrumb_link"><span>' + boostPFSConfig.label.breadcrumb_home + '</span></a></span> ';
			breadcrumbHtml += '<span class="breadcrumb-divider">/</span> ' +
				'<span><a href="{{currentCollectionLink}}" title="{{currentCollectionTitle}}" class="breadcrumb_link"><span>{{currentCollectionTitle}}</span></a></span> ';
			// Build Tags
			var currentTagsHtml = '';
			if (Array.isArray(boostPFSConfig.general.current_tags)) {
				var current_tags = boostPFSConfig.general.current_tags;
				for (var k = 0; k < current_tags.length; k++) {
					var tag = current_tags[k];
					currentTagsHtml += '<span class="breadcrumb-divider">/</span>';
					currentTagsHtml += '<span><a href="/collections/{{currentCollectionLink}}/' + Utils.slugify(tag) + '" title="' + tag + '"><span>' + tag + '</span></a></span>';
				}
			}
			breadcrumbHtml += currentTagsHtml;
			// Build Collection Info
			breadcrumbHtml = breadcrumbHtml.replace(/{{currentCollectionLink}}/g, '/collections/' + colInfo.handle).replace(/{{currentCollectionTitle}}/g, colInfo.title);
			// Top Pagination
			breadcrumbHtml += ' <span class="boost-pfs-filter-top-pagination"></span>';
			return breadcrumbHtml;
		}
		return '';
	};
  
	// Call Theme function to Build additional elements for Product list
	ProductList.prototype.afterRender = function (data) {
		//Build Quick view data
		if (!data) data = this.data;
		if (boostPFSConfig.custom.quick_shop_enabled) {
			this.buildExtrasProductListByAjax(data, 'boost-pfs-quickview', function(results) {
              console.log(results);
				results.forEach(function(result) {
					var element = '';
					if (boostPFSConfig.custom.quick_shop_style == 'inline') {
						element = jQ('[data-boost-theme-quickview="'+ result.id +'"]');
						if (element.find('.js-quick-shop-link').length == 0) {
							element.append(result.quickview);
						}
					} else {
						element = jQ('[data-boost-theme-quickview="'+ result.id +'"] .product-wrap');
						if (element.find('.js-quick-shop-link').length == 0) {
							element.append(result.quickview);
						}
					}
				});
				// buildTheme();
			});
		}
	};

	// Build Additional elements
	Filter.prototype.afterRender = function (data) {
		if (!data) data = this.data;
		// Remove InstantClick
		jQ(Selector.filterTree).find('a').attr('data-no-instant', '');

		// Remove product wrapper
		if (jQ(Selector.products).children().hasClass('product-list')) {
			jQ(Selector.products).children().children().unwrap();
		}

		// Build top pagination
		var totalPage = Math.ceil(data.total_product / Globals.queryParams.limit);
		var topPaginationHtml = '<span class="breadcrumb-divider">/</span> ' + (boostPFSConfig.label.breadcrumb_page).replace(/{{ current_page }}/g, Globals.queryParams.page).replace(/{{ pages }}/g, totalPage);
		jQ('.boost-pfs-filter-top-pagination').html(topPaginationHtml);
		jQ(".load-more__icon").remove();
        
        jQ('.boost-pfs-filter-tree-mobile-button button').html('');
        
        if (Settings.getSettingValue('general.paginationType') == 'default') {
            var result = 'Results: ' + data.products.length + ' (of ' + data.total_product + ')'
        } else {
            var totalProducts = Globals.queryParams.limit * Globals.queryParams.page
            totalProducts = totalProducts > data.total_product ? data.total_product : totalProducts
            var result = 'Results: ' + totalProducts + ' (of ' + data.total_product + ')'
        }
        jQ('.boost-custom-product-count').html(result)

		//buildTheme();
	};

	function buildTheme() {
		if ((Shopify.theme_settings.enable_shopify_review_comments || Shopify.theme_settings.enable_shopify_collection_badges) && window.SPR) {
			SPR.registerCallbacks();
			SPR.initRatingHandler();
			SPR.initDomEls();
			SPR.loadProducts();
			SPR.loadBadges();
		}
		if (Shopify.theme_settings.show_multiple_currencies) {
			convertCurrencies();
		}
		imageFunctions.showSecondaryImage();

		// Initialize shopify payment buttons
		if (Shopify.PaymentButton) {
			Shopify.PaymentButton.init();
		}

		productPage.init();
		if (Shopify.theme_settings.quick_shop_enabled) {
			quickShop.init();
		}
		hideNoScript();
	}

  // Start Boost 154224
  ProductList.prototype._catchError = function() {
    console.log('DATA???:', this)
    var self = this;
    var searchNotFoundJson = [];
		if (Utils.isNoFilterResult(this.totalProduct, this.eventType)) {
			var errorContent = Labels.error.noProducts;
			if (!Utils.checkExistFilterOptionParam()) {
				if (Utils.isSearchPage()) {
                  	var noProducts = jQ('#boost-pfs-instant-search-products-not-found-json');
                    if(noProducts.length){
                      searchNotFoundJson = JSON.parse(noProducts.html());
                      if(searchNotFoundJson.hasOwnProperty('products')){
                        errorContent = "";
                        searchNotFoundJson.products.forEach(function(product){
                          console.log('PRODUCT DATA:', product)
                          // Generate the images_info of product
                          var images_info = [];
                          product.media.forEach(function(media) {
                            if (media.media_type == 'image') {
                              images_info.push({
                                id: media.id,
                                position: media.position,
                                src: media.src,
                                width: media.width,
                                height: media.height
                              });
                            }
                          });
                          product.images_info = images_info;
                          product.price /= 100;
                          product.price_min /= 100;
                          product.price_max /= 100;
                          product.compare_at_price /= 100;
                          product.compare_at_price_min /= 100;
                          product.compare_at_price_max /= 100;
                          product.html = ProductGridItem.prototype.compileTemplate(product)
                          errorContent += product.html
                        })

                      }else{
                      	errorContent = Labels.error.noSearchResult;
                      }	
			
                    }else{
						errorContent = Labels.error.noSearchResult;
                    }
				}
			} else {
				errorContent = Labels.error.noFilterResult;
			}
			if (errorContent !== '') {
              if(searchNotFoundJson.length === 0){
				var template = this.getNoResultTemplate().replace(/{{content}}/g, errorContent);
                this.$element.html(template);
              }else{
                var template =  errorContent;
                this.$element.html(template);
                this.customizeNoResultPageResult()
              }
			}
		}
	}
  ProductList.prototype.customizeNoResultPageResult = function(){
	//Code for setting the search result to width 100% and hide the sorting and other element, customize to fit theme
  	jQ(".boost-pfs-filter-right").css("width" , "100%")
    jQ(".filters-toolbar").css("display" , "none");
    jQ(".boost-pfs-search-result-toolbar-wrap").css("display" , "none");
  }

  /* Start-Boost-154224 */
  ProductSlider.prototype.getTemplate = function() {
      return `
              <div class="boost-pfs-product-slider">
                <div class="boost-pfs-product-slider-inner">
                  <div class="boost-pfs-product-slider-item-wrapper product-list"></div>
                </div>
                <div class="boost-pfs-product-slider-nav">
                  <div class="boost-pfs-product-slider-prev boost-pfs-product-slider-nav-btn-disabled"></div>
                  <div class="boost-pfs-product-slider-next"></div>
                </div>
              </div>
            `.trim();
  }
  /* End-Boost-154224 */

  // #156679
  FilterApi.beforeCall = function(eventType, eventInfo) {
      /* Change the filter params before calling api */
      if(Utils.getSearchTerm() == ''){
        Globals.queryParams['tag'] = 'noinput';
      }
      /* No need to return anything */
  }
  // End #156679
  
})(); // Add this at the end