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

export function wrapNumber(number, wrap) {
  if (number > wrap) {
    return number - (number - (number % wrap))
  } else {
    return number;
  }
}

export function degtoRad(number) {
  return number * Math.PI / 180;
}

export function radtoDeg(number) {
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
