const CANNON = require('cannon');
module.exports = function initMaterials(instance, materials) {
    let basicContactMaterial;
    let trampolineContactMaterial;
    let basicPlayerContactMaterial;
    let trampolinePlayerContactMaterial;
    let playerPlayerContactMaterial;
    let basicMaterial;
    let playerMaterial;
    let trampolineMaterial;

    basicMaterial = new CANNON.Material("basicMaterial");
    basicContactMaterial = new CANNON.ContactMaterial(basicMaterial, basicMaterial, {
        friction: 0.1,
        restitution: 0.1,
    });
    materials.basicMaterial = basicMaterial;
    instance.addContactMaterial(basicContactMaterial);

    trampolineMaterial = new CANNON.Material("trampolineMaterial");
    trampolineContactMaterial = new CANNON.ContactMaterial(trampolineMaterial, basicMaterial, {
        friction: 0.0,
        restitution: 10000.0,
    });
    materials.trampolineMaterial = trampolineMaterial;
    instance.addContactMaterial(trampolineContactMaterial);

    playerMaterial = new CANNON.Material("playerMaterial");
    playerMaterial.friction = 0;
    playerMaterial.restitution = 0.01;
    basicPlayerContactMaterial = new CANNON.ContactMaterial(playerMaterial, basicMaterial, {
        friction: 0.9,
        restitution: 0,
    });
    materials.playerMaterial = playerMaterial;
    instance.addContactMaterial(basicPlayerContactMaterial);

    trampolinePlayerContactMaterial = new CANNON.ContactMaterial(playerMaterial, trampolineMaterial, {
        friction: 0.0,
        restitution: 1.1,
    });
    instance.addContactMaterial(trampolinePlayerContactMaterial);

    playerPlayerContactMaterial = new CANNON.ContactMaterial(playerMaterial, playerMaterial, {
        friction: -1,
        restitution: -1,
    });
    instance.addContactMaterial(playerPlayerContactMaterial);
}