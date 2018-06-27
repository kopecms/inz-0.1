import config from '../../config/config-front';
import Peer from 'peerjs';
import pad from './pad';
import $ from 'jquery';

const peer = (function() {

  let gameOn = false;

  const displayStartGame = () => {
    $('#you-are-connected').css('display', 'inline');
    $('#start-game').css('display', 'inline');
    $('#instructions').css('display', 'none');
  };

  return {
    startGame() {
      $('#connected-container').css('display', 'none');
      $('#pad-container').css('display', 'inline');
      gameOn = true;
      pad.setStartAplha();
    },
    init(id) {
      let peer = new Peer(id + '-mobile', {
        host: 'www.kopciu.xyz',
        port: 443,
        path: '/peerjs',
        secure: true,
      });
      let conn = peer.connect(id);
      conn.on('open', () => {
        console.log('connection open');
        displayStartGame();
        window.setInterval(() => {
          if (gameOn) {
            conn.send(pad.getData());
            console.log(pad.getData());
            pad.resetData();
          }
        }, config.peerjsServer.messageInterval);
      });
    }
  }
})();

export default peer;
