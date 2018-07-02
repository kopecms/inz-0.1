import * as THREE from 'three';
import * as CANNON from 'cannon';
import Box from '../entities/box';
import Physic from './physic';
import FootballPitch from '../entities/football-pitch';

const Scene = (() => {

  var instance;

  const createInstance = () => {
    const init = () => {
      instance = new THREE.Scene();
      initLight();
      initEnviroment();
    };

    const initLight = () => {
      let hemisphereLight, shadowLight, ambientLight;

      // A hemisphere light is a gradient colored light;
      // the first parameter is the sky color, the second parameter is the ground color,
      // the third parameter is the intensity of the light
      hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.6)

      // A directional light shines from a specific direction.
      // It acts like the sun, that means that all the rays produced are parallel.
      shadowLight = new THREE.DirectionalLight(0xffffff, .5);

      // Set the direction of the light
      shadowLight.position.set(150, 350, 350);

      // Allow shadow casting
      shadowLight.castShadow = true;

      // define the visible area of the projected shadow
      shadowLight.shadow.camera.left = -400;
      shadowLight.shadow.camera.right = 400;
      shadowLight.shadow.camera.top = 400;
      shadowLight.shadow.camera.bottom = -400;
      shadowLight.shadow.camera.near = 1;
      shadowLight.shadow.camera.far = 1000;

      // define the resolution of the shadow; the higher the better,
      // but also the more expensive and less performant
      shadowLight.shadow.mapSize.width = 2048;
      shadowLight.shadow.mapSize.height = 2048;

      ambientLight = new THREE.AmbientLight(0x404040); // soft white light
      instance.add(ambientLight)
      instance.add(hemisphereLight);
      instance.add(shadowLight);
    };

    const initEnviroment = () => {
      let footbalPitch = new FootballPitch(5);
    }

    return {
      init: init,
      instance: instance,
    }
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
        instance.init();
      }
      return instance;
    }
  }
})();

export default Scene;
