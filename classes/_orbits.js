import { isOrbiting, getParentBody, wrapNumber, checkDegToRad, hexToRgb } from './_logic.js'

var THREE = require('three');
var findRoot = require('newton-raphson');

export function drawOrbitsFromArray(celestialObjectArray, scene, deltaT = 0, animationSpeed) {
  for (var i = 0; i < celestialObjectArray.length; i++) {
    drawOrbit(scene, celestialObjectArray[i], celestialObjectArray, deltaT, animationSpeed);
  }
}

export function drawOrbit(scene, celestialObject, celestialObjectArray, deltaT = 0, animationSpeed) {
  var meanAnomaly = getMeanAnomaly(celestialObject, deltaT, animationSpeed);
  var eccentricAnomaly = getEccentricAnomaly(celestialObject, meanAnomaly);
  var trueAnomaly = getTrueAnomaly(celestialObject, eccentricAnomaly);
  var radius = getRadius(celestialObject, trueAnomaly);
  var objectToDraw = scene.getObjectByName(celestialObject.name);

  // console.log(trueAnomaly);
  if (isOrbiting(celestialObject)) {
    //Fetch parent body center and use that as its center
    var parentBody = scene.getObjectByName(celestialObject.center);
    var inclination = checkDegToRad(celestialObject.inclination) + checkDegToRad(getParentBody(celestialObject, celestialObjectArray).inclination);
    var coordinates = orbitCoordinates(celestialObject, trueAnomaly, radius, inclination);

    //Draw position
    objectToDraw.position.x = parentBody.position.x + coordinates.x;
    objectToDraw.position.y = parentBody.position.y + coordinates.y;
    objectToDraw.position.z = parentBody.position.z + coordinates.z;
  } else {
    // Draw orbit directly using orbit parameters
    var inclination = checkDegToRad(celestialObject.inclination);
    var coordinates = orbitCoordinates(celestialObject, trueAnomaly, radius, inclination);
    objectToDraw.position.x = coordinates.x;
    objectToDraw.position.y = coordinates.y;
    objectToDraw.position.z = coordinates.z;
  }

  if (celestialObject.intensity !== undefined) {
    //Is emitting body, update light positions
    // var vertices = objectToDraw.geometry.vertices;
  }
}

//Time to get mathy

function getMeanAnomaly(celestialObject, deltaT, animationSpeed) {
  var meanAnomaly = checkDegToRad(celestialObject.mean_anomaly);
  var newMeanAnomaly = meanAnomaly + ((2 * Math.PI)/(celestialObject.period * (1/animationSpeed) )) * deltaT;
  return wrapNumber(newMeanAnomaly, 2 * Math.PI);
}

function getEccentricAnomaly(celestialObject, meanAnomaly) {
  var eccentricity = parseFloat(celestialObject.eccentricity);
  // Function and first and second derivatives to use the Newton-Raphson method to approximate a root
  function f(x){return x - eccentricity * Math.sin(x) - meanAnomaly;}
  function fp(x) {return 1 - eccentricity * Math.cos(x);}

  return wrapNumber(findRoot(f, fp, Math.PI), 2 * Math.PI);
}

function getTrueAnomaly(celestialObject, eccentricAnomaly) {
  var eccentricity = parseFloat(celestialObject.eccentricity);
  var trueAnomaly = 2 * Math.atan( Math.pow((1 + eccentricity)/(1 - eccentricity), 0.5 ) * Math.tan(eccentricAnomaly/2) );
  if (trueAnomaly < 0) {
    trueAnomaly = trueAnomaly + 2 * Math.PI;
    return trueAnomaly;
  } else {
    return trueAnomaly;
  }
}

function getRadius(celestialObject, trueAnomaly) {
  var semimajor_axis = parseFloat(celestialObject.semimajor_axis);
  var eccentricity = parseFloat(celestialObject.eccentricity);
  return ( semimajor_axis * (1 - Math.pow(eccentricity, 2)) )/( 1 + eccentricity * Math.cos(trueAnomaly) );
}

function orbitCoordinates(celestialObject, trueAnomaly, radius, inclination) {
  var true_anomaly = trueAnomaly;
  var longitude = checkDegToRad(celestialObject.longitude);
  var periapsis_arg = checkDegToRad(celestialObject.periapsis_arg);

  var x = radius * ( Math.cos(longitude) * Math.cos(periapsis_arg + true_anomaly) - Math.sin(longitude) * Math.sin(periapsis_arg + true_anomaly) * Math.cos(inclination) );
  var y = radius * ( Math.sin(longitude) * Math.cos(periapsis_arg + true_anomaly) + Math.cos(longitude) * Math.sin(periapsis_arg + true_anomaly) * Math.cos(inclination) );
  var z = radius * ( Math.sin(inclination) * Math.sin(periapsis_arg + true_anomaly) );

  return {
    x: x,
    y: y,
    z: z
  }
}
