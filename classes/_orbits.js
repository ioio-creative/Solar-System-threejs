import { isOrbiting, hexToRgb } from './_logic.js'

var THREE = require('three');

export function drawOrbit(scene, celestialObject) {
  if (isOrbiting(celestialObject)) {
    //Fetch parent body center and use that as its center
    var parentBody = scene.getObjectByName(celestialObject.center);
  } else {
    //Draw orbit directly using orbit parameters
  }
}

function getOrbitCoordinates(celestialObject) {

  return {
    // x: ,
    // y: ,
    // z: ,
  }
}
