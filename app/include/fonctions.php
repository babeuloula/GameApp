<?php

    function redimention($filename) {
        $source = imagecreatefromjpeg($filename);
        $thumb = imagecreatetruecolor(1920, 1080);

        list($largeur_image, $hauteur_image) = getimagesize($filename);

        imagecopyresampled($thumb, $source, 0, 0, 0, 0, 1920, 1080, $largeur_image, $hauteur_image);

        imagejpeg($thumb, $filename, 50);
    }

    function redimentionPochette($filename) {
        $source = imagecreatefromjpeg($filename);
        list($largeur_image, $hauteur_image) = getimagesize($filename);

        $largeur = 300;
        $percent = (($largeur * 100) / $largeur_image) / 100;
        $newwidth = $largeur;
        $newheight = $hauteur_image * $percent;

        $thumb = imagecreatetruecolor($newwidth, $newheight);

        imagecopyresampled($thumb, $source, 0, 0, 0, 0, $newwidth, $newheight, $largeur_image, $hauteur_image);

        imagejpeg($thumb, $filename, 100);
    }

    function redimentionScreenshots($filename) {
        $source = imagecreatefromjpeg($filename);
        list($largeur_image, $hauteur_image) = getimagesize($filename);

        $largeur = 130;
        $percent = (($largeur * 100) / $largeur_image) / 100;
        $newwidth = $largeur;
        $newheight = $hauteur_image * $percent;

        $thumb = imagecreatetruecolor($newwidth, $newheight);

        imagecopyresampled($thumb, $source, 0, 0, 0, 0, $newwidth, $newheight, $largeur_image, $hauteur_image);

        imagejpeg($thumb, $filename, 100);
    }

    function afficher_games($home = true) {
        if($home) {
            require_once 'class/config.class.php';
            $config = new database("games/");
        } else {
            require_once '../class/config.class.php';
            $config = new database("../games/");
        }


        if($config) {
            $db = $config->getDataBase();

            $games = $db->prepare("SELECT id_game, titre_game, background_game, is_favoris_game FROM game ORDER BY titre_game ASC");
            $games->execute();

            while($g = $games->fetch()) {
                echo '<tr>';
                echo '<td>'.$g['titre_game'].'</td>';

                if($g['is_favoris_game'] == "1") {
                    echo '<td><input type="checkbox" class="favoris" name="favoris" value="'.$g['id_game'].'" checked></td>';
                } else {
                    echo '<td><input type="checkbox" class="favoris" name="favoris" value="'.$g['id_game'].'"></td>';
                }

                echo '<td>';
                echo '<img src="img/edit.png" alt="editer" width="16" height="16" class="edit" id_game="'.$g['id_game'].'">';
                echo '<img src="img/supprimer.png" alt="supprimer" width="16" height="16" class="del" id_game="'.$g['id_game'].'" image="'.$g['background_game'].'">';
                echo '</td>';
                echo '</tr>';
            }

            $games->closeCursor();
        } else {
            $config->getErreur();
        }
    }

    function sqlite_escape_string($string) {
        return SQLite3::escapeString($string);
    }

    function deleteFolder($dir) {
        if (is_dir($dir)) {
            $objects = scandir($dir);

            foreach ($objects as $object) {
                if ($object != "." && $object != "..") {
                    if(filetype($dir . "/" . $object) == "dir") {
                        deleteFolder($dir . "/" . $object);
                    } else {
                        unlink($dir . "/" . $object);
                    }
                }
            }
            reset($objects);
            rmdir($dir);
        }
    }

?>