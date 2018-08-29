import config from '../../config/config-front';
import Peer from 'peerjs';
import pad from './pad';
import $ from 'jquery';

const peer = (function() {

  let gameOn = false;
  let lastGZ = 0;

  function displayStartGame() {
    $('#you-are-connected').css('display', 'inline');
    $('#start-game').css('display', 'inline');
    $('#instructions').css('display', 'none');
  }

  function checkIfJump(data) {
    let jump = false;
    if (data.gz - lastGZ > 6) {
      jump = true;
    }
    return jump;
  }
  function checkIfDiving(data) {
    let diving = false;
    if (data.gz - lastGZ < -6) {
      diving = true;
    }
    return diving;
  }
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
            let data = pad.getData();
            data.jump = checkIfJump(data);
            data.diving = checkIfDiving(data);
            lastGZ = data.gz;
            conn.send(data);
            $('#gyro').text(JSON.stringify(data.jump));
            console.log(data);
            pad.resetData();
          }
        }, config.peerjsServer.messageInterval);
      });
    }
  }
})();

export default peer;
