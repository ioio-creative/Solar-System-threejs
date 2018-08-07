import { hexToRgb } from './_logic.js'

var THREE = require('three');

export function createSky(scene, file) {
  var geometry = new THREE.SphereGeometry(5000, 64, 32);
  var texture = new THREE.TextureLoader().load(file);
  var material = new THREE.MeshBasicMaterial( { color: hexToRgb("#FFF"), side: THREE.BackSide, map: texture } );
  var sky = new THREE.Mesh(geometry, material);
  sky.name = "$%%Skybox%%$"
  scene.add(sky);
}
