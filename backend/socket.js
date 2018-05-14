const _ = require('lodash');
const config = require('config');
const events = require('./events');

//TODO games

games = {}

const socket = (function () {

  let ioInstance;

  const setupDataBroadcasting = () => {
    setInterval(() => {
      _.forEach(games, (game, room) => {
        io.to(room).emit('gameState', game.getCurrentState());
      });
    }, config.get('socketServer.updateRate'));
  }

  return {
    init(io) {
      ioInstance = io;
      io.on('connection', client => {
        console.log('New player connected: ' + client.id);

        setupDataBroadcasting()

        client.on('joined', data => events.onJoin(io, client, data))
        client.on('hello', data => events.onHello(client, data));
        client.on('position', data => events.onPosition(client, data));
        client.on('collision', data => events.onCollision(client, data));
        client.on('shot', data => events.onShot(client, data));
        client.on('disconnect', () => events.onDisconnect(client));

        //chat interface
        client.on('message', data => events.onMessage(client, data));
      });
    },
    getIo() {
      return ioInstance;
    }
  }
})();

module.exports = socket;