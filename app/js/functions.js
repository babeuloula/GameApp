function init() {
    changeHorloge();

    var top = (parseInt($("#gameInfo").css('top')) - 45) / 2;
    var rightHorloge = (top * 2) + 45;
    $("#horloge").css('top', top).css('right', rightHorloge);
    $("#params").css('top', top).css('right', top);
    $("#maximize").css('top', top).css('left', top);
    $("#minimize").css('top', top).css('left', top);

    coverFlow();
    getInfos(0, function() {
        $("#overlay").fadeOut(400, function() {
            var marginTopInfos = ($("#gameInfo").height() - $('#gameInfo #containerInfo .image').height()) / 2;
            var heightDescriptif = Math.round($('#gameInfo #containerInfo .image').height() - ($("#gameInfo .infos").height() + 15));

            $('#gameInfo #containerInfo .image').css('marginTop', marginTopInfos);
            $("#gameInfo .infos").css('marginTop', marginTopInfos);
            $("#gameInfo .descriptif").height(heightDescriptif);

            $("#gameInfo #containerInfo").fadeTo(400, 1);
            $("#gameList #containerList").fadeTo(400, 1);

            if($('#gameInfo #containerInfo .descriptif p').height() > $('#gameInfo #containerInfo .descriptif').height()) {
                $('#gameInfo #containerInfo .descriptif').marquee({
                    duration: 5000,
                    gap: 25,
                    delayBeforeStart: 1000,
                    direction: 'up',
                    duplicated: true
                });
            }
        });
    });
}

function reload() {
    coverFlow();
    $('#containerList').coverflow().to(current);

    var top = (parseInt($("#gameInfo").css('top')) - 45) / 2;
    var rightHorloge = (top * 2) + 45;
    $("#horloge").css('top', top).css('right', rightHorloge);
    $("#params").css('top', top).css('right', top);
    $("#maximize").css('top', top).css('left', top);
    $("#minimize").css('top', top).css('left', top);

    var marginTopInfos = ($("#gameInfo").height() - $('#gameInfo #containerInfo .image').height()) / 2;
    var heightDescriptif = Math.round($('#gameInfo #containerInfo .image').height() - ($("#gameInfo .infos").height() + 15));

    $('#gameInfo #containerInfo .image').css('marginTop', marginTopInfos);
    $("#gameInfo .infos").css('marginTop', marginTopInfos);
    $("#gameInfo .descriptif").height(heightDescriptif);

    $('#gameInfo #containerInfo .descriptif').marquee('destroy');

    if($('#gameInfo #containerInfo .descriptif p').height() > $('#gameInfo #containerInfo .descriptif').height()) {
        $('#gameInfo #containerInfo .descriptif').marquee({
            duration: 5000,
            gap: 25,
            delayBeforeStart: 1000,
            direction: 'up',
            duplicated: true
        });
    }
}

function coverFlow() {
    var playlist = $.parseJSON(file.readFileSync('games/gameapp.json'));
    playlist.sort(sortByTitle);

    $('#containerList').coverflow({
        playlist: playlist,
        width: $(window).width(),
        height: $("#gameList").height(),
        backgroundopacity: 0,
        coverwidth: ($(window).width() / 100) * 8,
        mousewheel: false
    });
}

function getInfos(id, callback) {
    var game = $.parseJSON(file.readFileSync('games/gameapp.json'));
    game.sort(sortByTitle);

    getColor(game[id].background, function(color) {
        $('#gameInfo #containerInfo h2').css('color', color);

        $("#background").css('background-image', 'url("'+game[id].background+'")');
        $('#gameInfo #containerInfo .image').attr('src', game[id].screenshot).width('40%');
        $('#gameInfo #containerInfo .infos h1').html(game[id].titre);
        $('#gameInfo #containerInfo .infos .editeur').html(game[id].editeur);
        $('#gameInfo #containerInfo .infos .developpeur').html(game[id].developpeur);
        $('#gameInfo #containerInfo .infos .type').html(game[id].type);
        $('#gameInfo #containerInfo .infos .sortie').html(game[id].sortie);
        $('#gameInfo #containerInfo .infos .classification').html(game[id].classification);
        $('#gameInfo #containerInfo .descriptif p').html(game[id].descriptif);

        callback(true);
    });
}

function sortByTitle(key1, key2) {
    return key1.titre > key2.titre;
}

function getColor(src, callback) {
    var image = new Image();
    image.src = src;
    image.onload = function() {
        var r, g, b;
        var colorThief = new ColorThief();
        var dominant = colorThief.getColor(image);
        var palette = colorThief.getPalette(image, 2);

        if(dominant[0] < 115 && dominant[1] < 115 && dominant[2] < 115) {
            if(palette[1][0] < 115 && palette[1][1] < 115 && palette[1][2] < 115) {
                r = "9E";
                g = "87";
                b = "48";
            } else {
                r = toHex(palette[1][0]);
                g = toHex(palette[1][1]);
                b = toHex(palette[1][2]);
            }
        } else {
            r = toHex(dominant[0]);
            g = toHex(dominant[1]);
            b = toHex(dominant[2]);
        }

        var color = "#" + r + g + b;

        callback(color);
    };
}

function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
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

    if(!fs.existsSync('games/gameapp.json')) {
        fs.writeFileSync('games/gameapp.json', '[]');
        init();
    } else {
        var xml = file.readFileSync('games/gameapp.json');

        if(xml !== '[]') {
            //prepare(xml);
            init();
        } else {
            init();
        }
    }
}

var current = 0;
var total = $.parseJSON(file.readFileSync('games/gameapp.json')).length;
function actions_keyboard(keyCode) {
    switch(keyCode) {
        // Echap 27
        case 27:
            gui.App.quit();
            break;

        // Haut 38
        case 38:
            break;

        // Bas 40
        case 40:
            break;

        // Gauche 37
        case 37:
            if(current > 0) {
                current = current - 1;

                $("#background, #gameInfo #containerInfo").fadeOut(400, function() {
                    getInfos(current, function() {
                        $("#background, #gameInfo #containerInfo").fadeIn(1000);
                    });
                });
            }

            $('#containerList').coverflow().left();
            break;

        // Droite 39
        case 39:
            if(current < total - 1) {
                current = current + 1;

                $("#background, #gameInfo #containerInfo").fadeOut(400, function() {
                    getInfos(current, function() {
                        $("#background, #gameInfo #containerInfo").fadeIn(1000);
                    });
                });
            }

            $('#containerList').coverflow().right();
            break;

        // Entrée
        case 13:
            var game = $.parseJSON(file.readFileSync('games/gameapp.json'));

            alert("Lancement du jeu " + game[current].titre);

            /*child = execFile(game[current].path, function(error, stdout, stderr) {
                if (error) {
                    console.log(error.stack);
                    console.log('Error code: '+ error.code);
                    console.log('Signal received: '+
                        error.signal);
                }
                console.log('Child Process stdout: '+ stdout);
                console.log('Child Process stderr: '+ stderr);
            });

            child.on('exit', function (code) {
                console.log('Child process exited with exit code '+ code);
            });*/

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