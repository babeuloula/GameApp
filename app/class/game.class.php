<?php

    class game {
        private $path = "../";
        private $file = "game.html";

        public function __construct($dir = "", $fichier = "") {
            if($dir != "") {
                $this->path = $dir;
            }
            if($fichier != "") {
                $this->file = $fichier;
            }
        }

        public function createFile() {
            require_once 'config.class.php';

            $config = new database('../games/');

            if($config) {
                $db = $config->getDataBase();

                $export_favoris = "";
                $export_autres = "";

                $games_favoris = $db->prepare("SELECT id_game, titre_game, chemin_game, background_game, tete_game FROM game WHERE is_favoris_game = '1' ORDER BY titre_game ASC");
                $games_favoris->execute();

                $first = 0;
                $margin = 0;
                while($gf = $games_favoris->fetch()) {
                    $game_info = $db->prepare("SELECT pochette_game_info, description_game_info, note_game_info, editeur_game_info, developpeur_game_info, type_game_info, sortie_game_info, classification_game_info, screenshots_game_info
                                               FROM game_info
                                               WHERE id_game = '".$gf['id_game']."'");
                    $game_info->execute();
                    $gi = $game_info->fetch();
                    $game_info->closeCursor();

                    $attr = 'id_game="'.$gf['id_game'].'" pochette="'.$gi['pochette_game_info'].'" description="'.$gi['description_game_info'].'" note="'.$gi['note_game_info'].'" editeur="'.$gi['editeur_game_info'].'" developpeur="'.$gi['developpeur_game_info'].'" type="'.$gi['type_game_info'].'" sortie="'.$gi['sortie_game_info'].'" classification="'.$gi['classification_game_info'].'" screenshots="'.$gi['screenshots_game_info'].'"';

                    if($first == 0) {
                        $export_favoris.= '<div class="game active">';
                            $export_favoris.= '<img src="games/thumbs/'.$gf['id_game'].'/'.$gf['tete_game'].'" width="350" height="200" class="image" background="'.$gf['background_game'].'" chemin="'.$gf['chemin_game'].'" '.$attr.'>';
                            $export_favoris.= '<div class="titre">'.$gf['titre_game'].'</div>';
                        $export_favoris.= '</div>';

                        $first++;
                        $margin++;
                    } else {
                        if($margin < 3) {
                            $export_favoris.= '<div class="game">';
                                $export_favoris.= '<img src="games/thumbs/'.$gf['id_game'].'/'.$gf['tete_game'].'" width="350" height="200" class="image" background="'.$gf['background_game'].'" chemin="'.$gf['chemin_game'].'" '.$attr.'>';
                                $export_favoris.= '<div class="titre">'.$gf['titre_game'].'</div>';
                            $export_favoris.= '</div>';

                            $margin++;
                        } else {
                            $export_favoris.= '<div class="game noMargin">';
                                $export_favoris.= '<img src="games/thumbs/'.$gf['id_game'].'/'.$gf['tete_game'].'" width="350" height="200" class="image" background="'.$gf['background_game'].'" chemin="'.$gf['chemin_game'].'" '.$attr.'>';
                                $export_favoris.= '<div class="titre">'.$gf['titre_game'].'</div>';
                            $export_favoris.= '</div>';

                            $margin = 0;
                        }
                    }
                }

                $games_favoris->closeCursor();



                $games_autres = $db->prepare("SELECT id_game, titre_game, chemin_game, background_game, tete_game FROM game WHERE is_favoris_game = '0' ORDER BY titre_game ASC");
                $games_autres->execute();

                $margin = 0;
                while($ga = $games_autres->fetch()) {
                    $game_info = $db->prepare("SELECT pochette_game_info, description_game_info, note_game_info, editeur_game_info, developpeur_game_info, type_game_info, sortie_game_info, classification_game_info, screenshots_game_info
                                               FROM game_info
                                               WHERE id_game = '".$ga['id_game']."'");
                    $game_info->execute();
                    $gi = $game_info->fetch();
                    $game_info->closeCursor();

                    $attr = 'id_game="'.$ga['id_game'].'" pochette="'.$gi['pochette_game_info'].'" description="'.$gi['description_game_info'].'" note="'.$gi['note_game_info'].'" editeur="'.$gi['editeur_game_info'].'" developpeur="'.$gi['developpeur_game_info'].'" type="'.$gi['type_game_info'].'" sortie="'.$gi['sortie_game_info'].'" classification="'.$gi['classification_game_info'].'" screenshots="'.$gi['screenshots_game_info'].'"';

                    if($margin < 3) {
                        $export_autres.= '<div class="game">';
                            $export_autres.= '<img src="games/thumbs/'.$ga['id_game'].'/'.$ga['tete_game'].'" width="350" height="200" class="image" background="'.$ga['background_game'].'" chemin="'.$ga['chemin_game'].'" '.$attr.'>';
                            $export_autres.= '<div class="titre">'.$ga['titre_game'].'</div>';
                        $export_autres.= '</div>';

                        $margin++;
                    } else {
                        $export_autres.= '<div class="game noMargin">';
                            $export_autres.= '<img src="games/thumbs/'.$ga['id_game'].'/'.$ga['tete_game'].'" width="350" height="200" class="image" background="'.$ga['background_game'].'" chemin="'.$ga['chemin_game'].'" '.$attr.'>';
                            $export_autres.= '<div class="titre">'.$ga['titre_game'].'</div>';
                        $export_autres.= '</div>';

                        $margin = 0;
                    }
                }

                $games_autres->closeCursor();

                $export = '<favoris>'.$export_favoris.'</favoris><autres>'.$export_autres.'</autres>';

                $fp = fopen("../games.data", 'w+');
                fwrite($fp, $export);
                fclose($fp);
            } else {
                $config->getErreur();
            }
        }
    }

?>