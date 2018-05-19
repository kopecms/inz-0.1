
import * as THREE from 'three';
import $ from 'jquery';
import _ from 'lodash';
import { Vector3 } from 'three';
import Player from '../entities/player';
import Settings from '../interface/settings';
import socket from '../interface/socket';
import config from '../../../config/config-front';

const MultiplayerManager = (function () {
  const game = { player: null };
  let players = {};
  let gameState = {};
  let userId = '';

  const getVector = (dict) => new THREE.Vector3(dict.x, dict.y, dict.z);

  const getPlayerData = () => {
    if (players.hasOwnProperty(userId)) {
      return {
        position: players[userId].body.position,
        velocity: players[userId].body.velocity,
      }
    }
  }
  return {
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
    update() {
      _.forOwn(players, function (player, id) {
        if (gameState.hasOwnProperty(id)) {
          if (id === userId && players.hasOwnProperty(userId)) {
            player.update();
          } else {
            let direction = new THREE.Vector3(0, 0, 0);
            direction.subVectors(gameState[id].position, player.body.position);
            let velocity = direction.normalize().multiplyScalar(getVector(gameState[id].velocity).length());
            player.body.velocity.copy(velocity);
          }
        }
      });
    },
    updateGameState(gameStateData){
      gameState = gameStateData;
    },
    updatePlayers(playersData) {
      _.forOwn(playersData, function (data, id) {
        if (!players.hasOwnProperty(id)) {
          players[id] = new Player(id, data.position);
        }
        console.log(players);
      });
      console.log('event')
      _.forOwn(players, function (player, id) {
        if (!playersData.hasOwnProperty(id)) {
          player.delete();
          delete players[id];
        }
      });
    },
  }
})();

export default MultiplayerManager;