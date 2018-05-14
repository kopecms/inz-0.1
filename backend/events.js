
const gameMain = require('./game/main')
const socket = require('./socket')

module.exports = {
  onJoin(io, client, data) {
    console.log('joined', data);
    const { room, username } = data;
    let main = gameMain.getInstance();
    client.join(room, () => {
      main.addUserToGame(room, username);
      io.to(room).emit(
        'joined',
        main.getPlayers(room)
      );
    });
  },
  onHello(client, data) {
    console.log('hello');
  },
  onPosition(client, data) {
    console.log('position');
  },
  onCollision(client, data) {
    console.log('collision');
  },
  onShot(client, data) {
    console.log('shot');
  },
  onDisconnect(client) {
    console.log('disconnect');
  },
  onMessage(client, data) {
    console.log('message', data);
  },
}