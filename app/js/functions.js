function init() {
    changeHorloge();

    var topHorloge = (parseInt($("#gameInfo").css('top')) - 45) / 2;
    $("#horloge").css('top', topHorloge).css('right', topHorloge);

    $("#background").css('background-image', 'url("'+$("#gameList #containerList .game.active").children().next('.background').text()+'")');

    $("#gameList #containerList .game").each(function() {
        if($(this).attr('class').indexOf('active') >= 0) {
            var width = Math.round(($(window).width() / 100) * 10);
            $(this).css('width', width);
        } else {
            var width = Math.round(($(window).width() / 100) * 8.5);
            $(this).css('width', width);
        }
    });
    $("#gameList #containerList").css('width', $(window).width()).css('left', '45%');

    $('#gameInfo #containerInfo .image').attr('src', $("#gameList #containerList .game.active").children().next('.background').text()).width('40%');
    $('#gameInfo #containerInfo .infos h1').html($("#gameList #containerList .game.active").children().next('.titre').text());
    $('#gameInfo #containerInfo .infos .editeur').html($("#gameList #containerList .game.active").children().next('.editeur').text());
    $('#gameInfo #containerInfo .infos .developpeur').html($("#gameList #containerList .game.active").children().next('.developpeur').text());
    $('#gameInfo #containerInfo .infos .type').html($("#gameList #containerList .game.active").children().next('.type').text());
    $('#gameInfo #containerInfo .infos .sortie').html($("#gameList #containerList .game.active").children().next('.sortie').text());
    $('#gameInfo #containerInfo .infos .classification').html($("#gameList #containerList .game.active").children().next('.classification').text());
    $('#gameInfo #containerInfo .infos .descriptif').html($("#gameList #containerList .game.active").children().next('.descriptif').text());

    $("#overlay").fadeOut(400, function() {
        var marginTopInfos = ($("#gameInfo").height() - $('#gameInfo #containerInfo .image').height()) / 2;
        var heightDescriptif = Math.round((75 * 100) / $('#gameInfo #containerInfo .image').height());

        $('#gameInfo #containerInfo .image').css('marginTop', marginTopInfos);
        $("#gameInfo .infos").css('marginTop', marginTopInfos).height($('#gameInfo #containerInfo .image').height());
        $("#gameInfo .infos .descriptif").height(heightDescriptif + '%');

        $("#gameList #containerList .game").each(function() {
            var marginTop = Math.round(($("#gameList").height() - $(this).children().height()) / 2);
            $(this).css('marginTop', marginTop);
        });

        $("#gameInfo #containerInfo").fadeTo(400, 1);
        $("#gameList #containerList").fadeTo(400, 1);
    });
}

function reload(left) {
    $("#background").fadeOut(400, function() {
        var topHorloge = (parseInt($("#gameInfo").css('top')) - 45) / 2;
        $("#horloge").css('top', topHorloge).css('right', topHorloge);

        $("#gameList #containerList").css('left', left);
        $("#gameList #containerList .game").each(function() {
            if($(this).attr('class').indexOf('active') >= 0) {
                var width = Math.round(($(window).width() / 100) * 10);
                $(this).css('width', width);
            } else {
                var width = Math.round(($(window).width() / 100) * 8.5);
                $(this).css('width', width);
            }

            var marginTop = Math.round(($("#gameList").height() - $(this).children().height()) / 2) - 3;
            $(this).css('marginTop', marginTop);
        });

        $('#gameInfo #containerInfo .image').attr('src', $("#gameList #containerList .game.active").children().next('.background').text()).width('40%');
        $('#gameInfo #containerInfo .infos h1').html($("#gameList #containerList .game.active").children().next('.titre').text());
        $('#gameInfo #containerInfo .infos .editeur').html($("#gameList #containerList .game.active").children().next('.editeur').text());
        $('#gameInfo #containerInfo .infos .developpeur').html($("#gameList #containerList .game.active").children().next('.developpeur').text());
        $('#gameInfo #containerInfo .infos .type').html($("#gameList #containerList .game.active").children().next('.type').text());
        $('#gameInfo #containerInfo .infos .sortie').html($("#gameList #containerList .game.active").children().next('.sortie').text());
        $('#gameInfo #containerInfo .infos .classification').html($("#gameList #containerList .game.active").children().next('.classification').text());
        $('#gameInfo #containerInfo .infos .descriptif').html($("#gameList #containerList .game.active").children().next('.descriptif').text());

        $("#gameInfo #containerInfo").fadeTo(200, 1);

        $(this).css('background-image', 'url("'+$("#gameList #containerList .game.active").children().next('.background').text()+'")').fadeIn(400);
    });
}

function nodejs() {
    if(!fs.existsSync('games/')) {
        fs.mkdirSync('games/');
    }

    if(!fs.existsSync('games/backgrounds/')) {
        fs.mkdirSync('games/backgrounds/');
    }

    if(!fs.existsSync('games/images/')) {
        fs.mkdirSync('games/images/');
    }

    if(!fs.existsSync('games/thumbs/')) {
        fs.mkdirSync('games/thumbs/');
    }

    if(!fs.existsSync('games/gameapp.db')) {
        fs.writeFileSync('games/gameapp.db', '<?xml version="1.0" encoding="UTF-8"?>');
        init();
    } else {
        var xml = file.readFileSync('games/gameapp.db');

        if(xml !== '<?xml version="1.0" encoding="UTF-8"?>') {
            prepare(xml);
        } else {
            init();
        }
    }
}

function actions_keyboard(keyCode) {
    switch(keyCode) {
        // Echap 27
        case 27:
            break;

        // Haut 38
        case 38:
            break;

        // Bas 40
        case 40:
            break;

        // Gauche 37
        case 37:
            if($("#gameList #containerList .game.active").prev().length) {
                var left = parseInt($("#gameList #containerList").css('left'), 10) + parseInt($("#gameList #containerList .game.active").width(), 10);
                $("#gameList #containerList .game.active").removeClass('active').prev().addClass('active');

                $("#gameInfo #containerInfo").fadeOut();
                reload(left + 'px');
            }
            break;

        // Droite 39
        case 39:
            if($("#gameList #containerList .game.active").next().length) {
                var left = parseInt($("#gameList #containerList").css('left'), 10) - parseInt($("#gameList #containerList .game.active").width(), 10);
                $("#gameList #containerList .game.active").removeClass('active').next().addClass('active');

                $("#gameInfo #containerInfo").fadeOut();
                reload(left + 'px');
            }
            break;

        // Entrée
        case 13:
            break;

        // Backspace
        case 8:
            break;
    }
}

function changeHorloge() {
    var heure = new Date().getHours();
    var minute = new Date().getMinutes();

    if(parseInt(heure, 10) < 10) {
        heure = "0" + heure;
    }

    if(parseInt(minute, 10) < 10) {
        minute = "0" + minute;
    }

    $("#horloge .heure").html(heure);
    $("#horloge .minute").html(minute);
}