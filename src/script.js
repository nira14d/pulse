import "./style.css";
import * as THREE from "three";
import vertexShaders from "./shaders/vertex.glsl";
import fragmentShaders from "./shaders/fragment.glsl";

/**
 * Base
 */
// Debug

const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

debugObject.uDepthColor = new THREE.Color("#002630");
debugObject.uSurfaceColor = new THREE.Color("#147084");
// Scene
const scene = new THREE.Scene();

const loader = new THREE.CubeTextureLoader();
const envMap = loader.load([
  "https://threejs.org/examples/textures/cube/Bridge2/posx.jpg",
  "https://threejs.org/examples/textures/cube/Bridge2/negx.jpg",
  "https://threejs.org/examples/textures/cube/Bridge2/posy.jpg",
  "https://threejs.org/examples/textures/cube/Bridge2/negy.jpg",
  "https://threejs.org/examples/textures/cube/Bridge2/posz.jpg",
  "https://threejs.org/examples/textures/cube/Bridge2/negz.jpg",
]);

// Apply to scene

scene.environment = envMap;

/**
 * Water
 */
// Geometry
const geometry = new THREE.SphereGeometry(1, 128, 128);

// Material
const material = new THREE.ShaderMaterial({
  transparent: true,
  vertexShader: vertexShaders,
  fragmentShader: fragmentShaders,
  uniforms: {
    time: { value: 0 },

    uColorOffSet: { value: 0.25 },
    uColorMultiplier: { value: 1.0 },
    uDepthColor: { value: debugObject.uDepthColor },
    uSurfaceColor: { value: debugObject.uSurfaceColor },

    metalness: { value: 1.0 },
    roughness: { value: 0.8 },
    albedo: { value: new THREE.Color(0xff5500) }, // orange color for visibility
    lightDirection: { value: new THREE.Vector3() },
    envMapIntensity: { value: 10 },
  },
});

// Mesh
const blob = new THREE.Mesh(geometry, material);

scene.add(blob);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 3);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("green");

/**
 * Animate
 */
const tick = () => {
  const lightWorld = new THREE.Vector3(1, 1, 1).normalize();
  const lightView = lightWorld
    .clone()
    .transformDirection(camera.matrixWorldInverse);
  material.uniforms.lightDirection.value.copy(lightView);

  material.uniforms.time.value += 0.01;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
