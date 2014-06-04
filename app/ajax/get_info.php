<?php

    require_once '../class/config.class.php';
    
    $config = new database('../games/');
    
    if($config) {
        $db = $config->getDataBase();
    
        $get_info = $db->prepare("SELECT titre_game, chemin_game, pochette_game_info, description_game_info, note_game_info, editeur_game_info, developpeur_game_info, type_game_info, sortie_game_info, classification_game_info, screenshots_game_info
                                  FROM game, game_info
                                  WHERE game.id_game = '".$_POST['id']."'
                                    AND game_info.id_game = game.id_game");
        $get_info->execute();
        $gi = $get_info->fetch();

        $result = array();

        $result['titre'] = stripslashes($gi['titre_game']);
        $result['chemin'] = $gi['chemin_game'];
        $result['pochette'] = $gi['pochette_game_info'];
        $result['description'] = stripslashes($gi['description_game_info']);
        $result['note'] = $gi['note_game_info'];
        $result['editeur'] = stripslashes($gi['editeur_game_info']);
        $result['developpeur'] = stripslashes($gi['developpeur_game_info']);
        $result['type'] = stripslashes($gi['type_game_info']);
        $result['sortie'] = $gi['sortie_game_info'];
        $result['classification'] = $gi['classification_game_info'];
        $result['screeshots'] = $gi['screenshots_game_info'];

        $get_info->closeCursor();

        echo json_encode($result);
    } else {
        $config->getErreur();
    }

?>