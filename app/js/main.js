jQuery(function($){
    var width = $(window).width();
    $(window).resize(function() {
        var pourcent = (parseInt($("#gameList #containerList").css('left'), 10) * 100) / width;
        var left = Math.round(($(window).width() / 100) * pourcent);
        width = $(window).width();
        reload(left + 'px');
    });

    $(document).ready(function() {
        nodejs();
    });


    $(document).keydown(function(e) {
        actions_keyboard(e.keyCode);
    });






    setInterval(function() {
        changeHorloge();

        $("#horloge .sep").fadeOut(100, function() {
            $("#horloge .sep").fadeIn(100);
        });
    }, 1000);
});