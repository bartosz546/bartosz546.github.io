import { ParticleNetwork } from './particle-network';

describe('ParticleNetwork', () => {
  describe('update', () => {
    it('wraps a particle from the right edge back to x=0 when it moves past width', () => {
      const network = new ParticleNetwork(100, 100);
      const particle = network.getParticles()[0];
      particle.x = 99;
      particle.vx = 1; // px/ms
      particle.y = 50;
      particle.vy = 0;

      network.update(5); // moves x to 104, past width=100

      expect(particle.x).toBe(0);
    });

    it('wraps a particle from the left edge back to x=width when it moves before 0', () => {
      const network = new ParticleNetwork(100, 100);
      const particle = network.getParticles()[0];
      particle.x = 1;
      particle.vx = -1;
      particle.y = 50;
      particle.vy = 0;

      network.update(5); // moves x to -4, before 0

      expect(particle.x).toBe(100);
    });

    it('wraps a particle vertically at the top and bottom edges', () => {
      const network = new ParticleNetwork(100, 100);
      const particle = network.getParticles()[0];
      particle.x = 50;
      particle.vx = 0;
      particle.y = 99;
      particle.vy = 1;

      network.update(5); // moves y to 104, past height=100

      expect(particle.y).toBe(0);

      particle.y = 1;
      particle.vy = -1;
      network.update(5); // moves y to -4, before 0

      expect(particle.y).toBe(100);
    });

    it('ignores non-positive or non-finite deltas without moving particles', () => {
      const network = new ParticleNetwork(100, 100);
      const particle = network.getParticles()[0];
      particle.x = 50;
      particle.y = 50;
      particle.vx = 1;
      particle.vy = 1;

      network.update(0);
      expect(particle.x).toBe(50);
      expect(particle.y).toBe(50);

      network.update(Number.NaN);
      expect(particle.x).toBe(50);
      expect(particle.y).toBe(50);
    });
  });

  describe('connectionAlpha', () => {
    it('returns baseAlpha at distance 0', () => {
      expect(ParticleNetwork.connectionAlpha(0, 140, 0.18)).toBeCloseTo(0.18);
    });

    it('returns 0 when distance equals or exceeds maxDistance', () => {
      expect(ParticleNetwork.connectionAlpha(140, 140, 0.18)).toBe(0);
      expect(ParticleNetwork.connectionAlpha(200, 140, 0.18)).toBe(0);
    });

    it('returns half of baseAlpha at half of maxDistance', () => {
      expect(ParticleNetwork.connectionAlpha(70, 140, 0.18)).toBeCloseTo(0.09);
    });
  });

  describe('resize', () => {
    it('reduces particle count for a much smaller area and does not throw', () => {
      const network = new ParticleNetwork(1000, 1000);
      const largeCount = network.getParticles().length;

      expect(() => network.resize(50, 50)).not.toThrow();
      const smallCount = network.getParticles().length;

      expect(smallCount).toBeLessThan(largeCount);
    });

    it('increases particle count for a much larger area and does not throw', () => {
      const network = new ParticleNetwork(50, 50);
      const smallCount = network.getParticles().length;

      expect(() => network.resize(1000, 1000)).not.toThrow();
      const largeCount = network.getParticles().length;

      expect(largeCount).toBeGreaterThan(smallCount);
    });

    it('caps particle count at MAX_PARTICLES_NARROW below the narrow width threshold', () => {
      const network = new ParticleNetwork(575, 5000);
      expect(network.getParticles().length).toBeLessThanOrEqual(40);
    });
  });
});
