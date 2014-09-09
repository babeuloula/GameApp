jQuery(function($){
    var json = $.parseJSON(file.readFileSync('games/gameapp.json'));
    json.sort(sortByTitle);

    for(var i = 0; i < json.length; i++) {
        $edit = $('<img/>').addClass('edit').attr('id_jeu', json[i].id).attr('src', 'css/images/edit.png');
        $suppr = $('<img/>').addClass('del').attr('id_jeu', json[i].id).attr('src', 'css/images/supprimer.png');

        $titre = $('<td/>').addClass('title').html(json[i].titre);
        $actions = $('<td/>').addClass('actions').append($edit).append($suppr);

        $tr = $('<tr/>').attr('id', json[i].id).append($titre).append($actions);
        $('#game_list').append($tr);
    }

    $(document).on('click', '#game_add_btn', function() {
        $("#select_game").fadeTo(0, 1);
        $("#enregsitrer_jeu").show();
        $("#modifier_jeu").hide();

        if($.trim($('#game_title').val()) === '') {
            popup('Vous devez rentrer le nom d\'un jeu');
        } else {
            dns.resolve('http://www.babeuloula.fr', function(err) {
                if (err) {
                    // Connecté
                    loading('scrap', 'Chargement des jeux en cours');

                    request('http://nex12sz:GT4!V2cT@ws.jeuxvideo.com/search_n/'+$.trim($('#game_title').val()), function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            if($(body).find('res_machine').length === 0) {
                                loadingEnd('scrap', function() {
                                    popup('Aucun jeux ne correspond a votre recherche');
                                });
                            } else {
                                var found = false;

                                $(body).find('res_machine').each(function() {
                                    if($(this).children('id_machine').text() === $("#game_platforme").val()) {
                                        found = true;
                                        var first = true;
                                        $("#select_game").html('');

                                        $(this).children('res_jeux').children('jeu').each(function() {
                                            var id = $(this).children('id_jeu').html();
                                            var titre = $(this).children('nom_jeu').html().replace('<!--[CDATA[', '').replace(']]-->', '');

                                            $("#select_game").append($('<option/>').val(id).html(titre));

                                            if(first) {
                                                first = false;
                                                getGameInfos(id, function(infos) {
                                                    $("#id_jeu").val(infos.id);
                                                    $("#titre_jeu").val(infos.titre);
                                                    $("#type_jeu").val(infos.type);
                                                    $("#editeur_jeu").val(infos.editeur);
                                                    $("#developpeur_jeu").val(infos.developpeur);
                                                    $("#sortie_jeu").val(infos.sortie);
                                                    $("#classification_jeu").val(infos.classification);
                                                    $("#descriptif_jeu").val(infos.descriptif);

                                                    $("#pochette_jeu").attr('src', infos.pochette);
                                                    $("#background_jeu").attr('src', infos.background);
                                                    $("#screenshot_jeu").attr('src', infos.screenshot);

                                                    loadingEnd('scrap', function() {
                                                        $("#popup_game").fadeIn(400);
                                                    });
                                                });
                                            }
                                        });
                                    }
                                });

                                if(!found) {
                                    loadingEnd('scrap', function() {
                                        popup('Aucun jeux ne correspond a votre recherche');
                                    });
                                }

                                $('#select_game').change(function() {
                                    loading('scrap', 'Chargement des informations du jeu en cours');

                                    getGameInfos($(this).val(), function(infos) {
                                        $("#id_jeu").val(infos.id);
                                        $("#titre_jeu").val(infos.titre);
                                        $("#type_jeu").val(infos.type);
                                        $("#editeur_jeu").val(infos.editeur);
                                        $("#developpeur_jeu").val(infos.developpeur);
                                        $("#sortie_jeu").val(infos.sortie);
                                        $("#classification_jeu").val(infos.classification);
                                        $("#descriptif_jeu").val(infos.descriptif);

                                        $("#pochette_jeu").attr('src', infos.pochette);
                                        $("#background_jeu").attr('src', infos.background);
                                        $("#screenshot_jeu").attr('src', infos.screenshot);

                                        loadingEnd('scrap', function() {
                                            $("#popup_game").fadeIn(400);
                                        });
                                    });
                                });
                            }
                        }
                    });
                } else {
                    // Non connecté
                    popup("Il vous faut Internet pour ajouter un jeu");
                }
            });
        }
    });

    $(document).on('click', '#annuler_jeu', function() {
        $("#popup_game").fadeOut(400, function() {
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
        });
    });

    $(document).on('click', '#enregsitrer_jeu, #modifier_jeu', function() {
        var id = $(this).attr('id').replace('#', '');
        var valid = true;
        var message = '';

        if($.trim($("#titre_jeu").val()) === '') {
            valid = false;
            message+= "Vous devez rentrer le nom du jeu<br>";
        }

        if($.trim($("#emplacement_jeu").val()) === '') {
            valid = false;
            message+= "Vous devez rentrer l'emplacement du jeu<br>";
        }

        if(valid) {
            if(id === "enregsitrer_jeu") {
                $("#popup_game").fadeOut(400, function() {
                    loading('download', 'Enregistrement du jeu en cours');
                    var json = file.readFileSync('games/gameapp.json');

                    var new_game = ',{' +
                                        '"id": '+$("#id_jeu").val()+','+
                                        '"image": "'+'../games/images/'+$("#id_jeu").val()+'/pochette/'+$("#pochette_jeu").attr('src').split('/').pop()+'",'+
                                        '"path": "'+addslashes($("#emplacement_jeu").val())+'",'+
                                        '"background": "'+'../games/backgrounds/'+$("#id_jeu").val()+'/'+$("#background_jeu").attr('src').split('/').pop()+'",'+
                                        '"screenshot": "'+'../games/images/'+$("#id_jeu").val()+'/'+$("#screenshot_jeu").attr('src').split('/').pop()+'",'+
                                        '"titre": "'+addslashes($("#titre_jeu").val())+'",'+
                                        '"type": "'+addslashes($("#type_jeu").val())+'",'+
                                        '"editeur": "'+addslashes($("#editeur_jeu").val())+'",'+
                                        '"developpeur": "'+addslashes($("#developpeur_jeu").val())+'",'+
                                        '"sortie": "'+addslashes($("#sortie_jeu").val())+'",'+
                                        '"classification": "'+addslashes($("#classification_jeu").val())+'",'+
                                        '"descriptif": "'+addslashes($("#descriptif_jeu").val())+'"'+
                                    '}';
                    json = json.replace(']', '') + new_game + ']';

                    fs.writeFileSync('games/gameapp.json', json);

                    if(!fs.existsSync('games/backgrounds/'+$("#id_jeu").val()+'/')) {
                        fs.mkdirSync('games/backgrounds/'+$("#id_jeu").val()+'/');
                    }

                    if(!fs.existsSync('games/images/'+$("#id_jeu").val()+'/')) {
                        fs.mkdirSync('games/images/'+$("#id_jeu").val()+'/');
                    }

                    if(!fs.existsSync('games/images/'+$("#id_jeu").val()+'/pochette/')) {
                        fs.mkdirSync('games/images/'+$("#id_jeu").val()+'/pochette/');
                    }

                    var dlBackground = false;
                    var dlScreenshot = false;
                    var dlPochette   = false;

                    if($("#background_jeu").attr('src') === 'css/images/gameapp.jpg') {
                        fs.createReadStream('app/css/images/gameapp.jpg').pipe(fs.createWriteStream('games/backgrounds/'+$("#id_jeu").val()+'/gameapp.jpg'));
                        dlBackground = true;
                    } else {
                        downloadImage('games/backgrounds/'+$("#id_jeu").val()+'/', $("#background_jeu").attr('src'), function() {
                            dlBackground = true;
                        });
                    }

                    if($("#screenshot_jeu").attr('src') === 'css/images/gameapp.jpg') {
                        fs.createReadStream('app/css/images/gameapp.jpg').pipe(fs.createWriteStream('games/backgrounds/'+$("#id_jeu").val()+'/gameapp.jpg'));
                        dlScreenshot = true;
                    } else {
                        downloadImage('games/images/'+$("#id_jeu").val()+'/', $("#screenshot_jeu").attr('src'), function() {
                            dlScreenshot = true;
                        });
                    }

                    if($("#pochette_jeu").attr('src') === 'css/images/no_pochette.jpg') {
                        fs.createReadStream('app/css/images/no_pochette.jpg').pipe(fs.createWriteStream('games/backgrounds/'+$("#id_jeu").val()+'/no_pochette.jpg'));
                        dlPochette = true;
                    } else {
                        downloadImage('games/images/'+$("#id_jeu").val()+'/pochette/', $("#pochette_jeu").attr('src'), function() {
                            dlPochette = true;
                        });
                    }

                    var checkClose = setInterval(function() {
                        if(dlBackground && dlScreenshot && dlPochette) {
                            clearInterval(checkClose);

                            resParams();
                            loadingEnd('download');
                        }
                    }, 100)


                });
            } else {
                $("#popup_game").fadeOut(400, function() {
                    loading('download', 'Enregistrement du jeu en cours');

                    var json = file.readFileSync('games/gameapp.json');
                    var parseJSON = $.parseJSON(json);
                    var final = '[';

                    for(var i = 0; i < parseJSON.length; i++) {
                        if(parseJSON[i].id !== parseInt($("#id_jeu").val(), 10)) {
                            final+= '{' +
                                        '"id": '+parseJSON[i].id+','+
                                        '"image": "'+parseJSON[i].image+'",'+
                                        '"path": "'+addslashes(parseJSON[i].path)+'",'+
                                        '"background": "'+parseJSON[i].background+'",'+
                                        '"screenshot": "'+parseJSON[i].screenshot+'",'+
                                        '"titre": "'+addslashes(parseJSON[i].titre)+'",'+
                                        '"type": "'+addslashes(parseJSON[i].type)+'",'+
                                        '"editeur": "'+addslashes(parseJSON[i].editeur)+'",'+
                                        '"developpeur": "'+addslashes(parseJSON[i].developpeur)+'",'+
                                        '"sortie": "'+addslashes(parseJSON[i].sortie)+'",'+
                                        '"classification": "'+addslashes(parseJSON[i].classification)+'",'+
                                        '"descriptif": "'+addslashes(parseJSON[i].descriptif)+'"'+
                                   '},';
                        }
                    }

                    final+= '{' +
                                '"id": '+$("#id_jeu").val()+','+
                                '"image": "'+$("#pochette_jeu").attr('src')+'",'+
                                '"path": "'+addslashes($("#emplacement_jeu").val())+'",'+
                                '"background": "'+$("#background_jeu").attr('src')+'",'+
                                '"screenshot": "'+$("#screenshot_jeu").attr('src')+'",'+
                                '"titre": "'+addslashes($("#titre_jeu").val())+'",'+
                                '"type": "'+addslashes($("#type_jeu").val())+'",'+
                                '"editeur": "'+addslashes($("#editeur_jeu").val())+'",'+
                                '"developpeur": "'+addslashes($("#developpeur_jeu").val())+'",'+
                                '"sortie": "'+addslashes($("#sortie_jeu").val())+'",'+
                                '"classification": "'+addslashes($("#classification_jeu").val())+'",'+
                                '"descriptif": "'+addslashes($("#descriptif_jeu").val())+'"'+
                           '}]';

                    fs.writeFileSync('games/gameapp.json', final);

                    resParams();
                    loadingEnd('download');
                });
            }
        } else {
            popup(message);
        }
    });

    $(document).on('click', '.edit', function() {
        var that = $(this);

        loading('scrap', 'Chargement des informations du jeu en cours');

        $("#enregsitrer_jeu").hide();
        $("#modifier_jeu").show();
        $("#select_game").fadeTo(0, 0);

        var json = $.parseJSON(file.readFileSync('games/gameapp.json'));

        for(var i = 0; i < json.length; i++) {
            if(json[i].id === parseInt(that.attr('id_jeu'), 10)) {
                $("#id_jeu").val(json[i].id);
                $("#titre_jeu").val(json[i].titre);
                $("#type_jeu").val(json[i].type);
                $("#editeur_jeu").val(json[i].editeur);
                $("#developpeur_jeu").val(json[i].developpeur);
                $("#sortie_jeu").val(json[i].sortie);
                $("#classification_jeu").val(json[i].classification);
                $("#emplacement_jeu").val(json[i].path);
                $("#descriptif_jeu").val(json[i].descriptif);

                $("#pochette_jeu").attr('src', json[i].image);
                $("#background_jeu").attr('src', json[i].background);
                $("#screenshot_jeu").attr('src', json[i].screenshot);

                loadingEnd('scrap', function() {
                    $("#popup_game").fadeIn(400);
                });
            }
        }

    });

    $(document).on('click', '.del', function() {
        var that = $(this);

        loading('confirmation', 'Êtes-vous sûr de vouloir supprimer le jeu ?');

        $(document).on('click', "#delGame #oui", function() {
            loadingEnd('confirmation');

            var json = file.readFileSync('games/gameapp.json');
            var parseJSON = $.parseJSON(json);
            var final = '[';

            for(var i = 0; i < parseJSON.length; i++) {
                if(parseJSON[i].id !== parseInt(that.attr('id_jeu'), 10)) {
                    final+= '{' +
                        '"id": '+parseJSON[i].id+','+
                        '"image": "'+parseJSON[i].image+'",'+
                        '"path": "'+addslashes(parseJSON[i].path)+'",'+
                        '"background": "'+parseJSON[i].background+'",'+
                        '"screenshot": "'+parseJSON[i].screenshot+'",'+
                        '"titre": "'+addslashes(parseJSON[i].titre)+'",'+
                        '"type": "'+addslashes(parseJSON[i].type)+'",'+
                        '"editeur": "'+addslashes(parseJSON[i].editeur)+'",'+
                        '"developpeur": "'+addslashes(parseJSON[i].developpeur)+'",'+
                        '"sortie": "'+addslashes(parseJSON[i].sortie)+'",'+
                        '"classification": "'+addslashes(parseJSON[i].classification)+'",'+
                        '"descriptif": "'+addslashes(parseJSON[i].descriptif)+'"'+
                        '},';
                }
            }

            final = final.slice(0, -1);
            final+= "]";

            fs.writeFileSync('games/gameapp.json', final);

            resParams();
            loadingEnd('download');
        });

        $(document).on('click', "#delGame #non", function() {
            loadingEnd('confirmation');
        });
    });

    $(document).on('click', '#popup #ok', function() {
        loadingEnd('popup');
    })
});