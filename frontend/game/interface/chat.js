import $ from 'jquery';
import socket from './socket';

function onNewStatus(data) {
    $('#chat-box').val($('#chat-box').val() + '<' + data.msg + '>\n');
    $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
}

function onNewMessage(data) {
    $('#chat-box').val($('#chat-box').val() + data.id + ': ' + data.msg + '\n');
    $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
}

function sendTextMsg() {
    let text = $('#text').val();
    $('#text').val('');
    socket.send('message', { msg: text });
};

function setupChatEvents() {
    $('#send').on('click', sendTextMsg);
    $('#text').keypress(e => {
        let code = e.keyCode || e.which;
        if (code == 13) {
            sendTextMsg();
        }
    });
}

export {onNewStatus, onNewMessage, setupChatEvents};
