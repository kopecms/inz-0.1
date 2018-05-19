const _ = require('lodash');
const config = require('config');
const events = require('./events');
const gameMain = require('./game/main')
//TODO games

games = {}

const socket = (function () {

  let ioInstance;
  let main;
  const setupDataBroadcasting = () => {
    setInterval(() => {
      _.forEach(main.getGames(), (game, room) => {
        ioInstance.to(room).emit('gameState', game.getCurrentState());
      });
    }, config.get('socketServer.updateRate'));
  }

  return {
    init(io) {
      ioInstance = io;
      main = gameMain.getInstance();
      io.on('connection', client => {
        console.log('New player connected: ' + client.id);

        setupDataBroadcasting()

        client.on('joined', data => events.onJoin(io, client, data))
        client.on('hello', data => events.onHello(client, data));
        client.on('playerData', data => events.onPlayerData(client, data));
        client.on('collision', data => events.onCollision(client, data));
        client.on('shot', data => events.onShot(client, data));
        client.on('disconnect', () => events.onDisconnect(io, client));

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