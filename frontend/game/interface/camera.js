import * as THREE from 'three';
import Player from '../entities/player';

const Camera = (function () {

  let instance;
  let move = new THREE.Vector3(0, 0, 0);
  let previous = new THREE.Vector3(0, 0, 0);
  let startAlpha = null;

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
        // tyl przod
        player.cameraPosition.copy(instance.position);
        move.subVectors(player.mesh.position, previous);
        previous.copy(player.mesh.position);
        instance.position.addVectors(instance.position, move);
        instance.lookAt(player.mesh.position);        
      }
      if (data.hasOwnProperty('alpha')) {
        if (startAlpha === null) {
          startAlpha = data.alpha;
        } else {
          if (data.gamma < 45) {
            let angleDifference;
            if (data.alpha > 180)
              angleDifference =  startAlpha - data.alpha + 360
            else 
              angleDifference  = startAlpha - data.alpha;
            angleDifference = angleDifference.map(-180,180, -Math.PI/4,Math.PI/4);
            angleDifference = Math.sign(angleDifference) * Math.pow(angleDifference, 2);
            if (Math.abs(angleDifference) < 0.1 ) {
              let s = Math.sin(angleDifference);
              let c = Math.cos(angleDifference);
              instance.position.subVectors(instance.position, player.mesh.position);
              let pos = instance.position;
              instance.position.set(pos.x * c - pos.z * s, pos.y, pos.x * s + pos.z * c);
              instance.position.addVectors(instance.position, player.mesh.position);
              instance.lookAt(player.mesh.position);
            }
          } 
        }
      }
    }
  }
})();

export default Camera;
