var json = $.parseJSON(file.readFileSync('games/gameapp.json'));

$table = $('<table/>').attr('id', 'game_list');
for(var i = 0; i < json.length; i++) {
    $edit = $('<img/>').addClass('edit').attr('src', 'css/images/edit.png');
    $suppr = $('<img/>').addClass('del').attr('src', 'css/images/supprimer.png');

    $titre = $('<td/>').addClass('title').html(json[i].titre);
    $actions = $('<td/>').addClass('actions').append($edit).append($suppr);

    $tr = $('<tr/>').attr('id', json[i].id).append($titre).append($actions);
    $table.append($tr);
}