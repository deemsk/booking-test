function Carousel(element, params) {
    this.element = element;
    this.params = $.extend({
        slideshowDelay: 3500,
    }, params);
    this.$photo = $('.js-carousel-photo', this.element);    
    this.collection = [];
    this.init();
};

Carousel.prototype = {

    init: function() {
        [].forEach.call(
            this.element.querySelectorAll('.js-carousel-thumb'),
            this.addItem,
            this
        )

        $(this.element)
            .on('click', '.js-carousel-thumb', this.onThumbClick.bind(this))
            .on('click', '.js-carousel-prev', this.onPrevClick.bind(this))
            .on('click', '.js-carousel-next', this.onNextClick.bind(this));
            
        this.playSlideshow();
    },
    
    addItem: function(element, index) {
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
        $(this.getSelectedItem().element).removeClass('photos__thumb_selected');
        $(item.element).addClass('photos__thumb_selected');

        this.current = index;
    },
    
    playSlideshow: function() {
        this.slideshowTimer = this.startSlide();
    },
    
    startSlide: function() {
        return setTimeout(function() {
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
    }
    
};
