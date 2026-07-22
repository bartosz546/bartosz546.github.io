import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ParticleNetwork } from './particle-network';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero implements OnInit, AfterViewInit, OnDestroy {
  private static readonly CIPHER_CHARS = '!@#$%^&*_+-=<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  private readonly badgeLead = 'This entire site was built in 4 hours';
  private readonly badgeRest = ' — designed with Claude Code, translated to Angular, and published.';
  protected readonly badgeLeadLength = this.badgeLead.length;
  protected readonly badgeText = signal(this.badgeLead + this.badgeRest);

  private cipherIntervalId?: ReturnType<typeof setInterval>;
  private phase: 'scrambled' | 'revealing' | 'revealed' | 'hiding' = 'scrambled';
  private phaseStartMs = 0;

  private readonly SCRAMBLED_DURATION_MS = 1000;
  private readonly REVEALING_DURATION_MS = 1200;
  private readonly REVEALED_DURATION_MS = 10000;
  private readonly HIDDEN_HOLD_DURATION_MS = 4000;
  private scrambledHoldMs = this.SCRAMBLED_DURATION_MS;

  protected readonly photoTransform = signal('rotateY(0deg) rotateX(0deg)');
  protected readonly orb1Transform = signal('translate(0px, 0px)');
  protected readonly orb2Transform = signal('translate(0px, 0px)');

  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('particleCanvas');
  private network?: ParticleNetwork;
  private ctx?: CanvasRenderingContext2D | null;
  private rafId?: number;
  private lastFrameMs = 0;
  private readonly onResize = () => this.setupCanvas();
  private readonly onVisibilityChange = () => {
    if (document.hidden) {
      if (this.rafId !== undefined) cancelAnimationFrame(this.rafId);
    } else if (this.shouldAnimate()) {
      this.lastFrameMs = performance.now();
      this.rafId = requestAnimationFrame(this.tick);
    }
  };

  private shouldAnimate(): boolean {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  protected onMouseMove(event: MouseEvent): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    this.photoTransform.set(`rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`);
    this.orb1Transform.set(`translate(${x * 30}px, ${y * 30}px)`);
    this.orb2Transform.set(`translate(${-x * 40}px, ${-y * 40}px)`);
    this.network?.setCursor(event.clientX - rect.left, event.clientY - rect.top);
  }

  protected onMouseLeave(): void {
    this.photoTransform.set('rotateY(0deg) rotateX(0deg)');
    this.orb1Transform.set('translate(0px, 0px)');
    this.orb2Transform.set('translate(0px, 0px)');
    this.network?.setCursor(null, null);
  }

  protected pickRandomChar(rng: () => number = Math.random): string {
    return Hero.CIPHER_CHARS[Math.floor(rng() * Hero.CIPHER_CHARS.length)];
  }

  protected buildDisplayText(target: string, revealedCount: number, randomChar: () => string): string {
    return target
      .split('')
      .map((ch, i) => (i < revealedCount || ch === ' ' ? ch : randomChar()))
      .join('');
  }

  ngOnInit(): void {
    const fullText = this.badgeLead + this.badgeRest;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.badgeText.set(fullText);
      return;
    }
    this.phase = 'scrambled';
    this.phaseStartMs = performance.now();
    this.scrambledHoldMs = this.SCRAMBLED_DURATION_MS;
    this.badgeText.set(this.buildDisplayText(fullText, 0, () => this.pickRandomChar()));

    this.cipherIntervalId = setInterval(() => this.tickCipher(fullText), 50);
  }

  ngAfterViewInit(): void {
    this.setupCanvas();
    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;

    const rect = canvas.parentElement!.getBoundingClientRect();
    const cssWidth = rect.width;
    const cssHeight = rect.height;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = cssWidth + 'px';
    canvas.style.height = cssHeight + 'px';

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    this.ctx = ctx;

    const isFirstSetup = !this.network;
    if (!this.network) {
      this.network = new ParticleNetwork(cssWidth, cssHeight);
    } else {
      this.network.resize(cssWidth, cssHeight);
    }

    if (!this.shouldAnimate()) {
      this.network.render(this.ctx, cssWidth, cssHeight);
      return;
    }

    if (isFirstSetup && !this.rafId) {
      this.lastFrameMs = performance.now();
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  private readonly tick = (now: number) => {
    const dt = now - this.lastFrameMs;
    this.lastFrameMs = now;
    if (!this.ctx || !this.network || !this.canvasRef()) return;
    const canvas = this.canvasRef()!.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.width / dpr;
    const cssHeight = canvas.height / dpr;
    this.network.update(dt);
    this.network.render(this.ctx, cssWidth, cssHeight);
    this.rafId = requestAnimationFrame(this.tick);
  };

  ngOnDestroy(): void {
    if (this.cipherIntervalId !== undefined) {
      clearInterval(this.cipherIntervalId);
    }
    if (this.rafId !== undefined) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  private tickCipher(fullText: string): void {
    const phaseElapsedMs = performance.now() - this.phaseStartMs;

    if (this.phase === 'scrambled') {
      if (phaseElapsedMs >= this.scrambledHoldMs) {
        this.phase = 'revealing';
        this.phaseStartMs = performance.now();
      }
      this.badgeText.set(this.buildDisplayText(fullText, 0, () => this.pickRandomChar()));
      return;
    }

    if (this.phase === 'revealing') {
      const revealedCount = Math.min(
        fullText.length,
        Math.floor((phaseElapsedMs / this.REVEALING_DURATION_MS) * fullText.length),
      );
      this.badgeText.set(this.buildDisplayText(fullText, revealedCount, () => this.pickRandomChar()));
      if (revealedCount >= fullText.length) {
        this.phase = 'revealed';
        this.phaseStartMs = performance.now();
        this.badgeText.set(fullText);
      }
      return;
    }

    if (this.phase === 'revealed') {
      if (phaseElapsedMs >= this.REVEALED_DURATION_MS) {
        this.phase = 'hiding';
        this.phaseStartMs = performance.now();
      }
      return;
    }

    if (this.phase === 'hiding') {
      const revealedCount = Math.max(
        0,
        fullText.length - Math.floor((phaseElapsedMs / this.REVEALING_DURATION_MS) * fullText.length),
      );
      this.badgeText.set(this.buildDisplayText(fullText, revealedCount, () => this.pickRandomChar()));
      if (revealedCount <= 0) {
        this.phase = 'scrambled';
        this.phaseStartMs = performance.now();
        this.scrambledHoldMs = this.HIDDEN_HOLD_DURATION_MS;
        this.badgeText.set(this.buildDisplayText(fullText, 0, () => this.pickRandomChar()));
      }
    }
  }
}
