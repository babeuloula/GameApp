<?php

    require_once '../include/fonctions.php';

    $time = time();

    $extentionBG = "jpg";
    $pathBG      = '../games/backgrounds/';
    $filenameBG  = basename($time);
    move_uploaded_file($_FILES['background_game']['tmp_name'], $pathBG.$filenameBG.".".$extentionBG);
    redimention($pathBG.$filenameBG.".".$extentionBG);

    $extentionT = "jpg";
    $pathT      = '../games/thumbs/';
    $filenameT  = basename($time);
    move_uploaded_file($_FILES['tete_game']['tmp_name'], $pathT.$filenameT.".".$extentionT);

    session_start();
    $_SESSION['image']['titre'] = $_POST['titre_game'];
    $_SESSION['image']['chemin'] = $_POST['chemin_game'];
    $_SESSION['image']['extentionBG'] = $extentionBG;
    $_SESSION['image']['extentionT']  = $extentionT;
    $_SESSION['image']['background']  = $filenameBG;
    $_SESSION['image']['tete']        = $filenameT;
    $_SESSION['image']['pathBG']      = $pathBG;
    $_SESSION['image']['pathT']       = $pathT;

    echo $_SESSION['image']['pathT'] . $_SESSION['image']['tete'] . "." . $_SESSION['image']['extentionT'];

?>