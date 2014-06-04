GameApp v0.2
============

Lancer vos jeux favoris via votre gamepad grâce à une interface simplifiée


Téléchargements
===============

Si vous souhaitez avoir une verison un peu plus "pro", je vous invite à télécharger le setup à cette adresse : <a href="http://www.babeuloula.fr/fichiers/projets/gameapp-0_2-setup.exe">http://www.babeuloula.fr/fichiers/projets/gameapp-0_2-setup.exe</a>


Comment ça fonctionne ?
=======================

Les contrôles
-------------

Pour le moment l'application ne fonctionne qu'avec les touches du claviers, la touche échap, entrée et retour arrière.

Ajouter des jeux
----------------

* Lancez l'application
* Appuyez sur Echap puis Paramètres
* Dans la nouvelle fenêtre, cliquez sur le bouton Ajouter un jeu
* Insérer le nom du jeu ainsi que le chemin vers le fichier à éxecuter
* Ajouter une image de fond (1920x1080) et une image miniature (que vous pourrez recadrer par la suite)
* Une fois le jeu ajouté, vous pourrez éditer les informations du jeu en cliquant sur le crayon à droite
* Pour supprimer un jeu, cliquez simplement sur la croix à droite

Cas d'utilisation des jeux Steam et UPlay
-----------------------------------------

Pour les jeux Steam et UPlay, il vous suffit d'indiquer dans le chemin d'accès au jeu :
* Steam : steam://ID_DU_JEU
* UPlay : uplay://ID_DU_JEU

Pour trouver l'identifiant du jeu, créez un raccourcis du jeu sur votre bureau grâce au logiciel et faites Clic Droit -> Propriétés


Compatibilité
=============

* Pour l'heure, je n'ai pu le tester que sous Windows 7. Normalement comme le système est le même, cela devrait fonctionner correctement sous Windows XP, Vista, 8 et 8.1.
* Il faut néanmoins, un écran de 1920x1080 (FullHD), pour le moment GameApp n'est pas responsive
* PHPDesktop ne gère pas les accents, donc si vous avez une erreur lors du lancement des Paramètres, c'est sans doute cela


Choses prévues dans les versions futurs
=======================================

* Contrôller GameApp via un gamepad
* Proposer plusieurs types d'affichages


Si vous constatez le moindre bug, ou si vous avez des propositions n'hésitez pas.
Comme toutes les choses que je propose sur GitHub, vous pouvez réutilisez les sources comme bon vous semble. Par contre essayez juste de m'envoyer un mail pour me montrer vos créations.
Et si le coeur vous en dit, n'hésitez pas à me payer une bière, GameApp est sous licence BeerWare.


Remerciements
=============

* Roger Wang pour Node Webkit (<a href="https://github.com/rogerwang/node-webkit">https://github.com/rogerwang/node-webkit</a>)
* Czarek Tomczak pour PHP Desktop (<a href="https://code.google.com/p/phpdesktop/">https://code.google.com/p/phpdesktop/</a>)
* Bennett Feely pour son loader animé en SVG (<a href="http://codepen.io/bennettfeely/pen/lyJdw">http://codepen.io/bennettfeely/pen/lyJdw</a>)