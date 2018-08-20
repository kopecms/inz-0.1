const _ = require('lodash');
const config = require('config');
const has = require('has');
const Game = require('./game');
//TODO games


const GameManager = (function () {

  let instance;
  let games = {}

  const createInstance = () => {
    return {
      addUserToGame(room, username) {
        if (!has(games, room)) {
          console.log('new game');
          games[room] = new Game();
        }
        games[room].createNewPlayer(username);
      },
      getGames() {
        return games;
      },
      getGame(room) {
        return games[room];
      },
      getPlayers(room) {
        return games[room].getPlayers();
      },
      updatePlayer(room, id, data) {
        games[room].updatePlayerPosition(id, data);
      },
      removePlayerFromGame(room, id) {
        delete games[room].players[id];
      },
      updateBall(room, playerId, ballData) {
        games[room].updateBallPosition(playerId, ballData);
      }
    }
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  }
})();

module.exports = GameManager;