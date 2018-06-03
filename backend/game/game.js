const _ = require('lodash');

const vector = (x, y, z) => {
  return { x, y, z };
}

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

class Game {
  constructor(room) {
    this.room = room;
    this.state = {};
    this.players = {};
  }

  updatePlayerPosition(id, data) {
    data = data || {position: null, velocity: null};
    this.players[id].position = data.position;
    this.players[id].velocity = data.velocity;
  }

  getCurrentState() {
    return this.players
  }

  createNewPlayer(id) {
    this.players[id] = {
      position: this.generateRandomPosition(),
      velocity: vector(0, 0, 0)
    }
    return this.players[id];
  }

  getPlayers() {
    return this.players;
  }

  generateRandomPosition() {
    return vector(randomInt(-40, 40), 7, randomInt(-40, 40))
  }
}
module.exports = Game;
