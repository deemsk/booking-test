function Carousel(element, params) {
    this.element = element;
    this.params = $.extend({
        slideshowDelay: 3500,
    }, params);
    this.$photo = $('.js-carousel-photo', this.element);
    this.$description = $('.js-carousel-photo-description', this.element);
    this.collection = [];
    this.init();
};

Carousel.prototype = {

    init: function() {
        $('.js-carousel-thumb', this.element).each(this.addItem.bind(this));

        $(this.element)
            .on('click', '.js-carousel-thumb', this.onThumbClick.bind(this))
            .on('click', '.js-carousel-prev', this.onPrevClick.bind(this))
            .on('click', '.js-carousel-next', this.onNextClick.bind(this));
            
        $(document)
            .on('keydown', this.onKeyDown.bind(this));

        this.playSlideshow();
    },

    addItem: function(index, element) {
        var image = element.querySelector('.js-carousel-thumb-image');

        this.collection.push({
            element: element,
            originSrc: image.getAttribute('data-origin-image-src'),
            description: image.getAttribute('alt')
        });
        
        if ($(element).hasClass('photos__thumb_selected')) {
            this.current = index;
        }

        element.setAttribute('data-carousel-index', index);
    },
    
    getItem: function(index) {
        return this.collection[index];
    },
    
    getSelectedItem: function() {
        return this.collection[this.current];
    },

    showPrevPhoto: function() {
        this.showPhoto(this.current - 1 < 0 ? this.collection.length - 1 : this.current - 1);
    },
    
    showNextPhoto: function() {
        this.showPhoto(this.current + 1 === this.collection.length ? 0 : this.current + 1);
    },
    
    showPhoto: function(index) {
        if (index === this.current) {
            return;
        }

        var item = this.getItem(index);
        
        this.$photo.prop('src', item.originSrc);
        this.$description
            .html(item.description)
            .toggleClass('hidden', !item.description);
        
        $(this.getSelectedItem().element).removeClass('photos__thumb_selected');
        $(item.element).addClass('photos__thumb_selected');

        this.current = index;
    },
    
    playSlideshow: function() {
        this.startSlide();
    },
    
    startSlide: function() {
        this.slideshowTimer = setTimeout(function() {
            this.showNextPhoto();
            this.startSlide();
        }.bind(this), this.params.slideshowDelay);
    },
    
    stopSlideshow: function() {
        clearInterval(this.slideshowTimer);
    },
    
    onThumbClick: function(event) {
        this.stopSlideshow();
        var index = parseInt(event.currentTarget.getAttribute('data-carousel-index'), 10);
        this.showPhoto(index);
    },
    
    onPrevClick: function() {
        this.stopSlideshow();
        this.showPrevPhoto();
    },
    
    onNextClick: function() {
        this.stopSlideshow();
        this.showNextPhoto();
    },
    
    onKeyDown: function(event) {
        var KEY_ARROW_LEFT = 0x25;
        var KEY_ARROW_RIGHT = 0x27;
        
        this.stopSlideshow();
        
        switch (event.keyCode) {
            case KEY_ARROW_LEFT:
                this.showPrevPhoto();
                break;
            case KEY_ARROW_RIGHT:
                this.showNextPhoto();
                break;
            default:
                return;
        }
    }
    
};






function RoomTable(element, params) {
    this.element = element;
    this.params = params;
    this.rows = this.element.querySelector('.js-room-table-items');
    this.$total = $('.js-room-table-total', this.element);
    this.$totalSum = $('.js-room-table-total-sum', this.element);
    this.collection = [];
    this.init();
}

RoomTable.prototype = {

    init: function() {
        [].forEach.call(
            this.element.querySelectorAll('.js-room-table-item'),
            this.addItem,
            this
        );
        
        $(this.element)
            .on('click', '.js-room-table-occupancy-header', function() {
                var order = 'ascending';
                if (this.sortField === 'occupancy') {
                    order = order === this.sortOrder ? 'descending' : order;
                }
                this.sort('occupancy', order);
            }.bind(this))
            .on('click', '.js-room-table-price-header', function() {
                var order = 'ascending';
                if (this.sortField === 'price') {
                    order = order === this.sortOrder ? 'descending' : order;
                }
                this.sort('price', order);
            }.bind(this));
    },
    
    addItem: function(element) {
        var values = {
            name:      element.querySelector('.js-room-table-name').innerHTML,
            occupancy: element.querySelector('.js-room-table-occupancy').innerHTML,
            price:     element.querySelector('.js-room-table-price').innerHTML,
            quantity:  element.querySelector('.js-room-table-quantity').value
        };

        var room = {
            element:   element,
            name:      values.name.trim(),
            occupancy: parseInt(values.occupancy, 10),
            price:     parseFloat(values.price.match(/(\d+(.\d+)?)/g).toString()),
            quantity:  parseInt(values.quantity, 10)
        };
        
        $(element.querySelector('.js-room-table-quantity')).change(function(event) {
            room.quantity = parseInt(event.currentTarget.value, 10);
            this.renderTotal();
        }.bind(this));
        
        this.collection.push(room);
    },
    
    sort: function(field, order) {
        var sortFunc;
        
        function asc(a, b) {
            return a[field] - b[field];
        }
        
        function desc(a, b) {
            return b[field] - a[field];
        }
        
        if (this.sortField == field && this.sortOrder == order) {
            return;
        }
        
        switch (order) {
            case 'ascending':
                sortFunc = asc;
                break;
            case 'descending':
                sortFunc = desc;
                break;
            default:
                return;
        }

        this.collection.sort(sortFunc);
        this.sortField = field;
        this.sortOrder = order;
        this.render();
    },
    
    renderTotal: function() {
        var sum = 0,
            room;

        for (var i = 0, l = this.collection.length; i < l; i++) {
            room = this.collection[i];
            sum += room.price * room.quantity;
        }

        this.$total.toggleClass('invisible', sum === 0);
        this.$totalSum.html('&euro;' + sum.toFixed(2));
    },

    render: function() {
        $('.js-room-table-head .rooms-table__cell', this.element)
            .removeClass('rooms-table__cell_ascending rooms-table__cell_descending');
        $('.js-room-table-' + this.sortField + '-header').addClass('rooms-table__cell_' + this.sortOrder);

        this.collection.forEach(function(row) {
            this.rows.appendChild(row.element);
        }, this);
    }

};
