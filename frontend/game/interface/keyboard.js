import * as THREE from 'three';
import config from '../../../config/config-front';
import MultiplayerManager from '../world/manager';
import Camera from '../interface/camera';

const Keyboard = (() => {

  let instance;
  const createInstance = () => {
    let keyMap = {};
    const onDocumentKeyDown = () => {
      let keyCode = event.which;
      let e = keyMap[keyCode];
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
        instance.registerKey(81, null, (data) => {
          let camera = Camera.getInstance();
          let player = MultiplayerManager.getPlayer();
          let cameraPosition = new THREE.Vector3();
          cameraPosition.copy(camera.position);
          cameraPosition.subVectors(cameraPosition, player.mesh.position);
          cameraPosition.applyAxisAngle(new THREE.Vector3(0, 1, 0), -1.0*config.keyboard.rotateCameraSpeed);
          cameraPosition.addVectors(cameraPosition, player.mesh.position);
          camera.position.copy(cameraPosition);
        })
        instance.registerKey(69, null, (data) => {
          let camera = Camera.getInstance();
          let player = MultiplayerManager.getPlayer();
          let cameraPosition = new THREE.Vector3();
          cameraPosition.copy(camera.position);
          cameraPosition.subVectors(cameraPosition, player.mesh.position);
          cameraPosition.applyAxisAngle(new THREE.Vector3(0, 1, 0), config.keyboard.rotateCameraSpeed);
          cameraPosition.addVectors(cameraPosition, player.mesh.position);
          camera.position.copy(cameraPosition);
        })
      }
      return instance;
    }
  }
})();

export default Keyboard;