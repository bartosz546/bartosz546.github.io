import { AfterViewInit, Component, ElementRef, OnDestroy, signal, viewChild, viewChildren } from '@angular/core';
import { EXPERIENCE_ENTRIES, ExperienceEntry } from '../../models';

@Component({
  selector: 'app-experience',
  imports: [],
  templateUrl: './experience.html',
  styleUrl: './experience.scss'
})
export class Experience implements AfterViewInit, OnDestroy {
  protected readonly entries: ExperienceEntry[] = EXPERIENCE_ENTRIES;
  protected readonly progress = signal(0);

  private readonly trackEl = viewChild<ElementRef<HTMLElement>>('trackEl');
  private readonly revealEls = viewChildren<ElementRef<HTMLElement>>('revealEl');

  private observer?: IntersectionObserver;
  private readonly onScroll = (): void => this.updateProgress();

  protected computeProgress(trackTop: number, trackHeight: number, viewportHeight: number): number {
    const visible = Math.min(Math.max(viewportHeight * 0.6 - trackTop, 0), trackHeight);
    return trackHeight > 0 ? (visible / trackHeight) * 100 : 0;
  }

  private updateProgress(): void {
    const track = this.trackEl();
    if (!track) return;
    const rect = track.nativeElement.getBoundingClientRect();
    this.progress.set(this.computeProgress(rect.top, rect.height, window.innerHeight));
  }

  ngAfterViewInit(): void {
    this.updateProgress();
    window.addEventListener('scroll', this.onScroll, { passive: true });

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
    window.removeEventListener('scroll', this.onScroll);
  }
}
