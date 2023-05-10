import * as THREE from "./three.module.js"

console.log(THREE);

let camera, scene, renderer;
let geometry, material, mesh;


camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  10
);
camera.position.z = 1;