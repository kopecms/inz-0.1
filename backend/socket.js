const _ = require('lodash');
const confing = require('config');
const events = require('./events');

const socket = (function () {

  const setupDataBroadcasting = () => {
    setInterval(() => {
      _.forEach(games, (game, room) => {
        io.to(room).emit('gameState', game.getCurrentState());
      });
    }, config.get('socketServer.updateRate'));
  }

  return {
    init(io) {
      io.on('connection', client => {
        console.log('New player connected: ' + client.id);

        setupDataBroadcasting()

        client.on('join', data => events.onJoin(data))
        client.on('hello', data => events.onJoin(data));
        client.on('position', data => events.onJoin(data));
        client.on('collision', data => events.onJoin(data));
        client.on('shot', data => events.onJoin(data));
        client.on('disconnect', () => events.onJoin(data));
      });
    }
  }
})();

module.exports = socket;