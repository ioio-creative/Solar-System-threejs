export function isOrbiting(celestialObject) {
  var centerArray = (celestialObject.center).split(" ", 3);
  if (isNaN(parseFloat(centerArray[0])) === false && isNaN(parseFloat(centerArray[1])) === false && isNaN(parseFloat(centerArray[2])) === false) {
    //Has valid coordinates
    return false;
  } else {
    //Is orbiting something else
    return true;
  }
}

//Search for array for the the parent body
export function getParentBody(celestialObject, celestialObjectArray) {
  for (var i = 0; i < celestialObjectArray.length; i++) {
    if (celestialObjectArray[i].name === celestialObject.center) {
      //Found the parent body
      return {
        inclination: celestialObjectArray[i].inclination
      }
    }
  }
}

export function getBodyNames(planetarySystemsArray) {
	var array = [];
	for (var i = 0; i < planetarySystemsArray.length; i++) {
		array[i] = planetarySystemsArray[i].name;
	}
	return array;
}

export function getBodyByName(bodyName, planetarySystemsArray) {
  for (var i = 0; i< planetarySystemsArray.length; i++) {
    if (planetarySystemsArray[i].name === bodyName) {
      return planetarySystemsArray[i];
    }
  }
}

export function wrapNumber(number, wrap) {
  if (number > wrap) {
    return number - (number - (number % wrap))
  } else {
    return number;
  }
}

export function checkDegToRad(number) {
  var numberArray = number.split(" ", 2);
  var parsedNum = parseFloat(numberArray[0]);
  if (typeof parsedNum === "number" && numberArray[1] === "deg") {
    //Is degree
    return parsedNum * Math.PI / 180;
  } else {
    //Is not degree
    return parsedNum;
  }
}

export function degToRad(number) {
  return number * Math.PI / 180;
}

export function radToDeg(number) {
  return number * 180 / Math.PI;
}

export function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return  (
        "rgb("+parseInt(result[1], 16)+", "+parseInt(result[2], 16)+", "+parseInt(result[3], 16)+")"
    )
}
