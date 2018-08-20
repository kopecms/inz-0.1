
const GameManager = require('./game/game-manager');
const socket = require('./socket-events');


let connections = {};

module.exports = {
  onJoin(io, client, data) {
    console.log('joined', data);
    const { room, username } = data;
    let main = GameManager.getInstance();
    connections[client.id] = {room, username};
    client.join(room, () => {
      main.addUserToGame(room, username);
      io.to(room).emit(
        'joined',
        main.getPlayers(room)
      );
      let game = main.getGame(room);
      io.to(room).emit(
        'coinsState',
        game.coins
      );
      console.log(game.coins);
    });
  },
  onCoinCollected(io, client, data) {
    //console.log(data)
    let main = GameManager.getInstance();
    const { room, username } = connections[client.id];
    let game = main.getGame(room);
    let coins = game.bonusCollected(username, data.coinId);
    io.to(room).emit(
      'coinsState',
      coins
    );

  },
  onPlayerData(client, data) {
    let main = GameManager.getInstance();
    const { room, username } = connections[client.id];
    main.updatePlayer(room, username, data);
  },
  onCollision(client, data) {
    let main = GameManager.getInstance();
    const { room, username } = connections[client.id];
    main.updateBall(room, username, data);
  },
  onDisconnect(io, client) {
    console.log('disconnect', client.id);
    let main = GameManager.getInstance();
    if (connections.hasOwnProperty(client.id)) {
      const { room, username } = connections[client.id];
      client.leave(room, () => {
        main.removePlayerFromGame(room, username);
        io.to(room).emit(
          'disconnected',
          main.getPlayers(room)
        );
        delete connections[client.id];
      });
    }
  },
  onMessage(io, client, data) {
    console.log('message', data);
    const { room, username } = connections[client.id];
    io.to(room).emit(
      'message',
      {
        id: username,
        msg: data.msg,
      }
    );
  },
}