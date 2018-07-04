const CANNON = require('cannon');
const config = require('config');
const configCommon = require('../../config/config-common');
const initMaterials = require('../../common/materials');
class World {
  constructor() {
    this.timeStep = 1/60;
    this.instance = new CANNON.World();
    this.instance.gravity.set(0, -100, 0);
    this.instance.broadphase = new CANNON.NaiveBroadphase();
    this.instance.solver.iterations = 10;
    this.materials = {};
    initMaterials(this.instance, this.materials);

    let shape = new CANNON.Sphere(configCommon.ballSize);
    this.body = new CANNON.Body({
      mass: 1,
      material: this.materials.physicMaterial,
      collisionFilterGroup: 1,
      collisionFilterMask: 1 | 2
    });
    this.body.addShape(shape);
    this.instance.addBody(this.body);
    this.body.position.set(0, 50, 0);

    this.h = 105*configCommon.footballPitchSize;
    this.w = 68*configCommon.footballPitchSize;
    let groundShape = new CANNON.Box(new CANNON.Vec3(this.h/2, 1, this.w/2));
    let groundBody = new CANNON.Body({
      mass: 0,
      shape: groundShape,
      material: this.materials.basicMaterial,
      collisionFilterGroup: 1,
      collisionFilterMask: 1 | 2
    });
    this.instance.addBody(groundBody);
    this.wallH = 200;
    this.makeWall(0, this.wallH/2, this.w/2, this.h, this.wallH , 1);
    this.makeWall(0, this.wallH/2, -this.w/2, this.h, this.wallH , 1);
    this.makeWall(this.h/2, this.wallH/2, 0, 1, this.wallH , this.h);
    this.makeWall(-this.h/2, this.wallH/2, 0, 1, this.wallH , this.h);
    setInterval(() => {
        this.instance.step(this.timeStep);
    }, config.get('game.updateRate'));
    setInterval(() => {
        console.log(this.body.position)
    }, 500);
  }

  makeWall(p,q,w,x,y,z) {
    let wallShape = new CANNON.Box(new CANNON.Vec3(x/2, y/2, z/2));
    let wall = new CANNON.Body({
      mass: 0,
      shape: wallShape,
      material: this.materials.basicMaterial,
      collisionFilterGroup: 1,
      collisionFilterMask: 1 | 2
    });
    wall.position.set(p,q,w);
    this.instance.addBody(wall);
  }

  getBallInfo() {
    return {
        position: this.body.position,
        velocity: this.body.velocity,
    };
  }

  setBallPosition(x, y, z) {
    this.body.position.set(x, y, z);
  }

  makeCollision(position, velocity) {
    this.body.velocity.x += velocity.x;
    this.body.velocity.y += velocity.y;
    this.body.velocity.z += velocity.z;
    console.log(this.body.velocity, velocity)
  }

  sumVectors(p, q) {
      return {
        x: p.x + q.x,
        y: p.y + q.y,
        z: p.z + q.z,
      }
  }
}

module.exports = World;