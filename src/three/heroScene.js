import * as THREE from 'three';

export function initHeroScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 8;

  const count = window.innerWidth < 700 ? 420 : 760;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 7;
    sizes[i] = Math.random() * 2.2 + 0.7;
    seeds[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.7) } },
    vertexShader: `
      attribute float size; attribute float seed; varying float vSeed; uniform float uTime; uniform float uPixelRatio;
      void main(){
        vSeed=seed; vec3 p=position;
        p.x += sin(uTime*.22 + seed*18.0)*.22; p.y += cos(uTime*.28 + seed*13.0)*.18;
        vec4 mv=modelViewMatrix*vec4(p,1.0); gl_PointSize=size*uPixelRatio*(18.0/-mv.z); gl_Position=projectionMatrix*mv;
      }`,
    fragmentShader: `
      varying float vSeed;
      void main(){
        vec2 uv=gl_PointCoord-.5; float d=length(uv); float a=pow(smoothstep(.5,0.,d),2.2);
        vec3 deep=vec3(.06,.23,.72); vec3 electric=vec3(.22,.74,.97); vec3 c=mix(deep,electric,vSeed);
        gl_FragColor=vec4(c,a*.58);
      }`,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const ringGeo = new THREE.TorusGeometry(2.8, 0.006, 8, 160);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.22 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI * 0.62;
  ring.position.z = -1.7;
  scene.add(ring);

  const state = { mx: 0, my: 0, sx: 0, sy: 0, scroll: 0 };
  window.addEventListener('pointermove', (event) => {
    state.mx = (event.clientX / window.innerWidth - 0.5) * 2;
    state.my = (event.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
  window.addEventListener('scroll', () => { state.scroll = Math.min(window.scrollY / window.innerHeight, 1.5); }, { passive: true });
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    material.uniforms.uTime.value = time;
    state.sx += (state.mx - state.sx) * 0.045;
    state.sy += (state.my - state.sy) * 0.045;
    particles.rotation.y = time * 0.018 + state.sx * 0.18;
    particles.rotation.x = state.sy * -0.12;
    particles.position.y = state.scroll * 0.9;
    ring.rotation.z = time * 0.05;
    ring.rotation.y = state.sx * 0.22;
    camera.position.z = 8 - state.scroll * 2.4;
    renderer.render(scene, camera);
  }
  animate();

  return { dispose() { geometry.dispose(); material.dispose(); ringGeo.dispose(); ringMat.dispose(); renderer.dispose(); } };
}
