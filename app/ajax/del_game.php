<?php

    require_once '../include/fonctions.php';
    require_once '../class/config.class.php';
    require_once '../class/game.class.php';

    $config = new database("../games/");

    if($config) {
        $db = $config->getDataBase();

        $del = $db->prepare("DELETE FROM game WHERE id_game = '".$_POST['id']."'");
        $del->execute();
        $del->closeCursor();

        $del2 = $db->prepare("DELETE FROM game_info WHERE id_game = '".$_POST['id']."'");
        $del2->execute();
        $del2->closeCursor();

        deleteFolder('../games/backgrounds/'.$_POST['id'].'/');
        deleteFolder('../games/images/'.$_POST['id'].'/');
        deleteFolder('../games/thumbs/'.$_POST['id'].'/');

        $games = new game();
        $games->createFile();

        afficher_games(false);
    } else {
        $config->getErreur();
    }

?>