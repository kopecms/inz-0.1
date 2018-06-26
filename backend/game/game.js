const _ = require('lodash');
const config = require('config');

const vector = (x, y, z) => {
  return { x, y, z };
}

const distance = (p, q) => {
  return Math.sqrt((Math.pow(p.x-q.x),2)+(Math.pow(q.z-p.z),2));
}

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

class Game {
  constructor(room) {
    this.room = room;
    this.state = {};
    this.players = {};
    this.coins = {};
    _.assign(this.coins, this.generateCoins(config.get('game.initCoinsQuantity')));
  }

  updatePlayerPosition(id, data) {
    data = data || {position: null, velocity: null};
    this.players[id].position = data.position;
    this.players[id].velocity = data.velocity;
  }

  generateCoins(quantity){
    let coins = {};
    let coinsArea = config.get('game.coinsArea');
    for (let i = 0; i < quantity; ++i) {
      this.coins[Game.incrementId()] = {
        x: Math.floor(Math.random()*coinsArea-coinsArea/2),
        y: 10,
        z: Math.floor(Math.random()*coinsArea-coinsArea/2),
      };
    }
    return coins;
  }

  static incrementId() {
    if (!this.latestId) this.latestId = 1;
    else this.latestId++;
    return this.latestId;
  }
  
  coinCollected(playerId, coinId) {
    if (this.coins[coinId]) {
      let coin = this.coins[coinId];
      let player = this.players[playerId];
      if (distance(player.position, coin) < config.get('game.validCoinDistance')) {
        player.score += 10;
        delete this.coins[coinId];
      }
    }
    return this.coins;
  }


  getCurrentState() {
    return this.players;
  }

  createNewPlayer(id) {
    this.players[id] = {
      position: this.generateRandomPosition(),
      velocity: vector(0, 0, 0),
      score: 0,
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
