import * as THREE from 'three';

const scene = new THREE.Scene();

const distance = 500;
const camera = new THREE.OrthographicCamera( window.innerWidth/-2, window.innerWidth/2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 10000 );

camera.rotation.x = 50*Math.PI/180;
camera.rotation.y = 20*Math.PI/180;
camera.rotation.z = 10*Math.PI/180;

const initialCameraPositionY = -Math.tan(camera.rotation.x)*distance;
const initialCameraPositionX = Math.tan(camera.rotation.y)*Math.sqrt(distance**2 + initialCameraPositionY**2);
camera.position.y = initialCameraPositionY;
camera.position.x = initialCameraPositionX;
camera.position.z = distance;

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
scene.add(hemiLight)

const initialDirLightPositionX = -100;
const initialDirLightPositionY = -100;
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(initialDirLightPositionX, initialDirLightPositionY, 200);
dirLight.castShadow = true;
scene.add(dirLight);

dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
var d = 500;
dirLight.shadow.camera.left = - d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = - d;

// var helper = new THREE.CameraHelper( dirLight.shadow.camera );
// var helper = new THREE.CameraHelper( camera );
// scene.add(helper)

const backLight = new THREE.DirectionalLight(0x000000, .4);
backLight.position.set(200, 200, 50);
backLight.castShadow = true;
scene.add(backLight)

const renderer = new THREE.WebGLRenderer({
   alpha: true,
   antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

export {scene, camera, renderer, dirLight, initialDirLightPositionX, initialDirLightPositionY, initialCameraPositionY, initialCameraPositionX};