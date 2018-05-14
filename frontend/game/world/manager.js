
import * as THREE from 'three';
import $ from 'jquery';
import _ from 'lodash';
import { Vector3 } from 'three';

const multiplayerManager = (function () {
  const game = { player: null };
  let players = {};

  return {
    init() {
      window.setInterval(() => {

      }, 2000);
    },
    getGame() {
      return game;
    },

    updatePlayers(playersData) {
      players = playersData;
    },
  }
})();

export default multiplayerManager;