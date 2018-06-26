import $ from 'jquery';

var elem = document.getElementById('login-container');

function GoInFullscreen(element) {
  if (element.requestFullscreen)
    element.requestFullscreen();
  else if (element.mozRequestFullScreen)
    element.mozRequestFullScreen();
  else if (element.webkitRequestFullscreen)
    element.webkitRequestFullscreen();
  else if (element.msRequestFullscreen)
    element.msRequestFullscreen();
}
document.addEventListener('keydown', function (e) {
  if (e.keyCode == 13) {
    GoInFullscreen(elem);
  }
}, false);

$('#mobile-join').click(() => {
  let username = $('#name-input').val().toLowerCase();
  window.location.href = '/mobile/' + username;
});