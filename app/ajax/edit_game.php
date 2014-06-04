<?php

    require_once '../include/fonctions.php';
    require_once '../class/config.class.php';
    require_once '../class/game.class.php';

    $config = new database("../games/");

    if($config) {
        $db = $config->getDataBase();

        $update = $db->prepare("UPDATE game
                                SET titre_game = '".sqlite_escape_string(str_replace('"', '', $_POST['titre_game']))."',
                                    chemin_game = '".$_POST['chemin_game']."'
                                WHERE id_game = '".$_POST['id']."'");
        $update->execute();
        $update->closeCursor();

        $screenshots_game = "";
        if(count($_POST['screenshots_game']) > 0 && $_POST['screenshots_game'][0] != "") {
            for($i = 0; $i < count($_POST['screenshots_game']); $i++) {
                $screenshots_game.= $_POST['screenshots_game'][$i] . "#";

                if(!is_dir('../games/images/'.$_POST['id'].'/')) {
                    mkdir('../games/images/'.$_POST['id'].'/');
                }

                $filename = explode('/', $_POST['screenshots_game'][$i]);
                $filename = end($filename);

                file_put_contents('../games/images/'.$_POST['id'].'/'.$filename, fopen($_POST['screenshots_game'][$i], 'r'));
                redimentionScreenshots('../games/images/'.$_POST['id'].'/'.$filename);
            }

            $screenshots_game = substr($screenshots_game, 0, -1);
        }

        if($_POST['pochette_game'] != "") {
            if(!is_dir('../games/images/'.$_POST['id'].'/')) {
                mkdir('../games/images/'.$_POST['id'].'/');
            }

            $filename = explode('/', $_POST['pochette_game']);
            $filename = end($filename);

            file_put_contents('../games/images/'.$_POST['id'].'/'.$filename, fopen($_POST['pochette_game'], 'r'));
            redimentionPochette('../games/images/'.$_POST['id'].'/'.$filename);
        }

        $update2 = $db->prepare("UPDATE game_info
                                 SET pochette_game_info = '".$_POST['pochette_game']."',
                                     description_game_info = '".sqlite_escape_string(str_replace('"', '', $_POST['description_game']))."',
                                     note_game_info = '".$_POST['note_game']."',
                                     editeur_game_info = '".sqlite_escape_string(str_replace('"', '', $_POST['editeur_game']))."',
                                     developpeur_game_info = '".sqlite_escape_string(str_replace('"', '', $_POST['developpeur_game']))."',
                                     type_game_info = '".sqlite_escape_string(str_replace('"', '', $_POST['type_game']))."',
                                     sortie_game_info = '".$_POST['sortie_game']."',
                                     classification_game_info = '".sqlite_escape_string(str_replace('"', '', $_POST['classification_game']))."',
                                     screenshots_game_info = '".$screenshots_game."'
                                 WHERE id_game = ".$_POST['id']."");
        $update2->execute();
        $update2->closeCursor();

        $games = new game();
        $games->createFile();

        afficher_games(false);
    } else {
        $config->getErreur();
    }

?>