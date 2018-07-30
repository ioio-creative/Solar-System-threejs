import { isOrbiting, hexToRgb } from './_logic.js'

var THREE = require('three');

export function createCelestialObject (scene, celestialObject) {
  var geometry = new THREE.SphereGeometry(parseFloat(celestialObject.scale), 50, 50);
  var material = new THREE.MeshBasicMaterial( {color: hexToRgb(celestialObject.color) } );
  var object = new THREE.Mesh(geometry, material);

  //Lighting
  object.castShadow = true;
  //Check if emissive
  if (celestialObject.intensity !== "") {
    object.receiveShadow = false;
  } else {
    // Not emmsive, get shadows
    object.receiveShadow = true;
  }

  object.name = celestialObject.name;

  if (isOrbiting(celestialObject)) {
    //Not valid coordinates, don't do stuff, default to 0, 0, 0
  } else {
    var centerArray = (celestialObject.center).split(" ", 3);
    //Center is a valid coordinate, set coordinates
    object.position.x = parseFloat(centerArray[0]);
    object.position.y = parseFloat(centerArray[1]);
    object.position.z = parseFloat(centerArray[2]);
  }

  //Add the celestialObject to the scene
  scene.add(object);
}
