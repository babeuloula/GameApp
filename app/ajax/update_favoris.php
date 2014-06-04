<?php

    require_once '../class/config.class.php';
    require_once '../class/game.class.php';

    $config = new database("../games/");
    
    if($config) {
        $db = $config->getDataBase();
    
        $update = $db->prepare("UPDATE game SET is_favoris_game = '".$_POST['etat']."' WHERE id_game = '".$_POST['id']."'");
        $update->execute();
        $update->closeCursor();

        $games = new game();
        $games->createFile();
    } else {
        $config->getErreur();
    }

?>