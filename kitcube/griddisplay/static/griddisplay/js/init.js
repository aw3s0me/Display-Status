$(
    var canvasWidth = $(window).width();
    var canvasHeight = $(window).height() 
            - $('.banner').css('height').toNum()
            - $('.footer').css('height').toNum();
    console.log(canvasWidth);
    $('.canvas').initial(canvasWidth, canvasHeight, 36, 20);
);
