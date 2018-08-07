import './static/css/styles.scss'
import planetarySystems from './static/data/planetarySystems.json'
import { createCelestialObject, createCelestialObjectsFromArray } from './classes/_celestialObject.js'
import { drawOrbit, drawOrbitsFromArray } from './classes/_orbits.js'
import { createSky } from './classes/_sky.js'
import sky from './static/img/milkyway.jpg'

var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var findRoot = require('modified-newton-raphson');
const dat = require('dat.gui');

var scene;
var renderer;
var camera;
var controls;
var container;
var bodyToFocus;
var cameraPosition;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var systems = planetarySystems;
var nameDropdown;

// custom global variables
var animationSpeed = 0.3;
var deltaT = 0;

function init(containerId) {
	//Setup scene and renderer
	container = document.getElementById(containerId);
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( container.clientWidth, container.clientHeight, false );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.physicallyCorrectLights = true;
	container.appendChild( renderer.domElement );

	//Camera and controls
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 ); //FOV, aspect ratio, near (closer won't be rendered), far (further than that won't be rendered)
	camera.position.z = 5;
	camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
	controls = new OrbitControls(camera, renderer.domElement);

	//Ambient lighting
  var ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

	// when the mouse moves, call the given function
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
}

function onWindowResize() {
  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;
  // update the camera's frustum
  camera.updateProjectionMatrix();
  // update the size of the renderer AND the canvas
  renderer.setSize( container.clientWidth, container.clientHeight );
}

function onDocumentMouseDown( event )
{
	// the following line would stop any other event handler from firing
	// (such as the mouse's TrackballControls)
	// event.preventDefault();

	// update the mouse variable
	mouse.x = ( event.clientX / container.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / container.clientHeight ) * 2 + 1;

	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	var intersectObject = raycaster.intersectObjects( scene.children );

	// if there is one (or more) intersections
	if ( intersectObject.length > 0 )
	{
		if (intersectObject[0].object.name === "$%%Skybox%%$") {
			//Do nothing as intersected Skybox
		} else {
			bodyToFocus = scene.getObjectByName(intersectObject[0].object.name)
			focusCamera(bodyToFocus);
			//Set selected
			setSelectedValue(nameDropdown.domElement.children[0], intersectObject[0].object.name);
		}
	}

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
	drawOrbitsFromArray(systems.CelestialObjects, scene, deltaT, animationSpeed);
	deltaT += 1;
	if (bodyToFocus === undefined) {
		//Do nothing
	} else {
		focusCamera(bodyToFocus);
	}
}

// render, or 'draw a still image', of the scene
function render() {
  renderer.render( scene, camera );
}

function focusCamera(objectToFocus) {

	camera.lookAt( new THREE.Vector3( objectToFocus.position.x, objectToFocus.position.y, objectToFocus.position.z ) );
	// update the camera's frustum
  camera.updateProjectionMatrix();
}

function buildGui() {
	var gui = new dat.GUI();

	var params = {
		name: "Celestial body"

	}

	nameDropdown = gui.add(params, 'name', getBodyNames(systems.CelestialObjects)).onChange(function(val){
		bodyToFocus = scene.getObjectByName(val);
	});



	gui.open;
}

function getBodyNames(planetarySystemsArray) {
	var array = [];
	for (var i = 0; i < planetarySystemsArray.length; i++) {
		array[i] = planetarySystemsArray[i].name;
	}
	return array;
}

function setSelectedValue(selectObj, valueToSet) {
    for (var i = 0; i < selectObj.options.length; i++) {
        if (selectObj.options[i].text== valueToSet) {
            selectObj.options[i].selected = true;
            return;
        }
    }
}


init("container");
window.addEventListener( 'resize', onWindowResize );

createSky(scene, sky);

createCelestialObjectsFromArray(systems.CelestialObjects, scene);

buildGui();

start();
