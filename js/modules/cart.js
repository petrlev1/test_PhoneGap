'use strict';

// Ìîäóëü êîðçèíû
var cart = (function($) {

    var cartData,
        opts = {};

    // Èíèöèàëèçàöèÿ ìîäóëÿ
    function init(options) {
        _initOptions(options);
        updateData();
        if (opts.renderCartOnInit) {
            renderCart();
        }
        if (opts.renderMenuCartOnInit) {
            renderMenuCart();
        }
        _bindHandlers();
    }

    // Èíèöèàëèçèðóåì íàñòðîéêè
    function _initOptions(options) {
        var defaultOptions = {
            renderCartOnInit: true,
            renderMenuCartOnInit: true,
            elAddToCart: '.js-add-to-cart',
            attrId: 'data-id',
            attrName: 'data-name',
            attrPrice: 'data-price',
			attrImg: 'data-img',
            attrDelta: 'data-delta',
            elCart: '#cart',
            elTotalCartCount: '#total-cart-count',
            elTotalCartSumma: '#total-cart-summa',
            elCartItem: '.js-cart-item',
            elCartCount: '.js-count',
            elCartSumma: '.js-summa',
            elChangeCount: '.js-change-count',
            elRemoveFromCart: '.js-remove-from-cart'
        };
        _.defaults(options || {}, defaultOptions);
        opts = _.clone(options);
    }

    // Íàâåøèâàì ñîáûòèÿ
    function _bindHandlers() {
        _onClickAddBtn();
        _onClickChangeCountInCart();
        _onClickRemoveFromCart();
    }





    // Ïîëó÷àåì äàííûå
    function updateData() {
        cartData = JSON.parse(localStorage.getItem('cart')) || [];
        return cartData;
    }

    // Âîçâðàùàåì äàííûå
    function getData() {
        return cartData;
    }

    // Ñîõðàíÿåì äàííûå â localStorage
    function saveData() {
        localStorage.setItem('cart', JSON.stringify(cartData));
        return cartData;
    }

    // Î÷èùàåì äàííûå
    function clearData() {
        cartData = [];
        saveData();
        return cartData;
    }

    // Ïîèñê îáúåêòà â êîëëåêöèè cartData ïî id
    function getById(id) {
        return _.findWhere(cartData, {id: id});
    }

    // Äîáàâëåíèå òîâàðà â êîëëåêöèþ
    function add(item) {
        var oldItem;
        updateData();
        oldItem = getById(item.id);
        if(!oldItem) {
            cartData.push(item);
        } else {
            oldItem.count = oldItem.count + item.count;
        }
        saveData();
        return item;
    }

    // Óäàëåíèå òîâàðà èç êîëëåêöèè
    function remove(id) {
        updateData();
        cartData = _.reject(cartData, function(item) {
            return item.id === id;
        });
        saveData();
        return cartData;
    }

    // Èçìåíåíèå êîëè÷åñòâà òîâàðà â êîëëåêöèè
    function changeCount(id, delta) {
        var item;
        updateData();
        item = getById(id);
        if(item) {
            item.count = item.count + delta;
            if (item.count < 1) {
                remove(id);
            }
            saveData();
        }
        return _.findWhere(cartData, {id: id}) || {};
    }

    // Âîçâðàùàåì êîëè÷åñòâî òîâàðîâ (êîëè÷åñòâî âèäîâ òîâàðîâ â êîðçèíå)
    function getCount() {
        return _.size(cartData);
    }

    // Âîçâðàùàåì îáùåå êîëè÷åñòâî òîâàðîâ 
    function getCountAll() {
        return _.reduce(cartData, function(sum, item) {return sum + item.count}, 0);
    }

    // Âîçâðàùàåì îáùóþ ñóììó
    function getSumma() {
        return _.reduce(cartData, function(sum, item) {return sum + item.count * item.price}, 0);
    }






    // Ðåíäåðèì êîðçèíó
    function renderCart() {
        var template = _.template($('#cart-template').html()),
            data = {
                goods: cartData
            };
        $(opts.elCart).html(template(data));
        renderTotalCartSumma();
    }

    // Ðåíäåðèì êîëè÷åñòâî òîâàðîâ â ìåíþ
    function renderMenuCart() {
        var countAll = getCountAll();
        $(opts.elTotalCartCount).html(countAll !== 0 ? countAll : '');
    }

    // Ðåíäåðèì îáùóþ ñóììó òîâàðîâ
    function renderTotalCartSumma() {
        $(opts.elTotalCartSumma).html(getSumma());            
    }



    // Ïîèñê ïðîäóêòà â êîðçèíå ïî id
    function findCartElemById(id) {
        return $(opts.elCartItem + '[' + opts.attrId + '="'+id+'"]');
    }

    // Äîáàâëåíèå â êîðçèíó
    function _onClickAddBtn() {
        $('body').on('click', opts.elAddToCart, function(e) {
            var $this = $(this);
            add({
                id: +$this.attr(opts.attrId),
                name: $this.attr(opts.attrName),
                price: +$this.attr(opts.attrPrice),
				img: $this.attr(opts.attrImg),
                count: 1
            });    
            renderMenuCart();
           // alert('Òîâàð äîáàâëåí â êîðçèíó');
        });
    }

    // Ìåíÿåì êîëè÷åñòâî òîâàðîâ â êîðçèíå
    function _onClickChangeCountInCart() {
        $('body').on('click', opts.elChangeCount, function(e) {
            var $this = $(this),
                id = +$this.attr(opts.attrId),
                delta = +$this.attr(opts.attrDelta),
                $cartElem = findCartElemById(id),
                cartItem = changeCount(id, delta);
            if (cartItem.count) {
                $cartElem.find(opts.elCartCount).html(cartItem.count);
                $cartElem.find(opts.elCartSumma).html(cartItem.count * cartItem.price);
            } else {
                $cartElem.remove();
            }
            renderMenuCart();
            renderTotalCartSumma();
        });
    }

    // Óäàëÿåì òîâàð èç êîðçèíå
    function _onClickRemoveFromCart() {
        $('body').on('click', opts.elRemoveFromCart, function(e) {
            if(!confirm('Удалить товар из корзины?')) return false;
            var $this = $(this),
                id = +$this.attr(opts.attrId),
                $cartElem = findCartElemById(id);
            remove(id);
            $cartElem.remove();
            renderMenuCart();
            renderTotalCartSumma();
        });
    }



    // Ýêñïîðòèðóåì íàðóæó
    return {
        init: init,
        update: updateData,
        getData: getData,
        save: saveData,
        clearData: clearData,
        getById: getById,
        add: add,
        remove: remove,
        changeCount: changeCount,
        getCount: getCount,
        getCountAll: getCountAll,
        getSumma: getSumma
    }

})(jQuery);