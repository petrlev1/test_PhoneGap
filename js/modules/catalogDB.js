'use strict';

// Модуль каталога для работы с БД
var catalogDB = (function($) {

    var ui = {
        $form: $('#filters-form'),
        $prices: $('#prices'),
		$gobrands: $('#gobrands'),
		$gocats: $('#gocats'),
		$icFiltr: $('#icFiltr'),
        $pricesLabel: $('#prices-label'),
        $minPrice: $('#min-price'),
        $maxPrice: $('#max-price'),
        $categoryBtn: $('.js-category'),
		$brandBtn: $('.js-brand'),
        $brands: $('#brands'),
		$categorys: $('#categorys'),
		$search: $('#search'),
		$btn: $('#btn'),
        $sort: $('#sort'),
		$gaz: $('#gaz'),
		$steklo: $('#steklo'),
        $goods: $('#goods'),
        $goodsTemplate: $('#goods-template'),
        $brandsTemplate: $('#brands-template'),
		$categorysTemplate: $('#categorys-template')
    };
    var selectedCategory = 0,
		selectedBrand = 0,
        goodsTemplate = _.template(ui.$goodsTemplate.html()),
        brandsTemplate = _.template(ui.$brandsTemplate.html()),
		categorysTemplate = _.template(ui.$categorysTemplate.html())
		
	;

    // Инициализация модуля
    function init() {

		 ui.$gocats.hide();

		//console.log(ui.$search);

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
			if (selectedBrand!=0)
			{
				ui.$goods.show();
				_getData({needsData: 'brands,categorys,prices,search'});
			}
			else
			{ 
				ui.$icFiltr.show();

				/* скрытие */
				ui.$sort.show();
			ui.$gaz.show();
			ui.$steklo.show();
			
			


				ui.$goods.hide();
				_getData_bra({needsData: 'brands,categorys,prices,search'});
			}

			
		}else
		{

			/* скрытие */
			ui.$sort.hide();
			ui.$gaz.hide();
			ui.$steklo.hide();

			ui.$icFiltr.hide();
			
			

 ui.$goods.hide();
 _getData_cat({needsData: 'brands,categorys,prices,search'});
		//ui.$goods.hide();
		}
    }

    // Навешиваем события
    function _bindHandlers() {
        ui.$categoryBtn.on('click', _changeCategory);

		ui.$gobrands.on('click', _goBrands);

		ui.$categorys.on('click','.js-category', _changeCategory);

        ui.$btn.on('click', _getData);

        ui.$brands.on('click', '.js-brand', _changeBrand);

        ui.$sort.on('change', _getData);
		
		ui.$gaz.on('change', _getData);

		ui.$steklo.on('change', _getData);
    }

    // Сброс фильтров, только брендов и цен
    function _resetFilters() {
        ui.$brands.find('input').removeAttr('checked');
        ui.$minPrice.val(0);
        ui.$maxPrice.val(1000000);
    }



	  function _goBrands() {

		  ui.$gocats.show();
		  ui.$icFiltr.show();
		  ui.$sort.show();
			ui.$gaz.show();
			ui.$steklo.show();

		  ui.$gobrands.hide();

		  selectedBrand = 0;

		 console.log(selectedCategory + " / "  + selectedBrand);

		  ui.$goods.hide();
			    ui.$categorys.hide();
				ui.$brands.show();

				_getData_bra({needsData: 'brands'});




	  }

 // Смена брендов

	   function _changeBrand() {

 ui.$gocats.hide();

        var $this = $(this);
		 
		 selectedBrand = $this.attr('data-brand');
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
		// console.log("tima brand: " + selectedBrand);


        //ui.$brandBtn.removeClass('active');

      //  $this.addClass('active');
       

	

        _resetFilters();


		if (selectedBrand!=0)
		{

			/* скрытие */

			ui.$sort.show();
			ui.$gaz.show();
			ui.$steklo.show();
			ui.$icFiltr.show();
			


		
				ui.$goods.show();
			    ui.$categorys.hide();
				ui.$brands.hide();
			    console.log('goods');
				 _getData({needsData: 'brands,categorys,prices,search'});
		}

		else
			{
				 _getData_bra({needsData: 'brands'});


			}
			
			

    

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
		 console.log(ui.$form);

		 ui.$gocats.show();
		 ui.$icFiltr.show();
		 ui.$sort.show();
			ui.$gaz.show();
			ui.$steklo.show();


        ui.$categoryBtn.removeClass('active');

        $this.addClass('active');
       

	

        _resetFilters();
		if (selectedCategory!=0)
		{

			if (selectedBrand!=0)
			{

				/* скрытие */
				ui.$sort.show();
			ui.$gaz.show();
			ui.$steklo.show();
			


				ui.$goods.show();
			    ui.$categorys.hide();
			    console.log('goods');
				 _getData_bra({needsData: 'brands,categorys,prices,search'});

			}else
			{
				 _getData_bra({needsData: 'brands'});
				 ui.$categorys.hide();
			}
			
			

    
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

		console.log("search: " + responce.search);

		if (responce.search!="")
		{
			ui.$gobrands.hide();
			ui.$gocats.show();
		}else
		{
			ui.$gobrands.show();
			ui.$gocats.hide();
		}

        ui.$goods.html(goodsTemplate({goods: responce.data.goods}));
      
		
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

		 ui.$goods.show();
		 ui.$brands.hide();
	     ui.$categorys.hide();

		  ui.$gobrands.show();



        var catalogData = 'category=' + selectedCategory + '&brands%5B%5D=' + selectedBrand + '&'  + ui.$form.serialize();

		console.log('brands: ok' +  catalogData);


        if (options && options.needsData) {
            catalogData += '&needs_data=' + options.needsData;
        }
        $.ajax({

			

			//url: 'http://mosnapitki.ru.swtest.ru/scripts/catalog.php',

            //url: 'http://test6/scripts/catalog.php',

			url: 'http://petrlev.pro.swtest.ru/scripts/catalog.php',

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
		

        var catalogData = ui.$form.serialize();
        if (options && options.needsData) {
            catalogData += '&needs_data=' + options.needsData;
        }
        $.ajax({
			//url: 'http://test6/scripts/catalog.php',
            //url: 'http://mosnapitki.ru.swtest.ru/scripts/catalog.php',

			url: 'http://petrlev.pro.swtest.ru/scripts/catalog.php',

			
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



	 function _catalogSuccess_bra(responce) {

		
      
		if (responce.data.brands) {
            ui.$brands.html(brandsTemplate({brands: responce.data.brands}));
        }
     
    }

	function _getData_bra(options) {
        var catalogData = 'category=' + selectedCategory + '&'+ ui.$form.serialize();
        if (options && options.needsData) {
            catalogData += '&needs_data=' + options.needsData;
        }
        $.ajax({
			// url: 'http://mosnapitki.ru.swtest.ru/scripts/catalog.php',
             //url: 'http://test6/scripts/catalog.php',

			url: 'http://petrlev.pro.swtest.ru/scripts/catalog.php',

            data: catalogData,
            type: 'GET',
            cache: false,
            dataType: 'json',
            error: _catalogError,
            success: function(responce) {
                if (responce.code === 'success') {
                    _catalogSuccess_bra(responce);
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