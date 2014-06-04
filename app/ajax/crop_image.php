<?php

    require_once '../include/fonctions.php';
    require_once '../class/config.class.php';
    require_once '../class/game.class.php';

    session_start();
    $image = $_SESSION['image']['tete'];
    $extention = $_SESSION['image']['extentionT'];
    $content_dir = $_SESSION['image']['pathT'];
    $file = $content_dir . $image . "." . $extention;

    $targ_w = 350;
    $targ_h = 200;

    $img_r = imagecreatefromjpeg($file);
    $dst_r = ImageCreateTrueColor($targ_w, $targ_h);

    imagecopyresampled($dst_r, $img_r, 0, 0, $_POST['x'], $_POST['y'], $targ_w, $targ_h, $_POST['w'], $_POST['h']);

    imagejpeg($dst_r, $file, 100);

    $config = new database("../games/");
    
    if($config) {
        $db = $config->getDataBase();
    
        $game = $db->prepare("INSERT INTO game (titre_game, chemin_game, background_game, tete_game, is_favoris_game)
                              VALUES ('".sqlite_escape_string($_SESSION['image']['titre'])."', '".$_SESSION['image']['chemin']."', '".$_SESSION['image']['background'] . "." . $_SESSION['image']['extentionBG']."', '".$_SESSION['image']['tete'] . "." . $_SESSION['image']['extentionT']."', '0')");
        $game->execute();
        $lastID = $db->lastInsertId();
        $game->closeCursor();

        mkdir('../games/images/'.$lastID.'/');
        mkdir('../games/backgrounds/'.$lastID.'/');
        mkdir('../games/thumbs/'.$lastID.'/');

        $game_info = $db->prepare("INSERT INTO game_info (id_game, id_game_jvc, pochette_game_info, description_game_info, note_game_info, editeur_game_info, developpeur_game_info, type_game_info, sortie_game_info, classification_game_info, screenshots_game_info)
                                   VALUES ('".$lastID."', '', '', '', '', '', '', '', '', '', '')");
        $game_info->execute();
        $game_info->closeCursor();

        unset($_SESSION);

        $games = new game();
        $games->createFile();

        afficher_games(false);
    } else {
        $config->getErreur();
    }

?>