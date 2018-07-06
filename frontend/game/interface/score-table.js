import $ from 'jquery';
import List from 'list.js';
import _ from 'lodash'; 

var options = {
    valueNames: [ 'player', 'score' ],
    item: '<li><div class="player"></div><span class="score"></span></li>'
};

var userList = new List('info-players', options);

function addToScoreTable(usernames) {
    for (let i in usernames) {
        let username = usernames[i];
        if (!userList.get('player', username).length){
            userList.add({ player: username, score: 0 });
        }
    }
}

function removeFromScoreTable(usernames) {
    for (let i in usernames) {
        let username = usernames[i];
        userList.remove('player', username);
    }
}

function updatePlayerScore(gameState) {
    _.forOwn(gameState, function (playerData, username) {
        if (playerData.hasOwnProperty('score')) {
          userList.remove('player', username);
          let score = playerData.score;
          userList.add({ player: username, score });
        }
    });
    userList.sort('score', { order: 'desc' });
}

function updateMatchScore(scores) {
    $('#red-score').text(scores.red);
    $('#blue-score').text(scores.blue);
}

export {addToScoreTable, removeFromScoreTable, updatePlayerScore, updateMatchScore};