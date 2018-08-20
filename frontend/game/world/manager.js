
import * as THREE from 'three';
import $ from 'jquery';
import _ from 'lodash';
import { Vector3 } from 'three';
import Player from '../entities/player';
import Settings from '../interface/settings';
import socket from '../interface/socket';
import config from '../../../config/config-front';
import Coin from '../entities/coin';
import { updatePlayerScore, updateMatchScore } from '../interface/score-table';
import utils from '../../../common/utils';


const MultiplayerManager = (function () {
  const game = {
    ball: {},
    coins: [],
  };
  let coins = {};
  let players = {};
  let gameState = {};
  let userId = '';
  let tmpVector = new THREE.Vector3(0, 0, 0);
  let direction = new THREE.Vector3(0, 0, 0);
  const getVector = (dict) => new THREE.Vector3(dict.x, dict.y, dict.z);

  const getPlayerData = () => {
    if (players.hasOwnProperty(userId)) {
      return {
        position: players[userId].body.position,
        velocity: players[userId].body.velocity,
      };
    }
  };

  let coinsArea = 250;
  const generateCoins = () => {
    for (let i = 0; i < config.game.coin.initQuantity; ++i) {
      let coin = new Coin();
      game.coins.push(coin);
      coin.setPosition(Math.floor(Math.random()*coinsArea-coinsArea/2), 10, Math.floor(Math.random()*coinsArea-coinsArea/2))
    }
  };
  const updateBall = (ballData) => {
    if (game.ball !== {}) {
      if (game.ball.position && ballData.position &&
          utils.distance(game.ball.position, ballData.position) < config.game.ball.maxDistanceDifference) {
        direction.set(0, 0, 0);
        direction.subVectors(game.ball.body.position, ballData.position);
        let velocity = direction.normalize().multiplyScalar(-1*getVector(Math.pow((ballData.velocity).length(),3)));
        game.ball.body.velocity.copy(velocity);
      } else {
        game.ball.body.position.copy(ballData.position);
        game.ball.body.velocity.copy(ballData.velocity);
      }
    }
  };
  return {
    ball: {},
    init() {
      window.setInterval(() => {
        socket.sendPlayerData(getPlayerData());
      }, config.socket.messageInterval);
    },
    setUsername(id) {
      userId = id;
    },
    getPlayer() {
      return players[userId];
    },
    getGame() {
      return game;
    },
    update(controllerData) {
      _.forOwn(players, function (player, id) {
        if (gameState.hasOwnProperty(id)) {
          if (id === userId && players.hasOwnProperty(userId)) {
            player.update(controllerData);
          } else {
            if (gameState[id] && gameState[id].position && player.body.position) {
              if (utils.distance(gameState[id].position, player.body.position) < config.game.player.maxDistanceDifference) {
                direction.set(0, 0, 0);
                direction.subVectors(gameState[id].position, player.body.position);
                let velocity = direction.normalize().multiplyScalar(Math.pow(getVector(gameState[id].velocity).length(),1));
                player.body.velocity.copy(velocity);
              } else {
                player.body.position.copy(gameState[id].position);
                player.body.velocity.copy(gameState[id].velocity); 
              }
            }
          }
        }
      });
    },
    updateGameState(gameStateData){
      gameState = gameStateData.players;
      updateBall(gameStateData.ball);
      updateMatchScore(gameStateData.score);
      updatePlayerScore(gameStateData.players);
    },
    updatePlayers(playersData) {
      _.forOwn(playersData, function (data, id) {
        if (!players.hasOwnProperty(id)) {
          players[id] = new Player(id, data.position);
        }
      });
      let removedPlayers = [];
      _.forOwn(players, function (player, id) {
        if (!playersData.hasOwnProperty(id)) {
          removedPlayers.push(id);
          player.delete();
          delete players[id];
        }
      });
      return removedPlayers;
    },
    updateCoinsState(data) {
      _.forOwn(data, function (coin, id) {
        if (!coins.hasOwnProperty(id)) {
          coins[id] = new Coin(id);
          coins[id].setPosition(coin.x, coin.y, coin.z);
        }
      });
      _.forOwn(coins, function (coin, id) {
        if (!data.hasOwnProperty(id)) {
          coin.delete();
          delete coins[id];
        }
      });
    },
    updateCoins() {
      _.forOwn(coins, function(coin, id) {
        coin.update();
        if (players[userId]) {
          if (tmpVector.subVectors(players[userId].mesh.position, coin.mesh.position).length() < config.game.coin.r + 2) {
            socket.send('coinCollected', {coinId: coin.id});
            coin.delete();
          }
        }
      });
    }
  };
})();

export default MultiplayerManager;