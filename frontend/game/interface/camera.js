import * as THREE from 'three';
import Player from '../entities/player';

const Camera = (function () {

  let instance;
  let move = new THREE.Vector3(0, 0, 0);
  let previous = new THREE.Vector3(0, 0, 0);

  const createInstance = () => {
    return {
      init() {
        instance = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        instance.position.x = 100;
        instance.position.z = 0;
        instance.position.y = 50;
      },
    }
  }
  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
        instance.init();
      }
      return instance;
    },
    update(player, data) {
      if (player instanceof Player) {
        player.cameraPosition.copy(instance.position);
        instance.lookAt(player.mesh.position);
      }
    }
  }
})();

export default Camera;
