import { AfterViewInit, Component, ElementRef, OnDestroy, viewChildren } from '@angular/core';
import { Stat, STATS } from '../../models';

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.html',
  styleUrl: './stats.scss'
})
export class Stats implements AfterViewInit, OnDestroy {
  protected readonly stats: Stat[] = STATS;

  private readonly revealEls = viewChildren<ElementRef<HTMLElement>>('revealEl');

  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -12% 0px' }
    );

    for (const ref of this.revealEls()) {
      this.observer.observe(ref.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
