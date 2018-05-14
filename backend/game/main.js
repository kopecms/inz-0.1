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
        games = {};
      },
      addUserToGame(room, username) {
        if (!has(games, room)) {
          console.log('new game');
          games[room] = new Game(room);
        }
        games[room].createNewPlayer(username);
      },
      getPlayers(room) {
        return games[room].getPlayers()
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