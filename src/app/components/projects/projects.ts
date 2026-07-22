import { AfterViewInit, Component, ElementRef, OnDestroy, WritableSignal, signal, viewChild, viewChildren } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { PROJECTS, Project } from '../../models';

interface ProjectCard {
  project: Project;
  transform: WritableSignal<string>;
  shadow: WritableSignal<string>;
}

const TILT_NEUTRAL = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)';
const REVEAL_HIDDEN = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateY(24px)';

@Component({
  selector: 'app-projects',
  imports: [NgOptimizedImage],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects implements AfterViewInit, OnDestroy {
  protected readonly cards: ProjectCard[] = PROJECTS.map((project) => ({
    project,
    transform: signal(REVEAL_HIDDEN),
    shadow: signal('none'),
  }));

  private readonly headingEl = viewChild<ElementRef<HTMLElement>>('revealEl');
  private readonly cardRevealEls = viewChildren<ElementRef<HTMLElement>>('cardRevealEl');

  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const revealEls = this.cardRevealEls();
    if (revealEls.length !== this.cards.length) {
      // Invariant: the @for loop renders exactly one #cardRevealEl per card, in
      // the same order. If this ever drifts (e.g. conditional rendering added
      // to the template), fail loudly instead of silently mis-mapping cards.
      console.error(
        `Projects: cardRevealEls (${revealEls.length}) and cards (${this.cards.length}) length mismatch; reveal/tilt mapping may be incorrect.`,
      );
    }

    const cardsByEl = new WeakMap<Element, ProjectCard>();
    revealEls.forEach((ref, index) => {
      const card = this.cards[index];
      if (card) cardsByEl.set(ref.nativeElement, card);
    });

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            const card = cardsByEl.get(entry.target as HTMLElement);
            card?.transform.set(TILT_NEUTRAL);
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -12% 0px' },
    );

    const heading = this.headingEl();
    if (heading) this.observer.observe(heading.nativeElement);

    for (const ref of revealEls) {
      this.observer.observe(ref.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  protected onCardMouseMove(card: ProjectCard, event: MouseEvent): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.transform.set(`perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`);
    card.shadow.set('0 24px 48px -16px oklch(0 0 0 / 0.5)');
  }

  protected onCardMouseLeave(card: ProjectCard): void {
    card.transform.set(TILT_NEUTRAL);
    card.shadow.set('none');
  }
}
