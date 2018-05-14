import $ from 'jquery';
import * as THREE from 'three';
import config from '../../config/config-front';
import Peer from 'peerjs';
import socket from './interface/socket';
import multiplayerManager from './world/manager';
import Camera from './interface/camera';
import Scene from './world/scene';

function getUsernameFromTemplate() {
  return $('#username').text()
}

function getRoomNameFromTemplate() {
  return $('#room').text()
}

function connectPeerJS(username) {
  var peer = new Peer(username, {
    host: 'www.kopciu.xyz',
    port: 9000,
    path: '/',
    secure: true
   });
  peer.on('connection', function (conn) {
    conn.on('open', function () {
      conn.on('data', function (receiveData) {
        logger('Data recieved from mobile: ' + JSON.stringify(receiveData), 'all');
        setData(receiveData);
      });
    });
  });
}

$(document).ready(() => {
  let username = getUsernameFromTemplate();
  let room = getRoomNameFromTemplate();

  multiplayerManager.init();
  socket.init(username, room);

  let game = multiplayerManager.getGame();

  const camera = Camera.getInstance();
  const scene = Scene.getInstance();

  let renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);
  console.log(scene)
  console.log(camera);
  let animate = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();
  //connectPeerJS('marcin');
});