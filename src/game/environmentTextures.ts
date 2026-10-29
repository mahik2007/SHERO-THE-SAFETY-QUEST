import Phaser from 'phaser';

export function generateEnvironmentTextures(scene: Phaser.Scene) {
  // 1. Cyber City Skyline Parallax Background (1200 x 400)
  if (!scene.textures.exists('bg_skyline')) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 400;
    const ctx = canvas.getContext('2d')!;

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, 400);
    sky.addColorStop(0, '#080B18');
    sky.addColorStop(0.5, '#11142B');
    sky.addColorStop(1, '#20133F');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 1200, 400);

    // Stars
    ctx.fillStyle = '#67E8F9';
    for (let i = 0; i < 60; i++) {
      const sx = (i * 47) % 1200;
      const sy = (i * 29) % 200;
      const r = (i % 3 === 0) ? 1.5 : 1;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Distant towers
    ctx.fillStyle = '#0B0E23';
    for (let i = 0; i < 20; i++) {
      const bx = i * 65;
      const bw = 45 + (i % 3) * 15;
      const bh = 140 + (i % 5) * 35;
      ctx.fillRect(bx, 400 - bh, bw, bh);

      // Neon window strips
      ctx.fillStyle = (i % 2 === 0) ? 'rgba(103, 232, 249, 0.4)' : 'rgba(167, 139, 250, 0.3)';
      for (let wy = 400 - bh + 15; wy < 380; wy += 20) {
        ctx.fillRect(bx + 8, wy, bw - 16, 4);
      }
      ctx.fillStyle = '#0B0E23';
    }

    scene.textures.addCanvas('bg_skyline', canvas);
  }

  // 2. Road & Sidewalk Ground Tile (256 x 96)
  if (!scene.textures.exists('ground_street')) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 96;
    const ctx = canvas.getContext('2d')!;

    // Asphalt / Pavement
    ctx.fillStyle = '#0E1326';
    ctx.fillRect(0, 0, 256, 96);

    // Curb neon strip
    ctx.fillStyle = '#4B7BFF';
    ctx.fillRect(0, 0, 256, 4);

    // Pavement tiles pattern
    ctx.strokeStyle = 'rgba(103, 232, 249, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 256; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 4);
      ctx.lineTo(x, 96);
      ctx.stroke();
    }
    for (let y = 4; y < 96; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }

    scene.textures.addCanvas('ground_street', canvas);
  }

  // 3. Glowing Interactive Waypoint / Trigger Marker (64 x 64)
  if (!scene.textures.exists('trigger_marker')) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, '#67E8F9');
    grad.addColorStop(0.4, '#4B7BFF');
    grad.addColorStop(0.8, '#A78BFA');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fill();

    // Diamond icon in center
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(32, 14);
    ctx.lineTo(44, 32);
    ctx.lineTo(32, 50);
    ctx.lineTo(20, 32);
    ctx.closePath();
    ctx.fill();

    // Exclamation Mark
    ctx.fillStyle = '#080B18';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('!', 32, 32);

    scene.textures.addCanvas('trigger_marker', canvas);
  }

  // 4. Street Light Prop (48 x 140)
  if (!scene.textures.exists('prop_streetlight')) {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 140;
    const ctx = canvas.getContext('2d')!;

    // Pole
    ctx.fillStyle = '#475569';
    ctx.fillRect(22, 20, 4, 120);

    // Lamp head
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.moveTo(12, 20);
    ctx.lineTo(36, 20);
    ctx.lineTo(30, 8);
    ctx.lineTo(18, 8);
    ctx.closePath();
    ctx.fill();

    // Light beam
    const glow = ctx.createRadialGradient(24, 20, 4, 24, 70, 50);
    glow.addColorStop(0, 'rgba(103, 232, 249, 0.7)');
    glow.addColorStop(0.6, 'rgba(103, 232, 249, 0.2)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.moveTo(14, 20);
    ctx.lineTo(34, 20);
    ctx.lineTo(46, 120);
    ctx.lineTo(2, 120);
    ctx.closePath();
    ctx.fill();

    scene.textures.addCanvas('prop_streetlight', canvas);
  }

  // 5. Bus / Transit Vehicle (180 x 100)
  if (!scene.textures.exists('prop_bus')) {
    const canvas = document.createElement('canvas');
    canvas.width = 180;
    canvas.height = 100;
    const ctx = canvas.getContext('2d')!;

    // Bus body
    ctx.fillStyle = '#1E1B4B';
    ctx.beginPath();
    ctx.roundRect(4, 10, 172, 70, 8);
    ctx.fill();
    ctx.strokeStyle = '#4B7BFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Windows
    ctx.fillStyle = '#67E8F9';
    ctx.globalAlpha = 0.8;
    for (let wx = 18; wx < 150; wx += 28) {
      ctx.fillRect(wx, 22, 22, 24);
    }
    ctx.globalAlpha = 1.0;

    // Headlight glow
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(8, 60, 6, 0, Math.PI * 2);
    ctx.fill();

    // Destination Sign
    ctx.fillStyle = '#080B18';
    ctx.fillRect(35, 12, 100, 8);
    ctx.fillStyle = '#65F5C5';
    ctx.font = 'bold 7px sans-serif';
    ctx.fillText('LINE 42 CENTRAL', 40, 18);

    // Wheels
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(42, 82, 14, 0, Math.PI * 2);
    ctx.arc(142, 82, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#64748B';
    ctx.beginPath();
    ctx.arc(42, 82, 6, 0, Math.PI * 2);
    ctx.arc(142, 82, 6, 0, Math.PI * 2);
    ctx.fill();

    scene.textures.addCanvas('prop_bus', canvas);
  }

  // 6. Convenience Store / Staffed Safe Haven Booth (140 x 130)
  if (!scene.textures.exists('prop_safe_haven')) {
    const canvas = document.createElement('canvas');
    canvas.width = 140;
    canvas.height = 130;
    const ctx = canvas.getContext('2d')!;

    // Building
    ctx.fillStyle = '#111827';
    ctx.fillRect(10, 20, 120, 110);
    ctx.strokeStyle = '#67E8F9';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 20, 120, 110);

    // Neon Canopy
    ctx.fillStyle = '#22C55E';
    ctx.fillRect(6, 20, 128, 16);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('24/7 SAFE POINT', 18, 32);

    // Glass Window with Warm Interior
    const intGlow = ctx.createLinearGradient(20, 45, 120, 110);
    intGlow.addColorStop(0, '#FEF08A');
    intGlow.addColorStop(1, '#67E8F9');
    ctx.fillStyle = intGlow;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(20, 45, 60, 60);
    ctx.globalAlpha = 1.0;

    // Friendly Attendant Silhouette
    ctx.fillStyle = '#1E1B4B';
    ctx.beginPath();
    ctx.arc(50, 65, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(42, 75, 16, 20);

    // Glass Door
    ctx.fillStyle = 'rgba(103, 232, 249, 0.4)';
    ctx.fillRect(86, 45, 36, 75);
    ctx.strokeStyle = '#FFFFFF';
    ctx.strokeRect(86, 45, 36, 75);

    scene.textures.addCanvas('prop_safe_haven', canvas);
  }

  // 7. Bystander / NPC character silhouette (40 x 60)
  if (!scene.textures.exists('npc_bystander')) {
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 60;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#312E81';
    // Head
    ctx.beginPath();
    ctx.arc(20, 14, 8, 0, Math.PI * 2);
    ctx.fill();
    // Torso
    ctx.fillRect(12, 24, 16, 22);
    // Legs
    ctx.fillStyle = '#1E1B4B';
    ctx.fillRect(13, 46, 5, 14);
    ctx.fillRect(22, 46, 5, 14);

    scene.textures.addCanvas('npc_bystander', canvas);
  }
}
