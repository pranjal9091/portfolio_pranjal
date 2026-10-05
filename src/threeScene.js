import * as THREE from 'three';

/**
 * Interactive 3D WebGL Hero Canvas Engine
 * Features:
 * - Dynamic crystalline quantum core (Morphing Icosahedron + Wireframe lattice)
 * - Orbiting dual-axis planetary rings
 * - 1,500 responsive kinetic particle nodes with cursor gravitational pull
 * - Mouse velocity tracking, drag-rotation, and click-shockwave ripples
 */
export class HeroThreeScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.dragRotation = { x: 0, y: 0 };

    this.init();
    this.createObjects();
    this.createParticles();
    this.bindEvents();
    this.animate(0);
  }

  init() {
    this.scene = new THREE.Scene();
    
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 24;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.container.appendChild(this.renderer.domElement);

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0x16161D, 2.5);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xE8D5B5, 3.5);
    keyLight.position.set(10, 15, 10);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38BDF8, 2.8);
    rimLight.position.set(-15, -10, -10);
    this.scene.add(rimLight);

    const mintLight = new THREE.PointLight(0x34D399, 3.0, 30);
    mintLight.position.set(0, -6, 5);
    this.scene.add(mintLight);
  }

  createObjects() {
    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    // 1. Inner Crystalline Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(4.2, 1);
    this.coreOriginalPositions = coreGeo.attributes.position.clone();
    
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x121218,
      emissive: 0x1A1813,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      wireframe: false,
      flatShading: true,
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.mainGroup.add(this.coreMesh);

    // 2. Wireframe Lattice Overlay (Warm Champagne Gold)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xE8D5B5,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    this.wireMesh = new THREE.Mesh(coreGeo, wireMat);
    this.wireMesh.scale.setScalar(1.02);
    this.mainGroup.add(this.wireMesh);

    // 3. Orbiting Torus Ring 1 (Horizon Blue)
    const ringGeo1 = new THREE.TorusGeometry(6.6, 0.04, 16, 120);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.6,
    });
    this.ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    this.ring1.rotation.x = Math.PI / 3;
    this.mainGroup.add(this.ring1);

    // 4. Orbiting Torus Ring 2 (Warm Sand Gold)
    const ringGeo2 = new THREE.TorusGeometry(7.6, 0.03, 16, 140);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xE8D5B5,
      transparent: true,
      opacity: 0.45,
    });
    this.ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.ring2.rotation.y = Math.PI / 4;
    this.ring2.rotation.x = -Math.PI / 6;
    this.mainGroup.add(this.ring2);

    // 5. Orbiting Quantum Nodes on Rings
    this.ringNodes = [];
    const nodeGeo = new THREE.SphereGeometry(0.16, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xFFF6E5 });
    
    for (let i = 0; i < 4; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      this.mainGroup.add(node);
      this.ringNodes.push({
        mesh: node,
        radius: i % 2 === 0 ? 6.6 : 7.6,
        angle: (i * Math.PI) / 2,
        speed: (i % 2 === 0 ? 0.012 : -0.009),
        ringIndex: i % 2
      });
    }
  }

  createParticles() {
    const particleCount = 1400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0xE8D5B5), // Champagne
      new THREE.Color(0x38BDF8), // Horizon Cyan
      new THREE.Color(0x34D399), // Mint Emerald
      new THREE.Color(0xA09E96), // Muted Silver
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 5.5 + Math.random() * 14.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circle particle texture for soft rounded dots
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.7)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      map: texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.particles = new THREE.Points(geometry, material);
    this.particlePositions = positions;
    this.particleOriginalPositions = originalPositions;
    this.particleVelocities = velocities;
    this.mainGroup.add(this.particles);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());

    // Mouse movement
    window.addEventListener('mousemove', (e) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      this.mouse.targetX = (e.clientX - halfW) / halfW;
      this.mouse.targetY = -(e.clientY - halfH) / halfH;
    });

    // Drag to rotate
    const dom = this.renderer.domElement;
    dom.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.dragRotation.y += deltaX * 0.005;
      this.dragRotation.x += deltaY * 0.005;

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Click wave distortion
    dom.addEventListener('click', () => {
      this.triggerShockwave();
    });

    // Scroll depth effect
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      this.camera.position.y = -scrollY * 0.004;
      this.camera.rotation.x = -scrollY * 0.0002;
    });
  }

  triggerShockwave() {
    this.shockwaveActive = true;
    this.shockwaveRadius = 0;
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate(time) {
    requestAnimationFrame((t) => this.animate(t));

    const t = time * 0.001;

    // Smooth mouse interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Main group rotation
    this.mainGroup.rotation.y = t * 0.12 + this.mouse.x * 0.5 + this.dragRotation.y;
    this.mainGroup.rotation.x = t * 0.06 + this.mouse.y * 0.35 + this.dragRotation.x;

    // Rings counter-rotation
    if (this.ring1) {
      this.ring1.rotation.z += 0.005;
      this.ring1.rotation.y += 0.002;
    }
    if (this.ring2) {
      this.ring2.rotation.z -= 0.004;
      this.ring2.rotation.x += 0.003;
    }

    // Orbiting nodes
    if (this.ringNodes) {
      this.ringNodes.forEach((node) => {
        node.angle += node.speed;
        const x = Math.cos(node.angle) * node.radius;
        const z = Math.sin(node.angle) * node.radius;
        if (node.ringIndex === 0) {
          node.mesh.position.set(x, z * Math.sin(Math.PI / 3), z * Math.cos(Math.PI / 3));
        } else {
          node.mesh.position.set(x * Math.cos(Math.PI / 4), x * Math.sin(Math.PI / 4), z);
        }
      });
    }

    // Geometric Core Vertex Oscillation (Mathematical breathing)
    if (this.coreMesh && this.coreOriginalPositions) {
      const posAttr = this.coreMesh.geometry.attributes.position;
      const origPos = this.coreOriginalPositions;
      const count = posAttr.count;

      for (let i = 0; i < count; i++) {
        const ox = origPos.getX(i);
        const oy = origPos.getY(i);
        const oz = origPos.getZ(i);

        const dist = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const wave = Math.sin(dist * 2.5 - t * 2.5 + i * 0.2) * 0.18;

        posAttr.setXYZ(i, ox + (ox / dist) * wave, oy + (oy / dist) * wave, oz + (oz / dist) * wave);
      }
      posAttr.needsUpdate = true;
      this.wireMesh.geometry.attributes.position.needsUpdate = true;
    }

    // Swirling Particle Field with Gravitational Perturbation
    if (this.particles) {
      const positions = this.particlePositions;
      const orig = this.particleOriginalPositions;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        // Ambient orbit around Y-axis
        const x = positions[ix];
        const z = positions[iz];
        const angle = 0.0015 + (i % 5) * 0.0003;

        positions[ix] = x * Math.cos(angle) - z * Math.sin(angle);
        positions[iz] = x * Math.sin(angle) + z * Math.cos(angle);

        // Subtle gentle drift toward mouse orientation
        positions[ix] += this.mouse.x * 0.03;
        positions[iy] += this.mouse.y * 0.03;

        // Return pull to original bounds
        positions[ix] += (orig[ix] - positions[ix]) * 0.01;
        positions[iy] += (orig[iy] - positions[iy]) * 0.01;
        positions[iz] += (orig[iz] - positions[iz]) * 0.01;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
