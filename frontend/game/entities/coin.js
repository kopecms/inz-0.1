import * as CANNON from 'cannon';
import * as THREE from 'three';
import Scene from '../world/scene';
import config from '../../../config/config-front';

class Coin {
  constructor(id, color=config.colors.red) {
    this.id = id;
    let geometry = new THREE.CylinderGeometry(config.game.coin.r, config.game.coin.r, config.game.coin.h, config.game.coin.rSegments);
    let material = new THREE.MeshLambertMaterial({ color });
    let coin = new THREE.Mesh(geometry, material);
    coin.castShadow = true;
    coin.receiveShadow = true;
    let scene = Scene.getInstance();
    scene.add(coin);
    coin.rotation.x = Math.PI/2;
    this.mesh = coin;
    this.deleted = false;
  }

  setPosition(x, y, z) {
    this.mesh.position.set(x, y, z);
  }

  delete() {
    let scene = Scene.getInstance();
    scene.remove(this.mesh);
    this.deleted = true;
  }

  update() {
    this.mesh.rotation.z += 0.05;
  }
}

export default Coin;