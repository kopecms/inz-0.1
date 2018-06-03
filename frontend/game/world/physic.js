import * as CANNON from 'cannon';
import * as THREE from 'three';
import Player from '../entities/player';
import Camera from '../interface/camera';
import initMaterials from './materials';
import { inspect } from 'util';

const Physic = (() => {
  let instance;
  let timeStep = 1 / 60;
  let updateList = [];
  let materials = {};
  let tempTextIdVector = new THREE.Vector3();

  const createInstance = () => {
    const init = () => {
      instance = new CANNON.World();
      instance.gravity.set(0, -100, 0);
      instance.broadphase = new CANNON.NaiveBroadphase();
      instance.solver.iterations = 10;
      initMaterials(instance, materials);
    };
    return {
      init: init,
      instance: instance,
    }
  }

  return {
    addEntity: (entity) => {
      updateList.push(entity);
    },
    update: () => {
      instance.step(timeStep);
      updateList.forEach((entity) => {
        entity.mesh.position.copy(entity.body.position);
        entity.mesh.quaternion.copy(entity.body.quaternion);
        if (entity instanceof Player && entity.idTextMesh) {
          entity.idTextMesh.position.set(
            entity.body.position.x, entity.body.position.y + 15, entity.body.position.z
          );
          entity.idTextMesh.lookAt(Camera.getInstance().position);
        }
      });
    },
    getMaterial(name) {
      return materials[name];
    },
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
        instance.init();
      }
      return instance;
    },
  }
})();

export default Physic;