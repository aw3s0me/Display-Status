(function($) {
    $.fn.initial = function(availWidth, availHeight, sizeX, sizeY) {
        var wgt = availWidth * 0.96,
            hgt = availHeight * 0.96,
            unitX = Math.round(10*(wgt / sizeX))/10,
            unitY = Math.round(10*(hgt / sizeY))/10,
            unit0 = (unitY < unitX) ? unitY : unitX,
            margintop = (availHeight - unit0*sizeY)/2.;

        this.css('margin-top', margintop + 'px');
        this.css('height', sizeY*unit0 + 'px');
        this.css('width', sizeX*unit0 + 'px');

        this.data('gridUnit', unit0);
        this.data('gridSizeX', sizeX);
        this.data('gridSizeY', sizeY);

        console.log('gridSize', sizeX, sizeY);
        console.log('unitX/Y', unit0);
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

(jQuery));
