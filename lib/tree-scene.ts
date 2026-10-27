import * as THREE from 'three';
import { CROWN_PROGRESS, PALACE_ENTRANCE_PROGRESS, PALACE_INTERIOR_PROGRESS, type JourneyScene } from './tree-journey';
import { createTreeWorld } from './tree-world';
import { createBranchRealms } from './branch-realms';
import { HEAVEN_REALM, TREE_REALMS } from './tree-realms';
import { TREE_CAMERA_STOPS as CAMERA_STOPS } from './tree-camera';
import { createRenderQuality } from './tree-render-quality';

export function createTreeScene(host: HTMLElement, onUnavailable: () => void): JourneyScene {
  const lightweight = window.matchMedia('(max-width: 767px)').matches || navigator.hardwareConcurrency <= 4;
  const renderer = new THREE.WebGLRenderer({ antialias: !lightweight, alpha: false, powerPreference: 'high-performance' });
  const maxPixelRatio = Math.min(window.devicePixelRatio, lightweight ? 1.25 : 1.5);
  renderer.setPixelRatio(maxPixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  // The landscape is stationary: render its sun shadow once, then reuse it.
  renderer.shadowMap.enabled = !lightweight;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  const canvas = renderer.domElement; host.appendChild(canvas);
  const scene = new THREE.Scene();
  const dawn = new THREE.Color('#91ccec');
  const palette = CAMERA_STOPS.map((_, index) => {
    const realm = index >= HEAVEN_REALM.progress && index <= CROWN_PROGRESS
      ? HEAVEN_REALM : TREE_REALMS.find(item => item.progress === index);
    return { horizon: new THREE.Color(realm?.horizon ?? '#91ccec'), zenith: new THREE.Color(realm?.zenith ?? '#147ac1') };
  });
  scene.background = dawn.clone(); scene.fog = new THREE.FogExp2(dawn.clone(), 0.0013);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.2, 480);
  scene.add(camera);
  const hemisphere = new THREE.HemisphereLight('#d3eaff', '#536b2e', 2.1); scene.add(hemisphere);
  const sun = new THREE.DirectionalLight('#fff2ce', 3.2); sun.position.set(-70, 150, 80); scene.add(sun);
  sun.castShadow = !lightweight;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -125, right: 125, top: 145, bottom: -110, near: 1, far: 350 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.25; sun.shadow.intensity = 0.55;
  const fill = new THREE.DirectionalLight('#c8e4ee', 1.2); fill.position.set(60, 100, 140); scene.add(fill);
  const daylight = {
    sky: new THREE.Color('#d3eaff'), ground: new THREE.Color('#536b2e'),
    sun: new THREE.Color('#fff2ce'), fill: new THREE.Color('#c8e4ee'),
  };
  const volcanicLight = {
    sky: new THREE.Color('#7d3026'), ground: new THREE.Color('#ff622a'),
    sun: new THREE.Color('#ffa264'), fill: new THREE.Color('#ff6b31'),
  };
  const palaceLight = {
    sky: new THREE.Color('#ffe4b5'), ground: new THREE.Color('#6a3b29'),
    sun: new THREE.Color('#ffdda0'), fill: new THREE.Color('#ffd19a'),
  };
  const daylightFillPosition = fill.position.clone();
  const lavaFillPosition = new THREE.Vector3(-40, -65, 100);
  const world = createTreeWorld(scene, lightweight, Math.min(lightweight ? 2 : 4, renderer.capabilities.getMaxAnisotropy()));
  const realms = createBranchRealms(scene, lightweight);
  const skyMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { horizon: { value: dawn.clone() }, zenith: { value: new THREE.Color('#147ac1') }, time: { value: 0 }, underworld: { value: 0 } },
    vertexShader: `varying vec3 direction; void main() { direction = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position.z = gl_Position.w; }`,
    fragmentShader: `varying vec3 direction; uniform vec3 horizon; uniform vec3 zenith; uniform float time; uniform float underworld;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
      }
      float fbm(vec2 p) {
        float sum = 0.0, amplitude = 0.5;
        for (int i = 0; i < 3; i++) {
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
        color += vec3(0.6, 0.48, 0.22) * pow(alignment, 18.0) * 0.8 * (1.0 - underworld);
        vec2 cloudUV = d.xz / max(0.13, d.y + 0.19) * 1.5 + vec2(time * 0.003, 0.0);
        float cloud = fbm(cloudUV);
        float bank = smoothstep(0.4, 0.62, cloud) * smoothstep(-0.025, 0.12, d.y);
        float light = smoothstep(0.4, 0.66, cloud + noise(cloudUV + vec2(-0.12, 0.18)) * 0.12);
        vec3 cloudColor = mix(vec3(0.48, 0.61, 0.75), vec3(1.55, 1.52, 1.35), light);
        vec3 fireGlow = vec3(0.0);
        if (underworld > 0.001) {
          cloudColor = mix(cloudColor, mix(vec3(0.025, 0.004, 0.003), vec3(0.24, 0.025, 0.006), light), underworld);
          bank = mix(bank, smoothstep(0.27, 0.58, cloud) * smoothstep(-0.2, 0.3, d.y), underworld);
          fireGlow = vec3(0.2, 0.023, 0.003) * exp(-abs(d.y + 0.03) * 6.0) * underworld;
        }
        color = mix(color, cloudColor, bank);
        color += fireGlow;
        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const skyGeometry = new THREE.SphereGeometry(430, 16, 10);
  // Draw the sky at the far plane after opaque scenery. Covered pixels skip
  // its cloud shader, leaving more GPU time for crisp foliage and grass.
  const skyDome = new THREE.Mesh(skyGeometry, skyMaterial); skyDome.renderOrder = 1000; scene.add(skyDome);
  const orbitCurve = new THREE.CatmullRomCurve3(CAMERA_STOPS.map(s => new THREE.Vector3(...s.position)), false, 'catmullrom', 0.3);
  const aimCurve = new THREE.CatmullRomCurve3(CAMERA_STOPS.map(s => new THREE.Vector3(...s.target)), false, 'catmullrom', 0.3);
  const orbit = new THREE.Vector3(), aim = new THREE.Vector3(), position = new THREE.Vector3(), look = new THREE.Vector3();
  const pointer = new THREE.Vector2(), smoothPointer = new THREE.Vector2(), sky = new THREE.Color();
  let targetProgress = 0, currentProgress = 0, initialized = false;
  let lost = false, disposed = false, frame = 0, lastTime = 0, nextFrameTime = 0, elapsed = 0;
  const frameInterval = 1000 / 60;
  const context = renderer.getContext();
  const gl = 'createQuery' in context ? context : null;
  const timer = gl?.getExtension('EXT_disjoint_timer_query_webgl2') as { TIME_ELAPSED_EXT: number; GPU_DISJOINT_EXT: number } | null;
  const gpuQuery = gl && timer ? gl.createQuery() : null;
  const quality = createRenderQuality(maxPixelRatio, !!gpuQuery);
  let queryPending = false, queryFrames = 0;
  let daylightShadowsReady = false;
  let viewportWidth = 0;

  function resize() {
    if (disposed) return;
    const width = host.clientWidth, height = host.clientHeight;
    if (!width || !height) return;
    viewportWidth = width;
    renderer.setSize(width, height, false); camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  function render(time: number) {
    frame = 0;
    if (disposed || lost || document.hidden) return;
    frame = requestAnimationFrame(render);
    if (time < nextFrameTime - 1) return;
    const startTime = performance.now();
    nextFrameTime = nextFrameTime && time - nextFrameTime < frameInterval * 2 ? nextFrameTime + frameInterval : time + frameInterval;
    const frameGap = lastTime ? time - lastTime : frameInterval;
    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : frameInterval / 1000;
    lastTime = time; elapsed += delta; skyMaterial.uniforms.time.value = elapsed;
    currentProgress += (targetProgress - currentProgress) * (1 - Math.exp(-delta * 3.2));
    if (Math.abs(currentProgress - targetProgress) < 0.001) currentProgress = targetProgress;
    const t = currentProgress / (CAMERA_STOPS.length - 1);
    orbitCurve.getPoint(t, orbit); aimCurve.getPoint(t, aim);
    const portrait = 1 - THREE.MathUtils.smoothstep(currentProgress, 0, 1);
    const mobileWidth = viewportWidth < 768;
    const heaven = THREE.MathUtils.smoothstep(currentProgress, HEAVEN_REALM.progress - 1, HEAVEN_REALM.progress);
    const passage = THREE.MathUtils.smoothstep(currentProgress, PALACE_ENTRANCE_PROGRESS - 1, PALACE_ENTRANCE_PROGRESS);
    const interior = THREE.MathUtils.smoothstep(currentProgress, PALACE_ENTRANCE_PROGRESS, PALACE_INTERIOR_PROGRESS + 0.5);
    position.copy(orbit); look.copy(aim);
    if (mobileWidth) position.sub(aim).multiplyScalar(1 + (0.12 + portrait * 0.18 + heaven * 0.23) * (1 - passage)).add(aim);
    // Leave the main scenery to the right of desktop copy; center it on phones.
    const framing = mobileWidth ? 0 : 4 * (1 - passage);
    const angle = Math.atan2(position.x, position.z);
    look.x -= Math.cos(angle) * framing; look.z += Math.sin(angle) * framing;
    smoothPointer.lerp(pointer, 1 - Math.exp(-delta * 2));
    position.x += smoothPointer.x * 0.35 * (1 - passage * 0.85);
    position.y += smoothPointer.y * 0.15 * (1 - passage * 0.85);
    camera.position.copy(position); camera.lookAt(look);
    const fov = THREE.MathUtils.lerp(mobileWidth ? 65 : 48, mobileWidth ? 68 : 58, interior);
    if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }
    // Reuse existing lights for lava bounce; no extra lights or shadow passes.
    const underworld = 1 - THREE.MathUtils.smoothstep(camera.position.y, -8, 7);
    skyMaterial.uniforms.underworld.value = underworld;
    hemisphere.color.copy(daylight.sky).lerp(volcanicLight.sky, underworld);
    hemisphere.groundColor.copy(daylight.ground).lerp(volcanicLight.ground, underworld);
    hemisphere.intensity = THREE.MathUtils.lerp(2.1, 1.25, underworld);
    sun.color.copy(daylight.sun).lerp(volcanicLight.sun, underworld);
    sun.intensity = THREE.MathUtils.lerp(3.2, 1.1, underworld);
    fill.color.copy(daylight.fill).lerp(volcanicLight.fill, underworld);
    fill.position.copy(daylightFillPosition).lerp(lavaFillPosition, underworld);
    fill.intensity = THREE.MathUtils.lerp(1.2, 1.9, underworld);
    hemisphere.color.lerp(palaceLight.sky, interior); hemisphere.groundColor.lerp(palaceLight.ground, interior);
    hemisphere.intensity = THREE.MathUtils.lerp(hemisphere.intensity, 1.65, interior);
    sun.color.lerp(palaceLight.sun, interior); sun.intensity = THREE.MathUtils.lerp(sun.intensity, 2.2, interior);
    fill.color.lerp(palaceLight.fill, interior); fill.intensity = THREE.MathUtils.lerp(fill.intensity, 2.0, interior);
    (scene.fog as THREE.FogExp2).density = THREE.MathUtils.lerp(THREE.MathUtils.lerp(0.0013, 0.0045, underworld), 0.0006, interior);
    world.update(elapsed, camera.position.y, camera);
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
    // Reuse one asynchronous timer query, sampled twice a second. Never wait
    // for the GPU; unavailable or disjoint results are simply ignored.
    let gpuMs: number | undefined;
    queryFrames++;
    if (gl && timer && gpuQuery && queryPending && queryFrames % 8 === 0) {
      if (gl.getParameter(timer.GPU_DISJOINT_EXT)) {
        queryPending = false; quality.invalidateGpu();
      } else if (gl.getQueryParameter(gpuQuery, gl.QUERY_RESULT_AVAILABLE)) {
        gpuMs = gl.getQueryParameter(gpuQuery, gl.QUERY_RESULT) / 1e6;
        queryPending = false;
      }
    }
    const queryActive = !!(gl && timer && gpuQuery && !queryPending && queryFrames % 30 === 0);
    if (queryActive && gl && timer && gpuQuery) gl.beginQuery(timer.TIME_ELAPSED_EXT, gpuQuery);
    renderer.render(scene, camera);
    if (queryActive && gl && timer) { gl.endQuery(timer.TIME_ELAPSED_EXT); queryPending = true; }
    const nextPixelRatio = quality.sample(time, performance.now() - startTime, frameGap, gpuMs);
    if (nextPixelRatio !== undefined) {
      renderer.setPixelRatio(nextPixelRatio); resize();
    }
  }
  function start() {
    if (!frame && !disposed && !lost && !document.hidden) { lastTime = 0; nextFrameTime = 0; quality.reset(performance.now()); frame = requestAnimationFrame(render); }
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
      if (gl && gpuQuery) gl.deleteQuery(gpuQuery);
      realms.dispose(); world.dispose(); sun.shadow.dispose(); skyMaterial.dispose(); skyGeometry.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };
}
