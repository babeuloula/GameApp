function popup(title, text, type, reload) {
    switch(type) {
        case "ok"    :
            var icone = "ui-icon ui-icon-circle-check";
            var titre = title;
            break;
        case "alert" :
            var icone = "ui-icon ui-icon-alert";
            var titre = "Erreur";
            break;
        default :
            if(type != "") {
                var icone = "ui-icon "+type;
            } else {
                var icone = "";
            }
            var titre = title;
            break;
    }

    $("#TextePopup").html(text);
    $("#IconePopup").removeAttr("class");
    $("#IconePopup").addClass(icone);

    $("#DialMessage").dialog({
        title: titre,
        modal: true,
        resizable: false,
        width: '280',
        height: 'auto',
        buttons: {
            OK: function(){
                $(this).dialog("close");
                $(this).dialog("destroy");

                if(reload) {
                    javascript:location.reload();
                }
            }
        }
    });
}

function progressbar(texte) {
    if(texte == "" || texte == null) {
        $("#loading").html("Chargement en cours...<br/>Veuillez patienter");
    } else {
        $("#loading").html(texte);
    }

    $("#progressbarDialog").removeAttr("class");

    $("#progressbarDialog:ui-dialog").dialog("destroy");
    $("#progressbarDialog").dialog({
        autoOpen: true,
        modal: true,
        resizable: false,
        height:120,
        width:280,
        open: function(event, ui){
            $("#progressbarDialog").prev("div").hide();
        }
    });
}

function updateCoords(c) {
    $('#x').val(c.x);
    $('#y').val(c.y);
    $('#w').val(c.w);
    $('#h').val(c.h);
}

function checkCoords() {
    if (parseInt($('#w').val()) != "0") {
        return true;
    } else {
        popup("Erreur", "Veuillez sélectionner une zone à redimentionner", "alert", false);
        return false;
    }
}