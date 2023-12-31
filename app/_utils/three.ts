import * as three from "three";
import React from "react";
import { Dimensions, Colors } from "@/_typescript/interfaces";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import { hexToComplimentary } from "@/_utils";

class Subcamera extends three.PerspectiveCamera {
  constructor(fov: number, aspect: number, near: number, far: number) {
    super(fov, aspect, near, far);
    this.viewport = new three.Vector4();
  }

  viewport: three.Vector4;
}

const AMOUNT = 8;

function toRadians(angle: number): number {
  return angle * (Math.PI / 180);
}

export const renderBackground = (
  ref: React.RefObject<HTMLElement>,
  dimensions: Dimensions,
  colors: Colors,
  colorSetter: (colors: Colors) => void
) => {

  const { width, height } = dimensions;
  const ASPECT_RATIO = width / height;
  const WIDTH = (width / AMOUNT) * window.devicePixelRatio;
  const HEIGHT = (height / AMOUNT) * window.devicePixelRatio;

  const cameras: Subcamera[] = [];

  for (let i = 0; i < AMOUNT; i++) {
    for (let j = 0; j < AMOUNT; j++) {
      const subcamera = new Subcamera(19, ASPECT_RATIO, 0.1, 20);
      subcamera.viewport = new three.Vector4(
        Math.floor(j * WIDTH),
        Math.floor(i * HEIGHT),
        Math.ceil(WIDTH),
        Math.ceil(HEIGHT)
      );
      subcamera.position.x = j / AMOUNT - 0.5;
      subcamera.position.y = 0.5 - i / AMOUNT;
      subcamera.position.z = 0.7;
      subcamera.position.multiplyScalar(2.7);
      subcamera.lookAt(-0.1, -0.2, 0);
      subcamera.updateMatrixWorld();
      subcamera.position.z = 4.3;
      subcamera.updateMatrixWorld();
      cameras.push(subcamera);
    }
  }

  const camera = new three.ArrayCamera(cameras);
  camera.position.z = 2;

  const scene = new three.Scene();

  const geometryBackground = new three.PlaneGeometry(100, 100);
  const materialBackground = new three.MeshPhongMaterial({ color: 0xdedfe1 });

  const background = new three.Mesh(geometryBackground, materialBackground);
  background.receiveShadow = true;
  background.castShadow = false;
  background.position.set(0, 0, -1);
  scene.add(background);

  const geometry = new RoundedBoxGeometry(1, 1, 1, 7, 0.25);
  const material = new three.MeshPhysicalMaterial({
    reflectivity: 0.7,
    color: colors?.bg ? new three.Color(colors.bg) : 0xdedfe1,
    roughness: 0.7,
    // map: texture,
  });
  const mesh = new three.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const light = new three.DirectionalLight(0xdedfe1, 5);
  light.position.set(0.8, 0.8, 10);
  light.castShadow = true;
  light.shadow.camera.zoom = 4;
  light.shadow.radius = 20; // blurrier shadows
  scene.add(light);

  const renderer = new three.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  ref.current?.appendChild(renderer.domElement);
  ref.current?.addEventListener("mouseup", (e) => onMouseUp(mesh, colorSetter));
  ref.current?.addEventListener("wheel", (e) => onWheel(e, camera), {
    passive: true,
  });

  let isDragging = false;
  let previousMousePosition = {
    x: 0,
    y: 0,
  };
  ref.current?.addEventListener(
    "mousedown",
    function (e) {
      isDragging = true;
    },
    { passive: true }
  );
  ref.current?.addEventListener(
    "mousemove",
    (e) =>
      (previousMousePosition = onMouseMove(
        e,
        previousMousePosition,
        isDragging,
        mesh
      )),
    { passive: true }
  );
  document.addEventListener(
    "mouseup",
    function (e) {
      isDragging = false;
    },
    { passive: true }
  );

  function animate() {
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.005;
    mesh.rotation.z += 0.005;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  return { initRenderer: renderer, initCamera: camera };
};

export const renderCube = (
  ref: React.RefObject<HTMLElement>,
  dimensions: Dimensions,
  colors: Colors,
  colorSetter: (colors: Colors) => void
) => {

  const { width, height } = dimensions;

  const camera = new three.PerspectiveCamera(75, width / height, 0.1, 20);
  camera.position.z = 2;

  const scene = new three.Scene();

  const geometry = new RoundedBoxGeometry(1, 1, 1, 7, 0.25);
  const material = new three.MeshPhysicalMaterial({
    reflectivity: 0.7,
    color: new three.Color(colors.bg),
    roughness: 0.7,
    // map: texture,
  });
  const mesh = new three.Mesh(geometry, material);
  mesh.name = "cube";
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const light = new three.DirectionalLight(0xdedfe1, 5);
  light.position.set(0.8, 0.8, 10);
  light.castShadow = true;
  light.shadow.camera.zoom = 4;
  light.shadow.radius = 20; // blurrier shadows
  scene.add(light);

  const renderer = new three.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  ref.current?.appendChild(renderer.domElement);
  ref.current?.addEventListener("mouseup", () => onMouseUp(mesh, colorSetter), {
    passive: true,
  });
  let isDragging = false;
  let previousMousePosition = {
    x: 0,
    y: 0,
  };
  ref.current?.addEventListener(
    "mousedown",
    function (e) {
      isDragging = true;
    },
    { passive: true }
  );
  ref.current?.addEventListener(
    "mousemove",
    (e) =>
      (previousMousePosition = onMouseMove(
        e,
        previousMousePosition,
        isDragging,
        mesh
      )),
    { passive: true }
  );
  document.addEventListener(
    "mouseup",
    function (e) {
      isDragging = false;
    },
    { passive: true }
  );

  function animate() {
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.005;
    mesh.rotation.z += 0.005;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  return { initRenderer: renderer, initCamera: camera };
};

export const onResize = (
  dimensions: Dimensions,
  renderer: three.WebGLRenderer,
  camera: three.ArrayCamera
) => {
  const { width, height } = dimensions;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

export function onResizeArray(
  dimensions: Dimensions,
  renderer: three.WebGLRenderer,
  camera: three.ArrayCamera
) {
  const { width, height } = dimensions;

  const ASPECT_RATIO = width / height;
  const WIDTH = (width / AMOUNT) * window.devicePixelRatio;
  const HEIGHT = (height / AMOUNT) * window.devicePixelRatio;

  camera.aspect = ASPECT_RATIO;
  camera.updateProjectionMatrix();

  for (let y = 0; y < AMOUNT; y++) {
    for (let x = 0; x < AMOUNT; x++) {
      const subcamera = camera.cameras[AMOUNT * y + x];

      // @ts-ignore
      subcamera.viewport.set(
        Math.floor(x * WIDTH),
        Math.floor(y * HEIGHT),
        Math.ceil(WIDTH),
        Math.ceil(HEIGHT)
      );

      subcamera.aspect = ASPECT_RATIO;
      subcamera.updateProjectionMatrix();
    }
  }

  renderer.setSize(width, height);
}

const onMouseUp = (mesh: three.Mesh, colorSetter: (colors: Colors) => void) => {
  const color = Math.random() * 0xffffff;
  //@ts-ignore
  mesh.material.color.setHex(color);
  // @ts-ignore
  const hexColor = mesh.material.color.getHexString();
  const complementary = hexToComplimentary(hexColor, true);
  colorSetter({ title: complementary, bg: `#${hexColor}` });
};

const onMouseMove = function (
  e: MouseEvent,
  previousMousePosition: { x: number; y: number },
  isDragging: boolean,
  mesh: three.Mesh
) {
  var deltaMove = {
    x: e.offsetX - previousMousePosition.x,
    y: e.offsetY - previousMousePosition.y,
  };

  if (isDragging) {
    var deltaRotationQuaternion = new three.Quaternion().setFromEuler(
      new three.Euler(
        toRadians(deltaMove.y * 1),
        toRadians(deltaMove.x * 1),
        0,
        "XYZ"
      )
    );

    mesh.quaternion.multiplyQuaternions(
      deltaRotationQuaternion,
      mesh.quaternion
    );
  }

  return (previousMousePosition = {
    x: e.offsetX,
    y: e.offsetY,
  });
};

const onWheel = (e: WheelEvent, camera: three.ArrayCamera) => {
  const scroll = e.deltaY / 400;

  window.requestAnimationFrame(() => {
    for (let y = 0; y < AMOUNT; y++) {
      for (let x = 0; x < AMOUNT; x++) {
        const subcamera = camera.cameras[AMOUNT * y + x];

        if (
          subcamera.position.z + scroll < 1.45 ||
          subcamera.position.z + scroll > 7.5
        ) {
          return;
        }
        subcamera.position.z += scroll;
        subcamera.updateMatrixWorld();
      }
    }
  });
};
