import planetarySystems from './static/data/planetarySystems.json'
import { createCelestialObject, createCelestialObjectsFromArray } from './classes/_celestialObject.js'
import { drawOrbit, drawOrbitsFromArray } from './classes/_orbits.js'
import { createSky } from './classes/_sky.js'
import { setSelectedValue, updateGui } from './classes/_gui.js'
import { getBodyNames, getBodyByName, radToDeg, degToRad } from './classes/_logic.js'
import sky from './static/img/milkyway.jpg'

var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var findRoot = require('modified-newton-raphson');
const dat = require('dat.gui');
import './static/css/styles.scss'

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

//GUI
var gui = new dat.GUI();
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
			updateGuiParams();
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

	var newCelestialObject = {
		name: "Celestial body",
		scale: 1,
		centerX: 0,
		centerY: 0,
		centerZ: 0,
		center: "0 0 0",
		eccentricity: 0.1,
		semimajor_axis: 10,
		inclination: 0,
		longitude: 0,
		periapsis_arg: 0,
		mean_anomaly: 0,
		period: 100,
		color: "#fff000",
	};

	nameDropdown = gui.add(params, 'name', getBodyNames(systems.CelestialObjects)).onChange(function(val) {
		bodyToFocus = scene.getObjectByName(val);
		updateGuiParams();
	});

	gui.add(params, 'scale', 0, 50).onChange(function(val) {
		var bodyToModify = getBodyByName(bodyToFocus.name, systems.CelestialObjects);
		bodyToModify.scale = val;
		scene.remove(scene.getObjectByName(bodyToModify.name));
		createCelestialObject(scene, bodyToModify);
		bodyToFocus = scene.getObjectByName(bodyToFocus.name);
		render();
	});

	gui.add(params, 'eccentricity', 0.000, 0.980).onChange(function(val) {
		var bodyToModify = getBodyByName(bodyToFocus.name, systems.CelestialObjects);
		bodyToModify.eccentricity = val
		scene.remove(scene.getObjectByName(bodyToModify.name));
		createCelestialObject(scene, bodyToModify);
		bodyToFocus = scene.getObjectByName(bodyToFocus.name);
		render();
	});

	gui.add(params, 'semimajor_axis', 0, 1000).onChange(function(val) {
		var bodyToModify = getBodyByName(bodyToFocus.name, systems.CelestialObjects);
		bodyToModify.semimajor_axis = val;
		scene.remove(scene.getObjectByName(bodyToModify.name));
		createCelestialObject(scene, bodyToModify);
		bodyToFocus = scene.getObjectByName(bodyToFocus.name);
		render();
	});

	gui.add(params, 'inclination', 0, 90).onChange(function(val) {
		var bodyToModify = getBodyByName(bodyToFocus.name, systems.CelestialObjects);
		bodyToModify.inclination = val.toString() + " deg";
		scene.remove(scene.getObjectByName(bodyToModify.name));
		createCelestialObject(scene, bodyToModify);
		bodyToFocus = scene.getObjectByName(bodyToFocus.name);
		render();
	});

	gui.add(params, 'longitude', 0, 360).onChange(function(val) {
		var bodyToModify = getBodyByName(bodyToFocus.name, systems.CelestialObjects);
		bodyToModify.longitude = val.toString() + " deg";
		scene.remove(scene.getObjectByName(bodyToModify.name));
		createCelestialObject(scene, bodyToModify);
		bodyToFocus = scene.getObjectByName(bodyToFocus.name);
		render();
	});

	gui.add(params, 'periapsis_arg', 0, 360).onChange(function(val) {
		var bodyToModify = getBodyByName(bodyToFocus.name, systems.CelestialObjects);
		bodyToModify.periapsis_arg = val.toString() + " deg";
		scene.remove(scene.getObjectByName(bodyToModify.name));
		createCelestialObject(scene, bodyToModify);
		bodyToFocus = scene.getObjectByName(bodyToFocus.name);
		render();
	});

	gui.add(params, 'mean_anomaly', 0, 360).onChange(function(val) {
		var bodyToModify = getBodyByName(bodyToFocus.name, systems.CelestialObjects);
		bodyToModify.mean_anomaly = val.toString() + " deg";
		scene.remove(scene.getObjectByName(bodyToModify.name));
		createCelestialObject(scene, bodyToModify);
		bodyToFocus = scene.getObjectByName(bodyToFocus.name);
		render();
	});

	gui.add(params, 'period', 0, 10000).onChange(function(val) {
		var bodyToModify = getBodyByName(bodyToFocus.name, systems.CelestialObjects);
		bodyToModify.period = val.toString();
		scene.remove(scene.getObjectByName(bodyToModify.name));
		createCelestialObject(scene, bodyToModify);
		bodyToFocus = scene.getObjectByName(bodyToFocus.name);
		render();
	});

	gui.addColor(params, 'color').onChange(function(val) {
		var bodyToModify = getBodyByName(bodyToFocus.name, systems.CelestialObjects);
		bodyToModify.color = val;
		scene.remove(scene.getObjectByName(bodyToModify.name));
		createCelestialObject(scene, bodyToModify);
		bodyToFocus = scene.getObjectByName(bodyToFocus.name);
		render();
	});

	var createObject = gui.addFolder('Create Celestial Object');
	createObject.add(newCelestialObject, 'name')
	createObject.add(newCelestialObject, 'scale', 0, 50);
	createObject.add(newCelestialObject, 'centerX');
	createObject.add(newCelestialObject, 'centerY');
	createObject.add(newCelestialObject, 'centerZ');
	createObject.add(newCelestialObject, 'eccentricity', 0, 0.98);
	createObject.add(newCelestialObject, 'semimajor_axis', 0, 1000);
	createObject.add(newCelestialObject, 'inclination', 0, 90);
	createObject.add(newCelestialObject, 'longitude', 0, 360);
	createObject.add(newCelestialObject, 'periapsis_arg', 0, 360);
	createObject.add(newCelestialObject, 'mean_anomaly', 0, 360);
	createObject.add(newCelestialObject, 'period', 0, 10000);
	createObject.addColor(newCelestialObject, 'color');
	var objectToAdd = { add:function(){
		var objectHolder = {};
		objectHolder.name = newCelestialObject.name;
		objectHolder.scale = newCelestialObject.scale.toString();
		objectHolder.center = newCelestialObject.centerX.toString() + " " + newCelestialObject.centerY.toString() + " " + newCelestialObject.centerZ.toString();
		objectHolder.inclination = newCelestialObject.inclination.toString() + " deg";
		objectHolder.eccentricity = newCelestialObject.eccentricity.toString();
		objectHolder.semimajor_axis = newCelestialObject.semimajor_axis.toString();
		objectHolder.longitude = newCelestialObject.longitude.toString() + " deg";
		objectHolder.periapsis_arg = newCelestialObject.periapsis_arg.toString() + " deg";
		objectHolder.mean_anomaly = newCelestialObject.mean_anomaly.toString() + " deg";
		objectHolder.period = newCelestialObject.period.toString();
		objectHolder.color = newCelestialObject.color;
		createCelestialObject(scene, objectHolder);
		systems.CelestialObjects.push(objectHolder);

		render();
		// Set selected
		bodyToFocus = scene.getObjectByName(objectHolder.name);
		updateGuiParams();
		//Update name dropdown
		while(nameDropdown.domElement.children[0].firstChild) {
			//Remove all previous elements in dropdown
			nameDropdown.domElement.children[0].removeChild(nameDropdown.domElement.children[0].firstChild);
		}
		for(var i = 0; i < systems.CelestialObjects.length; i++) {
    	var dropdownName = getBodyNames(systems.CelestialObjects)[i];
    	var dropdownItem = document.createElement("option");
    	dropdownItem.textContent = dropdownName;
    	dropdownItem.value = dropdownName;
    	nameDropdown.domElement.children[0].appendChild(dropdownItem);
		};
		setSelectedValue(nameDropdown.domElement.children[0], objectHolder.name);
	}};
	createObject.add(objectToAdd, 'add');

	gui.open;
}

function updateGuiParams() {
	params.scale = parseFloat(getBodyByName(bodyToFocus.name, systems.CelestialObjects).scale);
	params.eccentricity = parseFloat(getBodyByName(bodyToFocus.name, systems.CelestialObjects).eccentricity);
	params.semimajor_axis = parseFloat(getBodyByName(bodyToFocus.name, systems.CelestialObjects).semimajor_axis);
	params.inclination = parseFloat(getBodyByName(bodyToFocus.name, systems.CelestialObjects).inclination);
	params.longitude = parseFloat(getBodyByName(bodyToFocus.name, systems.CelestialObjects).longitude);
	params.periapsis_arg = parseFloat(getBodyByName(bodyToFocus.name, systems.CelestialObjects).periapsis_arg);
	params.mean_anomaly = parseFloat(getBodyByName(bodyToFocus.name, systems.CelestialObjects).mean_anomaly);
	params.period = parseFloat(getBodyByName(bodyToFocus.name, systems.CelestialObjects).period);
	params.color = getBodyByName(bodyToFocus.name, systems.CelestialObjects).color;
	updateGui(gui);
}

//
//
//
// Initialise the whole scene and build GUI
//
//
//

init("container");
window.addEventListener( 'resize', onWindowResize );

createSky(scene, sky);

createCelestialObjectsFromArray(systems.CelestialObjects, scene);

bodyToFocus = scene.getObjectByName(systems.CelestialObjects[0].name);

//Initialise GUI
var params = {
	name: "Body",
	scale: parseFloat(getBodyByName(bodyToFocus.name, systems.CelestialObjects).scale),
	eccentricity: parseFloat(getBodyByName(bodyToFocus.name, systems.CelestialObjects).eccentricity),
	semimajor_axis: parseFloat(getBodyByName(bodyToFocus.name, systems.CelestialObjects).semimajor_axis),
	inclination: parseFloat(getBodyByName(bodyToFocus.name, systems.CelestialObjects).inclination),
	longitude: parseFloat(getBodyByName(bodyToFocus.name, systems.CelestialObjects).longitude),
	periapsis_arg: parseFloat(getBodyByName(bodyToFocus.name, systems.CelestialObjects).periapsis_arg),
	mean_anomaly: parseFloat(getBodyByName(bodyToFocus.name, systems.CelestialObjects).mean_anomaly),
	period: parseFloat(getBodyByName(bodyToFocus.name, systems.CelestialObjects).period),
	color: getBodyByName(bodyToFocus.name, systems.CelestialObjects).color,
};

buildGui();
setSelectedValue(nameDropdown.domElement.children[0], systems.CelestialObjects[0].name);

start();
