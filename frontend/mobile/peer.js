import config from '../../config/config-front';
import Peer from 'peerjs';
import pad from './pad';

const peer = (function() {

  return {
    init(id) {
      let peer = new Peer(id + '-mobile', {
        host: 'www.kopciu.xyz',
        port: 443,
        path: '/peerjs',
        secure: true,
      });
      let conn = peer.connect(id);
      conn.on('open', () => {
        console.log('connection open')
        window.setInterval(() => {
          conn.send(pad.getData());
          console.log(pad.getData());
          pad.resetData();
        }, config.peerjsServer.messageInterval);
      });
    }
  }
})();

export default peer;
