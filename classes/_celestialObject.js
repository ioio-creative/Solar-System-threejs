import { isOrbiting, hexToRgb } from './_logic.js'

var THREE = require('three');

export function createCelestialObjectsFromArray(celestialObjectArray, scene) {
  for (var i = 0; i < celestialObjectArray.length; i++) {
    createCelestialObject(scene, celestialObjectArray[i]);
  }
}

export function createCelestialObject (scene, celestialObject) {
  var geometry = new THREE.SphereGeometry(parseFloat(celestialObject.scale), 50, 50);
  var material = new THREE.MeshBasicMaterial( {color: hexToRgb(celestialObject.color) } );
  var object = new THREE.Mesh(geometry, material);

  //Lighting
  object.castShadow = true;

  //Check if emissive
  if (celestialObject.intensity !== undefined) {
    object.receiveShadow = false;
    // var vertices = geometry.vertices;
    // for (var i = 0; i < vertices.length; i++) {
    //   var light = new THREE.PointLight(hexToRgb(celestialObject.color), parseFloat(celestialObject.intensity), parseFloat(celestialObject.intensity) * 50, 2);
    //   light.position.x = vertices[i].x + 0.01;
    //   light.position.y = vertices[i].y + 0.01;
    //   light.position.z = vertices[i].z + 0.01;
    //   light.name = celestialObject.name + "Light" + i.toString();
    //   light.castShadow = true;
    //   scene.add(light);
    // }
    
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
