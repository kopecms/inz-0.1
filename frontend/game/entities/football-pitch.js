import * as CANNON from 'cannon';
import * as THREE from 'three';

import Scene from '../world/scene';
import Physic from '../world/physic';
import Box from './box';
import config from '../../../config/config-front';

class FootballPitch {
  constructor(size, color) {
    this.size = size;
    this.color = color;
    
    this.lineW = 5;
    this.margin = 5;
    this.gateW = 2;
    this.h = 105*this.size;
    this.w = 68*this.size;

    this.lowerBarrierH = 25;

    this._createFootballPitch();
    this._drawLines();
    this._drawGates();
    this._createBarriers();
  }
  _createBarriers(){
      //rigth
      let boxUp = new Box(this.h, this.lowerBarrierH, 3, 0);
      boxUp.mesh.rotateX(Math.PI/4);
      boxUp.setRotation();
      boxUp.setPosition(0, this.lowerBarrierH/2-4,this.w/2+this.lowerBarrierH/2*Math.cos(Math.PI/4)/2);
      Physic.addEntity(boxUp);
      //left
      let leftBox = new Box(this.h, this.lowerBarrierH, 3, 0);
      leftBox.mesh.rotateX(-Math.PI/4);
      leftBox.setRotation();
      leftBox.setPosition(0, this.lowerBarrierH/2-4,-this.w/2-this.lowerBarrierH/2*Math.cos(Math.PI/4)/2);
      Physic.addEntity(leftBox);

      let frontBox = new Box(3, this.lowerBarrierH, this.w, 0);
      frontBox.mesh.rotateZ(-Math.PI/4);
      frontBox.setRotation();
      frontBox.setPosition(this.h/2+this.lowerBarrierH/2*Math.cos(Math.PI/4)/2, this.lowerBarrierH/2-4,0);
      Physic.addEntity(frontBox);

      let backBox = new Box(3, this.lowerBarrierH, this.w, 0);
      backBox.mesh.rotateZ(Math.PI/4);
      backBox.setRotation();
      backBox.setPosition(-this.h/2-this.lowerBarrierH/2*Math.cos(Math.PI/4)/2, this.lowerBarrierH/2-4,0);
      Physic.addEntity(backBox);
  }
  _drawGates() {
    this._drawGate(1);
    this._drawGate(-1);
    }
  _drawGate(site) {
    this.gh = 5.5*this.size;
    this.gw = 16*this.size;
    let boxUp = new Box(this.gateW, this.gateW, this.gw+this.gateW, 0);
    boxUp.setPosition(site*this.h/2-site*this.margin,this.gh+2,0);
    Physic.addEntity(boxUp);
    let boxRight = new Box(this.gateW, this.gh, this.gateW, 0);
    boxRight.setPosition(site*this.h/2-site*this.margin,(this.gh+4)/2,-this.gw/2);
    Physic.addEntity(boxRight);
    let boxLeft = new Box(this.gateW, this.gh, this.gateW, 0);
    boxLeft.setPosition(site*this.h/2-site*this.margin,(this.gh+4)/2,this.gw/2);
    Physic.addEntity(boxLeft);
  }
  _drawLine(h, posX, posY, rotateAngle) {
    let material = new THREE.MeshLambertMaterial({ color: config.colors.white });
    let lineGeo = new THREE.BoxGeometry(h, 0.1, this.lineW);
    let lineMesh = new THREE.Mesh(lineGeo, material);
    lineMesh.receiveShadow = true;
    lineMesh.castShadow = false;
    let scene = Scene.getInstance();
    lineMesh.position.set(posX, 2.01, posY);
    lineMesh.rotateY(rotateAngle);
    scene.add(lineMesh);
  }
  _drawLines() {
    this._drawRing(0, 0, 0, 0, 2*Math.PI);
    
    this._drawRing(this.size*9.15, 0, 0, 0, 2*Math.PI);
    
    this._drawRing(this.size*1, this.h/2 - this.margin, this.w/2 - this.margin, Math.PI/2, 1/2*Math.PI);
    this._drawRing(this.size*1, -this.h/2 + this.margin, this.w/2 - this.margin, 0, 1/2*Math.PI);
    this._drawRing(this.size*1, this.h/2 - this.margin, -(this.w/2 - this.margin), Math.PI, 1/2*Math.PI);
    this._drawRing(this.size*1, -this.h/2 + this.margin, -(this.w/2 - this.margin), -Math.PI/2, 1/2*Math.PI);
    
    this._drawLine(this.h - this.margin, 0, this.w/2 - this.margin, 0 );
    this._drawLine(this.h - this.margin, 0, -this.w/2 + this.margin, 0 );
    this._drawLine(this.w - this.margin, this.h/2 - this.margin, 0, Math.PI/2 );
    this._drawLine(this.w - this.margin, -this.h/2 + this.margin, 0, Math.PI/2 );
    this._drawLine(this.w - this.margin, 0, 0, Math.PI/2 );
    
    this._drawPenaltyPost(16.5, 40.32, 1);
    this._drawPenaltyPost(5.5, 18.32, 1);
    this._drawPenaltyPost(16.5, 40.32, -1);
    this._drawPenaltyPost(5.5, 18.32, -1);
  }
  _drawRing(r, posX, posY, rotateAngle, theta){
    let material = new THREE.MeshLambertMaterial({ color: config.colors.white });
    let lineGeo = new THREE.RingGeometry(r, r+this.lineW, 32, 1, rotateAngle, theta);
    let lineMesh = new THREE.Mesh(lineGeo, material);
    lineMesh.receiveShadow = true;
    lineMesh.castShadow = true;
    let scene = Scene.getInstance();
    lineMesh.position.set(posX, 2.1, posY);
    lineMesh.rotateX(-Math.PI/2);
    scene.add(lineMesh);
  }
  _drawPenaltyPost(h,w,site) {
    this.ph = h*this.size;
    this.pw = w*this.size;
    this.pMargin = (this.w - this.pw)/2;
    this._drawLine(this.ph, site*(this.h/2 - this.ph/2 - this.margin), this.w/2 - this.pMargin - this.margin/2, 0 );
    this._drawLine(this.ph, site*(this.h/2 - this.ph/2 - this.margin), -this.w/2 + this.pMargin + this.margin/2, 0 );
    this._drawLine(this.pw, site*(this.h/2 - this.margin - this.ph), 0, Math.PI/2 );
  }
  _createFootballPitch() {
    let materialBlue = new THREE.MeshLambertMaterial({ color: config.colors.green });
    let planeGeometry = new THREE.BoxGeometry(this.h, 2, this.w);
    let plane = new THREE.Mesh(planeGeometry, materialBlue);
    plane.receiveShadow = true;
    let scene = Scene.getInstance();
    scene.add(plane);

    var groundShape = new CANNON.Box(new CANNON.Vec3(this.h/2, 1, this.w/2));
    var groundBody = new CANNON.Body({
      mass: 0,
      shape: groundShape,
      material: Physic.getMaterial('basicMaterial'),
      collisionFilterGroup: 1,
      collisionFilterMask: 1 | 2
    });
    var physic = Physic.getInstance();
    physic.addBody(groundBody);
  }
}

export default FootballPitch;
