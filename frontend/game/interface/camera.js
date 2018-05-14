import * as THREE from 'three';

const Camera = (function () {

  let instance;
  let move = new THREE.Vector3(0, 0, 0);
  let previous = new THREE.Vector3(0, 0, 0);

  const createInstance = () => {
    return {
      init() {
        instance = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        instance.position.x = -100;
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
  }
})();

export default Camera;
