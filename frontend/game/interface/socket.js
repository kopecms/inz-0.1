import io from 'socket.io-client';
import MultiplayerManager from '../world/manager';
import { onNewStatus, onNewMessage, setupChatEvents } from './chat';
import { addToScoreTable, removeFromScoreTable } from './score-table';

const socket = (function() {
  let socket;
  const sendFunc = (eventName, data) => {
    socket.emit(eventName, data);
  };
  return {
    send(eventName, data) {
      sendFunc(eventName, data)
    },
    sendPlayerData(data) {
      sendFunc('playerData', data);
    },
    init(username, room) {
      socket = io.connect('www.kopciu.xyz', { secure: true });
      socket.on('connect', () => {
        socket.emit('joined', {username, room});
      });
      socket.on('disconnected', data => {
        let removedPlayers = MultiplayerManager.updatePlayers(data);
        removeFromScoreTable(removedPlayers);
      });
      socket.on('joined', data => {
        MultiplayerManager.updatePlayers(data);
        addToScoreTable(Object.keys(data));
      });
      socket.on('gameState', data => {
        MultiplayerManager.updateGameState(data);
      });

      // chat interface
      socket.on('status', data => {
        onNewStatus(data);
      });
      socket.on('message', data => {
        onNewMessage(data);
      });
      setupChatEvents();
    },
  }
})();

export default socket;
