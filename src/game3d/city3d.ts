import * as THREE from 'three';

export type CityEnvironmentId = 'city_streets' | 'bus_stop' | 'the_alley' | 'city_intersection';

export interface InteractiveWorldObject {
  id: string;
  name: string;
  position: THREE.Vector3;
  radius: number;
  promptText: string;
  dialogueSpeaker: string;
  dialogueText: string;
}

export interface City3DEnvironment {
  scene: THREE.Scene;
  obstacles: THREE.Box3[];
  triggerBox: THREE.Box3;
  triggerMesh: THREE.Group;
  interactiveObjects: InteractiveWorldObject[];
  environmentId: CityEnvironmentId;
  update: (delta: number) => void;
}

export function build3DCityEnvironment(
  missionNumber: number = 1,
  nodeIndex: number = 1,
  forcedEnv?: CityEnvironmentId
): City3DEnvironment {
  const scene = new THREE.Scene();

  // Determine environment identity
  const envId: CityEnvironmentId =
    forcedEnv ||
    (missionNumber === 1
      ? 'bus_stop'
      : missionNumber === 2
      ? 'the_alley'
      : missionNumber === 3
      ? 'city_intersection'
      : 'city_streets');

  const isNightEnv = envId === 'the_alley' || envId === 'bus_stop';

  if (isNightEnv) {
    // Cinematic deep anime night sky: deep violet-midnight
    scene.background = new THREE.Color(0x04061A);
    scene.fog = new THREE.FogExp2(0x070A1E, 0.006);
  } else {
    // Premium daylight architectural theme: Pale sky blue with soft warm ivory atmospheric haze
    scene.background = new THREE.Color(0xD8E8F5);
    scene.fog = new THREE.FogExp2(0xE2EEF8, 0.0035);
  }

  const obstacles: THREE.Box3[] = [];
  const interactiveObjects: InteractiveWorldObject[] = [];

  if (isNightEnv) {
    // ── NIGHT SKY STAR FIELD & MOON ──────────────────────────────────────────
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 180 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5;
      starPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi);
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.5, sizeAttenuation: true, transparent: true, opacity: 0.85 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Bright moon disc in sky
    const moonGeo = new THREE.CircleGeometry(8, 32);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xE0F2FE, transparent: true, opacity: 0.92 });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(-80, 120, -140);
    moonMesh.lookAt(0, 0, 0);
    scene.add(moonMesh);

    // Night Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x2A3060, 2.8);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0x93C5FD, 2.2);
    moonLight.position.set(0, 60, 0);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 1024;
    moonLight.shadow.mapSize.height = 1024;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 120;
    moonLight.shadow.camera.left = -60;
    moonLight.shadow.camera.right = 60;
    moonLight.shadow.camera.top = 60;
    moonLight.shadow.camera.bottom = -60;
    scene.add(moonLight);

    const purpleFill = new THREE.DirectionalLight(0xC084FC, 0.9);
    purpleFill.position.set(-30, 25, -20);
    scene.add(purpleFill);

    const warmFill = new THREE.DirectionalLight(0xF59E0B, 0.5);
    warmFill.position.set(20, 8, 10);
    scene.add(warmFill);
  } else {
    // ── DAYTIME ARCHITECTURAL LIGHTING ───────────────────────────────────────
    // Soft skylight ambient (warm cream + pale sky blue)
    const daylightAmbient = new THREE.AmbientLight(0xF8F9FC, 2.2);
    scene.add(daylightAmbient);

    // Main warm sunlight with crisp natural shadows (champagne gold / warm ivory)
    const sunLight = new THREE.DirectionalLight(0xFFFBEB, 2.6);
    sunLight.position.set(25, 70, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 140;
    sunLight.shadow.camera.left = -70;
    sunLight.shadow.camera.right = 70;
    sunLight.shadow.camera.top = 70;
    sunLight.shadow.camera.bottom = -70;
    scene.add(sunLight);

    // Secondary sky fill light (pale sky blue)
    const skyFill = new THREE.DirectionalLight(0xBAE6FD, 1.2);
    skyFill.position.set(-30, 40, -25);
    scene.add(skyFill);

    // Ground bounce fill (warm ivory stone)
    const groundBounce = new THREE.DirectionalLight(0xF5F3ED, 0.6);
    groundBounce.position.set(0, -20, 0);
    scene.add(groundBounce);

    // Distant decorative sun glow disc
    const sunGeo = new THREE.CircleGeometry(10, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xFFFBEB, transparent: true, opacity: 0.85 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(80, 110, -120);
    sunMesh.lookAt(0, 0, 0);
    scene.add(sunMesh);
  }

  // 2. Base Materials & Textures
  // Road asphalt: clean daylight asphalt or wet reflective night asphalt
  const roadMat = new THREE.MeshStandardMaterial({
    color: isNightEnv ? 0x090D1A : 0x334155,
    roughness: isNightEnv ? 0.25 : 0.75,
    metalness: isNightEnv ? 0.6 : 0.08
  });

  // Sidewalk: natural paved stone (warm ivory / soft stone in daylight)
  const sidewalkMat = new THREE.MeshStandardMaterial({
    color: isNightEnv ? 0x1E2442 : 0xE2E8F0,
    roughness: 0.6,
    metalness: 0.1
  });

  // Curb edge stone (natural stone granite)
  const curbMat = new THREE.MeshStandardMaterial({
    color: isNightEnv ? 0x334155 : 0x94A3B8,
    roughness: 0.5
  });

  const bldgMat = new THREE.MeshStandardMaterial({
    color: isNightEnv ? 0x0F1426 : 0xF1F5F9,
    roughness: 0.75
  });
  const brickMat = new THREE.MeshStandardMaterial({
    color: isNightEnv ? 0x2E1A17 : 0xB45309,
    roughness: 0.82
  });
  const warmGlowMat = new THREE.MeshStandardMaterial({
    color: 0xFEF08A,
    emissive: 0xF59E0B,
    emissiveIntensity: isNightEnv ? 0.95 : 0.35
  });
  const cyanGlowMat = new THREE.MeshStandardMaterial({
    color: 0xBAE6FD,
    emissive: 0x38BDF8,
    emissiveIntensity: isNightEnv ? 0.85 : 0.25
  });
  const pharmacyGreenMat = new THREE.MeshStandardMaterial({
    color: 0x10B981,
    emissive: 0x10B981,
    emissiveIntensity: isNightEnv ? 1.0 : 0.5
  });

  // Animation holders
  const movingVehicles: { mesh: THREE.Group; speed: number; minX: number; maxX: number; dir: number }[] = [];
  const movingPedestrians: { mesh: THREE.Group; speed: number; minX: number; maxX: number; legL: THREE.Mesh; legR: THREE.Mesh; animTime: number }[] = [];
  const trafficLightBulbs: { red: THREE.Mesh; amber: THREE.Mesh; green: THREE.Mesh }[] = [];
  const busArrivalState = { mesh: null as THREE.Group | null, targetX: 2.0, speed: 7.0, isArriving: true };

  // =========================================================================
  // HELPER: Detailed Multi-Storey Building with Balconies & Signs
  // =========================================================================
  // Neon sign colors for variety
  const neonColors = [0xFF2D78, 0x00E5FF, 0xB44BFF, 0xFFD600, 0x00FF90, 0xFF6B2B, 0x4BFFDB];

  function createBuilding(x: number, z: number, w: number, h: number, d: number, isBrick: boolean = false) {
    const bldgGroup = new THREE.Group();
    bldgGroup.position.set(x, h / 2, z);

    // Main facade
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), isBrick ? brickMat : bldgMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    bldgGroup.add(mesh);

    // Roof cornice overhang (visible from top-down as colored border)
    const signIdx = Math.abs(Math.floor(x + z)) % neonColors.length;
    const neonColor = neonColors[signIdx];
    const corniceNeonMat = new THREE.MeshStandardMaterial({
      color: neonColor,
      emissive: neonColor,
      emissiveIntensity: 1.2,
      roughness: 0.3
    });
    const cornice = new THREE.Mesh(new THREE.BoxGeometry(w + 0.8, 0.35, d + 0.8), corniceNeonMat);
    cornice.position.y = h / 2 + 0.17;
    bldgGroup.add(cornice);

    // Roof sign/billboard (flat, visible top-down — key for isometric view!)
    const roofSignMat = new THREE.MeshStandardMaterial({
      color: neonColor,
      emissive: neonColor,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    const roofSign = new THREE.Mesh(new THREE.BoxGeometry(w * 0.65, 0.18, d * 0.45), roofSignMat);
    roofSign.position.y = h / 2 + 0.5;
    bldgGroup.add(roofSign);

    // Roof neon glow point light (illuminates top of building and nearby ground)
    const roofLight = new THREE.PointLight(neonColor, 2.5, 18, 1.5);
    roofLight.position.y = h / 2 + 1.5;
    bldgGroup.add(roofLight);

    // Glowing window grids with frames (alternating warm/cyan for anime feel)
    const numFloors = Math.floor(h / 3.2);
    for (let f = 1; f < numFloors; f++) {
      const yPos = -h / 2 + f * 3.2;
      const winGeo = new THREE.BoxGeometry(w * 0.82, 0.55, d + 0.15);
      const isWarm = (f + Math.floor(x)) % 2 === 0;
      const winMesh = new THREE.Mesh(winGeo, isWarm ? warmGlowMat : cyanGlowMat);
      winMesh.position.y = yPos;
      bldgGroup.add(winMesh);

      // Balcony rails on lower floors
      if (f <= 3 && Math.abs(x) < 50) {
        const balcMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
        const balc = new THREE.Mesh(new THREE.BoxGeometry(w * 0.75, 0.4, 0.6), balcMat);
        balc.position.set(0, yPos - 0.4, d / 2 + 0.3);
        bldgGroup.add(balc);
      }
    }

    scene.add(bldgGroup);
    const box = new THREE.Box3();
    box.setFromCenterAndSize(new THREE.Vector3(x, h / 2, z), new THREE.Vector3(w, h, d));
    obstacles.push(box);
    return bldgGroup;
  }

  // =========================================================================
  // HELPER: Lush Foliage Trees (Anime Cinematic Silhouette)
  // =========================================================================
  function createTree(x: number, z: number) {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, 0, z);

    // Trunk
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x271911, roughness: 0.9 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 4.2, 8), trunkMat);
    trunk.position.y = 2.1;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    // Tiered anime foliage clusters (deep emerald with neon highlight)
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x064E3B,
      roughness: 0.8,
      emissive: 0x047857,
      emissiveIntensity: 0.15
    });

    const leafTiers = [
      { y: 3.6, r: 1.5 },
      { y: 4.6, r: 1.2 },
      { y: 5.4, r: 0.8 }
    ];

    leafTiers.forEach(tier => {
      const cluster = new THREE.Mesh(new THREE.DodecahedronGeometry(tier.r, 1), leafMat);
      cluster.position.y = tier.y;
      cluster.castShadow = true;
      treeGroup.add(cluster);
    });

    scene.add(treeGroup);
  }

  // =========================================================================
  // HELPER: Streetlight with Warm Amber Glow & Ground Halo
  // =========================================================================
  function createStreetlight(x: number, z: number) {
    const lightGroup = new THREE.Group();
    lightGroup.position.set(x, 0, z);

    // Pole
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.4, roughness: 0.5 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 6.2, 10), poleMat);
    pole.position.y = 3.1;
    pole.castShadow = true;
    lightGroup.add(pole);

    // Curved Arm
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.12), poleMat);
    arm.position.set(-0.6, 6.1, 0);
    lightGroup.add(arm);

    // Lamp shade
    const lampHead = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.25, 10), poleMat);
    lampHead.position.set(-1.2, 6.0, 0);
    lightGroup.add(lampHead);

    // Glowing warm bulb
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), warmGlowMat);
    bulb.position.set(-1.2, 5.85, 0);
    lightGroup.add(bulb);

    // Point Light casting warm radiance
    const pLight = new THREE.PointLight(0xF59E0B, 3.8, 18, 1.2);
    pLight.position.set(-1.2, 5.6, 0);
    pLight.castShadow = true;
    pLight.shadow.mapSize.width = 512;
    pLight.shadow.mapSize.height = 512;
    lightGroup.add(pLight);

    // Ground wet reflection pool under streetlight
    const puddleMat = new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      emissive: 0xD97706,
      emissiveIntensity: 0.35,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.4
    });
    const puddle = new THREE.Mesh(new THREE.CircleGeometry(2.2, 16), puddleMat);
    puddle.rotation.x = -Math.PI / 2;
    puddle.position.set(-1.2, 0.02, 0);
    lightGroup.add(puddle);

    scene.add(lightGroup);
  }

  // =========================================================================
  // HELPER: Planters with Blooming Flowers
  // =========================================================================
  function createPlanter(x: number, z: number) {
    const planterGroup = new THREE.Group();
    planterGroup.position.set(x, 0.35, z);
    const box = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.7, 0.9), new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.7 }));
    planterGroup.add(box);

    const flowerMat1 = new THREE.MeshStandardMaterial({ color: 0xEC4899, emissive: 0xDB2777, emissiveIntensity: 0.4 });
    const flowerMat2 = new THREE.MeshStandardMaterial({ color: 0xA855F7, emissive: 0x9333EA, emissiveIntensity: 0.4 });

    for (let i = -1.2; i <= 1.2; i += 0.45) {
      const blossom = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), Math.abs(i) > 0.6 ? flowerMat1 : flowerMat2);
      blossom.position.set(i, 0.45, (Math.random() - 0.5) * 0.2);
      planterGroup.add(blossom);
    }
    scene.add(planterGroup);
  }

  // =========================================================================
  // HELPER: Animated Pedestrian NPC
  // =========================================================================
  function createPedestrian(startX: number, startZ: number, shirtColor: number = 0x3B82F6) {
    const pedGroup = new THREE.Group();
    pedGroup.position.set(startX, 0, startZ);

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.65, 8), new THREE.MeshStandardMaterial({ color: shirtColor }));
    body.position.y = 0.95;
    pedGroup.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshStandardMaterial({ color: 0xFFDFD3 }));
    head.position.y = 1.4;
    pedGroup.add(head);

    const legMat = new THREE.MeshStandardMaterial({ color: 0x1E293B });
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.6, 6), legMat);
    legL.position.set(-0.1, 0.3, 0);
    pedGroup.add(legL);

    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.6, 6), legMat);
    legR.position.set(0.1, 0.3, 0);
    pedGroup.add(legR);

    scene.add(pedGroup);
    movingPedestrians.push({
      mesh: pedGroup,
      speed: 1.4 + Math.random() * 0.6,
      minX: startX - 12,
      maxX: startX + 12,
      legL,
      legR,
      animTime: Math.random() * 10
    });
    return pedGroup;
  }

  // =========================================================================
  // ENVIRONMENT: THE BUS STOP (MISSION 1) — Comprehensive High Detail
  // =========================================================================
  if (envId === 'bus_stop') {
    // 1. Wet Asphalt Road
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(160, 50), roadMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Road Markings: Central dashed lanes
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xE2E8F0, transparent: true, opacity: 0.65 });
    for (let x = -70; x <= 70; x += 8) {
      const dash = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.015, 0.25), dashMat);
      dash.position.set(x, 0.01, 0);
      scene.add(dash);
    }

    // Bus Stop Yellow Box Road Marking ("BUS STOP")
    const busStopMarkingMat = new THREE.MeshBasicMaterial({ color: 0xFBBF24, transparent: true, opacity: 0.75 });
    const yellowStripe = new THREE.Mesh(new THREE.BoxGeometry(28, 0.015, 0.2), busStopMarkingMat);
    yellowStripe.position.set(0, 0.01, -3.2);
    scene.add(yellowStripe);

    // 2. Raised Paved Sidewalk & Stone Curb
    const sidewalk = new THREE.Mesh(new THREE.BoxGeometry(160, 0.25, 14), sidewalkMat);
    sidewalk.position.set(0, 0.12, -12);
    sidewalk.receiveShadow = true;
    scene.add(sidewalk);

    const curbStone = new THREE.Mesh(new THREE.BoxGeometry(160, 0.3, 0.4), curbMat);
    curbStone.position.set(0, 0.15, -5.0);
    curbStone.receiveShadow = true;
    scene.add(curbStone);

    // 3. Complete Bus Stop Shelter (Z: -10 to -8, open to the south where player walks)
    const shelterGroup = new THREE.Group();
    shelterGroup.position.set(0, 0, -9.2);

    // Support pillars (4 steel posts)
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.5, roughness: 0.4 });
    const pillarPositions = [
      [-5.5, -1.6], [5.5, -1.6],
      [-5.5, 1.6], [5.5, 1.6]
    ];
    pillarPositions.forEach(([px, pz]) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.6, 8), pillarMat);
      p.position.set(px, 1.8, pz);
      p.castShadow = true;
      shelterGroup.add(p);
    });

    // Modern Curved Glass/Steel Roof
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(12.5, 0.25, 4.4),
      new THREE.MeshStandardMaterial({
        color: 0x1E3A8A,
        emissive: 0x3B82F6,
        emissiveIntensity: 0.4,
        roughness: 0.3
      })
    );
    roof.position.y = 3.65;
    roof.castShadow = true;
    shelterGroup.add(roof);

    // Tempered Glass Back Panel
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x67E8F9,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.2
    });
    const backGlass = new THREE.Mesh(new THREE.BoxGeometry(11.8, 3.2, 0.1), glassMat);
    backGlass.position.set(0, 1.7, -1.6);
    shelterGroup.add(backGlass);

    // Side Glass Windbreak Panels
    const sideGlassL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.2, 3.0), glassMat);
    sideGlassL.position.set(-5.5, 1.7, 0);
    shelterGroup.add(sideGlassL);

    const sideGlassR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.2, 3.0), glassMat);
    sideGlassR.position.set(5.5, 1.7, 0);
    shelterGroup.add(sideGlassR);

    // Waiting Bench inside shelter
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const bench = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.45, 0.8), benchMat);
    bench.position.set(0, 0.55, -1.0);
    bench.castShadow = true;
    shelterGroup.add(bench);

    // Shelter Ceiling Warm Downlight
    const shelterLight = new THREE.PointLight(0xFDE047, 2.8, 8);
    shelterLight.position.set(0, 3.4, 0);
    shelterGroup.add(shelterLight);

    // Digital Schedule Board
    const schedSign = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 1.5, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x0A0D1E, emissive: 0xF59E0B, emissiveIntensity: 0.85 })
    );
    schedSign.position.set(3.4, 2.5, -1.5);
    shelterGroup.add(schedSign);

    scene.add(shelterGroup);

    // Shelter collision boundary (covers only back/bench, keeps front open)
    const shelterBox = new THREE.Box3();
    shelterBox.setFromCenterAndSize(new THREE.Vector3(0, 1.8, -10.2), new THREE.Vector3(12.5, 3.6, 2.0));
    obstacles.push(shelterBox);

    interactiveObjects.push({
      id: 'obj_timetable',
      name: 'City Transit Digital Schedule Board',
      position: new THREE.Vector3(3.5, 1, -7.5),
      radius: 3.5,
      promptText: '[E] INSPECT DIGITAL TIMETABLE',
      dialogueSpeaker: 'Digital Route Announcer',
      dialogueText: '"Line 42 Downtown Express approaching now. Board via the illuminated front door beside the driver."'
    });

    // 4. Bus Stop Pole & Signboard
    const poleGroup = new THREE.Group();
    poleGroup.position.set(-6.5, 0, -5.8);
    const signPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.8, 8), pillarMat);
    signPole.position.y = 1.9;
    poleGroup.add(signPole);

    const busIconSign = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.9, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x1E40AF, emissive: 0x60A5FA, emissiveIntensity: 0.6 })
    );
    busIconSign.position.y = 3.4;
    poleGroup.add(busIconSign);
    scene.add(poleGroup);

    // 5. High Detail Line 42 Transit Bus
    const busGroup = new THREE.Group();
    busGroup.position.set(2.0, 1.8, -3.2); // Aligned along road edge

    // Main Bus Chassis
    const busBody = new THREE.Mesh(
      new THREE.BoxGeometry(16, 3.5, 3.4),
      new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.35, metalness: 0.3 })
    );
    busBody.castShadow = true;
    busGroup.add(busBody);

    // Turquoise/Cyan transit stripe
    const busStripe = new THREE.Mesh(
      new THREE.BoxGeometry(16.05, 0.45, 3.42),
      new THREE.MeshStandardMaterial({ color: 0x06B6D4, emissive: 0x0891B2, emissiveIntensity: 0.6 })
    );
    busStripe.position.y = -0.2;
    busGroup.add(busStripe);

    // Illuminated Electronic Route Destination ("42 DOWNTOWN EXP")
    const routeSign = new THREE.Mesh(
      new THREE.BoxGeometry(5.5, 0.65, 3.45),
      warmGlowMat
    );
    routeSign.position.set(4.5, 1.25, 0);
    busGroup.add(routeSign);

    // Illuminated Passenger Windows along side
    for (let wx = -6; wx <= 5; wx += 2.2) {
      const pWin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 3.46), cyanGlowMat);
      pWin.position.set(wx, 0.5, 0);
      busGroup.add(pWin);
    }

    // Bus Front Windshield
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.0, 3.2), glassMat);
    windshield.position.set(8.0, 0.4, 0);
    busGroup.add(windshield);

    // Headlights (Twin bright warm beams)
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xFEF08A });
    [-1.2, 1.2].forEach(hz => {
      const hl = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 10), hlMat);
      hl.position.set(8.05, -0.6, hz);
      busGroup.add(hl);
    });

    // Bus Headlight Radiance Forward
    const busLight = new THREE.SpotLight(0xFEF08A, 5.0, 35, Math.PI / 4, 0.4);
    busLight.position.set(8.2, 0, 0);
    busLight.target.position.set(28, 0, -3.2);
    busGroup.add(busLight);
    busGroup.add(busLight.target);

    // Warm Interior Cabin Light (Visible through bus doors)
    const cabinLight = new THREE.PointLight(0xFDE047, 3.2, 12);
    cabinLight.position.set(5.0, 0.8, -1.0);
    busGroup.add(cabinLight);

    scene.add(busGroup);
    busArrivalState.mesh = busGroup;

    // Bus collision obstacle
    const busBox = new THREE.Box3();
    busBox.setFromCenterAndSize(busGroup.position, new THREE.Vector3(16.5, 4.0, 3.8));
    obstacles.push(busBox);

    // 6. Characters in the Scene
    // Bus Driver NPC standing by open front door
    createPedestrian(7.5, -5.6, 0x1E3A8A);
    interactiveObjects.push({
      id: 'obj_driver',
      name: 'Transit Driver (Line 42)',
      position: new THREE.Vector3(7.5, 1, -5.6),
      radius: 3.5,
      promptText: '[E] TALK TO DRIVER',
      dialogueSpeaker: 'Bus Driver',
      dialogueText: '"Line 42 Downtown Express. Step aboard the front section near the cabin light. Safe travels!"'
    });

    // Waiting Commuters near shelter
    createPedestrian(-2.5, -7.8, 0x64748B);
    createPedestrian(1.5, -8.0, 0x475569);

    // 7. Streetlights with warm amber halos
    createStreetlight(-25, -5.6);
    createStreetlight(0, -5.6);
    createStreetlight(25, -5.6);

    // 8. Trees and Planters along sidewalk
    createTree(-18, -13);
    createTree(18, -13);
    createPlanter(-12, -5.8);
    createPlanter(12, -5.8);

    // 9. Backdrop Architecture (Moonlight Café & 24/7 Pharmacy along sidewalk)
    // Moonlight Café (West building)
    const cafe = createBuilding(-32, -22, 28, 26, 16);
    interactiveObjects.push({
      id: 'obj_cafe_safe',
      name: 'Moonlight Café (Safe Staffed Space)',
      position: new THREE.Vector3(-22, 1, -12),
      radius: 4.5,
      promptText: '[E] ENTER MOONLIGHT CAFÉ',
      dialogueSpeaker: 'Café Barista',
      dialogueText: '"Hello! If you feel unsafe waiting outside, feel free to wait here by the lit window counter."'
    });

    // Pharmacy with glowing cross (East building)
    const pharm = createBuilding(32, -22, 28, 28, 16);
    const cross = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.0, 0.3), pharmacyGreenMat);
    cross.position.set(24, 6.0, -13.8);
    scene.add(cross);

    // Distant background skyscrapers for horizon depth
    createBuilding(-60, -35, 24, 45, 20);
    createBuilding(0, -38, 26, 50, 20);
    createBuilding(60, -35, 24, 42, 20);
  }

  // =========================================================================
  // ENVIRONMENT: THE ALLEY (MISSION 2)
  // =========================================================================
  else if (envId === 'the_alley') {
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(160, 24), roadMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    createBuilding(-30, -10, 24, 22, 10, true);
    createBuilding(0, -10, 22, 25, 10, true);
    createBuilding(30, -10, 26, 23, 10, true);

    createBuilding(-25, 10, 22, 24, 10, true);
    createBuilding(5, 10, 24, 26, 10, true);
    createBuilding(35, 10, 24, 22, 10, true);

    for (let x = -30; x <= 30; x += 15) {
      const lanternMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, emissive: 0xD97706, emissiveIntensity: 0.95 });
      const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.5), lanternMat);
      lantern.position.set(x, 4, -4.8);
      scene.add(lantern);

      const light = new THREE.PointLight(0xF59E0B, 3.2, 14);
      light.position.set(x, 3.8, -4.5);
      scene.add(light);
    }

    const dumpster = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2, 2), new THREE.MeshStandardMaterial({ color: 0x065F46 }));
    dumpster.position.set(-10, 1, -3.5);
    scene.add(dumpster);
    const dumpBox = new THREE.Box3();
    dumpBox.setFromCenterAndSize(dumpster.position, new THREE.Vector3(3.6, 2, 2.1));
    obstacles.push(dumpBox);

    interactiveObjects.push({
      id: 'obj_alleyway',
      name: 'Alley Observation Point',
      position: new THREE.Vector3(-10, 1, -1),
      radius: 3.5,
      promptText: '[E] CHECK SOUND OF CADENCE',
      dialogueSpeaker: 'Instinct & Cadence Check',
      dialogueText: '"Footsteps behind matched your cadence when turning. Disengage immediately toward the illuminated avenue."'
    });
  }

  // =========================================================================
  // ENVIRONMENT: CITY INTERSECTION (MISSION 3)
  // =========================================================================
  else if (envId === 'city_intersection') {
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(160, 60), roadMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const zebraMat = new THREE.MeshBasicMaterial({ color: 0xF8FAFC });
    for (let z = -10; z <= 10; z += 2.5) {
      const stripe1 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.02, 1.2), zebraMat);
      stripe1.position.set(-8, 0.02, z);
      scene.add(stripe1);
      const stripe2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.02, 1.2), zebraMat);
      stripe2.position.set(8, 0.02, z);
      scene.add(stripe2);
    }

    createStreetlight(-14, -12);
    createStreetlight(14, -12);
    createStreetlight(-14, 12);
    createStreetlight(14, 12);

    createBuilding(-35, -25, 24, 38, 16);
    createBuilding(35, -25, 22, 34, 16);
    createBuilding(-35, 25, 24, 32, 16);
    createBuilding(35, 25, 22, 36, 16);
  }

  // =========================================================================
  // ENVIRONMENT: CITY STREETS (DEFAULT/OTHER MISSIONS)
  // =========================================================================
  else {
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(160, 50), roadMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const curbN = new THREE.Mesh(new THREE.BoxGeometry(160, 0.25, 14), sidewalkMat);
    curbN.position.set(0, 0.12, -14);
    curbN.receiveShadow = true;
    scene.add(curbN);

    createStreetlight(-20, -7.5);
    createStreetlight(20, -7.5);
    createTree(-10, -14);
    createTree(10, -14);

    createBuilding(-40, -18, 22, 22, 14);
    createBuilding(0, -18, 24, 25, 14);
    createBuilding(40, -18, 20, 26, 14);
  }

  // =========================================================================
  // MISSION WAYPOINT TARGET BEACON (Glowing Diamond (!) in 3D)
  // =========================================================================
  const triggerGroup = new THREE.Group();
  const targetX = nodeIndex === 1 ? (envId === 'bus_stop' ? 0 : 5) : nodeIndex === 2 ? -10 : -25;
  const targetZ = envId === 'the_alley' ? -2 : -6.5;
  triggerGroup.position.set(targetX, 1.3, targetZ);

  const diamondGeo = new THREE.OctahedronGeometry(0.65, 0);
  const diamondMat = new THREE.MeshStandardMaterial({
    color: 0x67E8F9,
    emissive: 0x4B7BFF,
    emissiveIntensity: 0.85,
    metalness: 0.3,
    roughness: 0.2
  });
  const diamondMesh = new THREE.Mesh(diamondGeo, diamondMat);
  triggerGroup.add(diamondMesh);

  const beaconLight = new THREE.PointLight(0x67E8F9, 3.5, 7);
  triggerGroup.add(beaconLight);
  scene.add(triggerGroup);

  const triggerBox = new THREE.Box3();
  triggerBox.setFromCenterAndSize(triggerGroup.position, new THREE.Vector3(3.2, 4, 3.2));

  let time = 0;
  function update(delta: number) {
    time += delta;

    // 1. Waypoint Beacon Animation
    diamondMesh.rotation.y += delta * 2.2;
    diamondMesh.rotation.x = Math.sin(time * 3) * 0.2;
    triggerGroup.position.y = 1.3 + Math.sin(time * 4) * 0.2;

    // 2. Bus arrival animation if present
    if (busArrivalState.mesh) {
      if (busArrivalState.isArriving && busArrivalState.mesh.position.x < busArrivalState.targetX) {
        busArrivalState.mesh.position.x += busArrivalState.speed * delta;
        if (busArrivalState.mesh.position.x >= busArrivalState.targetX) {
          busArrivalState.mesh.position.x = busArrivalState.targetX;
          busArrivalState.isArriving = false;
        }
      }
    }

    // 3. Moving Vehicles Animation
    for (const v of movingVehicles) {
      v.mesh.position.x += v.speed * v.dir * delta;
      if (v.dir > 0 && v.mesh.position.x > v.maxX) {
        v.mesh.position.x = v.minX;
      } else if (v.dir < 0 && v.mesh.position.x < v.minX) {
        v.mesh.position.x = v.maxX;
      }
    }

    // 4. Moving Pedestrians Animation
    for (const p of movingPedestrians) {
      p.animTime += delta * 6;
      p.mesh.position.x += p.speed * 0.5 * delta;
      if (p.mesh.position.x > p.maxX) p.mesh.position.x = p.minX;

      const swing = Math.sin(p.animTime) * 0.4;
      p.legL.rotation.x = swing;
      p.legR.rotation.x = -swing;
    }

    // 5. Traffic Lights Cycling (Intersection)
    if (trafficLightBulbs.length > 0) {
      const phase = Math.floor(time % 12);
      for (const tl of trafficLightBulbs) {
        if (phase < 6) {
          (tl.green.material as THREE.MeshBasicMaterial).color.setHex(0x10B981);
          (tl.amber.material as THREE.MeshBasicMaterial).color.setHex(0x78350F);
          (tl.red.material as THREE.MeshBasicMaterial).color.setHex(0x450A0A);
        } else if (phase < 8) {
          (tl.green.material as THREE.MeshBasicMaterial).color.setHex(0x064E3B);
          (tl.amber.material as THREE.MeshBasicMaterial).color.setHex(0xFBBF24);
          (tl.red.material as THREE.MeshBasicMaterial).color.setHex(0x450A0A);
        } else {
          (tl.green.material as THREE.MeshBasicMaterial).color.setHex(0x064E3B);
          (tl.amber.material as THREE.MeshBasicMaterial).color.setHex(0x78350F);
          (tl.red.material as THREE.MeshBasicMaterial).color.setHex(0xEF4444);
        }
      }
    }
  }

  return {
    scene,
    obstacles,
    triggerBox,
    triggerMesh: triggerGroup,
    interactiveObjects,
    environmentId: envId,
    update
  };
}
