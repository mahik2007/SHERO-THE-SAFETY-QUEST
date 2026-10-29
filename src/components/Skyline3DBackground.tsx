import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Skyline3DBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080B18, 0.02);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 10, 28);
    camera.lookAt(0, 8, 0);

    // Lighting
    const ambient = new THREE.AmbientLight(0x20133F, 1.5);
    scene.add(ambient);

    const cyanLight = new THREE.PointLight(0x67E8F9, 3, 40);
    cyanLight.position.set(-15, 12, 10);
    scene.add(cyanLight);

    const blueLight = new THREE.PointLight(0x4B7BFF, 3, 40);
    blueLight.position.set(15, 12, 10);
    scene.add(blueLight);

    // 3D Skyscrapers Group
    const towersGroup = new THREE.Group();
    const bldgMat = new THREE.MeshStandardMaterial({ color: 0x0B0E23, roughness: 0.8 });
    const winMatCyan = new THREE.MeshBasicMaterial({ color: 0x67E8F9 });
    const winMatMagenta = new THREE.MeshBasicMaterial({ color: 0xF472D0 });
    const winMatLavender = new THREE.MeshBasicMaterial({ color: 0xA78BFA });

    for (let i = -12; i <= 12; i++) {
      const h = 10 + (Math.abs(i * 7) % 18) + Math.random() * 8;
      const w = 2.5 + Math.random() * 2;
      const d = 2.5 + Math.random() * 2;
      const x = i * 4.5 + (Math.random() - 0.5) * 1.5;
      const z = -5 - Math.random() * 20;

      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), bldgMat);
      mesh.position.set(x, h / 2, z);
      towersGroup.add(mesh);

      // Window strips
      for (let y = 3; y < h - 2; y += 3) {
        const mat = (i + y) % 3 === 0 ? winMatCyan : (i + y) % 3 === 1 ? winMatMagenta : winMatLavender;
        const win = new THREE.Mesh(new THREE.BoxGeometry(w * 0.8, 0.35, d + 0.1), mat);
        win.position.set(x, y, z);
        towersGroup.add(win);
      }
    }
    scene.add(towersGroup);

    // Moving Cyber Traffic Stream (Light Streaks along Highway)
    const trafficGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount; p++) {
      positions[p * 3] = (Math.random() - 0.5) * 80;
      positions[p * 3 + 1] = 0.5 + Math.random() * 0.3;
      positions[p * 3 + 2] = 5 + Math.random() * 8;

      const isCyan = Math.random() > 0.4;
      colors[p * 3] = isCyan ? 0.4 : 0.95;
      colors[p * 3 + 1] = isCyan ? 0.9 : 0.4;
      colors[p * 3 + 2] = 0.98;
    }

    trafficGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    trafficGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const trafficMat = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const trafficPoints = new THREE.Points(trafficGeo, trafficMat);
    scene.add(trafficPoints);

    // Animation Loop
    let lastTime = performance.now();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Slow cinematic camera orbit
      camera.position.x = Math.sin(now * 0.0003) * 4;
      camera.lookAt(0, 8, 0);

      // Traffic motion
      const pos = trafficGeo.attributes.position.array as Float32Array;
      for (let p = 0; p < particleCount; p++) {
        pos[p * 3] += (p % 2 === 0 ? 12 : -15) * delta;
        if (pos[p * 3] > 40) pos[p * 3] = -40;
        if (pos[p * 3] < -40) pos[p * 3] = 40;
      }
      trafficGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0" />;
};
