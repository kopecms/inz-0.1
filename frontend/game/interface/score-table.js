import $ from 'jquery';

function addToScoreTable(usernames) {
    for (let i in usernames) {
        let username = usernames[i];
        if (!$(`#${username}`).length){
            $('#players').append(
                `<li class="player-info" id="${username}">${username} <span class="score" id="score-${username}">0</span></li>`
            );
        }
    }
}

function removeFromScoreTable(usernames) {
    for (let i in usernames) {
        $(`#${usernames[i]}`).remove();
    }
}

function updatePlayerScore(username, score) {
    
}

export {addToScoreTable, removeFromScoreTable, updatePlayerScore};