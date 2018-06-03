const _ = require('lodash');
const config = require('config');
const has = require('has');
const Game = require('./game');
//TODO games


const gameMain = (function () {

  let instance;
  let games = {}

  const createInstance = () => {
    return {
      init() {
      },
      addUserToGame(room, username) {
        if (!has(games, room)) {
          console.log('new game');
          games[room] = new Game(room);
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
        return games[room].getPlayers()
      },
      updatePlayer(room, id, data) {
        games[room].updatePlayerPosition(id, data);
      },
      removeUserFromGame(room, id) {
        delete games[room].players[id];
      }
    }
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
        instance.init()
      }
      return instance;
    },
  }
})();

module.exports = gameMain;