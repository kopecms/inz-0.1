
import * as THREE from 'three';
import $ from 'jquery';
import _ from 'lodash';
import { Vector3 } from 'three';
import Player from '../entities/player';
import Settings from '../interface/settings';

const MultiplayerManager = (function () {
  const game = { player: null };
  let players = {};
  let gameState = {};
  let userId = '';

  const getVector = (dict) => new THREE.Vector3(dict.x, dict.y, dict.z);

  return {
    init() {
      window.setInterval(() => {

      }, 2000);
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
      _.forOwn(players, function (data, id) {
        if (id === userId && players.hasOwnProperty(userId)) {
          players[userId].update();
          if (Settings.useKeyboard) {

          } else if (Settings.useControler) {

          }
        } else {

        }
      });
    },
    updateGameState(gameStateData){
      gameState = gameStateData;
    },
    updatePlayers(playersData) {
      console.log(playersData)
      _.forOwn(playersData, function (data, id) {
        if (!players.hasOwnProperty(id)) {
          players[id] = new Player(id, data.position);
        }
        console.log(players);
      });
    },
  }
})();

export default MultiplayerManager;