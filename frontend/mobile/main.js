import $ from 'jquery';
import pad from './pad';
import peer from './peer';

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

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
