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
                    toolbar: false,
                    width: 1024,
                    height: 600,
                    resizable: false,
                    "min_width": 1024,
                    "max_width": 1024,
                    "min_height": 600,
                    "max_height": 600,
                    "title": "Paramètres de GameApp",
                    "icon": "app/icons/params_48.png",
                    show: true
                }
            }
        });

        var params = global.windowManager.open('params');

        params.on('close', function() {
            document.location.reload(true);
        });
    });

    $(document).on('click', '#maximize, #minimize', function() {
        $("#maximize").toggle(200);
        $("#minimize").toggle(200);
        nwin.toggleFullscreen();
    });

    setInterval(function() {
        changeHorloge();

        $("#horloge .sep").fadeTo(100, 0, function() {
            $("#horloge .sep").fadeTo(100, 1);
        });
    }, 1000);

    onload = function() {
        nwin.show();
        nwin.toggleFullscreen();
    };
});