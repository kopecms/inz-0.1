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
    this.tmp = new THREE.Vector3(0, 0, 0);
    this.tmp2 = new THREE.Vector3(0, 0, 0);
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
    return cube;
  }
  _createBody(position) {
    let shape = new CANNON.Sphere(5);
    let body = new CANNON.Body({
      position: position,
      mass: 100,
      material: Physic.getMaterial('playerMaterial'),
      collisionFilterGroup: 2, // Put the box in group 2
      collisionFilterMask: 1 | 2 // It ca
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
    return mesh;
  }
  update(data) {
    if (this.body.position.y < -50) {
      this.body.position.set(0, 50, 0);
      this.body.velocity.set(0, 0, 0);
    }
    this.direction.set(0, 0, 0);
    this.direction = this.direction.subVectors(this.mesh.position, this.cameraPosition).normalize();
    if (data.hasOwnProperty('gamma') && data.hasOwnProperty('beta')) {
          // vector postopadly (A,B) -> (-B,A)
          this.tmp = this.direction;
          this.tmp2.set(-this.tmp.z, 0, this.tmp.x);
          let gammaMapped = data.gamma.map(-90, 90, 1, -1) 
          gammaMapped = Math.sign(gammaMapped) * Math.pow(gammaMapped, 2) + 0.5;
          this.tmp.multiplyScalar((Math.sign(gammaMapped)*1 - gammaMapped) * config.game.player.speed);
          let betaMapped = data.beta.map(-180, 180, -1, 1);
          betaMapped = Math.sign(betaMapped) * Math.pow(betaMapped*2, 2)
          if (Math.sign(gammaMapped) > 0) {
            this.tmp2.multiplyScalar( betaMapped * config.game.player.speed);
          }
          else {
            this.tmp2.multiplyScalar(Math.sign(betaMapped) * (1 - Math.abs(betaMapped)) * config.game.player.speed);
          }
          let x = this.tmp.x + this.tmp2.x;
          let z = this.tmp.z + this.tmp2.z;
          if (x && Math.abs(x) < config.game.player.speed && z && Math.abs(z) < config.game.player.speed)
            this.body.velocity.set(x, this.body.velocity.y, z);
    }
    if (data.hasOwnProperty('diving') && !this.diving && this.inAir && data.diving) {
      this.diving = true;
      this.body.velocity.y = -100;
    }
    if (data.hasOwnProperty('jump') && !this.inAir && data.jump) {
      this.inAir = true;
      this.body.velocity.y = 100;
    }
    if (Math.abs(this.body.velocity.y) < 0.1) {
      this.inAir = false;
      this.diving = false;
    }
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
