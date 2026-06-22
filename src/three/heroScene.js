import * as THREE from 'three';

/**
 * Hero scene: electric blue particle field with depth grid lines,
 * mouse parallax, and scroll zoom. Premium dark SaaS energy.
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
  const PARTICLE_COUNT = 1100;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const sizes     = new Float32Array(PARTICLE_COUNT);
  const colorMix  = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const radius = 5 + Math.random() * 9;
    const theta  = Math.random() * Math.PI * 2;
    const phi    = Math.acos(2 * Math.random() - 1);

    positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.55;
    positions[i * 3 + 2] = radius * Math.cos(phi) * 0.45 - 2;

    sizes[i]    = Math.random() * 2.2 + 0.3;
    colorMix[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('colorMix', new THREE.BufferAttribute(colorMix, 1));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
    uniforms: {
      uTime:       { value: 0 },
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

        // gentle drift — unique per particle via colorMix seed
        pos.y += sin(uTime * 0.25 + colorMix * 18.0) * 0.35;
        pos.x += cos(uTime * 0.18 + colorMix * 12.0) * 0.25;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        float dist = -mvPosition.z;
        vAlpha = smoothstep(20.0, 3.5, dist);

        gl_PointSize = size * uPixelRatio * (11.0 / dist);
        gl_Position  = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying float vColorMix;
      varying float vAlpha;

      void main() {
        vec2 uv   = gl_PointCoord.xy - 0.5;
        float d   = length(uv);
        float glow = smoothstep(0.5, 0.0, d);
        glow = pow(glow, 1.5);

        // blue palette: deep blue → electric blue-white core
        vec3 deep    = vec3(0.14, 0.33, 0.87);  // #2353DE
        vec3 electric = vec3(0.38, 0.65, 1.0);  // #60A5FA
        vec3 core    = vec3(0.72, 0.88, 1.0);   // near-white blue

        vec3 color = mix(deep, electric, vColorMix);
        color = mix(color, core, pow(glow, 3.0) * 0.6);

        gl_FragColor = vec4(color, glow * vAlpha * 0.85);
      }
    `,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // ---------- subtle wireframe sphere for depth ----------
  const latticeGeo = new THREE.IcosahedronGeometry(5.2, 1);
  const latticeMat = new THREE.MeshBasicMaterial({
    color: 0x2563eb,
    wireframe: true,
    transparent: true,
    opacity: 0.04,
  });
  const lattice = new THREE.Mesh(latticeGeo, latticeMat);
  lattice.position.set(0, -0.3, -3);
  scene.add(lattice);

  // ---------- depth grid lines ----------
  const GRID_LINES = 8;
  const gridGroup  = new THREE.Group();
  const gridMat    = new THREE.LineBasicMaterial({
    color: 0x2563eb,
    transparent: true,
    opacity: 0.07,
  });

  for (let i = 0; i <= GRID_LINES; i++) {
    const t  = i / GRID_LINES;
    const x  = (t - 0.5) * 18;
    const hG = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-9, (t - 0.5) * 12, -4),
      new THREE.Vector3( 9, (t - 0.5) * 12, -4),
    ]);
    const vG = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, -6, -4),
      new THREE.Vector3(x,  6, -4),
    ]);
    gridGroup.add(new THREE.Line(hG, gridMat));
    gridGroup.add(new THREE.Line(vG, gridMat));
  }
  scene.add(gridGroup);

  // ---------- interaction state ----------
  const mouse          = { x: 0, y: 0 };
  const targetRotation = { x: 0, y: 0 };
  let scrollFactor     = 0;

  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
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

    targetRotation.y += (mouse.x * 0.25 - targetRotation.y) * 0.04;
    targetRotation.x += (-mouse.y * 0.18 - targetRotation.x) * 0.04;

    points.rotation.y  = targetRotation.y + elapsed * 0.012;
    points.rotation.x  = targetRotation.x;
    lattice.rotation.y = elapsed * 0.018;
    lattice.rotation.x = elapsed * 0.009;

    gridGroup.rotation.y = targetRotation.y * 0.3;

    // scroll pushes camera through the field
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
      gridMat.dispose();
      renderer.dispose();
    },
  };
}
