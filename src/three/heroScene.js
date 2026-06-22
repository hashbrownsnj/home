import * as THREE from 'three';

/**
 * Hero scene: a field of glowing gold embers/particles drifting
 * in 3D space with a subtle parallax response to mouse movement
 * and scroll. Built for atmosphere, not literal imagery — fits
 * the "molten gold in the dark" identity without being kitschy.
 */
export function initHeroScene(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 9;

  // ---------- particle field ----------
  const PARTICLE_COUNT = 900;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const speeds = new Float32Array(PARTICLE_COUNT);
  const colorMix = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const radius = 6 + Math.random() * 7;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
    positions[i * 3 + 2] = radius * Math.cos(phi) * 0.5 - 2;

    sizes[i] = Math.random() * 2.4 + 0.4;
    speeds[i] = Math.random() * 0.4 + 0.08;
    colorMix[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('colorMix', new THREE.BufferAttribute(colorMix, 1));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
    vertexShader: `
      attribute float size;
      attribute float colorMix;
      varying float vColorMix;
      varying float vAlpha;
      uniform float uTime;
      uniform float uPixelRatio;

      void main() {
        vColorMix = colorMix;
        vec3 pos = position;

        // gentle drifting motion, unique per-particle via colorMix as seed
        pos.y += sin(uTime * 0.3 + colorMix * 20.0) * 0.4;
        pos.x += cos(uTime * 0.2 + colorMix * 14.0) * 0.3;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        float dist = -mvPosition.z;
        vAlpha = smoothstep(18.0, 4.0, dist);

        gl_PointSize = size * uPixelRatio * (12.0 / dist);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying float vColorMix;
      varying float vAlpha;

      void main() {
        vec2 uv = gl_PointCoord.xy - 0.5;
        float dist = length(uv);
        float glow = smoothstep(0.5, 0.0, dist);
        glow = pow(glow, 1.6);

        vec3 hot = vec3(1.0, 0.48, 0.1);   // ember orange
        vec3 gold = vec3(1.0, 0.71, 0.15); // gold
        vec3 color = mix(gold, hot, vColorMix);

        gl_FragColor = vec4(color, glow * vAlpha * 0.9);
      }
    `,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // ---------- subtle wireframe lattice for depth ----------
  const latticeGeo = new THREE.IcosahedronGeometry(5.4, 1);
  const latticeMat = new THREE.MeshBasicMaterial({
    color: 0xc98a00,
    wireframe: true,
    transparent: true,
    opacity: 0.06,
  });
  const lattice = new THREE.Mesh(latticeGeo, latticeMat);
  lattice.position.set(0, -0.3, -3);
  scene.add(lattice);

  // ---------- interaction state ----------
  const mouse = { x: 0, y: 0 };
  const targetRotation = { x: 0, y: 0 };
  let scrollFactor = 0;

  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  window.addEventListener('scroll', () => {
    scrollFactor = Math.min(window.scrollY / window.innerHeight, 1.4);
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ---------- render loop ----------
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    material.uniforms.uTime.value = elapsed;

    targetRotation.y += (mouse.x * 0.3 - targetRotation.y) * 0.04;
    targetRotation.x += (-mouse.y * 0.2 - targetRotation.x) * 0.04;

    points.rotation.y = targetRotation.y + elapsed * 0.015;
    points.rotation.x = targetRotation.x;
    lattice.rotation.y = elapsed * 0.02;
    lattice.rotation.x = elapsed * 0.01;

    // scroll pushes camera "through" the field
    camera.position.z = 9 - scrollFactor * 5;
    camera.position.y = scrollFactor * -1.2;
    points.position.y = scrollFactor * 1.5;

    renderer.render(scene, camera);
  }

  animate();

  return {
    dispose() {
      geometry.dispose();
      material.dispose();
      latticeGeo.dispose();
      latticeMat.dispose();
      renderer.dispose();
    },
  };
}
