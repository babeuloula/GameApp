<?php

    require_once 'include/fonctions.php';
    require_once 'class/config.class.php';

?><!DOCTYPE HTML>

<html lang="fr">

    <head>

        <title>Paramètres &bull; GameApp</title>

        <link rel="shortcut icon" type="image/png" href="img/gameapp.png">

        <link title="defaut" type="text/css" rel="stylesheet" href="css/reset.css" media="screen">
        <link title="defaut" type="text/css" rel="stylesheet" href="css/jquery-ui.css" media="screen">
        <link title="defaut" type="text/css" rel="stylesheet" href="css/fontface.css" media="screen">
        <link title="defaut" type="text/css" rel="stylesheet" href="js/jcrop/jquery.Jcrop.css" media="screen">
        <link title="defaut" type="text/css" rel="stylesheet" href="css/params.css" media="screen">

        <META CHARSET="UTF-8">
        <META NAME="VIEWPORT" CONTENT="WIDTH=DEVICE-WIDTH, INITIAL-SCALE=1.0">
        <META NAME="KEYWORDS" CONTENT="">
        <META NAME="DESCRIPTION" CONTENT="">
        <META NAME="AUTHOR" CONTENT="Com Euro-Concept, comeuroconcept.fr création de site internet Lyon L'Arbresle">
        <META NAME="REVISIT-AFTER" CONTENT="7 DAYS">
        <META NAME="ROBOTS" CONTENT="ALL">

    </head>

    <body>

        <h1>Paramètres</h1>

        <div id="container">
            <button id="addGame">Ajouter un jeu</button>

            <table style="width: 100%">
                <thead>
                    <tr>
                        <th style="width: 60%">Titre du jeu</th>
                        <th style="width: 20%">Favoris</th>
                        <th style="width: 20%">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <?php afficher_games(); ?>
                </tbody>
            </table>
        </div>

        <div id="errors"></div>

        <!-- POPUPS -->
            <div id="dialogAddGame" class="cache">
                <label>Titre du jeu</label>
                <input type="text" name="titre_game" id="titre_game" placeholder="Day of the tentacle" class="w250">

                <label class="mt10">Chemin d'accès du jeu</label>
                <input type="text" name="chemin_game" id="chemin_game" placeholder="C:\Program Files (x86)\scummvm.exe" class="w250">

                <label class="mt10">Image de fond</label>
                <input type="file" name="background_game" id="background_game" class="w250">

                <label class="mt10">Miniature</label>
                <input type="file" name="tete_game" id="tete_game" class="w250">
            </div>

            <div id="dialogEditGame" class="cache">
                <form style="width: 550px">
                    <input type="hidden" id="id_game" name="id">

                    <div class="left">
                        <label>Titre du jeu</label>
                        <input type="text" name="titre_game" id="titre_game" placeholder="Day of the tentacle" class="w250">
                    </div>

                    <div class="right">
                        <label>Chemin d'accès du jeu</label>
                        <input type="text" name="chemin_game" id="chemin_game" placeholder="C:\Program Files (x86)\scummvm.exe" class="w250">
                    </div>

                    <div class="clear"></div>

                    <label class="mt10">Description du jeu</label>
                    <textarea id="description_game" name="description_game" placeholder="Day of the Tentacle est un jeu d'aventure sur PC faisant suite à Maniac Mansion. On y retrouve d'ailleurs le personnage de Bernard qui, accompagné par deux amis Hoogie et Laverne, devra sauver l'humanité de l'emprise des tentacules créés par le Dr Fred. Humour, anachronismes et voyages dans le temps sont au programme du jeu aux graphismes cartoon."></textarea>

                    <div class="clear"></div>

                    <div class="left">
                        <label class="mt10">Note du jeu</label>
                        <input type="text" name="note_game" id="note_game" maxlength="5" placeholder="19/20" class="w250">

                        <label class="mt10">Editeur du jeu</label>
                        <input type="text" name="editeur_game" id="editeur_game" class="w250" placeholder="LucasArts">

                        <label class="mt10">Développeur du jeu</label>
                        <input type="text" name="developpeur_game" id="developpeur_game" class="w250" placeholder="LucasArts">
                    </div>

                    <div class="right">
                        <label class="mt10">Type du jeu</label>
                        <input type="text" name="type_game" id="type_game" class="w250" placeholder="Aventure">

                        <label class="mt10">Sortie du jeu</label>
                        <input type="text" name="sortie_game" id="sortie_game" class="w250" placeholder="1993">

                        <label class="mt10">Classification du jeu</label>
                        <input type="text" name="classification_game" id="classification_game" class="w250" placeholder="Tout public">
                    </div>

                    <div class="clear"></div>

                    <label class="mt10">URL de la pochette du jeu</label>
                    <input type="text" name="pochette_game" id="pochette_game" class="w520" placeholder="http://image.jeuxvideo.com/images/pc/d/o/dottpc0f.jpg">

                    <label class="mt10">Images du jeu</label>
                    <button id="addImage">Ajouter un image</button>
                    <div id="images">
                        <input type="text" name="screenshots_game[]" class="mt5 w520 left" placeholder="http://image.jeuxvideo.com/images/pc/d/a/day-of-the-tentacle-pc-066.jpg"> <img src="img/del.png" alt="supprimer" title="Supprimer l'image" class="delImage right mt5">
                    </div>
                </form>
            </div>










            <div id="DialMessage" class="cache">
                <p>
                    <span id="IconePopup" style="float:left; margin:0 7px 40px 0;"></span>
                    <span id="TextePopup"></span></p>
            </div>

            <div id="DialConfirmation" class="cache" title="Confirmation">
                <p>
                    <span id="IconePopupConfirm" style="float:left; margin:0 7px 40px 0;" class="ui-icon ui-icon-alert"></span>
                    <span id="TextePopupConfirm">Êtes-vous sûr de vouloir supprimer le jeu ?</span></p>
            </div>

            <div id="progressbarDialog" class="cache">
                <div id="progressbar">
                    <center><img src="img/ajax-loader.gif"></center>
                </div>
                <div id="loading" style="text-align:center; margin-top:10px;"></div>
            </div>

            <div id="DialCropUpload" class="cache" style="text-align: center;">
                <img id="crop" style="display: none;" src="">

                <form id="formCrop">
                    <input type="hidden" id="x" name="x">
                    <input type="hidden" id="y" name="y">
                    <input type="hidden" id="w" name="w">
                    <input type="hidden" id="h" name="h">
                </form>
            </div>
        <!-- POPUPS -->

        <script type="text/javascript" src="js/jquery.js"></script>
        <script type="text/javascript" src="js/jquery-ui.js"></script>
        <script type="text/javascript" src="js/jquery.upload.js"></script>
        <script type="text/javascript" src="js/jcrop/jquery.Jcrop.js"></script>
        <script type="text/javascript" src="js/fonctions.js"></script>
        <script type="text/javascript" src="js/params.js"></script>

    </body>

</html>