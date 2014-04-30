(function($) {
    $.fn.initial = function(availWidth, availHeight, sizeX, sizeY) {
        var unit0 = 50,
            wgt = availWidth * 0.96,
            hgt = availHeight * 0.96,
            scale1 = wgt/ (sizeX*unit0),
            scale2 = hgt/ (sizeY*unit0),
            scale = Math.floor( 
                        ((scale2 < scale1) ? scale2 : scale1)*100 
                        ) /100,
            margintop = (availHeight - sizeY*unit0*scale)/2.;

        this.css('margin-top', margintop + 'px');
        this.css('height', sizeY*unit0*scale + 'px');
        this.css('width', sizeX*unit0*scale + 'px');

        this.attr('scaled', 'scaled');
        this.data('gridUnitX', unit0*scale);
        this.data('gridUnitY', unit0*scale);
        this.data('gridSizeX', sizeX);
        this.data('gridSizeY', sizeY);
        this.data('scale', scale);
        this.data('unit0', unit0);

        console.log('gridSize', sizeX, sizeY);
        console.log('unitX/Y', unit0*scale);
        console.log('scale', scale1, scale2, scale);
    };

    $.fn.toggleGrid = function() {
        var attr = this.attr('grid');
        if (typeof attr !== 'undefined' && attr !== false) {
            this.children('.grid').remove();
            this.removeAttr('grid');
            return;
        }
        this.attr('grid', 'grid');
        for (var i = 0; i < this.data('gridSizeX'); i++) {
            for(var j = 0; j < this.data('gridSizeY'); j++) {
                var w = new widget().init(1,1).setClass('grid');
                this.addWidget(w, i, j);
            }
        }
    };

    $.fn.addWidget = function(w, px, py, scale) {
        scale = defaultFor(scale, this.data('scale'));
        w.setScale(scale);
        w.e.style.left = px * this.data('gridUnitX') + 'px'; 
        w.e.style.top  = py * this.data('gridUnitY') + 'px';
        this.append(w.e.outerHTML);
        return this;
    };

}(jQuery));
