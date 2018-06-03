import * as CANNON from 'cannon';
import * as THREE from 'three';

import Scene from '../world/scene';
import Physic from '../world/physic';

import config from '../../../config/config-front';

class Player {
  constructor(id, position) {
    this.id = id;
    this.desirePosition = new THREE.Vector3(0, 0, 0);
    this.desirePosition.copy(position);
    this.desireVelocity = new THREE.Vector3(0, 0, 0);
    this.cameraPosition = new THREE.Vector3(0, 0, 0);
    this.direction = new THREE.Vector3(0, 0, 0);
    this.mesh = this._createMesh();
    this.body = this._createBody(position);

    //
    this.direction = new THREE.Vector3(0, 0, 0);
    this.v = new THREE.Vector3(0, 0, 0);
    this.u = new THREE.Vector3(0, 0, 0);

    let loader = new THREE.FontLoader();
    loader.load(config.game.font, font => {
      this.idTextMesh = this._createText(id, font);
    });

    this.gamma = 0;
    this.beta = 0;
    this.inAir = false;
    this.diving = false;
    Physic.addEntity(this);
  }
  _createMesh() {
    let geometry = new THREE.BoxGeometry(7, 7, 7);
    let material = new THREE.MeshLambertMaterial({ color: config.colors.yellow });
    let cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    let scene = Scene.getInstance();
    scene.add(cube);
    return cube
  }
  _createBody(position) {
    let shape = new CANNON.Sphere(5);
    let body = new CANNON.Body({
      position: position,
      mass: 1000,
      material: Physic.getMaterial('playerMaterial'),
      collisionFilterGroup: 2, // Put the box in group 2
      collisionFilterMask: 1 // It ca
    });
    body.addShape(shape);
    let physic = Physic.getInstance();
    physic.addBody(body);
    return body;
  }
  _createText(id, font) {
    let geometry = new THREE.TextGeometry(id, {
      size: 5,
      height: 1,
      font: font,
    });
    geometry.computeBoundingBox();
    this.idTextShift = 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    let material = new THREE.MeshBasicMaterial({ color: config.colors.yellow });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.rotateY(-Math.PI / 2)
    let scene = Scene.getInstance();
    scene.add(mesh);
    return mesh
  }
  update(data) {
    this.direction.set(0, 0, 0);
    this.direction = this.direction.subVectors(this.mesh.position, this.cameraPosition).normalize();
  }
  delete() {
    let scene = Scene.getInstance();
    scene.remove(this.mesh);
    scene.remove(this.idTextMesh)
    let physic = Physic.getInstance();
    physic.removeBody(this.body);
  }
}

export default Player;
