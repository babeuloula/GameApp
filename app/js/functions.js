function init() {
    changeHorloge();

    var top = (parseInt($("#gameInfo").css('top')) - 45) / 2;
    var rightHorloge = (top * 2) + 45;
    $("#horloge").css('top', top).css('right', rightHorloge);
    $("#params").css('top', top).css('right', top);
    $("#maximize").css('top', top).css('left', top);
    $("#minimize").css('top', top).css('left', top);

    var json = file.readFileSync('./games/gameapp.json');
    if(json !== '[]') {
        coverFlow();
        getInfos(0, function() {
            $("#overlay").fadeTo(400, 0, function() {
                var heightImage = Math.round($("#gameInfo").height() - 100);
                $('#gameInfo #containerInfo .image').height(heightImage);
                var heightDescriptif = Math.round(heightImage - ($("#gameInfo .infos").height() + 15));
                var widthInfos = $("#gameInfo").width() - $('#gameInfo #containerInfo .image').width() - 150;

                $('#gameInfo #containerInfo .image').css('marginTop', '50px').css('marginRight', '50px');
                $("#gameInfo .infos").css('marginTop', '50px').css('marginLeft', '50px').width(widthInfos);
                $("#gameInfo .descriptif").css('marginLeft', '50px').height(heightDescriptif).width(widthInfos);

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

    var heightImage = Math.round($("#gameInfo").height() - 100);
    $('#gameInfo #containerInfo .image').height(heightImage);
    var heightDescriptif = Math.round(heightImage - ($("#gameInfo .infos").height() + 15));
    var widthInfos = $("#gameInfo").width() - $('#gameInfo #containerInfo .image').width() - 150;

    $('#gameInfo #containerInfo .image').css('marginTop', '50px').css('marginRight', '50px');
    $("#gameInfo .infos").css('marginTop', '50px').css('marginLeft', '50px').width(widthInfos);
    $("#gameInfo .descriptif").css('marginLeft', '50px').height(heightDescriptif).width(widthInfos);

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
    var playlist = $.parseJSON(file.readFileSync('./games/gameapp.json'));
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
    var game = $.parseJSON(file.readFileSync('./games/gameapp.json'));
    game.sort(sortByTitle);

    getColor(game[id].background, function(color) {
        $('#gameInfo #containerInfo h2').css('color', color);

        $("#background").css('background-image', 'url("'+game[id].background+'")');
        $('#gameInfo #containerInfo .image').attr('src', game[id].screenshot);
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
    if(!fs.existsSync('./games/')) {
        fs.mkdirSync('./games/');
    }

    if(!fs.existsSync('./games/backgrounds/')) {
        fs.mkdirSync('./games/backgrounds/');
    }

    if(!fs.existsSync('./games/images/')) {
        fs.mkdirSync('./games/images/');
    }

    if(!fs.existsSync('./games/gameapp.json')) {
        fs.writeFileSync('./games/gameapp.json', '[]');
        init();
    } else {
        init();
    }
}

var current = 0;
var total = 0;
if(fs.existsSync('./games/gameapp.json')) {
    total = $.parseJSON(file.readFileSync('./games/gameapp.json')).length;
}
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
            $('#containerList').coverflow().left();

            if(current > 0) {
                current = current - 1;

                $("#background, #gameInfo #containerInfo").fadeTo(400, 0, function() {
                    getInfos(current, function() {
                        $("#background, #gameInfo #containerInfo").fadeTo(1000, 1);
                    });
                });
            }
            break;

        // Droite 39
        case 39:
            $('#containerList').coverflow().right();

            if(current < total - 1) {
                current = current + 1;

                $("#background, #gameInfo #containerInfo").fadeTo(400, 0, function() {
                    getInfos(current, function() {
                        $("#background, #gameInfo #containerInfo").fadeTo(1000, 1);
                    });
                });
            }
            break;

        // Entrée
        case 13:
            var game = $.parseJSON(file.readFileSync('./games/gameapp.json'));
            game.sort(sortByTitle);

            getColor(game[current].background, function(color) {
                $("#loading").css('color', color).width($(window).width()).height($(window).height());
                $("path").css('stroke', color);

                loading('launch', "Chargement du jeu en cours", function() {
                    if(game[current].path.indexOf('://') > 0 && game[current].path !== "") {
                        $(location).attr('href', game[current].path);
                    } else {
                        child = execFile(game[current].path, function(error,stdout,stderr) {
                            if (error) {
                                popup(error.stack + '<br><br>Error code: '+ error.code + '<br>Signal received: ' + error.signal);
                            }
                        });

                        child.on('exit', function (code) {
                            loadingEnd('launch');
                        });
                    }
                });
            });


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

function popup(message) {
    loading('popup', message);
}

function loading(type, message, callback) {
    if(type === 'launch') {
        $("#loading #messageLoading").html(message);

        if(callback === undefined) {
            $("#loading").fadeIn(400);
        } else {
            $("#loading").fadeIn(400, callback());
        }
    } else if(type === 'scrap' || type === 'download') {
        $("#loadingMessage").html(message);

        if(callback === undefined) {
            $("#loadingOverlay").fadeIn(400);
        } else {
            $("#loadingOverlay").fadeIn(400, callback());
        }
    } else if(type === 'confirmation') {
        $("#delGame #message").html(message);

        if(callback === undefined) {
            $("#delGame").fadeIn(400);
        } else {
            $("#delGame").fadeIn(400, callback());
        }
    } else if(type === 'popup') {
        $("#popup #popupMessage").html(message);

        if(callback === undefined) {
            $("#popup").fadeIn(400);
        } else {
            $("#popup").fadeIn(400, callback());
        }
    }
}

function loadingEnd(type, callback) {
    if(type === 'launch') {
        if(callback !== undefined) {
            $("#loading").fadeOut(400, callback());
        } else {
            $("#loading").fadeOut(400);
        }
    } else if(type === 'scrap' || type === 'download') {
        if(callback !== undefined) {
            $("#loadingOverlay").fadeOut(400, callback());
        } else {
            $("#loadingOverlay").fadeOut(400);
        }
    } else if(type === 'confirmation') {
        if(callback === undefined) {
            $("#delGame").fadeOut(400);
        } else {
            $("#delGame").fadeOut(400, callback());
        }
    } else if(type === 'popup') {
        if(callback === undefined) {
            $("#popup").fadeOut(400);
        } else {
            $("#popup").fadeOut(400, callback());
        }
    }
}

function getGameInfos(id, callback) {
    $("#id_jeu").val('');
    $("#titre_jeu").val('');
    $("#type_jeu").val('');
    $("#editeur_jeu").val('');
    $("#developpeur_jeu").val('');
    $("#sortie_jeu").val('');
    $("#classification_jeu").val('');
    $("#descriptif_jeu").val('');
    $("#pochette_jeu").attr('src', '');
    $("#background_jeu").attr('src', '');
    $("#screenshot_jeu").attr('src', '');

    // Infos de base
    request('http://nex12sz:GT4!V2cT@ws.jeuxvideo.com/01.jeux/'+id+'.xml', function (error1, response1, body1) {
        var infos = [];

        if (!error1 && response1.statusCode == 200) {
            infos.id = parseInt(id, 10);

            if($(body1).find('titre').length < 1) {
                infos.titre = '';
            } else {
                infos.titre = $(body1).find('titre').html().replace('<!--[CDATA[', '').replace(']]-->', '');
            }

            if($(body1).find('date_sortie').length < 1) {
                infos.sortie = '';
            } else {
                infos.sortie = $(body1).find('date_sortie').html().replace('<!--[CDATA[', '').replace(']]-->', '');
            }

            if($(body1).find('editeur').length < 1) {
                infos.editeur = '';
            } else {
                infos.editeur = $(body1).find('editeur').html().replace('<!--[CDATA[', '').replace(']]-->', '');
            }

            if($(body1).find('developpeur').length < 1) {
                infos.developpeur = '';
            } else {
                infos.developpeur = $(body1).find('developpeur').html().replace('<!--[CDATA[', '').replace(']]-->', '');
            }

            if($(body1).find('type').length < 1) {
                infos.type = '';
            } else {
                infos.type = $(body1).find('type').html().replace('<!--[CDATA[', '').replace(']]-->', '');
            }

            if($(body1).find('classification').length < 1) {
                infos.classification = '';
            } else {
                infos.classification = $(body1).find('classification').html().replace('<!--[CDATA[', '').replace(']]-->', '');
            }

            if($(body1).find('vignette_grande').html() === 'http://image.jeuxvideo.com/mobile/nopack.png') {
                infos.pochette = 'css/images/no_pochette.jpg';
            } else {
                infos.pochette = $(body1).find('vignette_grande').html();
            }


            // Résumé du jeu
            request('http://nex12sz:GT4!V2cT@ws.jeuxvideo.com/01.jeux/details/'+id+'.xml', function (error2, response2, body2) {
                if (!error2 && response2.statusCode == 200) {
                    if($(body2).find('resume').length < 1) {
                        infos.descriptif = '';
                    } else {
                        infos.descriptif = $(body2).find('resume').html().replace('<!--[CDATA[', '').replace(']]-->', '');
                    }

                    // Screenshot du jeu
                    request('http://ajax.googleapis.com/ajax/services/search/images?v=1.0&start=0&rsz=1&q='+infos.titre+'%20screenshot&imgsz=huge', function (error3, response3, body3) {
                        if (!error3 && response3.statusCode == 200) {
                            var screenshots = $.parseJSON(body3);

                            try {
                                infos.screenshot = screenshots.responseData.results[0].url;
                            } catch(err) {
                                infos.screenshot = 'css/images/gameapp.jpg';
                            }

                            request('http://ajax.googleapis.com/ajax/services/search/images?v=1.0&start=0&rsz=8&q='+infos.titre+'%20wallpaper&imgsz=huge', function (error4, response4, body4) {
                                if (!error4 && response4.statusCode == 200) {
                                    var wallpapers = $.parseJSON(body4);

                                    infos.background = 'css/images/gameapp.jpg';
                                    try {
                                        var finish = false;
                                        for(var w = 0; w < wallpapers.responseData.results.length; w++) {
                                            if(!finish) {
                                                if(wallpapers.responseData.results[w].width === '1920' && wallpapers.responseData.results[w].height === '1080') {
                                                    infos.background = wallpapers.responseData.results[w].url;
                                                    finish = true;
                                                }
                                            }
                                        }
                                    } catch(err) {
                                        infos.background = 'css/images/gameapp.jpg';
                                    }

                                    callback(infos);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

function downloadImage(path, url, callback) {
    var image = url.split('/').pop();
    var file = fs.createWriteStream(path + image);
    var request = http.get(url, function(response) {
        response.pipe(file);

        if(callback !== undefined) {
            callback();
        }
    });
}

function resParams() {
    $("#id_jeu").val('');
    $("#titre_jeu").val('');
    $("#type_jeu").val('');
    $("#editeur_jeu").val('');
    $("#developpeur_jeu").val('');
    $("#sortie_jeu").val('');
    $("#classification_jeu").val('');
    $("#emplacement_jeu").val('');
    $("#descriptif_jeu").val('');

    $("#pochette_jeu").attr('src', '');
    $("#background_jeu").attr('src', '');
    $("#screenshot_jeu").attr('src', '');

    var list = $.parseJSON(file.readFileSync('./games/gameapp.json'));
    list.sort(sortByTitle);

    $('#game_list').html('');
    for(var i = 0; i < list.length; i++) {
        $titre = $('<div/>').addClass('title').html(list[i].titre);

        $edit = $('<img/>').addClass('edit').attr('id_jeu', list[i].id).attr('src', 'css/images/edit.png');
        $suppr = $('<img/>').addClass('del').attr('id_jeu', list[i].id).attr('src', 'css/images/supprimer.png');
        $actions = $('<div/>').addClass('actions').append($edit).append($suppr);

        $bottom = $('<div/>').addClass('bottom').append($titre).append($actions);

        $pochette = $('<img/>').attr('src', list[i].image).addClass('pochette');

        $game = $('<div/>').addClass('game').attr('id', list[i].id).append($pochette).append($bottom);

        $('#game_list').append($game);
    }
}

function addslashes(str) {
    return (str + '').replace(/[\\"]/g, '\\$&').replace(/\u0000/g, '\\0');
}