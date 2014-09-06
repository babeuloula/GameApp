jQuery(function($){
    var nwin = gui.Window.get();

    $(window).resize(function() {
        reload();
    });

    $(document).ready(function() {
        nodejs();
    });

    $(document).keyup(function(e) {
        actions_keyboard(e.keyCode);
    });

    $(document).keydown(function(e) {
        //console.log(e.keyCode);
    });

    $(document).on('click', '#params', function() {
        global.windowManager = new WindowManager(gui, {
            "params": {
                page: "params.html",
                options: {
                    frame : true,
                    toolbar: true,
                    width: 640,
                    height: 480,
                    resizable: false,
                    "min_width": 640,
                    "min_height": 480,
                    "title": "Paramètres de GameApp",
                    "icon": "app/icons/params_48.png",
                    show: true
                }
            }
        });

        var params = global.windowManager.open('params');

        params.on('close', function() {
            window.location.reload();
        });
    });

    $(document).on('click', '#maximize, #minimize', function() {
        $("#maximize").toggle(200);
        $("#minimize").toggle(200);
        nwin.toggleFullscreen();
    });

    setInterval(function() {
        changeHorloge();

        $("#horloge .sep").fadeOut(100, function() {
            $("#horloge .sep").fadeIn(100);
        });
    }, 1000);

    onload = function() {
        nwin.show();
        nwin.toggleFullscreen();
    };
});