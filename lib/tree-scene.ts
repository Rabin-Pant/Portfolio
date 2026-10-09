import * as THREE from 'three';
import type { JourneyScene } from './tree-journey';
import { createTreeWorld } from './tree-world';
import { createBranchRealms } from './branch-realms';
import { TREE_REALMS } from './tree-realms';
import { TREE_CAMERA_STOPS as CAMERA_STOPS } from './tree-camera';

// Unwrapped angles let the camera spiral continuously without cutting through
// the trunk. Every project keeps its own branch destination.


export function createTreeScene(host: HTMLElement, onUnavailable: () => void): JourneyScene {
  const lightweight = window.matchMedia('(max-width: 767px)').matches || navigator.hardwareConcurrency <= 4;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lightweight ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  // The landscape is stationary: render its sun shadow once, then reuse it.
  renderer.shadowMap.enabled = !lightweight;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  const canvas = renderer.domElement; host.appendChild(canvas);
  const scene = new THREE.Scene();
  const dawn = new THREE.Color('#91ccec');
  const palette = CAMERA_STOPS.map((_, index) => {
    const realm = TREE_REALMS.find(item => item.progress === index);
    return { horizon: new THREE.Color(realm?.horizon ?? '#91ccec'), zenith: new THREE.Color(realm?.zenith ?? '#147ac1') };
  });
  scene.background = dawn.clone(); scene.fog = new THREE.FogExp2(dawn.clone(), 0.0018);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.2, 480);
  scene.add(camera);
  // A few flakes pass close to the viewer in the underworld. They sit in
  // camera space so the cavern and its buildings cannot hide all the snow.
  const snowPositions = new Float32Array((lightweight ? 500 : 700) * 3);
  for (let i = 0; i < snowPositions.length / 3; i++) {
    const depth = 17 + ((i * 73) % 310) / 10;
    snowPositions.set([
      (Math.sin(i * 127.1) * 0.5) * depth * 1.4,
      (Math.sin(i * 63.7) * 0.5) * depth * 0.95,
      -depth,
    ], i * 3);
  }
  const snowGeometry = new THREE.BufferGeometry();
  snowGeometry.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
  const snowMaterial = new THREE.ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false,
    uniforms: { time: { value: 0 }, opacity: { value: 0 } },
    vertexShader: `uniform float time; void main() {
      vec3 p = position;
      p.y = mod(p.y - time * 2.8 + 500.0, -p.z * 0.95) + p.z * 0.475;
      p.x += sin(time * 0.8 + p.z * 0.4) * 0.8;
      vec4 view = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * view;
      gl_PointSize = clamp(200.0 / -view.z, 3.0, 9.0);
    }`,
    fragmentShader: `uniform float opacity; void main() {
      float edge = 1.0 - smoothstep(0.2, 0.5, length(gl_PointCoord - vec2(0.5)));
      gl_FragColor = vec4(0.92, 0.97, 1.0, edge * opacity * 0.8);
    }`,
  });
  const foregroundSnow = new THREE.Points(snowGeometry, snowMaterial);
  foregroundSnow.frustumCulled = false;
  camera.add(foregroundSnow);
  const hemisphere = new THREE.HemisphereLight('#d3eaff', '#536b2e', 2.1); scene.add(hemisphere);
  const sun = new THREE.DirectionalLight('#fff2ce', 3.2); sun.position.set(-70, 150, 80); scene.add(sun);
  sun.castShadow = !lightweight;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -125, right: 125, top: 145, bottom: -110, near: 1, far: 350 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.25; sun.shadow.intensity = 0.55;
  const fill = new THREE.DirectionalLight('#c8e4ee', 1.2); fill.position.set(60, 100, 140); scene.add(fill);
  const world = createTreeWorld(scene, lightweight, Math.min(8, renderer.capabilities.getMaxAnisotropy()));
  const realms = createBranchRealms(scene, lightweight);
  const skyMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { horizon: { value: dawn.clone() }, zenith: { value: new THREE.Color('#147ac1') }, time: { value: 0 } },
    vertexShader: `varying vec3 direction; void main() { direction = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `varying vec3 direction; uniform vec3 horizon; uniform vec3 zenith; uniform float time;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
      }
      float fbm(vec2 p) {
        float sum = 0.0, amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
          sum += noise(p) * amplitude;
          p = mat2(1.6, -1.2, 1.2, 1.6) * p + 7.3;
          amplitude *= 0.5;
        }
        return sum;
      }
      void main() {
        vec3 d = normalize(direction);
        vec3 color = mix(horizon, zenith, smoothstep(-0.06, 0.55, d.y));
        float alignment = max(dot(d, normalize(vec3(-0.15, 0.22, -1.0))), 0.0);
        color += vec3(0.6, 0.48, 0.22) * pow(alignment, 18.0) * 0.8;
        vec2 cloudUV = d.xz / max(0.13, d.y + 0.19) * 1.5 + vec2(time * 0.003, 0.0);
        float cloud = fbm(cloudUV + fbm(cloudUV * 0.6) * 1.8);
        float bank = smoothstep(0.44, 0.65, cloud) * smoothstep(-0.025, 0.12, d.y);
        float light = smoothstep(0.43, 0.7, fbm(cloudUV + vec2(-0.12, 0.18)));
        vec3 cloudColor = mix(vec3(0.48, 0.61, 0.75), vec3(1.55, 1.52, 1.35), light);
        color = mix(color, cloudColor, bank);
        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const skyGeometry = new THREE.SphereGeometry(430, 16, 10);
  const skyDome = new THREE.Mesh(skyGeometry, skyMaterial); skyDome.renderOrder = -1; scene.add(skyDome);
  const orbitCurve = new THREE.CatmullRomCurve3(CAMERA_STOPS.map(s => new THREE.Vector3(s[0], s[1], s[2])), false, 'catmullrom', 0.3);
  const aimCurve = new THREE.CatmullRomCurve3(CAMERA_STOPS.map(s => new THREE.Vector3(s[0], s[3], s[4])), false, 'catmullrom', 0.3);
  const orbit = new THREE.Vector3(), aim = new THREE.Vector3(), position = new THREE.Vector3(), look = new THREE.Vector3();
  const pointer = new THREE.Vector2(), smoothPointer = new THREE.Vector2(), sky = new THREE.Color();
  let targetProgress = 0, currentProgress = 0, initialized = false;
  let lost = false, disposed = false, frame = 0, lastTime = 0, nextFrameTime = 0, elapsed = 0, slowFrames = 0, qualitySteps = 0;
  const frameInterval = 1000 / 60;
  let averageFrameTime = frameInterval;
  let daylightShadowsReady = false;

  function resize() {
    if (disposed) return;
    const width = host.clientWidth, height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false); camera.aspect = width / height;
    camera.fov = width < 768 ? 65 : 48; camera.updateProjectionMatrix();
    if (initialized && !lost) renderer.render(scene, camera);
  }
  function render(time: number) {
    frame = 0;
    if (disposed || lost || document.hidden) return;
    frame = requestAnimationFrame(render);
    if (time < nextFrameTime - 1) return;
    nextFrameTime = nextFrameTime && time - nextFrameTime < frameInterval * 2 ? nextFrameTime + frameInterval : time + frameInterval;
    const frameGap = lastTime ? time - lastTime : frameInterval;
    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : frameInterval / 1000;
    lastTime = time; elapsed += delta; skyMaterial.uniforms.time.value = elapsed;
    currentProgress += (targetProgress - currentProgress) * (1 - Math.exp(-delta * 3.2));
    if (Math.abs(currentProgress - targetProgress) < 0.001) currentProgress = targetProgress;
    snowMaterial.uniforms.time.value = elapsed;
    snowMaterial.uniforms.opacity.value = THREE.MathUtils.smoothstep(currentProgress, 0.5, 0.9)
      * (1 - THREE.MathUtils.smoothstep(currentProgress, 1.3, 1.7));
    foregroundSnow.visible = snowMaterial.uniforms.opacity.value > 0.01;
    const t = currentProgress / (CAMERA_STOPS.length - 1);
    orbitCurve.getPoint(t, orbit); aimCurve.getPoint(t, aim);
    const portrait = 1 - THREE.MathUtils.smoothstep(currentProgress, 0, 1);
    const mobileWidth = host.clientWidth < 768;
    const radius = Math.max(22, orbit.z) * (mobileWidth ? 1 + portrait * 0.3 : 1) + (mobileWidth ? (1 - portrait) * 15 : 0);
    position.set(Math.sin(orbit.x) * radius, orbit.y, Math.cos(orbit.x) * radius);
    look.set(Math.sin(aim.x) * aim.z, aim.y, Math.cos(aim.x) * aim.z);
    // Leave the main scenery to the right of desktop copy; center it on phones.
    const framing = host.clientWidth < 768 ? 0 : 4;
    look.x -= Math.cos(orbit.x) * framing; look.z += Math.sin(orbit.x) * framing;
    smoothPointer.lerp(pointer, 1 - Math.exp(-delta * 2));
    position.x += smoothPointer.x * 0.35; position.y += smoothPointer.y * 0.15;
    camera.position.copy(position); camera.lookAt(look);
    world.update(elapsed, camera.position.y);
    if (!lightweight && !daylightShadowsReady && camera.position.y >= 10) {
      renderer.shadowMap.needsUpdate = true; daylightShadowsReady = true;
    }
    realms.update(elapsed, camera);
    const paletteIndex = Math.min(palette.length - 2, Math.floor(currentProgress));
    const blend = THREE.MathUtils.smoothstep(currentProgress - paletteIndex, 0, 1);
    sky.copy(palette[paletteIndex].horizon).lerp(palette[paletteIndex + 1].horizon, blend);
    (scene.background as THREE.Color).copy(sky); (scene.fog as THREE.FogExp2).color.copy(sky);
    skyDome.position.copy(camera.position); skyMaterial.uniforms.horizon.value.copy(sky);
    skyMaterial.uniforms.zenith.value.copy(palette[paletteIndex].zenith).lerp(palette[paletteIndex + 1].zenith, blend);
    const startTime = performance.now(); renderer.render(scene, camera);
    if (qualitySteps < 4) {
      averageFrameTime += (Math.min(frameGap, 100) - averageFrameTime) * 0.05;
      slowFrames = performance.now() - startTime > frameInterval || averageFrameTime > frameInterval * 1.12 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
      if (slowFrames > 45) { qualitySteps++; slowFrames = 0; averageFrameTime = frameInterval; renderer.setPixelRatio(Math.min(renderer.getPixelRatio(), Math.max(1, renderer.getPixelRatio() - 0.25))); resize(); }
    }
  }
  function start() {
    if (!frame && !disposed && !lost && !document.hidden) { lastTime = 0; nextFrameTime = 0; averageFrameTime = frameInterval; frame = requestAnimationFrame(render); }
  }
  function onVisibility() { cancelAnimationFrame(frame); frame = 0; start(); }
  function onPointer(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || lightweight) return;
    pointer.set(event.clientX / window.innerWidth * 2 - 1, -(event.clientY / window.innerHeight * 2 - 1));
  }
  function onPointerLeave() { pointer.set(0, 0); }
  function onContextLost(event: Event) { event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0; onUnavailable(); }
  const observer = new ResizeObserver(resize); observer.observe(host);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pointermove', onPointer, { passive: true }); document.addEventListener('pointerleave', onPointerLeave);
  canvas.addEventListener('webglcontextlost', onContextLost); resize(); start();
  return {
    setProgress(value) {
      targetProgress = THREE.MathUtils.clamp(value, 0, CAMERA_STOPS.length - 1);
      if (!initialized) { currentProgress = targetProgress; initialized = true; cancelAnimationFrame(frame); frame = 0; render(performance.now()); }
    },
    dispose() {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility); window.removeEventListener('pointermove', onPointer); document.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      realms.dispose(); world.dispose(); sun.shadow.dispose(); skyMaterial.dispose(); skyGeometry.dispose(); snowMaterial.dispose(); snowGeometry.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };
}
