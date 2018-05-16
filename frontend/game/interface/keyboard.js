import * as THREE from 'three';
import config from '../../../config/config-front';
import MultiplayerManager from '../world/manager';

const Keyboard = (() => {

  let instance;
  const createInstance = () => {
    let keyMap = {};
    const onDocumentKeyDown = () => {
      let keyCode = event.which;
      let e = keyMap[keyCode];
      console.log(keyCode)
      if (e) {
        e.func(e.data);
      }
    }
    return {
      init: () => {
        document.addEventListener('keydown', onDocumentKeyDown, false);
      },
      registerKey: (key, data, func) => {
        keyMap[key] = {
          data: data,
          func: func,
        }
      },
    }
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
        instance.init();
        instance.registerKey(87, null, (data) => {
          let player = MultiplayerManager.getPlayer();
          let v = player.direction.multiplyScalar(config.game.player.speed);
          MultiplayerManager.getPlayer().body.velocity.set(v.x, 0, v.z);
        });

        instance.registerKey(83, null, (data) => {
          let player = MultiplayerManager.getPlayer();
          let v = player.direction.multiplyScalar(config.game.player.speed);
          player.body.velocity.set(-1.0 * v.x, 0, -1.0 * v.z);
        });

        instance.registerKey(65, null, (data) => {
          let player = MultiplayerManager.getPlayer();
          let v = player.direction.multiplyScalar(config.game.player.speed);
          v.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
          player.body.velocity.set(v.x, 0, v.z);
        })
        instance.registerKey(68, null, (data) => {
          let player = MultiplayerManager.getPlayer();
          let v = player.direction.multiplyScalar(config.game.player.speed);
          v.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
          player.body.velocity.set(-1.0 * v.x, 0, -1.0 * v.z);
        })
        instance.registerKey(32, null, (data) => {
          MultiplayerManager.getPlayer().body.velocity.y = 100;
        })
      }
      return instance;
    }
  }
})();

export default Keyboard;