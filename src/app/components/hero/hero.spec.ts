import { TestBed } from '@angular/core/testing';
import { Hero } from './hero';

function mockMatchMedia(matches: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

function makeMouseEvent(
  target: HTMLElement,
  clientX: number,
  clientY: number,
): MouseEvent {
  return { currentTarget: target, clientX, clientY } as unknown as MouseEvent;
}

describe('Hero', () => {
  let target: HTMLElement;

  beforeEach(async () => {
    mockMatchMedia(false);

    await TestBed.configureTestingModule({
      imports: [Hero],
    }).compileComponents();

    target = document.createElement('div');
    target.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 200, height: 100 }) as DOMRect;
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Hero);
    const hero = fixture.componentInstance;
    expect(hero).toBeTruthy();
  });

  it('should reset all transform signals to neutral values on mouse leave', () => {
    const fixture = TestBed.createComponent(Hero);
    const hero = fixture.componentInstance as any;

    hero.onMouseMove(makeMouseEvent(target, 150, 25));
    hero.onMouseLeave();

    expect(hero.photoTransform()).toBe('rotateY(0deg) rotateX(0deg)');
    expect(hero.orb1Transform()).toBe('translate(0px, 0px)');
    expect(hero.orb2Transform()).toBe('translate(0px, 0px)');
  });

  it('should compute tilt and parallax transforms from mouse position', () => {
    const fixture = TestBed.createComponent(Hero);
    const hero = fixture.componentInstance as any;

    // x = (150 - 0) / 200 - 0.5 = 0.25
    // y = (25 - 0) / 100 - 0.5 = -0.25
    hero.onMouseMove(makeMouseEvent(target, 150, 25));

    expect(hero.photoTransform()).toBe('rotateY(4deg) rotateX(4deg)');
    expect(hero.orb1Transform()).toBe('translate(7.5px, -7.5px)');
    expect(hero.orb2Transform()).toBe('translate(-10px, 10px)');
  });

  it('should not update transforms when prefers-reduced-motion is set', () => {
    mockMatchMedia(true);
    const fixture = TestBed.createComponent(Hero);
    const hero = fixture.componentInstance as any;

    hero.onMouseMove(makeMouseEvent(target, 150, 25));

    expect(hero.photoTransform()).toBe('rotateY(0deg) rotateX(0deg)');
    expect(hero.orb1Transform()).toBe('translate(0px, 0px)');
    expect(hero.orb2Transform()).toBe('translate(0px, 0px)');
  });
});
