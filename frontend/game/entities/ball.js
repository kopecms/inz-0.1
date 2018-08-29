import * as CANNON from 'cannon';
import * as THREE from 'three';

import Scene from '../world/scene';
import Physic from '../world/physic';

import socket from '../interface/socket';
import config from '../../../config/config-front';
import MultiplayerManager from '../world/manager';

class Ball {
  constructor(size, mass=1, color=config.colors.red, physicMaterial=Physic.getMaterial('trampolineMaterial')) {
    var geometry = new THREE.SphereGeometry( size, 10, 10 );
    var material = new THREE.MeshLambertMaterial( {color: color} );
    var sphere = new THREE.Mesh( geometry, material );
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    let scene = Scene.getInstance();
    scene.add( sphere );
    this.mesh = sphere;

    let shape = new CANNON.Sphere(size);
    let body = new CANNON.Body({
      mass: 100,
      material: physicMaterial,
      collisionFilterGroup: 1,
      collisionFilterMask: 1 | 2
    });
    body.addShape(shape);
    this.body = body;

    let physic = Physic.getInstance();
    physic.addBody(body);
    
    this.setEvents();
  }
  setEvents() {
    this.body.addEventListener("collide",(e) => {
      let player = MultiplayerManager.getPlayer();
      if (e.body.id === player.body.id) {
        socket.send('collision', {
          position: this.body.position,
          velocity: this.getKickDirection(this.body, e.body),
        });
      }
    });
  }
  getKickDirection(p, q) {
    let direction = new THREE.Vector3(0,0,0);
    direction.subVectors(p.position, q.position);
    return direction.normalize().multiplyScalar(50 + p.velocity.length());
  }
  setPosition(x, y, z) {
    this.body.position.set(x, y, z);
    this.mesh.position.set(x, y, z);
  }
}

export default Ball;