import { TestBed } from '@angular/core/testing';
import { Projects } from './projects';

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

describe('Projects', () => {
  let target: HTMLElement;

  beforeEach(async () => {
    mockMatchMedia(false);

    await TestBed.configureTestingModule({
      imports: [Projects],
    }).compileComponents();

    target = document.createElement('div');
    target.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 200, height: 100 }) as DOMRect;
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Projects);
    const projects = fixture.componentInstance;
    expect(projects).toBeTruthy();
  });

  it('should compute the tilt transform and shadow from mouse position', () => {
    const fixture = TestBed.createComponent(Projects);
    const projects = fixture.componentInstance as any;
    const card = projects.cards[0];

    // x = (150 - 0) / 200 - 0.5 = 0.25
    // y = (25 - 0) / 100 - 0.5 = -0.25
    projects.onCardMouseMove(card, makeMouseEvent(target, 150, 25));

    expect(card.transform()).toBe(
      'perspective(900px) rotateY(2deg) rotateX(2deg) translateY(-6px)',
    );
    expect(card.shadow()).toBe('0 24px 48px -16px oklch(0 0 0 / 0.5)');
  });

  it('should reset transform and shadow to neutral on mouse leave', () => {
    const fixture = TestBed.createComponent(Projects);
    const projects = fixture.componentInstance as any;
    const card = projects.cards[0];

    projects.onCardMouseMove(card, makeMouseEvent(target, 150, 25));
    projects.onCardMouseLeave(card);

    expect(card.transform()).toBe(
      'perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)',
    );
    expect(card.shadow()).toBe('none');
  });

  it('should not update transform or shadow when prefers-reduced-motion is set', () => {
    mockMatchMedia(true);
    const fixture = TestBed.createComponent(Projects);
    const projects = fixture.componentInstance as any;
    const card = projects.cards[0];
    const initialTransform = card.transform();
    const initialShadow = card.shadow();

    projects.onCardMouseMove(card, makeMouseEvent(target, 150, 25));

    expect(card.transform()).toBe(initialTransform);
    expect(card.shadow()).toBe(initialShadow);
  });

  it('should reveal only the specific card whose element intersects, not another card', () => {
    // Capture the IntersectionObserver constructed by the component so we can
    // manually fire its callback, simulating the browser reporting that a
    // single card's element has scrolled into view.
    let capturedCallback: IntersectionObserverCallback | undefined;
    const OriginalIntersectionObserver = window.IntersectionObserver;
    const observeSpy = vi.fn();
    class SpyIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        capturedCallback = callback;
      }
      observe = observeSpy;
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = () => [];
    }
    window.IntersectionObserver = SpyIntersectionObserver as unknown as typeof IntersectionObserver;

    try {
      const fixture = TestBed.createComponent(Projects);
      fixture.detectChanges(); // triggers ngAfterViewInit, wiring up cardsByEl + observer

      const projects = fixture.componentInstance as any;
      const cardRevealEls = projects.cardRevealEls() as { nativeElement: HTMLElement }[];
      expect(cardRevealEls.length).toBe(projects.cards.length);
      expect(cardRevealEls.length).toBeGreaterThan(1);

      const targetIndex = 1;
      const targetEl = cardRevealEls[targetIndex].nativeElement;
      const otherIndex = 0;
      const otherCard = projects.cards[otherIndex];
      const targetCard = projects.cards[targetIndex];

      const otherTransformBefore = otherCard.transform();

      expect(capturedCallback).toBeDefined();
      capturedCallback!(
        [{ target: targetEl, isIntersecting: true } as unknown as IntersectionObserverEntry],
        new SpyIntersectionObserver(() => {}) as unknown as IntersectionObserver,
      );

      // The card matching the intersecting element is revealed...
      expect(targetCard.transform()).toBe(
        'perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)',
      );
      // ...while every other card (identified by project name) is untouched.
      expect(otherCard.transform()).toBe(otherTransformBefore);
      expect(targetCard.project.name).not.toBe(otherCard.project.name);
    } finally {
      window.IntersectionObserver = OriginalIntersectionObserver;
    }
  });
});
