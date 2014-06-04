function loadImage(image) {
    var img = new Image();
    return img.src = image;
}

jQuery(function($){
    $('html *').not(':has(input)').not('input').disableSelection();

    $(document).ready(function() {
        $.ajax({
            url: "games.data",
            success: function(response) {
                var games = $.parseHTML(response);

                $("#favoris").html($(games[0]).html());
                $("#autres").html($(games[1]).html());

                $("#loadingApp").fadeOut(150, function() {
                    $("#container").fadeIn(150);
                    $('html').css('background', 'url("games/backgrounds/'+$(".game.active .image").attr('id_game')+'/'+$(".game.active .image").attr('background')+'") #000 center center no-repeat fixed');
                });
            }
        });
    });

    $(document).keyup(function(e) {
        if($("#container").is(':visible')) {
            switch(e.keyCode) {
                // Echap 27
                case 27:
                    if(!$("#containerGameInfos").is(':visible')) {
                        if($("#containerMenu").is(':visible')) {
                            $("#containerMenu").css('top', $(document).scrollTop() + 'px').fadeOut(150);
                        } else {
                            $("#containerMenu").css('top', $(document).scrollTop() + 'px').fadeIn(150);
                        }
                    }

                    break;

                // Haut 38
                case 38:
                    if(!$("#containerMenu").is(':visible') && !$("#containerGameInfos").is(':visible')) {
                        if($("#favoris").html() != "" && $("#autres").html() != "") {
                            var parent = $(".game.active").parent().attr('id');
                            $game = $(".game.active")
                                                .removeClass('active')
                                                .prev('.game').prev('.game').prev('.game').prev('.game')
                                                .addClass('active');

                            if($game.children('.image').attr('background') === undefined) {
                                if(parent == "autres") {
                                    $game = $("#favoris").children().last().addClass('active');
                                    $('html').css('background', 'url("games/backgrounds/'+$game.children('.image').attr('id_game')+'/'+$game.children('.image').attr('background')+'") #000 center center no-repeat fixed');
                                } else {
                                    $game = $("#favoris").children().first().addClass('active');
                                    $('html').css('background', 'url("games/backgrounds/'+$game.children('.image').attr('id_game')+'/'+$game.children('.image').attr('background')+'") #000 center center no-repeat fixed');
                                }
                            } else {
                                $('html').css('background', 'url("games/backgrounds/'+$game.children('.image').attr('id_game')+'/'+$game.children('.image').attr('background')+'") #000 center center no-repeat fixed');
                            }

                            $('html, body').animate({
                                scrollTop: $(".game.active").position().top - 212
                            }, 50);
                        }
                    }

                    break;

                // Bas 40
                case 40:
                    if(!$("#containerMenu").is(':visible') && !$("#containerGameInfos").is(':visible')) {
                        if($("#favoris").html() != "" && $("#autres").html() != "") {
                            var parent = $(".game.active").parent().attr('id');
                            $game = $(".game.active")
                                                .removeClass('active')
                                                .next('.game').next('.game').next('.game').next('.game')
                                                .addClass('active');

                            if($game.children('.image').attr('background') === undefined) {
                                if(parent == "favoris") {
                                    $game = $("#autres").children().first().addClass('active');
                                    $('html').css('background', 'url("games/backgrounds/'+$game.children('.image').attr('id_game')+'/'+$game.children('.image').attr('background')+'") #000 center center no-repeat fixed');
                                } else {
                                    $game = $("#autres").children().last().addClass('active');
                                    $('html').css('background', 'url("games/backgrounds/'+$game.children('.image').attr('id_game')+'/'+$game.children('.image').attr('background')+'") #000 center center no-repeat fixed');
                                }
                            } else {
                                $('html').css('background', 'url("games/backgrounds/'+$game.children('.image').attr('id_game')+'/'+$game.children('.image').attr('background')+'") #000 center center no-repeat fixed');
                            }

                            $('html, body').animate({
                                scrollTop: $(".game.active").position().top - 212
                            }, 50);
                        }
                    }

                    break;

                // Gauche 37
                case 37:
                    if(!$("#containerMenu").is(':visible') && !$("#containerGameInfos").is(':visible')) {
                        if($("#favoris").html() != "" && $("#autres").html() != "") {
                            if(!$(".game.active").is(':first-child')) {
                                $game = $(".game.active")
                                                    .removeClass('active')
                                                    .prev('.game')
                                                    .addClass('active');
                                $('html').css('background', 'url("games/backgrounds/'+$game.children('.image').attr('id_game')+'/'+$game.children('.image').attr('background')+'") #000 center center no-repeat fixed');
                            } else {
                                if($(".game.active").parent().attr('id') == "autres") {
                                    $game = $(".game.active").removeClass('active').parent().prev().prev().prev().children('.game').last().addClass('active');
                                    $('html').css('background', 'url("games/backgrounds/'+$game.children('.image').attr('id_game')+'/'+$game.children('.image').attr('background')+'") #000 center center no-repeat fixed');
                                }
                            }

                            $('html, body').animate({
                                scrollTop: $(".game.active").position().top - 212
                            }, 50);
                        }
                    } else {
                        if(!$("#containerGameInfos").is(':visible')) {
                            if($("#containerMenu .active").attr('id') == "quitter") {
                                $("#quitter img").attr('src', $("#quitter img").attr('src').replace('_hover.png', '.png'));
                                $("#quitter").removeClass('active');

                                $("#params img").attr('src', $("#params img").attr('src').replace('.png', '_hover.png'));
                                $("#params").addClass('active');
                            }
                        }
                    }

                    break;

                // Droite 39
                case 39:
                    if(!$("#containerMenu").is(':visible') && !$("#containerGameInfos").is(':visible')) {
                        if($("#favoris").html() != "" && $("#autres").html() != "") {
                            if(!$(".game.active").is(':last-child')) {
                                $game = $(".game.active")
                                                    .removeClass('active')
                                                    .next('.game')
                                                    .addClass('active');
                                $('html').css('background', 'url("games/backgrounds/'+$game.children('.image').attr('id_game')+'/'+$game.children('.image').attr('background')+'") #000 center center no-repeat fixed');
                            } else {
                                if($(".game.active").parent().attr('id') == "favoris") {
                                    $game = $(".game.active").removeClass('active').parent().next().next().next().children('.game').first().addClass('active');
                                    $('html').css('background', 'url("games/backgrounds/'+$game.children('.image').attr('id_game')+'/'+$game.children('.image').attr('background')+'") #000 center center no-repeat fixed');
                                }
                            }

                            $('html, body').animate({
                                scrollTop: $(".game.active").position().top - 212
                            }, 50);
                        }
                    } else {
                        if(!$("#containerGameInfos").is(':visible')) {
                            if($("#containerMenu .active").attr('id') == "params") {
                                $("#params img").attr('src', $("#params img").attr('src').replace('_hover.png', '.png'));
                                $("#params").removeClass('active');

                                $("#quitter img").attr('src', $("#quitter img").attr('src').replace('.png', '_hover.png'));
                                $("#quitter").addClass('active');
                            }
                        }
                    }

                    break;

                // Entrée
                case 13:
                    if(!$("#containerMenu").is(':visible')) {
                        if($("#containerGameInfos").is(':visible')) {
                            $("#containerGameInfos").css('top', $(document).scrollTop() + 'px').fadeOut(150, function() {
                                $("#containerLoading").css('top', $(document).scrollTop() + 'px').fadeIn(150);

                                if($(".game.active .image").attr('chemin').indexOf('://') > 0 && $(".game.active .image").attr('chemin') != "") {
                                    $(location).attr('href', $(".game.active .image").attr('chemin'));
                                } else {
                                    child = execFile($(".game.active .image").attr('chemin'), function(error,stdout,stderr) {
                                        if (error) {
                                            console.log(error.stack);
                                            console.log('Error code: '+ error.code);
                                            console.log('Signal received: '+
                                                error.signal);
                                        }
                                        console.log('Child Process stdout: '+ stdout);
                                        console.log('Child Process stderr: '+ stderr);

                                        setTimeout(function() {
                                            $("#containerLoading").fadeOut(150);
                                        }, 15000);
                                    });

                                    child.on('exit', function (code) {
                                        console.log('Child process exited with exit code '+ code);
                                    });
                                }
                            });
                        } else {
                            var pochette = $(".game.active .image").attr('pochette').split('/').pop();
                            $('.pochette .front').attr('src', 'games/images/'+$(".game.active .image").attr('id_game')+'/'+pochette);

                            $('.infos .titre').html($(".game.active .titre").html());
                            $('.infos .sortie').html($(".game.active .image").attr('sortie'));
                            $('.infos .note').html($(".game.active .image").attr('note'));
                            $('.infos .editeur').html('<label>Editeur</label> ' + $(".game.active .image").attr('editeur'));
                            $('.infos .developpeur').html('<label>Développeur</label> ' + $(".game.active .image").attr('developpeur'));
                            $('.infos .type').html('<label>Type</label> ' + $(".game.active .image").attr('type'));
                            $('.infos .classification').html('<label>Classification</label> ' + $(".game.active .image").attr('classification'));
                            $('.infos .description').html($(".game.active .image").attr('description'));

                            $('.infos .carrousel').html('');
                            var carrousel = $(".game.active .image").attr('screenshots').split('#');
                            for(var c = 0; c < carrousel.length; c++) {
                                var screenshot = carrousel[c].split('/').pop();

                                $img = $("<div/>").html($("<img/>").attr('src', 'games/images/'+$(".game.active .image").attr('id_game')+'/'+screenshot).width(130)).width(130);
                                $('.infos .carrousel').append($img);
                            }

                            $("#containerGameInfos").css('top', $(document).scrollTop() + 'px').fadeIn(150);

                            $('.carrousel').slick({
                                infinite: true,
                                slidesToShow: 3,
                                slidesToScroll: 3,
                                autoplay: true,
                                autoplaySpeed: 2000,
                                speed: 500,
                                accessibility: false,
                                arrows: false,
                                draggable: false,
                                pauseOnHover: false
                            });
                        }
                    } else {
                        if($("#menu .active").attr('id') == "params") {
                            // Si on est sur le bouton params, on lance les paramètres
                            child = execFile("params.exe", function(error,stdout,stderr) {
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

                                $.ajax({
                                    url: "games.data",
                                    success: function(response) {
                                        var games = $.parseHTML(response);

                                        $("#favoris").html($(games[0]).html());
                                        $("#autres").html($(games[1]).html());

                                        $('html').css('background', 'url("games/backgrounds/'+$(".game.active .image").attr('id_game')+'/'+$(".game.active .image").attr('background')+'") #000 center center no-repeat fixed');
                                    }
                                });
                            });
                        } else {
                            // Sinon on quitte l'application
                            gui.App.quit();
                        }
                    }

                    break;

                // Backspace
                case 8:
                    if($("#containerGameInfos").is(':visible')) {
                        $("#containerGameInfos").css('top', $(document).scrollTop() + 'px').fadeOut(150, function() {
                            $('.carrousel').unslick();
                        });
                    }
                    break;
            }
        }
    }).keydown(function(e) { if (e.which == 8) { e.preventDefault(); } });
});