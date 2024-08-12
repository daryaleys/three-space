import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import "./style.css";
import spaceImage from "./assets/space.jpg";
import moonImage from "./assets/moon.jpg";
import normalImage from "./assets/normal.jpg";

const canvasElement = document.querySelector("#bg");
if (canvasElement) {
	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	const renderer = new THREE.WebGLRenderer({
		canvas: canvasElement,
	});

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.position.set(0, 10, 50);

	const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 8);
	const material = new THREE.MeshStandardMaterial({ color: 0xff11ff, wireframe: true });
	const torus = new THREE.Mesh(geometry, material);
	torus.position.x = 20;
	scene.add(torus);

	const pointLight = new THREE.PointLight(0xffffff, 100, 10000);
	pointLight.castShadow = true;
	pointLight.position.set(0, 0, 0);

	const ambientLight = new THREE.AmbientLight(0xffffff);
	scene.add(pointLight, ambientLight);

	// const lightHelper = new THREE.PointLightHelper(pointLight);
	// scene.add(lightHelper);

	// const gridHelper = new THREE.GridHelper(200, 50);
	// scene.add(gridHelper);

	new OrbitControls(camera, renderer.domElement);

	function addStar() {
		const geometry = new THREE.SphereGeometry(0.25, 24, 24);
		const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
		const star = new THREE.Mesh(geometry, material);

		const [x, y, z] = Array(3)
			.fill(0)
			.map(() => THREE.MathUtils.randFloatSpread(100));
		star.position.set(x, y, z);
		scene.add(star);
	}

	for (let i = 0; i < 200; i++) addStar();

	const spaceTexture = new THREE.TextureLoader().load(spaceImage);
	scene.background = spaceTexture;

	const moonTexture = new THREE.TextureLoader().load(moonImage);
	const normalTexture = new THREE.TextureLoader().load(normalImage);
	const moon = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture }));
	moon.position.z = 30;
	moon.position.setX(-10);
	scene.add(moon);

	let scrollY = window.scrollY;
	function moveCamera() {
		moon.rotation.x += 0.05;
		moon.rotation.y += 0.075;
		moon.rotation.z += 0.05;
		if (scrollY > window.scrollY && camera.position.z > -70) {
			camera.position.z -= 0.5;
		} else if (scrollY < window.scrollY && camera.position.z < 70) {
			camera.position.z += 0.5;
		}
		scrollY = window.scrollY;
	}

	window.addEventListener("scroll", moveCamera);

	function animate() {
		torus.rotation.x += 0.01;
		torus.rotation.y += 0.005;
		torus.rotation.z += 0.01;
		renderer.render(scene, camera);
	}

	renderer.setAnimationLoop(animate);
}
