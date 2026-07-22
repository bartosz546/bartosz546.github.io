import { TestBed } from '@angular/core/testing';
import { Experience } from './experience';

describe('Experience', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Experience],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Experience);
    const experience = fixture.componentInstance;
    expect(experience).toBeTruthy();
  });

  describe('computeProgress', () => {
    it('returns 0 before the reference line is reached', () => {
      const fixture = TestBed.createComponent(Experience);
      const experience = fixture.componentInstance as any;

      // viewportHeight * 0.6 = 600, trackTop = 900 is well beyond that.
      const result = experience.computeProgress(900, 800, 1000);

      expect(result).toBe(0);
    });

    it('returns the partial percentage once scrolled into view', () => {
      const fixture = TestBed.createComponent(Experience);
      const experience = fixture.componentInstance as any;

      // visible = clamp(1000*0.6 - 200, 0, 800) = clamp(400, 0, 800) = 400
      // pct = (400 / 800) * 100 = 50
      const result = experience.computeProgress(200, 800, 1000);

      expect(result).toBe(50);
    });

    it('clamps to 100 once fully scrolled past', () => {
      const fixture = TestBed.createComponent(Experience);
      const experience = fixture.componentInstance as any;

      // trackTop very negative -> visible clamps at trackHeight.
      const result = experience.computeProgress(-5000, 800, 1000);

      expect(result).toBe(100);
    });

    it('returns 0 when trackHeight is 0 to avoid division by zero', () => {
      const fixture = TestBed.createComponent(Experience);
      const experience = fixture.componentInstance as any;

      const result = experience.computeProgress(0, 0, 1000);

      expect(result).toBe(0);
    });
  });
});
