import config from '../../config/config-front';
import Peer from 'peerjs';
import pad from './pad';

const peer = (function() {
  var peer = new Peer(configuration.mobileId, { key: 'm6uhjzrbsiu4ygb9' });

  return {
    init(id) {
      let peer = new Peer('marcin' + '-mobile', {
        host: 'www.kopciu.xyz',
        port: 9000,
        path: '/'
      });
      let conn = peer.connect('marcin');
      conn.on('open', () => {
        console.log('connection open')
        window.setInterval(() => {
          conn.send(pad.getData());
          clearData();
        }, 10);
      });
    }
  }
})();

export default peer;
