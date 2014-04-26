function initPage2(sizeX, sizeY) {
    var unit0 = 50,
        wgt = $(window).width() * 0.96,
        hgt = ($(window).height()
                - $('.banner').css('height').toNum()
                - $('.footer').css('height').toNum())*0.96,
        scale1 = wgt/ (sizeX*unit0),
        scale2 = hgt/ (sizeY*unit0),
        scale = (scale2 < scale1) ? scale2 : scale1,

    scale = Math.floor(scale*100)/100;

    var margin = ($(window).height()
                - $('.banner').css('height').toNum()
                - $('.footer').css('height').toNum()
                - sizeY * unit0 * scale)/2.;

    $('.canvas').attr('scaled', 'scaled');
    $('.canvas').data('gridUnitX', unit0*scale);
    $('.canvas').data('gridUnitY', unit0*scale);
    $('.canvas').data('gridSizeX', sizeX);
    $('.canvas').data('gridSizeY', sizeY);
    $('.canvas').data('scale', scale);
    $('.canvas').data('unit0', unit0);

    $('.canvas').css('margin-top', margin + 'px');
    $('.canvas').css('height', sizeY*unit0*scale + 'px');
    $('.canvas').css('width', sizeX*unit0*scale + 'px');

    console.log('gridSize', sizeX, sizeY);
    console.log('unitX/Y', unit0*scale);
    console.log('scale', scale1, scale2, scale);
}

