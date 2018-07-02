import * as CANNON from 'cannon';
import * as THREE from 'three';

import Scene from '../world/scene';
import Physic from '../world/physic';

import config from '../../../config/config-front';

class Box {
  constructor(x, y, z, mass=1, color=config.colors.red, physicMaterial=Physic.getMaterial('basicMaterial')) {
    let geometry = new THREE.BoxGeometry(x, y, z);
    let material = new THREE.MeshLambertMaterial({ color });
    let cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    let scene = Scene.getInstance();
    scene.add(cube);
    this.mesh = cube;

    let shape = new CANNON.Box(new CANNON.Vec3(x / 2, y / 2, z / 2));
    let body = new CANNON.Body({
      mass: mass,
      material: physicMaterial,
      collisionFilterGroup: 1,
      collisionFilterMask: 1 | 2
    });
    body.addShape(shape);
    this.body = body;

    let physic = Physic.getInstance();
    physic.addBody(body);
  }

  setPosition(x, y, z) {
    this.body.position.set(x, y, z);
    this.mesh.position.set(x, y, z);
  }
  setRotation(x, y, z) {
    this.body.rotation.set(x, y, z);
    this.mesh.rotation.set(x, y, z);
  }
}

export default Box;