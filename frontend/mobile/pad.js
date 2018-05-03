import $ from 'jquery';
import nipplesjs from 'nipplejs';
import GyroNorm from '../../node_modules/gyronorm/dist/gyronorm.complete';

const pad = (function() {

  let data = {
    angle: {},
    direction: {},
    distance: 0,
    buttonOne: false,
    buttonTwo: false,
    alpha: 0,
    beta: 0,
    gamma: 0,
    gx: 0,
    gy: 0,
    gz: 0,
  };

  return {
    init() {
      let manager = nipplesjs.create({
        zone: document.getElementById('joystick'),
        color: 'blue',
        multitouch: true,
      });

      manager.on('dir start move', (evt, dataJoystick) => {
        data.angle = dataJoystick.angle;
        data.direction = dataJoystick.direction;
        data.distance = dataJoystick.distance;
      });

      $('#one').bind('touchstart mousedown', () => {
        data.buttonOne = true;
        $('#one').addClass('touched');
      });
      $('#two').bind('touchstart mousedown', () => {
        data.buttonTwo = true;
        $('#two').addClass('touched');
      });
      $('#one').bind('touchend mouseup', () => {
        data.buttonOne = true;
        $('#one').removeClass('touched');
      });
      $('#two').bind('touchend mouseup', () => {
        $('#two').removeClass('touched');
      });

      let gn = new GyroNorm();
      gn.init({ frequency: 50 }).then(() => {
        gn.start((dataGyro) => {
          data.alpha = dataGyro.do.alpha;
          data.beta = dataGyro.do.beta;
          data.gamma = dataGyro.do.gamma;
          data.gx = dataGyro.dm.gx;
          data.gy = dataGyro.dm.gy;
          data.gz = dataGyro.dm.gz;
          $('#gyro').text(JSON.stringify(dataGyro));
        });
      }).catch((e) => {
        logger('Error GyroNorm: ' + e, 'errors');
      });

      console.log('Pad initialized');
    },

    getData() {
      return data;
    },

    resetData() {
      data.angle = {};
      data.direction = {};
      data.distance = 0;
      data.buttonOne= false;
      data.buttonTwo = false;
    },
  }
})();

export default pad;