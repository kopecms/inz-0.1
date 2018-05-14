import io from 'socket.io-client';
import $ from 'jquery';
import multiplayerManager from '../world/manager';

const socket = (function() {
  let socket;
  const sendFunc = (eventName, data) => {
    socket.emit(eventName, data);
  };
  const sendTextMsg = () => {
    let text = $('#text').val();
    $('#text').val('');
    sendFunc('message', { msg: text });
  };
  return {
    send(eventName, data) {
      sendFunc()
    },
    init(username, room) {
      socket = io.connect('www.kopciu.xyz', { secure: true });
      socket.on('connect', () => {
        socket.emit('joined', {username, room});
      });
      socket.on('joined', (data) => {
        multiplayerManager.updatePlayers(data);
      });

      // chat interface
      socket.on('status', data => {
        $('#chat-box').val($('#chat-box').val() + '<' + data.msg + '>\n');
        $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
      });
      socket.on('message', data => {
        $('#chat-box').val($('#chat-box').val() + data.msg + '\n');
        $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
      });

      $('#send').on('click', sendTextMsg);
      $('#text').keypress(e => {
        let code = e.keyCode || e.which;
        if (code == 13) {
          send();
        }
      });
    },
  }
})();

export default socket;
