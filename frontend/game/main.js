import $ from 'jquery';
import * as THREE from 'three';
import config from '../../config/config-front';
import Peer from 'peerjs';
import socket from './interface/socket';
import MultiplayerManager from './world/manager';
import Camera from './interface/camera';
import Scene from './world/scene';
import Physic from './world/physic';
import Box from './entities/box';
import Keyboard from './interface/keyboard';

// TODO refactor
var controllerData = {};

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function getUsernameFromTemplate() {
  let username = $('#username').text().toLowerCase();
  if (username === '') {
    username = 'test' + Math.floor(Math.random()*100);
    $('#username').val(username);
  }
  return 'pawel';
}

function getRoomNameFromTemplate() {
  let room = $('#room').text().toLowerCase();
  return room;
}

function initPeerJs(username) {
  let peer = new Peer(username, {
      // TODO refactor
      host: 'www.kopciu.xyz',
      port: 443,
      path: '/peerjs',
      secure: true
    });
    peer.on('connection', function (conn) {
    conn.on('open', function () {
      conn.on('data', function (receiveData) {
        //console.log('Data recieved from mobile: ' + JSON.stringify(receiveData));
        // TODO refactor jak juz bedzie dzialac
        controllerData = receiveData;
      });
    });
  });
}

$(document).ready(() => {
  let username = getUsernameFromTemplate();
  let room = getRoomNameFromTemplate();

  MultiplayerManager.init();
  socket.init(username, room);
  // TODO refactor
  initPeerJs(username);
  MultiplayerManager.setUsername(username);
  let game = MultiplayerManager.getGame();

  const camera = Camera.getInstance();
  const scene = Scene.getInstance();
  const physic = Physic.getInstance();

  Keyboard.getInstance();

  let renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  let box = new Box(10, 10, 10, 1);
  box.setPosition(0, 50, 0);
  Physic.addEntity(box);

  let animate = () => {
    Physic.update();
    Camera.update(MultiplayerManager.getPlayer(), controllerData);
    MultiplayerManager.update(controllerData);
    MultiplayerManager.updateCoins();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();
});