const _ = require('lodash');
const config = require('config');
const World = require('./world');

const vector = (x, y, z) => {
  return { x, y, z };
}

const distance = (p, q) => {
  return Math.sqrt((Math.pow(p.x-q.x),2)+(Math.pow(q.z-p.z),2));
}

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

class Game {
  constructor() {
    this.state = {};
    this.players = {};
    this.bonuses = {};
    this.score = {
      red: 0,
      blue: 0,
    }
    this.world = new World(this);
    _.assign(this.bonuses, this.generateBonuses(config.get('game.initBonusQuantity')));
  }

  updatePlayerPosition(id, data) {
    data = data || {position: null, velocity: null};
    if (this.players.hasOwnProperty(id)) {
      this.players[id].position = data.position;
      this.players[id].velocity = data.velocity;
    }
  }

  generateBonuses(quantity){
    let bonuses = {};
    let bonusesArea = config.get('game.bonusArea');
    for (let i = 0; i < quantity; ++i) {
      this.bonuses[Game.incrementId()] = {
        x: Math.floor(Math.random()*bonusesArea-bonusesArea/2),
        y: 10,
        z: Math.floor(Math.random()*bonusesArea-bonusesArea/2),
      };
    }
    return bonuses;
  }

  static incrementId() {
    if (!this.latestId) this.latestId = 1;
    else this.latestId++;
    return this.latestId;
  }
  
  bonusCollected(playerId, coinId) {
    if (this.bonuses[coinId]) {
      let coin = this.bonuses[coinId];
      let player = this.players[playerId];
      if (distance(player.position, coin) < config.get('game.validCoinDistance')) {
        player.score += 10;
        delete this.bonuses[coinId];
      }
    }
    return this.bonuses;
  }

  updateBallPosition(playerId, ballData) {
    let player = this.players[playerId];
    let ball = this.world.getBallInfo();
    if (distance(player.position, ball.position) < config.get('game.validBallCollisionDistance')) {
      this.world.makeCollision(null, ballData.velocity);
      player.score += 1;
      //console.log(this.players)
    }
  }

  getCurrentState() {
    return {
      score: this.score,
      ball: this.world.getBallInfo(),
      players: this.players
    };
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
