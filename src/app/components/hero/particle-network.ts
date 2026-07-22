export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export class ParticleNetwork {
  private static readonly PARTICLE_DENSITY_DIVISOR = 9000;
  private static readonly MAX_PARTICLES = 90;
  private static readonly MAX_PARTICLES_NARROW = 40;
  private static readonly NARROW_WIDTH = 576;
  private static readonly SPEED_RANGE = 0.03; // px/ms
  static readonly CONNECT_DISTANCE = 140;
  static readonly CURSOR_CONNECT_DISTANCE = 160;
  static readonly BASE_LINE_ALPHA = 0.18;
  static readonly CURSOR_LINE_ALPHA = 0.35;
  static readonly PARTICLE_RADIUS = 1.6;
  static readonly PARTICLE_ALPHA = 0.55;

  private particles: Particle[] = [];
  private width: number;
  private height: number;
  private cursorX: number | null = null;
  private cursorY: number | null = null;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.seed();
  }

  private computeCount(): number {
    const cap = this.width < ParticleNetwork.NARROW_WIDTH
      ? ParticleNetwork.MAX_PARTICLES_NARROW
      : ParticleNetwork.MAX_PARTICLES;
    return Math.min(cap, Math.floor((this.width * this.height) / ParticleNetwork.PARTICLE_DENSITY_DIVISOR));
  }

  private seed(): void {
    const count = this.computeCount();
    this.particles = Array.from({ length: count }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * 2 * ParticleNetwork.SPEED_RANGE,
      vy: (Math.random() - 0.5) * 2 * ParticleNetwork.SPEED_RANGE,
    }));
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.seed();
  }

  setCursor(x: number | null, y: number | null): void {
    this.cursorX = x;
    this.cursorY = y;
  }

  update(deltaMs: number): void {
    const dt = Number.isFinite(deltaMs) && deltaMs > 0 ? deltaMs : 0;
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.x < 0) p.x = this.width;
      else if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      else if (p.y > this.height) p.y = 0;
    }
  }

  static connectionAlpha(distance: number, maxDistance: number, baseAlpha: number): number {
    if (distance >= maxDistance) return 0;
    return (1 - distance / maxDistance) * baseAlpha;
  }

  render(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const alpha = ParticleNetwork.connectionAlpha(dist, ParticleNetwork.CONNECT_DISTANCE, ParticleNetwork.BASE_LINE_ALPHA);
        if (alpha <= 0) continue;
        ctx.strokeStyle = `oklch(0.75 0.14 200 / ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    if (this.cursorX !== null && this.cursorY !== null) {
      for (const p of this.particles) {
        const dist = Math.hypot(p.x - this.cursorX, p.y - this.cursorY);
        const alpha = ParticleNetwork.connectionAlpha(dist, ParticleNetwork.CURSOR_CONNECT_DISTANCE, ParticleNetwork.CURSOR_LINE_ALPHA);
        if (alpha <= 0) continue;
        ctx.strokeStyle = `oklch(0.75 0.14 200 / ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(this.cursorX, this.cursorY);
        ctx.stroke();
      }
    }

    ctx.fillStyle = `oklch(0.75 0.14 200 / ${ParticleNetwork.PARTICLE_ALPHA})`;
    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, ParticleNetwork.PARTICLE_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  getParticles(): readonly Particle[] {
    return this.particles;
  }
}
