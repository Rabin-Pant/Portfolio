import * as THREE from 'three';
import type { JourneyScene } from './forest-journey';
import { projects } from './projects';
import { createSurfaceTexture, createContactTexture, createPineGeometry, createOrganicGeometry, createFernGeometry } from './forest-surfaces';

// All scenery is procedural: no models, texture downloads, or asset licensing.
const CAMERA_STOPS = [
  { position: [0, 5, 44], target: [0, 3, 12] },
  { position: [-2, 4.5, 26], target: [1, 2.8, -2] },
  { position: [0, 4.8, 4], target: [0, 1.7, -17] },
  { position: [1, 4.5, -19], target: [0, 2.5, -44] },
  { position: [-5, 5, -43], target: [9, 3.2, -61] },
  { position: [-7, 7, -76], target: [7, 5, -96] },
  { position: [-6, 6, -107], target: [20, 2, -125] },
  ...projects.map((_, index) => {
    const locations = [
      { position: [-5, 7, -140], target: [15, 8, -165] },
      { position: [-8, 6, -186], target: [12, 6, -209] },
      { position: [-6, 8, -236], target: [10, 3, -255] },
      { position: [-7, 5, -280], target: [9, 2, -297] },
    ];
    return locations[index] ?? { position: [-6, 6, -305], target: [8, 3, -325] };
  }),
  { position: [-4, 6.8, -330], target: [10, 3.6, -352] },
];

function seededRandom(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function pathX(z: number) {
  return Math.sin(z * 0.035) * 3;
}

export function createForestScene(host: HTMLElement, onUnavailable: () => void): JourneyScene {
  const mobile = window.matchMedia('(max-width: 767px)').matches || navigator.hardwareConcurrency <= 4;
  const renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 1.4));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  const canvas = renderer.domElement;
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const dawn = new THREE.Color('#9baea4');
  const dusk = new THREE.Color('#62667c');
  scene.background = dawn.clone();
  scene.fog = new THREE.FogExp2(dawn.clone(), 0.012);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.2, 230);
  const random = seededRandom(2717);
  const disposables = new Set<THREE.BufferGeometry | THREE.Material | THREE.Texture>();
  const geometry = <T extends THREE.BufferGeometry>(value: T): T => { disposables.add(value); return value; };
  const material = <T extends THREE.Material>(value: T): T => { disposables.add(value); return value; };
  const standard = (color: string, roughness = 1) => material(new THREE.MeshStandardMaterial({ color, roughness, flatShading: true }));
  const soil = standard('#465442');
  const trailMaterial = standard('#b2a082');
  const wood = standard('#80664b');
  const bark = standard('#665447');
  const rock = standard('#667365');
  const stone = standard('#737663');
  const roofMaterial = standard('#253b39', 0.7);
  const wallMaterial = standard('#a08b66');
  const darkWood = standard('#322e26');
  const foliage = ['#294b3b', '#516747', '#3b6145', '#75815a'].map((color) => standard(color));
  const earthMap = createSurfaceTexture('earth');
  earthMap.repeat.set(60, 90);
  const grainMap = createSurfaceTexture('grain');
  grainMap.repeat.set(2, 3);
  const stoneMap = createSurfaceTexture('stone');
  stoneMap.repeat.set(3, 3);
  [earthMap, grainMap, stoneMap].forEach((texture) => disposables.add(texture));
  soil.map = earthMap;
  for (const surface of [wood, bark, darkWood, wallMaterial]) {
    surface.map = grainMap;
    if (!mobile) { surface.bumpMap = grainMap; surface.bumpScale = 0.06; }
  }
  for (const surface of [rock, stone]) {
    surface.map = stoneMap;
    if (!mobile) { surface.bumpMap = stoneMap; surface.bumpScale = 0.12; }
  }
  foliage.forEach((surface) => { surface.flatShading = false; surface.map = stoneMap; });
  const windTime = { value: 0 };
  foliage.forEach((m) => {
    m.onBeforeCompile = (shader) => {
      shader.uniforms.windTime = windTime;
      shader.vertexShader = 'uniform float windTime;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
        #include <begin_vertex>
        #ifdef USE_INSTANCING
          transformed.x += sin(windTime * 0.5 + instanceMatrix[3].x * 0.3 + instanceMatrix[3].z * 0.2)
                         * 0.018 * (position.y + 0.5);
        #endif
      `);
    };
  });

  const hemisphere = new THREE.HemisphereLight('#d6e5f0', '#34402a', 1.8);
  scene.add(hemisphere);
  const sunlight = new THREE.DirectionalLight('#ffe1a3', 3.2);
  sunlight.position.set(-35, 32, -55);
  scene.add(sunlight);
  const fill = new THREE.DirectionalLight('#89c3c2', 0.65);
  fill.position.set(30, 14, 30);
  scene.add(fill);

  function mesh(g: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = scene) {
    const object = new THREE.Mesh(g, m);
    object.position.set(x, y, z);
    parent.add(object);
    return object;
  }

  const boxGeometry = geometry(new THREE.BoxGeometry(1, 1, 1));
  function box(m: THREE.Material, x: number, y: number, z: number, sx: number, sy: number, sz: number, parent: THREE.Object3D = scene) {
    const object = mesh(boxGeometry, m, x, y, z, parent);
    object.scale.set(sx, sy, sz);
    return object;
  }

  // A quiet forest floor, broken up by low-poly hills and a winding ribbon trail.
  const groundGeometry = geometry(new THREE.PlaneGeometry(360, 540, 48, 72));
  const groundPositions = groundGeometry.getAttribute('position');
  for (let i = 0; i < groundPositions.count; i++) {
    const x = groundPositions.getX(i), y = groundPositions.getY(i);
    const slope = THREE.MathUtils.smoothstep(Math.abs(x), 32, 90);
    groundPositions.setZ(i, slope * (2 + Math.sin(x * 0.09) * Math.cos(y * 0.06) * 2));
  }
  groundGeometry.computeVertexNormals();
  soil.flatShading = false;
  const ground = mesh(groundGeometry, soil, 0, -0.12, -180);
  ground.rotation.x = -Math.PI / 2;
  const pathVertices: number[] = [];
  for (let z = 60; z >= -365; z -= 1) {
    const x = pathX(z);
    const verge = Math.sin(z * 0.8) * 0.15 + Math.sin(z * 1.9) * 0.06;
    pathVertices.push(x - 1.9 - verge, 0.035, z, x + 1.9 + verge, 0.035, z);
  }
  const pathIndices: number[] = [];
  for (let i = 0; i < pathVertices.length / 3 - 2; i += 2) {
    pathIndices.push(i, i + 1, i + 2, i + 1, i + 3, i + 2);
  }
  const pathGeometry = geometry(new THREE.BufferGeometry());
  pathGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pathVertices, 3));
  pathGeometry.setIndex(pathIndices);
  pathGeometry.computeVertexNormals();
  mesh(pathGeometry, trailMaterial, 0, 0, 0);

  const hillGeometry = geometry(createOrganicGeometry(2));
  for (let i = 0; i < 48; i++) {
    const side = i % 2 ? 1 : -1;
    const z = 35 - i * 9;
    const hill = mesh(hillGeometry, foliage[i % 4], side * (52 + random() * 25), -5, z);
    hill.scale.set(14 + random() * 13, 10 + random() * 13, 20 + random() * 20);
  }
  for (let i = 0; i < 11; i++) {
    const mountain = mesh(hillGeometry, standard(i % 2 ? '#627776' : '#536f6c'), (i - 5) * 22, 1, -412 - random() * 20);
    mountain.scale.set(24, 18 + random() * 24, 22);
  }

  // Instancing keeps hundreds of trees to a handful of draw calls.
  const treeCount = mobile ? 320 : 500;
  const trunk = new THREE.InstancedMesh(geometry(new THREE.CylinderGeometry(0.2, 0.42, 1, 5)), bark, treeCount);
  const pineGeometry = geometry(createPineGeometry(mobile));
  const leafyGeometry = geometry(createOrganicGeometry(mobile ? 1 : 2));
  const crowns = foliage.map((m, i) => new THREE.InstancedMesh(i % 2 ? leafyGeometry : pineGeometry, m, treeCount));
  const contactTexture = createContactTexture();
  disposables.add(contactTexture);
  const contactMaterial = material(new THREE.MeshBasicMaterial({
    color: '#0b1912', map: contactTexture, transparent: true, opacity: 0.5, depthWrite: false,
  }));
  const contactGeometry = geometry(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2));
  const treeShadows = new THREE.InstancedMesh(contactGeometry, contactMaterial, treeCount);
  scene.add(treeShadows);
  const transform = new THREE.Object3D();
  const crownCounts = [0, 0, 0, 0];
  scene.add(trunk, ...crowns);
  for (let i = 0; i < treeCount; i++) {
    const z = 57 - random() * 450;
    const side = i % 2 ? 1 : -1;
    let x = pathX(z) + side * (9 + random() * 38);
    // Leave the bridge, clearing, and studio visible from the camera route.
    if (Math.abs(z + 10) < 5) x += side * 13;
    if (z < -35 && x > -25 && x < 36) x += side * 34;
    if (z < -18 && z > -39 && Math.abs(x) < 16) x += side * 11;
    const height = 6 + random() * 11;
    transform.position.set(x, height * 0.23, z);
    transform.scale.set(1, height * 0.46, 1);
    transform.rotation.set(0, random() * Math.PI, 0);
    transform.updateMatrix();
    trunk.setMatrixAt(i, transform.matrix);
    const color = i % 4;
    for (let layer = 0; layer < 3; layer++) {
      const leafy = color % 2 === 1;
      const width = height * (leafy ? 0.24 : 0.32 - layer * 0.065);
      transform.position.set(
        x + (leafy ? Math.cos(layer * 2.1) * width * 0.5 : 0),
        height * (leafy ? 0.65 + Math.sin(layer * 2) * 0.035 : 0.43 + layer * 0.2),
        z + (leafy ? Math.sin(layer * 2.1) * width * 0.5 : 0),
      );
      transform.scale.set(width, height * (leafy ? 0.23 : 0.5), width * (leafy ? 0.9 : 1));
      transform.updateMatrix();
      crowns[color].setMatrixAt(crownCounts[color]++, transform.matrix);
    }
    transform.position.set(x, -0.08, z);
    transform.rotation.set(0, 0, 0);
    transform.scale.set(height * 0.8, 1, height * 0.65);
    transform.updateMatrix();
    treeShadows.setMatrixAt(i, transform.matrix);
  }
  treeShadows.computeBoundingSphere();
  for (const [x, z, width, depth] of [[9, -62, 17, 15], [9, -96, 22, 22], [12, -210, 17, 15], [9, -300, 25, 18], [10, -352, 24, 20]]) {
    mesh(contactGeometry, contactMaterial, x, -0.07, z).scale.set(width, 1, depth);
  }
  crowns.forEach((crown, index) => { crown.count = crownCounts[index]; crown.computeBoundingSphere(); });
  trunk.computeBoundingSphere();

  // Ferns and boulders give the foreground scale without texture maps.
  const boulderGeometry = geometry(createOrganicGeometry(1));
  const boulders = new THREE.InstancedMesh(boulderGeometry, rock, 110);
  const fernMaterial = material(foliage[2].clone());
  fernMaterial.side = THREE.DoubleSide;
  fernMaterial.onBeforeCompile = foliage[2].onBeforeCompile;
  const ferns = new THREE.InstancedMesh(geometry(createFernGeometry(mobile)), fernMaterial, 170);
  scene.add(boulders, ferns);
  for (let i = 0; i < 170; i++) {
    let z = 48 - random() * 425;
    if (Math.abs(z + 10) < 4) z += 7;
    let x = pathX(z) + (i % 2 ? 1 : -1) * (3 + random() * 14);
    // Ground scatter stays out of the lake, waterfall pool, and theatre stage.
    if (Math.hypot(x - 22, z + 125) < 20 || Math.hypot(x - 16, z + 160) < 12
      || Math.hypot(x - 10, z + 258) < 17) x = -22 - Math.abs(x);
    const scale = 0.5 + random();
    transform.position.set(x, 0.04, z);
    transform.rotation.set(0, random() * Math.PI, 0);
    transform.scale.set(scale, scale, scale);
    transform.updateMatrix();
    ferns.setMatrixAt(i, transform.matrix);
    if (i < 110) {
      transform.position.set(x + 1.3, 0.12, z);
      transform.scale.set(scale, scale * 0.5, scale * 0.8);
      transform.updateMatrix();
      boulders.setMatrixAt(i, transform.matrix);
    }
  }
  ferns.computeBoundingSphere();
  boulders.computeBoundingSphere();

  const waterMaterial = material(new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, dusk: { value: 0 }, skyColor: { value: dawn.clone() } },
    vertexShader: `varying vec3 vWorld;
      void main() { vWorld = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0); }`,
    fragmentShader: `varying vec3 vWorld; uniform float time; uniform float dusk; uniform vec3 skyColor;
      void main() {
        vec2 p = vWorld.xz;
        float a = p.x * 1.8 + p.y * 0.8 + time * 0.7;
        float b = p.x * 0.7 - p.y * 2.3 - time * 0.5;
        vec3 normal = normalize(vec3(cos(a) * 0.06 + cos(b) * 0.035, 1.0, cos(b) * 0.07));
        vec3 eye = normalize(cameraPosition - vWorld);
        float fresnel = 0.12 + 0.65 * pow(1.0 - max(dot(eye, normal), 0.0), 3.0);
        vec3 deep = mix(vec3(0.045, 0.14, 0.13), vec3(0.035, 0.07, 0.105), dusk);
        vec3 color = mix(deep, skyColor * 0.85, fresnel);
        float sparkle = pow(max(dot(reflect(-normalize(vec3(-0.4, 0.6, 0.3)), normal), eye), 0.0), 100.0);
        color += vec3(0.85, 0.71, 0.45) * sparkle * (1.0 - dusk * 0.6);
        color += sin(a) * sin(b) * 0.012;
        float haze = 1.0 - exp(-length(cameraPosition - vWorld) * 0.006);
        gl_FragColor = vec4(mix(color, skyColor, haze), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  }));
  const water = mesh(geometry(new THREE.PlaneGeometry(190, 6.5, 1, 1)), waterMaterial, 0, 0.055, -10);
  water.rotation.x = -Math.PI / 2;
  // Banks sit alongside the water instead of requiring expensive reflections.
  for (const z of [-14, -6]) {
    for (let i = 0; i < 26; i++) {
      const x = (i - 13) * 3.5;
      if (Math.abs(x) < 3) continue;
      const bank = mesh(boulderGeometry, stone, x, 0.18, z + random() * 0.5);
      bank.scale.set(2, 0.55 + random() * 0.6, 1.25);
    }
  }
  const bridge = new THREE.Group();
  bridge.position.set(pathX(-10), 0, -10);
  scene.add(bridge);
  for (let i = 0; i < 19; i++) box(wood, 0, 0.38, (i - 9) * 0.45, 4.1, 0.22, 0.4, bridge);
  for (const side of [-1, 1]) {
    for (const z of [-4, -2, 0, 2, 4]) box(wood, side * 2.05, 1.1, z, 0.16, 1.8, 0.16, bridge);
    box(wood, side * 2.05, 1.85, 0, 0.16, 0.14, 8.5, bridge);
    box(wood, side * 2.05, 1.15, 0, 0.12, 0.1, 8.5, bridge);
    box(darkWood, side * 1.4, 0.15, 0, 0.22, 0.4, 9, bridge);
  }

  // Studio: timber siding, a pitched roof, glowing windows, desk, and terrace.
  const studio = new THREE.Group();
  studio.position.set(10, 0, -352);
  scene.add(studio);
  box(stone, 0, 0.25, 0, 10.8, 0.5, 8, studio);
  box(wallMaterial, 0, 3, 0, 10, 5.5, 7.4, studio);
  for (let i = 0; i < 14; i++) box(wood, 0, 0.6 + i * 0.37, 3.74, 10, 0.055, 0.06, studio);
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-5.8, 0);
  roofShape.lineTo(0, 3.1);
  roofShape.lineTo(5.8, 0);
  roofShape.closePath();
  const roof = mesh(geometry(new THREE.ExtrudeGeometry(roofShape, { depth: 9.1, bevelEnabled: false })), roofMaterial, 0, 5.7, -4.55, studio);
  roof.name = 'studio-roof';
  const windowsMaterial = material(new THREE.MeshBasicMaterial({
    color: '#dda856', toneMapped: false,
  }));
  for (const x of [-3, 2.8]) {
    box(darkWood, x, 3.1, 3.81, 3.4, 2.9, 0.16, studio);
    box(windowsMaterial, x, 3.1, 3.91, 3, 2.5, 0.05, studio);
    box(wood, x, 3.1, 3.96, 0.09, 2.6, 0.07, studio);
    box(wood, x, 3.1, 3.96, 3.1, 0.09, 0.07, studio);
    // Silhouettes read as a desk and monitor behind the glass.
    box(darkWood, x, 2.55, 3.99, 2.2, 0.09, 0.04, studio);
    box(darkWood, x + 0.25, 3.08, 4, 0.95, 0.65, 0.035, studio);
    box(darkWood, x + 0.25, 2.68, 4, 0.1, 0.3, 0.035, studio);
  }
  box(darkWood, 0, 1.9, 3.86, 1.4, 3.5, 0.15, studio);
  box(windowsMaterial, 0, 2.5, 3.96, 0.8, 1.4, 0.04, studio);
  box(wood, 0, 0.4, 6.5, 12.5, 0.25, 5.8, studio);
  for (let i = 0; i < 22; i++) box(darkWood, -6 + i * 0.56, 0.54, 6.5, 0.025, 0.02, 5.8, studio);
  for (const x of [-6, 6]) {
    for (let z = 4; z < 9; z += 1.4) box(wood, x, 1.15, z, 0.12, 1.5, 0.12, studio);
    box(wood, x, 1.9, 6.5, 0.14, 0.13, 5.8, studio);
  }
  // A bench and planter on the terrace make the destination feel inhabited.
  box(wood, -3.9, 1.2, 7, 2.7, 0.17, 1, studio);
  box(wood, -3.9, 1.8, 7.45, 2.7, 1.1, 0.12, studio);
  for (const x of [-4.8, -3]) box(darkWood, x, 0.82, 7, 0.12, 0.7, 0.8, studio);
  box(wood, 4.6, 0.95, 6.9, 1.2, 0.8, 1.2, studio);
  const plant = mesh(geometry(new THREE.IcosahedronGeometry(0.9, 0)), foliage[2], 4.6, 2, 6.9, studio);
  plant.scale.set(0.85, 1.3, 0.85);

  const lanternMaterial = material(new THREE.MeshBasicMaterial({ color: '#ffcc7b', toneMapped: false }));
  const lanternGeometry = geometry(new THREE.SphereGeometry(0.15, 6, 4));
  for (let i = 0; i < 9; i++) {
    const x = -5 + i * 1.25;
    const y = 4.3 - Math.sin((i / 8) * Math.PI) * 0.7;
    mesh(lanternGeometry, lanternMaterial, x, y, 6.6, studio);
    if (i > 0) {
      const previousX = -5 + (i - 1) * 1.25;
      const previousY = 4.3 - Math.sin(((i - 1) / 8) * Math.PI) * 0.7;
      const wire = box(darkWood, (x + previousX) / 2, (y + previousY) / 2, 6.6, 1.3, 0.025, 0.025, studio);
      wire.rotation.z = Math.atan2(y - previousY, x - previousX);
    }
  }
  const studioLight = new THREE.PointLight('#ffbb68', 13, 20, 2);
  studioLight.position.set(0, 4, 7);
  studio.add(studioLight);

  // Skills: an open-air workshop beside the trail, well before the studio.
  const canvasMaterial = standard('#b9a574');
  const workshop = new THREE.Group();
  workshop.position.set(9, 0, -62);
  scene.add(workshop);
  mesh(geometry(new THREE.ConeGeometry(5.5, 6, 4)), canvasMaterial, 0, 3, 0, workshop).rotation.y = Math.PI / 4;
  const entranceShape = new THREE.Shape();
  entranceShape.moveTo(-1.1, 0);
  entranceShape.lineTo(0, 3.8);
  entranceShape.lineTo(1.1, 0);
  entranceShape.closePath();
  const entranceGeometry = geometry(new THREE.ShapeGeometry(entranceShape));
  mesh(entranceGeometry, darkWood, 0, 0.03, 3.91, workshop).rotation.x = -0.575;
  box(wood, -4, 1.8, 5, 4.5, 0.2, 1.7, workshop);
  for (const x of [-5.7, -2.3]) box(wood, x, 0.85, 5, 0.22, 1.7, 1.4, workshop);
  box(stone, -4, 2.08, 5, 1.1, 0.36, 0.65, workshop);
  box(darkWood, -3, 2.14, 5, 0.15, 0.55, 0.15, workshop);
  for (let i = 0; i < 3; i++) box(wood, 4 + i * 0.5, 0.55 + i * 0.5, 2, 1.4, 1, 1.3, workshop);

  // Certifications: a stone gateway and telescope overlooking distant peaks.
  const overlook = new THREE.Group();
  overlook.position.set(9, 0, -96);
  scene.add(overlook);
  const platform = mesh(geometry(new THREE.CylinderGeometry(9, 10, 1.2, 10)), stone, 0, 0.6, 0, overlook);
  platform.name = 'overlook-platform';
  for (const x of [-4.5, 4.5]) {
    for (let i = 0; i < 5; i++) box(stone, x, 1.6 + i * 1.2, -3, 1.5, 1.1, 1.6, overlook);
  }
  box(stone, 0, 7.5, -3, 10.8, 1.4, 1.7, overlook);
  for (let i = 0; i < 4; i++) box(stone, 0, 0.25 + i * 0.16, 10 - i * 0.85, 4.5, 0.5, 0.85, overlook);
  for (const angle of [0, 2.1, 4.2]) {
    const leg = box(darkWood, 2 + Math.sin(angle) * 0.45, 2.3, 2 + Math.cos(angle) * 0.45, 0.12, 2.3, 0.12, overlook);
    leg.rotation.z = Math.sin(angle) * 0.22;
  }
  const telescope = mesh(geometry(new THREE.CylinderGeometry(0.4, 0.55, 3, 10)), roofMaterial, 2, 3.8, 2, overlook);
  telescope.rotation.set(0.9, 0, -0.4);
  const flags = new THREE.Group();
  overlook.add(flags);
  const flagColors = ['#a66b57', '#c3af71', '#789992', '#7f92a3', '#a99e7d'];
  for (let i = 0; i < 9; i++) {
    const flag = mesh(geometry(new THREE.PlaneGeometry(0.65, 0.9)), material(new THREE.MeshStandardMaterial({ color: flagColors[i % 5], side: THREE.DoubleSide })), -4 + i, 6.5 - Math.sin(i / 8 * Math.PI) * 0.65, -1.8, flags);
    flag.rotation.y = 0.2;
  }

  // Projects open onto a wide lake with a small wooden landing.
  const lake = mesh(geometry(new THREE.CircleGeometry(19, 36)), waterMaterial, 22, 0.06, -125);
  lake.rotation.x = -Math.PI / 2;
  const shore = mesh(geometry(new THREE.TorusGeometry(19.2, 0.45, 4, 36)), trailMaterial, 22, 0.02, -125);
  shore.rotation.x = Math.PI / 2;
  const jetty = new THREE.Group();
  jetty.position.set(8, 0, -117);
  jetty.rotation.y = -0.4;
  scene.add(jetty);
  for (let i = 0; i < 18; i++) box(wood, 0, 0.45, -i * 0.5, 3, 0.15, 0.45, jetty);
  for (const x of [-1.35, 1.35]) {
    for (const z of [0, -4, -8]) box(darkWood, x, 0.25, z, 0.2, 1.8, 0.2, jetty);
  }

  // MediaTranscribe: a waterfall, its rocky basin, and animated falling water.
  const waterfall = new THREE.Group();
  waterfall.position.set(16, 0, -165);
  scene.add(waterfall);
  for (let i = 0; i < 7; i++) {
    const cliff = mesh(hillGeometry, rock, (i - 3) * 3.8, 8 + random() * 2, -4, waterfall);
    cliff.scale.set(4.8, 10 + random() * 4, 5);
  }
  const fallingWater = material(new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, noiseMap: { value: stoneMap } }, transparent: true, side: THREE.DoubleSide,
    vertexShader: `uniform float time; varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 p = position;
        p.x *= 0.9 + (1.0 - uv.y) * 0.2;
        p.x += sin(uv.y * 18.0 + time * 3.0) * 0.06;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: `uniform float time; uniform sampler2D noiseMap; varying vec2 vUv;
      void main() {
        float flow = vUv.y * 2.5 + time * 0.8;
        float coarse = texture2D(noiseMap, vec2(vUv.x * 1.7, flow * 0.4)).r;
        float streak = smoothstep(0.72, 0.94, texture2D(noiseMap, vec2(vUv.x * 7.0 + coarse * 0.15, flow)).r);
        float foam = smoothstep(0.76, 0.96, texture2D(noiseMap, vec2(vUv.x * 2.7, flow * 1.7)).r);
        float edges = 1.0 - smoothstep(0.32, 0.5, abs(vUv.x - 0.5));
        vec3 water = mix(vec3(0.28, 0.48, 0.49), vec3(0.83, 0.91, 0.9), streak * 0.45 + foam * 0.4);
        gl_FragColor = vec4(water, edges * (0.75 + foam * 0.2));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  }));
  mesh(geometry(new THREE.PlaneGeometry(5.2, 19)), fallingWater, 0, 10, 1.5, waterfall);
  const basin = mesh(geometry(new THREE.CircleGeometry(11, 28)), waterMaterial, 0, 0.08, 5, waterfall);
  basin.rotation.x = -Math.PI / 2;
  const sprayMaterial = material(new THREE.SpriteMaterial({ color: '#cee2dc', map: contactTexture, transparent: true, opacity: 0.45, depthWrite: false }));
  const spray = new THREE.Sprite(sprayMaterial);
  spray.position.set(0, 1.2, 2);
  spray.scale.set(12, 4, 1);
  waterfall.add(spray);

  // TalentBridge: a broad flowering meadow and a turning windmill.
  const meadow = mesh(geometry(new THREE.CircleGeometry(31, 32)), standard('#637349'), 11, 0.015, -210);
  meadow.rotation.x = -Math.PI / 2;
  const mill = new THREE.Group();
  mill.position.set(12, 0, -210);
  scene.add(mill);
  mesh(geometry(new THREE.CylinderGeometry(2, 3, 13, 8)), wallMaterial, 0, 6.5, 0, mill);
  mesh(geometry(new THREE.ConeGeometry(3.1, 4, 8)), roofMaterial, 0, 15, 0, mill);
  box(darkWood, 0, 1.5, 3, 1.5, 3, 0.1, mill);
  const rotor = new THREE.Group();
  rotor.position.set(0, 10.5, 2.7);
  mill.add(rotor);
  for (let i = 0; i < 4; i++) {
    const arm = new THREE.Group();
    arm.rotation.z = i * Math.PI / 2;
    rotor.add(arm);
    box(wood, 0, 4, 0, 0.22, 8, 0.18, arm);
    box(canvasMaterial, 0.6, 5.1, 0.1, 1.6, 4.5, 0.06, arm);
  }
  const blooms = new THREE.InstancedMesh(geometry(new THREE.IcosahedronGeometry(0.16, 0)), standard('#d8b777'), mobile ? 180 : 360);
  scene.add(blooms);
  for (let i = 0; i < blooms.count; i++) {
    transform.position.set(11 + (random() - 0.5) * 56, 0.25 + random() * 0.35, -210 + (random() - 0.5) * 52);
    transform.scale.set(1, 1, 1);
    transform.updateMatrix();
    blooms.setMatrixAt(i, transform.matrix);
  }
  blooms.computeBoundingSphere();

  // CineBook: an outdoor stone amphitheatre, with terraced seats and a stage.
  const theatre = new THREE.Group();
  theatre.position.set(10, 0, -258);
  scene.add(theatre);
  const stage = mesh(geometry(new THREE.CircleGeometry(7, 24)), trailMaterial, 0, 0.04, 0, theatre);
  stage.rotation.x = -Math.PI / 2;
  for (let i = 0; i < 4; i++) {
    const seating = mesh(geometry(new THREE.TorusGeometry(9 + i * 2.2, 0.75, 4, 26, Math.PI * 1.55)), stone, 0, 0.75 + i * 0.8, 0, theatre);
    seating.rotation.set(-Math.PI / 2, 0, -0.15);
  }
  const columnGeometry = geometry(new THREE.CylinderGeometry(0.55, 0.65, 6.5, 8));
  for (let i = 0; i < 6; i++) {
    const angle = i / 5 * Math.PI;
    const x = Math.cos(angle) * 17;
    const z = -Math.sin(angle) * 17;
    mesh(columnGeometry, stone, x, 3.25, z, theatre);
    box(stone, x, 6.7, z, 1.9, 0.5, 1.9, theatre);
  }

  // Chat App: lanterns, tents, a flickering campfire, and local fireflies.
  const camp = new THREE.Group();
  camp.position.set(9, 0, -300);
  scene.add(camp);
  for (const x of [-7, 7]) {
    const tent = mesh(geometry(new THREE.ConeGeometry(3.6, 4.5, 4)), canvasMaterial, x, 2.25, -3, camp);
    tent.rotation.y = Math.PI / 4;
    const entrance = mesh(entranceGeometry, darkWood, x, 0.03, -0.43, camp);
    entrance.rotation.x = -0.515;
    entrance.scale.set(0.7, 0.75, 1);
  }
  const fireRing = mesh(geometry(new THREE.TorusGeometry(1.7, 0.28, 5, 12)), rock, 0, 0.2, 3, camp);
  fireRing.rotation.x = Math.PI / 2;
  for (let i = 0; i < 3; i++) box(wood, 0, 0.25 + i * 0.1, 3, 2.8, 0.3, 0.3, camp).rotation.y = i * Math.PI / 3;
  const fireMaterial = material(new THREE.MeshBasicMaterial({ color: '#f5a641', toneMapped: false }));
  const fire = mesh(geometry(new THREE.ConeGeometry(0.85, 2, 6)), fireMaterial, 0, 1.2, 3, camp);
  const fireLight = new THREE.PointLight('#ff9c42', 22, 19, 2);
  fireLight.position.set(0, 2.5, 3);
  camp.add(fireLight);
  for (const x of [-5, 5]) {
    box(wood, x, 0.7, 5, 0.8, 0.6, 3.5, camp);
    box(darkWood, x, 2, -1, 0.1, 4, 0.1, camp);
    mesh(lanternGeometry, lanternMaterial, x, 3.5, -1, camp).scale.setScalar(2);
  }

  // One sky draw supplies a horizon gradient and warm solar haze.
  const skyMaterial = material(new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { horizon: { value: dawn.clone() }, zenith: { value: new THREE.Color('#627f95') }, evening: { value: 0 } },
    vertexShader: `varying vec3 direction; void main() { direction = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `varying vec3 direction; uniform vec3 horizon; uniform vec3 zenith; uniform float evening;
      void main() {
        vec3 d = normalize(direction);
        vec3 color = mix(horizon, zenith, smoothstep(0.0, 0.75, d.y));
        vec3 sunDir = normalize(vec3(-0.55, mix(0.3, 0.08, evening), -1.0));
        float alignment = max(dot(d, sunDir), 0.0);
        color += vec3(0.55, 0.33, 0.13) * pow(alignment, 24.0) * 0.4;
        color += vec3(1.0, 0.78, 0.45) * smoothstep(0.9993, 0.9998, alignment);
        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  }));
  const skyDome = mesh(geometry(new THREE.SphereGeometry(210, 16, 10)), skyMaterial, 0, 0, 0);
  skyDome.renderOrder = -1;
  const mistMaterial = material(new THREE.MeshBasicMaterial({
    color: '#acc6b2', transparent: true, opacity: 0.045, depthWrite: false, side: THREE.DoubleSide,
  }));
  const mistGeometry = geometry(new THREE.PlaneGeometry(130, 7));
  for (let i = 0; i < 11; i++) mesh(mistGeometry, mistMaterial, 0, 2.5, 8 - i * 37);

  const moteCount = mobile ? 130 : 230;
  const motePositions = new Float32Array(moteCount * 3);
  for (let i = 0; i < moteCount; i++) {
    motePositions[i * 3] = (random() - 0.5) * 45;
    motePositions[i * 3 + 1] = 1 + random() * 11;
    motePositions[i * 3 + 2] = 45 - random() * 430;
  }
  const moteGeometry = geometry(new THREE.BufferGeometry());
  moteGeometry.setAttribute('position', new THREE.BufferAttribute(motePositions, 3));
  const moteMaterial = material(new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { time: { value: 0 }, dusk: { value: 0 } },
    vertexShader: `uniform float time; varying float glow;
      void main() {
        vec3 p = position;
        p.x += sin(time * 0.23 + position.z) * 0.6;
        p.y += sin(time * 0.4 + position.x) * 0.4;
        vec4 view = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * view;
        gl_PointSize = clamp(55.0 / -view.z, 1.0, 4.0);
        glow = 0.35 + 0.3 * sin(time + position.x * 2.0);
      }`,
    fragmentShader: `uniform float dusk; varying float glow;
      void main() {
        float alpha = smoothstep(0.5, 0.1, distance(gl_PointCoord, vec2(0.5)));
        gl_FragColor = vec4(mix(vec3(0.88, 0.92, 0.71), vec3(1.0, 0.8, 0.36), dusk), alpha * glow);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  }));
  scene.add(new THREE.Points(moteGeometry, moteMaterial));
  const campMotes = new Float32Array(90 * 3);
  for (let i = 0; i < 90; i++) {
    campMotes[i * 3] = 9 + (random() - 0.5) * 26;
    campMotes[i * 3 + 1] = 1 + random() * 5;
    campMotes[i * 3 + 2] = -300 + (random() - 0.5) * 22;
  }
  const campMoteGeometry = geometry(new THREE.BufferGeometry());
  campMoteGeometry.setAttribute('position', new THREE.BufferAttribute(campMotes, 3));
  scene.add(new THREE.Points(campMoteGeometry, moteMaterial));

  let targetProgress = 0;
  let currentProgress = 0;
  let initialized = false;
  let lost = false;
  let disposed = false;
  let frame = 0;
  let lastTime = 0;
  let nextFrameTime = 0;
  let elapsed = 0;
  let slowFrames = 0;
  let qualityReduced = false;
  const frameInterval = 1000 / 60;
  const look = new THREE.Vector3();
  const position = new THREE.Vector3();
  const nextPosition = new THREE.Vector3();
  const nextLook = new THREE.Vector3();
  const pointer = new THREE.Vector2();
  const smoothPointer = new THREE.Vector2();
  const sky = new THREE.Color();
  const nightZenith = new THREE.Color('#303b5d');

  function resize() {
    if (disposed) return;
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = width < 768 ? 62 : 48;
    camera.updateProjectionMatrix();
    if (initialized && !lost) renderer.render(scene, camera);
  }

  function render(time: number) {
    frame = 0;
    if (disposed || lost || document.hidden) return;
    frame = requestAnimationFrame(render);
    // Keep a 60 fps cadence across 60 Hz and higher-refresh displays.
    // Advance the deadline rather than rounding every interval to rAF ticks.
    if (time < nextFrameTime - 1) return;
    nextFrameTime = nextFrameTime && time - nextFrameTime < frameInterval * 2
      ? nextFrameTime + frameInterval : time + frameInterval;
    const frameGap = lastTime ? time - lastTime : frameInterval;
    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : frameInterval / 1000;
    lastTime = time;
    elapsed += delta;
    windTime.value = elapsed;
    rotor.rotation.z = elapsed * 0.35;
    flags.children.forEach((flag, index) => { flag.rotation.y = Math.sin(elapsed * 1.5 + index) * 0.25; });
    fallingWater.uniforms.time.value = elapsed;
    fire.scale.set(1 + Math.sin(elapsed * 5.7) * 0.08, 1 + Math.sin(elapsed * 7.3) * 0.15, 1);
    fireLight.intensity = 22 + Math.sin(elapsed * 6.5) * 4;
    spray.scale.y = 4 + Math.sin(elapsed * 1.6) * 0.3;
    currentProgress += (targetProgress - currentProgress) * (1 - Math.exp(-delta * 3.2));
    if (Math.abs(currentProgress - targetProgress) < 0.001) currentProgress = targetProgress;
    const index = Math.min(CAMERA_STOPS.length - 2, Math.floor(currentProgress));
    const blend = THREE.MathUtils.smoothstep(currentProgress - index, 0, 1);
    const from = CAMERA_STOPS[index];
    const to = CAMERA_STOPS[index + 1];
    position.fromArray(from.position).lerp(nextPosition.fromArray(to.position), blend);
    look.fromArray(from.target).lerp(nextLook.fromArray(to.target), blend);
    smoothPointer.lerp(pointer, 1 - Math.exp(-delta * 2));
    position.x += smoothPointer.x * 0.4;
    position.y += smoothPointer.y * 0.16;
    camera.position.copy(position);
    camera.lookAt(look);

    const evening = THREE.MathUtils.smoothstep(currentProgress, 2.8, CAMERA_STOPS.length - 1);
    sky.copy(dawn).lerp(dusk, evening);
    (scene.background as THREE.Color).copy(sky);
    (scene.fog as THREE.FogExp2).color.copy(sky);
    sunlight.intensity = 3.2 - evening * 1.8;
    hemisphere.intensity = 1.8 - evening * 0.5;
    skyDome.position.copy(camera.position);
    skyMaterial.uniforms.horizon.value.copy(sky);
    skyMaterial.uniforms.zenith.value.set('#627f95').lerp(nightZenith, evening);
    skyMaterial.uniforms.evening.value = evening;
    windowsMaterial.color.setRGB(0.72 + evening * 0.28, 0.35 + evening * 0.16, 0.08);
    studioLight.intensity = 13 + evening * 20;
    waterMaterial.uniforms.time.value = elapsed;
    waterMaterial.uniforms.dusk.value = evening;
    waterMaterial.uniforms.skyColor.value.copy(sky);
    moteMaterial.uniforms.time.value = elapsed;
    moteMaterial.uniforms.dusk.value = evening;
    const start = performance.now();
    renderer.render(scene, camera);
    if (!qualityReduced) {
      slowFrames = (performance.now() - start > frameInterval || frameGap > frameInterval * 1.8)
        ? slowFrames + 1 : Math.max(0, slowFrames - 1);
      if (slowFrames > 45) {
        qualityReduced = true;
        renderer.setPixelRatio(mobile ? 0.75 : 1);
        resize();
      }
    }
  }

  function start() {
    if (!frame && !disposed && !lost && !document.hidden) {
      lastTime = 0;
      nextFrameTime = 0;
      frame = requestAnimationFrame(render);
    }
  }
  function onVisibility() {
    cancelAnimationFrame(frame);
    frame = 0;
    start();
  }
  function onPointer(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || mobile) return;
    pointer.set(event.clientX / window.innerWidth * 2 - 1, -(event.clientY / window.innerHeight * 2 - 1));
  }
  function onPointerLeave() { pointer.set(0, 0); }
  function onContextLost(event: Event) {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
    frame = 0;
    onUnavailable();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('pointerleave', onPointerLeave);
  canvas.addEventListener('webglcontextlost', onContextLost);
  resize();
  start();

  return {
    setProgress(value) {
      targetProgress = THREE.MathUtils.clamp(value, 0, CAMERA_STOPS.length - 1);
      if (!initialized) {
        currentProgress = targetProgress;
        initialized = true;
        cancelAnimationFrame(frame);
        frame = 0;
        render(performance.now());
      }
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      scene.traverse((object) => { if (object instanceof THREE.InstancedMesh) object.dispose(); });
      disposables.forEach((resource) => resource.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
