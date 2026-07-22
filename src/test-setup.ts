// Global test environment polyfills for Vitest (jsdom does not implement these).

class IntersectionObserverStub implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  // Exposed so specs can manually simulate intersection events by invoking
  // the callback the component registered, e.g.:
  //   const observer = <captured via a spy on window.IntersectionObserver>;
  //   observer.callback([{ target: el, isIntersecting: true } as IntersectionObserverEntry], observer);
  constructor(public readonly callback: IntersectionObserverCallback = () => {}) {}

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;
}

// jsdom does not implement matchMedia. Default to "no preference" (motion allowed);
// individual specs may override window.matchMedia to simulate prefers-reduced-motion.
if (typeof window !== 'undefined' && typeof window.matchMedia === 'undefined') {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
