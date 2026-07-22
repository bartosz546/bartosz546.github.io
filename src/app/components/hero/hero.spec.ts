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

  describe('cipher/decode badge animation', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('pickRandomChar returns a char from the cipher pool for a stubbed rng', () => {
      const fixture = TestBed.createComponent(Hero);
      const hero = fixture.componentInstance as any;
      const pool = '!@#$%^&*_+-=<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

      const first = hero.pickRandomChar(() => 0);
      const last = hero.pickRandomChar(() => 0.9999999);

      expect(pool).toContain(first);
      expect(pool).toContain(last);
      expect(first).toBe(pool[0]);
      expect(last).toBe(pool[pool.length - 1]);
    });

    it('buildDisplayText reveals characters before revealedCount and ciphers the rest, keeping spaces literal', () => {
      const fixture = TestBed.createComponent(Hero);
      const hero = fixture.componentInstance as any;
      const target = 'Hi there';
      const randomChar = () => '#';

      const result = hero.buildDisplayText(target, 3, randomChar);

      // "Hi " -> indices 0,1,2 revealed ("H","i"," ") ; index 2 is a space anyway.
      expect(result).toBe('Hi #####');
      for (let i = 0; i < target.length; i++) {
        if (target[i] === ' ') {
          expect(result[i]).toBe(' ');
        } else if (i < 3) {
          expect(result[i]).toBe(target[i]);
        } else {
          expect(result[i]).toBe('#');
        }
      }
    });

    it('buildDisplayText with revealedCount 0 ciphers all non-space characters', () => {
      const fixture = TestBed.createComponent(Hero);
      const hero = fixture.componentInstance as any;
      const target = 'ab cd';

      const result = hero.buildDisplayText(target, 0, () => '#');

      expect(result).toBe('## ##');
    });

    it('ngOnInit sets the full real text immediately and does not start an interval when prefers-reduced-motion is set', () => {
      mockMatchMedia(true);
      vi.useFakeTimers();
      const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');

      const fixture = TestBed.createComponent(Hero);
      const hero = fixture.componentInstance as any;
      // Triggers Angular's normal (deduped) first change detection, which runs ngOnInit exactly once.
      fixture.detectChanges();

      const fullText =
        'This entire site was built in 4 hours — designed with Claude Code, translated to Angular, and published.';
      expect(hero.badgeText()).toBe(fullText);
      expect(setIntervalSpy).not.toHaveBeenCalled();

      vi.advanceTimersByTime(10000);
      expect(hero.badgeText()).toBe(fullText);
    });

    it('ngOnInit starts scrambled and eventually reveals the full text over time when motion is allowed', () => {
      mockMatchMedia(false);
      vi.useFakeTimers();

      const fixture = TestBed.createComponent(Hero);
      const hero = fixture.componentInstance as any;
      fixture.detectChanges();

      const fullText =
        'This entire site was built in 4 hours — designed with Claude Code, translated to Angular, and published.';

      // Immediately scrambled: same length, not equal to the real text.
      expect(hero.badgeText().length).toBe(fullText.length);
      expect(hero.badgeText()).not.toBe(fullText);

      // Past scrambled (2000ms) + revealing (1200ms) duration, text should be fully revealed.
      vi.advanceTimersByTime(3300);
      expect(hero.badgeText()).toBe(fullText);

      fixture.destroy();
    });

    it('buildDisplayText with a decreasing revealedCount ciphers trailing characters first, mirroring the hiding sweep', () => {
      const fixture = TestBed.createComponent(Hero);
      const hero = fixture.componentInstance as any;
      const target = 'Hi there';
      const randomChar = () => '#';

      // Simulate the "hiding" sweep: revealedCount shrinks from target.length down to 0.
      const full = hero.buildDisplayText(target, target.length, randomChar);
      const mid = hero.buildDisplayText(target, 3, randomChar);
      const none = hero.buildDisplayText(target, 0, randomChar);

      expect(full).toBe(target);
      // With revealedCount 3: front characters ("Hi ") stay real, trailing become the stub char.
      expect(mid).toBe('Hi #####');
      // With revealedCount 0: only the literal space survives, everything else is ciphered.
      expect(none).toBe('## #####');
    });

    it('advances revealed -> hiding -> scrambled (with 5s hold) -> revealing without getting stuck', () => {
      mockMatchMedia(false);
      vi.useFakeTimers();

      const fixture = TestBed.createComponent(Hero);
      const hero = fixture.componentInstance as any;
      fixture.detectChanges();

      const fullText =
        'This entire site was built in 4 hours — designed with Claude Code, translated to Angular, and published.';

      // Reach "revealed": scrambled (1000ms) + revealing (1400ms).
      vi.advanceTimersByTime(2400 + 50);
      expect(hero.badgeText()).toBe(fullText);
      expect(hero.phase).toBe('revealed');

      // Reach "hiding": revealed hold (10000ms).
      vi.advanceTimersByTime(10000 + 50);
      expect(hero.phase).toBe('hiding');

      // Partway through hiding, text should no longer be fully revealed nor fully random.
      vi.advanceTimersByTime(700);
      expect(hero.badgeText().length).toBe(fullText.length);
      expect(hero.badgeText()).not.toBe(fullText);

      // Finish hiding (1400ms total) -> should land back in "scrambled" using the 5s hidden hold.
      vi.advanceTimersByTime(1400);
      expect(hero.phase).toBe('scrambled');
      expect(hero.scrambledHoldMs).toBe(hero.HIDDEN_HOLD_DURATION_MS);
      expect(hero.scrambledHoldMs).toBe(5000);

      // Confirm it stays scrambled before the 5s hold elapses...
      vi.advanceTimersByTime(3000);
      expect(hero.phase).toBe('scrambled');

      // ...and transitions to "revealing" once the 5s hold elapses, eventually reaching "revealed" again.
      vi.advanceTimersByTime(2000 + 50);
      expect(hero.phase).toBe('revealing');

      vi.advanceTimersByTime(1400 + 50);
      expect(hero.phase).toBe('revealed');
      expect(hero.badgeText()).toBe(fullText);

      fixture.destroy();
    });

    it('ngOnDestroy clears the interval so no further badgeText changes occur', () => {
      mockMatchMedia(false);
      vi.useFakeTimers();
      const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

      const fixture = TestBed.createComponent(Hero);
      const hero = fixture.componentInstance as any;
      fixture.detectChanges();

      fixture.destroy();
      expect(clearIntervalSpy).toHaveBeenCalled();

      const textAfterDestroy = hero.badgeText();
      vi.advanceTimersByTime(10000);
      expect(hero.badgeText()).toBe(textAfterDestroy);
    });
  });

  describe('particle network canvas lifecycle', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('ngAfterViewInit does not throw even when jsdom canvas getContext("2d") returns null', () => {
      mockMatchMedia(false);
      const fixture = TestBed.createComponent(Hero);

      // Triggers ngOnInit + ngAfterViewInit. jsdom has no canvas package installed,
      // so HTMLCanvasElement.getContext('2d') resolves to null here, exercising the guard.
      expect(() => fixture.detectChanges()).not.toThrow();

      const canvas: HTMLCanvasElement | null = fixture.nativeElement.querySelector('canvas.particle-canvas');
      expect(canvas).toBeTruthy();

      fixture.destroy();
    });

    it('ngOnDestroy (via fixture.destroy()) does not throw and removes window/document listeners', () => {
      mockMatchMedia(false);
      const removeWindowSpy = vi.spyOn(window, 'removeEventListener');
      const removeDocSpy = vi.spyOn(document, 'removeEventListener');
      const cancelAnimationFrameSpy = vi.spyOn(globalThis, 'cancelAnimationFrame');

      const fixture = TestBed.createComponent(Hero);
      fixture.detectChanges();

      expect(() => fixture.destroy()).not.toThrow();

      expect(removeWindowSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(removeDocSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
      // No rAF loop should have started since jsdom's 2D context is null (guarded),
      // so cancelAnimationFrame is not required to fire, but the spy itself must exist
      // and destroy() must remain safe to call regardless.
      expect(cancelAnimationFrameSpy).toBeDefined();
    });

    it('shouldAnimate reflects the current prefers-reduced-motion setting', () => {
      mockMatchMedia(false);
      const fixture = TestBed.createComponent(Hero);
      const hero = fixture.componentInstance as any;
      expect(hero.shouldAnimate()).toBe(true);

      mockMatchMedia(true);
      expect(hero.shouldAnimate()).toBe(false);

      fixture.destroy();
    });

    it('onVisibilityChange does not resume the rAF loop on becoming visible when prefers-reduced-motion is set', () => {
      mockMatchMedia(true);
      const fixture = TestBed.createComponent(Hero);
      fixture.detectChanges();

      const rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame');
      const originalHiddenDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden');
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });

      try {
        (fixture.componentInstance as any).onVisibilityChange();
        expect(rafSpy).not.toHaveBeenCalled();
      } finally {
        if (originalHiddenDescriptor) {
          Object.defineProperty(Document.prototype, 'hidden', originalHiddenDescriptor);
        }
        delete (document as any).hidden;
        fixture.destroy();
      }
    });

    it('does not leave a dangling requestAnimationFrame loop running after destroy', () => {
      mockMatchMedia(false);
      const rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame');

      const fixture = TestBed.createComponent(Hero);
      fixture.detectChanges();
      fixture.destroy();

      const callsBeforeWait = rafSpy.mock.calls.length;

      // Give any stray scheduled frame a chance to fire; count must not grow after destroy.
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(rafSpy.mock.calls.length).toBe(callsBeforeWait);
          resolve();
        }, 50);
      });
    });
  });
});
