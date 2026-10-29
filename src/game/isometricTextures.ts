import Phaser from 'phaser';

export function generateIsometricTextures(scene: Phaser.Scene) {
  // 1. Isometric Street Road Tile (64 x 32 diamond)
  if (!scene.textures.exists('iso_road')) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    // Diamond path
    ctx.beginPath();
    ctx.moveTo(32, 0);
    ctx.lineTo(64, 16);
    ctx.lineTo(32, 32);
    ctx.lineTo(0, 16);
    ctx.closePath();
    ctx.fillStyle = '#0F1326';
    ctx.fill();

    // Subtle neon asphalt grid edge
    ctx.strokeStyle = 'rgba(75, 123, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Road dashed dividing line
    ctx.beginPath();
    ctx.moveTo(32, 6);
    ctx.lineTo(32, 26);
    ctx.strokeStyle = 'rgba(103, 232, 249, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    scene.textures.addCanvas('iso_road', canvas);
  }

  // 2. Isometric Sidewalk / Plaza Tile (64 x 32 diamond)
  if (!scene.textures.exists('iso_sidewalk')) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    ctx.beginPath();
    ctx.moveTo(32, 0);
    ctx.lineTo(64, 16);
    ctx.lineTo(32, 32);
    ctx.lineTo(0, 16);
    ctx.closePath();
    ctx.fillStyle = '#181C38';
    ctx.fill();

    // Neon lavender border
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    scene.textures.addCanvas('iso_sidewalk', canvas);
  }

  // 3. Isometric 2.5D Neon Skyscraper / Building (128 x 160)
  if (!scene.textures.exists('iso_building_tower')) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 160;
    const ctx = canvas.getContext('2d')!;

    const topY = 24;
    const midY = 100;
    const botY = 160;

    // Roof diamond
    ctx.beginPath();
    ctx.moveTo(64, 0);
    ctx.lineTo(128, topY);
    ctx.lineTo(64, topY * 2);
    ctx.lineTo(0, topY);
    ctx.closePath();
    ctx.fillStyle = '#20133F';
    ctx.fill();
    ctx.strokeStyle = '#67E8F9';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Left Facade (Darker shaded)
    ctx.beginPath();
    ctx.moveTo(0, topY);
    ctx.lineTo(64, topY * 2);
    ctx.lineTo(64, botY);
    ctx.lineTo(0, botY - topY);
    ctx.closePath();
    ctx.fillStyle = '#0B0E23';
    ctx.fill();

    // Right Facade (Light illuminated)
    ctx.beginPath();
    ctx.moveTo(64, topY * 2);
    ctx.lineTo(128, topY);
    ctx.lineTo(128, botY - topY);
    ctx.lineTo(64, botY);
    ctx.closePath();
    ctx.fillStyle = '#11142B';
    ctx.fill();

    // Glowing Neon Windows on Facades
    ctx.fillStyle = '#67E8F9';
    for (let wy = topY * 2 + 10; wy < botY - 20; wy += 22) {
      // Left window
      ctx.beginPath();
      ctx.moveTo(16, wy - 8);
      ctx.lineTo(48, wy);
      ctx.lineTo(48, wy + 10);
      ctx.lineTo(16, wy + 2);
      ctx.closePath();
      ctx.fill();

      // Right window (Neon Lavender)
      ctx.fillStyle = '#A78BFA';
      ctx.beginPath();
      ctx.moveTo(80, wy);
      ctx.lineTo(112, wy - 8);
      ctx.lineTo(112, wy + 2);
      ctx.lineTo(80, wy + 10);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#67E8F9';
    }

    scene.textures.addCanvas('iso_building_tower', canvas);
  }

  // 4. Isometric 2.5D Bus Stop Shelter (96 x 80)
  if (!scene.textures.exists('iso_bus_stop')) {
    const canvas = document.createElement('canvas');
    canvas.width = 96;
    canvas.height = 80;
    const ctx = canvas.getContext('2d')!;

    // Canopy Roof
    ctx.beginPath();
    ctx.moveTo(48, 4);
    ctx.lineTo(92, 24);
    ctx.lineTo(48, 44);
    ctx.lineTo(4, 24);
    ctx.closePath();
    ctx.fillStyle = 'rgba(75, 123, 255, 0.85)';
    ctx.fill();
    ctx.strokeStyle = '#67E8F9';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Glass Backwall
    ctx.fillStyle = 'rgba(103, 232, 249, 0.3)';
    ctx.beginPath();
    ctx.moveTo(4, 24);
    ctx.lineTo(48, 44);
    ctx.lineTo(48, 76);
    ctx.lineTo(4, 56);
    ctx.closePath();
    ctx.fill();

    // Steel Pillars
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(48, 44);
    ctx.lineTo(48, 76);
    ctx.moveTo(92, 24);
    ctx.lineTo(92, 56);
    ctx.stroke();

    // Glowing Digital Bus Sign
    ctx.fillStyle = '#080B18';
    ctx.fillRect(52, 26, 32, 12);
    ctx.strokeStyle = '#65F5C5';
    ctx.strokeRect(52, 26, 32, 12);
    ctx.fillStyle = '#65F5C5';
    ctx.font = 'bold 8px monospace';
    ctx.fillText('BUS 42', 54, 35);

    scene.textures.addCanvas('iso_bus_stop', canvas);
  }

  // 5. Isometric 2.5D Animated Transit Bus (140 x 100)
  if (!scene.textures.exists('iso_bus')) {
    const canvas = document.createElement('canvas');
    canvas.width = 140;
    canvas.height = 100;
    const ctx = canvas.getContext('2d')!;

    // Bus Roof
    ctx.beginPath();
    ctx.moveTo(70, 6);
    ctx.lineTo(134, 32);
    ctx.lineTo(70, 58);
    ctx.lineTo(6, 32);
    ctx.closePath();
    ctx.fillStyle = '#1E1B4B';
    ctx.fill();
    ctx.strokeStyle = '#4B7BFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Left Body Side
    ctx.beginPath();
    ctx.moveTo(6, 32);
    ctx.lineTo(70, 58);
    ctx.lineTo(70, 92);
    ctx.lineTo(6, 66);
    ctx.closePath();
    ctx.fillStyle = '#11142B';
    ctx.fill();

    // Right Front Face
    ctx.beginPath();
    ctx.moveTo(70, 58);
    ctx.lineTo(134, 32);
    ctx.lineTo(134, 66);
    ctx.lineTo(70, 92);
    ctx.closePath();
    ctx.fillStyle = '#20133F';
    ctx.fill();

    // Front Windshield
    ctx.fillStyle = 'rgba(103, 232, 249, 0.85)';
    ctx.beginPath();
    ctx.moveTo(74, 60);
    ctx.lineTo(128, 38);
    ctx.lineTo(128, 52);
    ctx.lineTo(74, 74);
    ctx.closePath();
    ctx.fill();

    // Side Windows
    for (let wx = 14; wx < 60; wx += 16) {
      ctx.beginPath();
      ctx.moveTo(wx, 36 + wx * 0.35);
      ctx.lineTo(wx + 10, 40 + wx * 0.35);
      ctx.lineTo(wx + 10, 54 + wx * 0.35);
      ctx.lineTo(wx, 50 + wx * 0.35);
      ctx.closePath();
      ctx.fill();
    }

    // Glowing Headlight
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(130, 62, 5, 0, Math.PI * 2);
    ctx.fill();

    scene.textures.addCanvas('iso_bus', canvas);
  }

  // 6. Isometric 2.5D 24/7 Staffed Safe Haven Store (110 x 120)
  if (!scene.textures.exists('iso_safe_haven')) {
    const canvas = document.createElement('canvas');
    canvas.width = 110;
    canvas.height = 120;
    const ctx = canvas.getContext('2d')!;

    // Roof
    ctx.beginPath();
    ctx.moveTo(55, 6);
    ctx.lineTo(105, 30);
    ctx.lineTo(55, 54);
    ctx.lineTo(5, 30);
    ctx.closePath();
    ctx.fillStyle = '#22C55E';
    ctx.fill();
    ctx.strokeStyle = '#86EFAC';
    ctx.stroke();

    // Left Facade
    ctx.beginPath();
    ctx.moveTo(5, 30);
    ctx.lineTo(55, 54);
    ctx.lineTo(55, 114);
    ctx.lineTo(5, 90);
    ctx.closePath();
    ctx.fillStyle = '#064E3B';
    ctx.fill();

    // Right Facade (Front Entrance with Warm Light)
    ctx.beginPath();
    ctx.moveTo(55, 54);
    ctx.lineTo(105, 30);
    ctx.lineTo(105, 90);
    ctx.lineTo(55, 114);
    ctx.closePath();
    ctx.fillStyle = '#022C22';
    ctx.fill();

    // Illuminated Shop Window & Door
    const winGrad = ctx.createLinearGradient(60, 50, 100, 100);
    winGrad.addColorStop(0, '#FEF08A');
    winGrad.addColorStop(1, '#67E8F9');
    ctx.fillStyle = winGrad;
    ctx.beginPath();
    ctx.moveTo(62, 60);
    ctx.lineTo(98, 42);
    ctx.lineTo(98, 82);
    ctx.lineTo(62, 100);
    ctx.closePath();
    ctx.fill();

    // Cashier / Staff silhouette inside
    ctx.fillStyle = '#080B18';
    ctx.beginPath();
    ctx.arc(80, 68, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(75, 75, 10, 14);

    // Glowing SafePoint Banner
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('24/7 SAFE POINT', 14, 26);

    scene.textures.addCanvas('iso_safe_haven', canvas);
  }

  // 7. Isometric 2.5D Animated NPC Driver & Bystanders (48 x 56)
  if (!scene.textures.exists('iso_npc_driver')) {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 56;
    const ctx = canvas.getContext('2d')!;

    // Uniform & Cap
    ctx.fillStyle = '#1E3A8A';
    ctx.beginPath();
    ctx.arc(24, 14, 7, 0, Math.PI * 2);
    ctx.fill();
    // Cap visor
    ctx.fillStyle = '#3B82F6';
    ctx.fillRect(20, 9, 10, 3);
    // Face
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.arc(24, 16, 4, 0, Math.PI * 2);
    ctx.fill();
    // Body
    ctx.fillStyle = '#1D4ED8';
    ctx.fillRect(16, 22, 16, 18);
    // Tie
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(23, 23, 2, 12);
    // Legs
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(17, 40, 5, 14);
    ctx.fillRect(26, 40, 5, 14);

    scene.textures.addCanvas('iso_npc_driver', canvas);
  }

  // 8. Isometric Street Lamp with Atmospheric Ground Cone (40 x 90)
  if (!scene.textures.exists('iso_lamp')) {
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 90;
    const ctx = canvas.getContext('2d')!;

    // Pole
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.lineTo(20, 85);
    ctx.stroke();

    // Lantern Head
    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.arc(20, 16, 6, 0, Math.PI * 2);
    ctx.fill();

    // Glowing cyan bulb
    ctx.fillStyle = '#67E8F9';
    ctx.beginPath();
    ctx.arc(20, 16, 3, 0, Math.PI * 2);
    ctx.fill();

    // Ground light pool
    const lightGrad = ctx.createRadialGradient(20, 85, 2, 20, 85, 18);
    lightGrad.addColorStop(0, 'rgba(103, 232, 249, 0.7)');
    lightGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.ellipse(20, 85, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    scene.textures.addCanvas('iso_lamp', canvas);
  }
}
