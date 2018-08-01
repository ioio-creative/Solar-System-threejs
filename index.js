import './static/css/styles.scss'
import planetarySystems from './static/data/planetarySystems.json'
import { createCelestialObject } from './classes/_celestialObject.js'
import { drawOrbit } from './classes/_orbits.js'
import { createSky } from './classes/_sky.js'
import sky from './static/img/milkyway.jpg'

var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var findRoot = require('modified-newton-raphson');

var scene;
var renderer;
var camera;
var controls;
var container;

var animationSpeed = 1;
var deltaT = 0;

function init(containerId) {
	//Setup scene and renderer
	container = document.getElementById(containerId);
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( container.clientWidth, container.clientHeight, false );
	container.appendChild( renderer.domElement );

	//Camera and controls
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 ); //FOV, aspect ratio, near (closer won't be rendered), far (further than that won't be rendered)
	camera.position.z = 5;
	camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
	controls = new OrbitControls(camera, renderer.domElement);

	//Ambient lighting
  var ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);
}

function onWindowResize() {
  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;
  // update the camera's frustum
  camera.updateProjectionMatrix();
  // update the size of the renderer AND the canvas
  renderer.setSize( container.clientWidth, container.clientHeight );
}

function start() {
  renderer.setAnimationLoop( () => {
    update();
    render();
  } );
}

function stop() {
  renderer.setAnimationLoop( null );
}

// perform any updates to the scene, called once per frame
// avoid heavy computation here
function update() {
	//Draw orbit functionality here
	drawOrbit(scene, planetarySystems.CelestialObjects[0], deltaT, animationSpeed);
	drawOrbit(scene, planetarySystems.CelestialObjects[1], deltaT, animationSpeed);
	drawOrbit(scene, planetarySystems.CelestialObjects[2], deltaT, animationSpeed);
	deltaT += 1;
}

// render, or 'draw a still image', of the scene
function render() {
  renderer.render( scene, camera );
}

init("container");
window.addEventListener( 'resize', onWindowResize );

createSky(scene, sky);

createCelestialObject(scene, planetarySystems.CelestialObjects[0]);
createCelestialObject(scene, planetarySystems.CelestialObjects[1]);
createCelestialObject(scene, planetarySystems.CelestialObjects[2]);


start();
