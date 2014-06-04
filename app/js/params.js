jQuery(function($){
    var api = "http://nex12sz:GT4!V2cT@ws.jeuxvideo.com/";
    $('html *').not(':has(input), :has(textarea)').not('input, textarea').disableSelection();

    $("#addGame").button({icons: {primary: "ui-icon-plus"}});
    $("#addImage").button({icons: {primary: "ui-icon-image"}});

    $(".favoris").change(function() {
        if($(this).is(':checked')) {
            $.ajax({
                url: "ajax/update_favoris.php",
                type: "post",
                data: "etat=1&id="+$(this).val(),
                success: function(response) {
                    $("#errors").html(response);
                }
            });
        } else {
            $.ajax({
                url: "ajax/update_favoris.php",
                type: "post",
                data: "etat=0&id="+$(this).val(),
                success: function(response) {
                    $("#errors").html(response);
                }
            });
        }
    });


    /**
     * Ajouter un jeu
     */
    $("#addGame").click(function() {
        $("#dialogAddGame").dialog({
            title: "Ajouter un jeu",
            modal: true,
            closeOnEscape: false,
            resizable: false,
            width: 280,
            buttons: {
                Ajouter: function() {
                    $("#dialogAddGame #titre_game, #dialogAddGame #chemin_game").removeClass("invalid");
                    var valid = true;
                    var message = "";
                    var background = $("#dialogAddGame #background_game").val().split('.').pop();
                    var tete = $("#dialogAddGame #tete_game").val().split('.').pop();

                    if($.trim($("#dialogAddGame #titre_game").val()) == "") {
                        $("#dialogAddGame #titre_game").addClass("invalid");
                        message+= "Merci de rentrer le titre du jeu<br>";
                        valid = false;
                    }

                    if($.trim($("#dialogAddGame #chemin_game").val()) == "") {
                        $("#dialogAddGame #chemin_game").addClass("invalid");
                        message+= "Merci de rentrer le chemin d'accès du jeu<br>";
                        valid = false;
                    }

                    if($.trim($("#dialogAddGame #background_game").val()) == "") {
                        $("#dialogAddGame #background_game").addClass("invalid");
                        message+= "Veuillez sélectionner un background<br>";
                        valid = false;
                    } else if(background.toLowerCase() != "jpg" && background.toLowerCase() != "jpeg" && background.toLowerCase() != "png") {
                        message+= "Formats autorisés (*.jpg, *.jpeg ou *.png)<br>";
                        $("#dialogAddGame #background_game").addClass("invalid");
                        valid = false;
                    }

                    if($.trim($("#dialogAddGame #tete_game").val()) == "") {
                        message+= "Veuillez sélectionner une miniature<br>";
                        popup("Erreur", "Veuillez sélectionner une image", "alert", false);
                        $("#dialogAddGame #tete_game").addClass("invalid");
                        valid = false;
                    } else if(tete.toLowerCase() != "jpg" && tete.toLowerCase() != "jpeg" && tete.toLowerCase() != "png") {
                        message+= "Formats autorisés (*.jpg, *.jpeg ou *.png)<br>";
                        $("#dialogAddGame #tete_game").addClass("invalid");
                        valid = false;
                    }

                    if(valid) {
                        $("#dialogAddGame").dialog("close");
                        $("#dialogAddGame").dialog("destroy");

                        progressbar("Téléchargement des images en cours...<br/>Veuillez patienter");

                        $("#dialogAddGame").upload("ajax/add_game.php", function(data) {
                            $("#progressbarDialog").addClass("cache");
                            $("#progressbarDialog").dialog("close");

                            $("#crop").attr("src", data);

                            var api = $.Jcrop('#crop');

                            $("#DialCropUpload").dialog({
                                title: "Création de la miniature",
                                open: function(event, ui) {
                                    progressbar("Chargement de l'outil de rognage en cours...<br/>Veuillez patienter");

                                    $(".ui-dialog-titlebar-close").hide();

                                    api.setImage(data, function() {
                                        $("#progressbarDialog").addClass("cache");
                                        $("#progressbarDialog").dialog("close");

                                        api.setOptions({
                                            aspectRatio: 350 / 200,
                                            bgColor: 'black',
                                            bgOpacity: .4,
                                            keySupport: false,
                                            onSelect: updateCoords,
                                            onChange: updateCoords,
                                            setSelect: [0, 0, 350, 200]
                                        });
                                        api.focus();
                                    });
                                },
                                closeOnEscape: false,
                                resizable: false,
                                width: 800,
                                height: 600,
                                modal: true,
                                buttons: {
                                    "Terminer": function() {
                                        if(checkCoords()) {
                                            $.ajax({
                                                url: "ajax/crop_image.php",
                                                type: 'post',
                                                data: $("#formCrop").serialize(),
                                                success: function(response) {
                                                    api.destroy();

                                                    $("#DialCropUpload").dialog("close");
                                                    $("#DialCropUpload").dialog("destroy");

                                                    $("#crop").attr("src", "");
                                                    $("#formCrop input").val("");
                                                    $("#dialogAddGame #titre_game, #dialogAddGame #chemin_game, #dialogAddGame #background_game, #dialogAddGame #tete_game").val("");

                                                    popup("Succès", "Le jeu a été ajouté avec succès", "ok", false);

                                                    $("tbody").html(response);
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        });
                    } else {
                        popup("Erreur", message, "alert", false);
                    }
                },
                Annuler: function() {
                    $("input").removeClass("invalid");

                    $("#dialogAddGame").dialog("close");
                    $("#dialogAddGame").dialog("destroy");

                    $("#dialogAddGame #titre_game, #dialogAddGame #chemin_game, #dialogAddGame #background_game, #dialogAddGame #tete_game").val("");
                }
            }
        });
    });


    /**
     * Editer un jeu
     */
    $(document).on('click', '.edit', function() {
        var id = $(this).attr('id_game');

        $.ajax({
            url: "ajax/get_info.php",
            type: "post",
            data: "id="+id,
            success: function(response) {
                var json = $.parseJSON(response);

                $("#dialogEditGame #id_game").val(id);
                $("#dialogEditGame #titre_game").val(json.titre);
                $("#dialogEditGame #chemin_game").val(json.chemin);
                $("#dialogEditGame #description_game").val(json.description);
                $("#dialogEditGame #note_game").val(json.note);
                $("#dialogEditGame #editeur_game").val(json.editeur);
                $("#dialogEditGame #developpeur_game").val(json.developpeur);
                $("#dialogEditGame #type_game").val(json.type);
                $("#dialogEditGame #sortie_game").val(json.sortie);
                $("#dialogEditGame #classification_game").val(json.classification);
                $("#dialogEditGame #pochette_game").val(json.pochette);

                var screeshots = json.screeshots.split('#');
                $("#dialogEditGame #images input").val(screeshots[0]);
                for(var i = 1; i < screeshots.length; i++) {
                    $("#dialogEditGame #images").append('<input type="text" name="screenshots_game[]" value="'+screeshots[i]+'" class="mt5 w520 left" placeholder="http://image.jeuxvideo.com/images/pc/d/a/day-of-the-tentacle-pc-066.jpg"> <img src="img/del.png" alt="supprimer" title="Supprimer l\'image" class="delImage right mt5">');
                }

                $("#dialogEditGame").dialog({
                    title: "Editer un jeu",
                    modal: true,
                    closeOnEscape: false,
                    resizable: false,
                    width: 590,
                    height: 590,
                    buttons: {
                        Modifier: function() {
                            $("input, textarea").removeClass('invalid');
                            var valid = true;
                            var message = "";

                            if($.trim($("#dialogEditGame #titre_game").val()) == "") {
                                $("#dialogEditGame #titre_game").addClass("invalid");
                                message+= "Merci de rentrer le titre du jeu<br>";
                                valid = false;
                            }

                            if($.trim($("#dialogEditGame #chemin_game").val()) == "") {
                                $("#dialogEditGame #chemin_game").addClass("invalid");
                                message+= "Merci de rentrer le chemin d'accès du jeu<br>";
                                valid = false;
                            }

                            if(valid) {
                                progressbar("Téléchargement des images en cours...<br/>Veuillez patienter");

                                $.ajax({
                                    url: "ajax/edit_game.php",
                                    type: "post",
                                    data: $("#dialogEditGame form").serialize(),
                                    success: function(response) {
                                        $("#progressbarDialog").addClass("cache");
                                        $("#progressbarDialog").dialog("close");

                                        $("input, textarea").removeClass('invalid').val('');
                                        $("#images").html('<input type="text" name="screenshots_game[]" class="mt5 w520 left" placeholder="http://image.jeuxvideo.com/images/pc/d/a/day-of-the-tentacle-pc-066.jpg"> <img src="img/del.png" alt="supprimer" title="Supprimer l\'image" class="delImage right mt5">');

                                        popup("Succès", "Le jeu a été modifié avec succès", "ok", false);

                                        $("tbody").html(response);
                                    }
                                });

                                $("#dialogEditGame").dialog("close");
                                $("#dialogEditGame").dialog("destroy");
                            } else {
                                popup("Erreur", message, "alert", false);
                            }
                        },
                        Annuler: function() {
                            $("#dialogEditGame").dialog("close");
                            $("#dialogEditGame").dialog("destroy");

                            $("input, textarea").removeClass('invalid').val('');
                            $("#images").html('<input type="text" name="screenshots_game[]" class="mt5 w520 left" placeholder="http://image.jeuxvideo.com/images/pc/d/a/day-of-the-tentacle-pc-066.jpg"> <img src="img/del.png" alt="supprimer" title="Supprimer l\'image" class="delImage right mt5">');
                        }
                    }
                });
            }
        });
    });


    /**
     * Ajouter une image dans la fiche du jeu
     */
    $(document).on('click', '#addImage', function(e) {
        e.preventDefault();
        $("#images").append('<input type="text" name="screenshots_game[]" class="mt5 w520 left" placeholder="http://image.jeuxvideo.com/images/pc/d/a/day-of-the-tentacle-pc-066.jpg"> <img src="img/del.png" alt="supprimer" title="Supprimer l\'image" class="delImage right mt5">');
    });


    /**
     * Supprimer une image
     */
    $(document).on('click', '.delImage', function() {
        var i = 0;
        $(".delImage").each(function() {
            i++;
        });

        if(i > 1) {
            $(this).prev().remove();
            $(this).remove();
        }
    });


    /**
     * Supprimer un jeu
     */
    $(document).on('click', '.del', function() {
        var id = $(this).attr('id_game');
        var image = $(this).attr('image');

        $("#DialConfirmation").dialog({
            title: "Supprimer un jeu",
            modal: true,
            closeOnEscape: false,
            resizable: false,
            width: 280,
            buttons: {
                Oui: function() {
                    $("#DialConfirmation").dialog("close");
                    $("#DialConfirmation").dialog("destroy");

                    $.ajax({
                        url: "ajax/del_game.php",
                        type: "post",
                        data: "id="+id+"&image="+image,
                        success: function(response) {
                            $("tbody").html(response);
                        }
                    });
                },
                Non: function() {
                    $("#DialConfirmation").dialog("close");
                    $("#DialConfirmation").dialog("destroy");
                }
            }
        });
    });
});