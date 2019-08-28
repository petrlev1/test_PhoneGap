'use strict';

// Модуль каталога для работы с БД
var catalogDB = (function($) {

    var ui = {
        $form: $('#filters-form'),
        $prices: $('#prices'),
        $pricesLabel: $('#prices-label'),
        $minPrice: $('#min-price'),
        $maxPrice: $('#max-price'),
        $categoryBtn: $('.js-category'),
        $brands: $('#brands'),
		$categorys: $('#categorys'),
		$search: $('#search'),
        $sort: $('#sort'),
        $goods: $('#goods'),
        $goodsTemplate: $('#goods-template'),
        $brandsTemplate: $('#brands-template'),
		$searchTemplate: $('#search-template'),
		$categorysTemplate: $('#categorys-template')
    };
    var selectedCategory = 0,
        goodsTemplate = _.template(ui.$goodsTemplate.html()),
        brandsTemplate = _.template(ui.$brandsTemplate.html()),
		searchTemplate  = _.template(ui.$searchTemplate.html()),
		categorysTemplate = _.template(ui.$categorysTemplate.html())
		
	;

    // Инициализация модуля
    function init() {

		console.log(selectedCategory);

/*
		if (selectedCategory==0)
		{
			ui.$goods.hide();
			 ui.$categorys.show();
		}else
		{
			ui.$goods.show();
			ui.$categorys.hide();
		}

*/
		

// ui.$goodsTemplate.hide();

        _initPrices({
            minPrice: 0,
            maxPrice: 1000000
        });
        _bindHandlers();
		if (selectedCategory!=0)
		{
			 ui.$goods.show();
        _getData({needsData: 'brands,categorys,prices,search'});
		}else
		{
 ui.$goods.hide();
 _getData_cat({needsData: 'brands,categorys,prices,search'});
		//ui.$goods.hide();
		}
    }

    // Навешиваем события
    function _bindHandlers() {
        ui.$categoryBtn.on('click', _changeCategory);

		ui.$categorys.on('click','.js-category', _changeCategory);

        ui.$search.on('click','.js-search', _getData);

        ui.$brands.on('change', 'select', _getData);
        ui.$sort.on('change', _getData);
    }

    // Сброс фильтров, только брендов и цен
    function _resetFilters() {
        ui.$brands.find('input').removeAttr('checked');
        ui.$minPrice.val(0);
        ui.$maxPrice.val(1000000);
    }

    // Смена категории
    function _changeCategory() {



        var $this = $(this);
		 
		 selectedCategory = $this.attr('data-category');
/*
		 if (selectedCategory==0)
		 {
			 ui.$goods.hide();
			  ui.$categorys.show();
		 }else
		{


		 ui.$goods.show();
		 ui.$categorys.hide();
		}
*/
		 console.log(selectedCategory);


        ui.$categoryBtn.removeClass('active');

        $this.addClass('active');
       

	

        _resetFilters();
		if (selectedCategory!=0)
		{
 ui.$goods.show();
			 ui.$categorys.hide();
			console.log('goods');

       _getData({needsData: 'brands,categorys,prices,search'});
		}else
		{
 ui.$goods.hide();
			console.log('cat');
			   _getData_cat({needsData: 'categorys'});
		}
    }

    // Изменение диапазона цен, реакция на событие слайдера
    function _onSlidePrices(event, elem) {
        _updatePricesUI({
            minPrice: elem.values[0],
            maxPrice: elem.values[1]
        });
    }

    // Обновление цен
    function _updatePricesUI(options) {
        ui.$pricesLabel.html(options.minPrice + ' - ' + options.maxPrice + ' руб.');
        ui.$minPrice.val(options.minPrice);
        ui.$maxPrice.val(options.maxPrice);
    }

    // Инициализация цен с помощью jqueryUI
    function _initPrices(options) {
        ui.$prices.slider({
            range: true,
            min: options.minPrice,
            max: options.maxPrice,
            values: [options.minPrice, options.maxPrice],
            slide: _onSlidePrices,
            change: _getData
        });
        _updatePricesUI(options);
    }

    // Обновление слайдера с отключением события change
    function _updatePrices(options) {
        ui.$prices.slider({
            change: null
        }).slider({
            min: options.minPrice,
            max: options.maxPrice,
            values: [options.minPrice, options.maxPrice]
        }).slider({
            change: _getData
        });
        _updatePricesUI(options);
    }

    // Ошибка получения данных
    function _catalogError(responce) {
        console.error('responce', responce);
        // Далее обработка ошибки, зависит от фантазии
    }

    // Успешное получение данных
    function _catalogSuccess(responce) {

		//console.log(responce);
        ui.$goods.html(goodsTemplate({goods: responce.data.goods}));


		ui.$search.html(searchTemplate({search: responce.search}));
      
		
		if (responce.data.brands) {
            ui.$brands.html(brandsTemplate({brands: responce.data.brands}));
        }

		/*
		if (responce.data.categorys) {
            ui.$categorys.html(categorysTemplate({categorys: responce.data.categorys}));
        }
		*/
        if (responce.data.prices) {
            _updatePrices({
                minPrice: +responce.data.prices.min_price,
                maxPrice: +responce.data.prices.max_price
            });
        }
    }



    // Получение данных
    function _getData(options) {

		//console.log('brands: ok' +  selectedCategory);

        var catalogData = 'category=' + selectedCategory + '&' + ui.$form.serialize();

		console.log('brands: ok' +  catalogData);


        if (options && options.needsData) {
            catalogData += '&needs_data=' + options.needsData;
        }
        $.ajax({

			

			// url: 'http://test6/scripts/catalog.php',

            url: 'http://mosnapitki.ru.swtest.ru/scripts/catalog.php',
            data: catalogData,
            type: 'GET',
            cache: false,
            dataType: 'json',
            error: _catalogError,
            success: function(responce) {
                if (responce.code === 'success') {
                    _catalogSuccess(responce);
                } else {
                    _catalogError(responce);
                }
            }
        });
    }

	 function _catalogSuccess_cat(responce) {


console.log(responce);
		
      
		if (responce.data.categorys) {
            ui.$categorys.html(categorysTemplate({categorys: responce.data.categorys}));
        }
     
    }

	 function _getData_cat(options) {
        var catalogData = 'category=' + selectedCategory + '&' + ui.$form.serialize();
        if (options && options.needsData) {
            catalogData += '&needs_data=' + options.needsData;
        }
        $.ajax({
            url: 'http://sitescatya.temp.swtest.ru/scripts/catalog.php',
            data: catalogData,
            type: 'GET',
            cache: false,
            dataType: 'json',
            error: _catalogError,
            success: function(responce) {
                if (responce.code === 'success') {
                    _catalogSuccess_cat(responce);
                } else {
                    _catalogError(responce);
                }
            }
        });
    }




    // Экспортируем наружу
    return {
        init: init
    }
    
})(jQuery);