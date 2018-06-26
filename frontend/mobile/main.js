import $ from 'jquery';
import Instascan from 'instascan';
import pad from './pad';
import peer from './peer';

function getUsername() {
  const pathArray = window.location.pathname.split('/');
  return pathArray[2];
}
$(document).ready(() => {
  let username = getUsername();
  $("#start-game").click(() => {
    peer.startGame();
  });
  pad.init(username);
  peer.init(username);
});


/* let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
scanner.addListener('scan', function (content) {
  console.log(content);
  scanner.stop();
  $('.scanner').addClass('unvisible');
  $('.container').removeClass('unvisible');
  pad.init();
  peer.init(content);
});
Instascan.Camera.getCameras().then(function (cameras) {
  if (cameras.length > 0) {
    scanner.start(cameras[0]);
  } else {
    console.error('No cameras found.');
  }
}).catch(function (e) {
  console.error(e);
}); */