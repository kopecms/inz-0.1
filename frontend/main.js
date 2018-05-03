import $ from 'jquery';
/* import qrcode from 'qrcode-generator'; */
import config from '../config/config-front';
import Peer from 'peerjs';
import io from 'socket.io-client';
import Socketiop2p from 'socket.io-p2p';

function getUsernameFromTemplate() {
  return $('#username').val()
}
/*
function generateQRCode(username) {
  let qr = qrcode(1, 'H');
  qr.addData(username);
  qr.make();
  document.getElementById('qrcode').innerHTML = qr.createImgTag();
} */

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
  var socket = io.connect('www.kopciu.xyz', { secure: true } )
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
  //var ws = new WebSocket('wss://192.168.0.106:8443');
  //ws.onload = ()=> ws.send('foo');

  connectPeerJS('marcin');
});