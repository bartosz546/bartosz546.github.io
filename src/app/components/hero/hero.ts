import { Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero {
  protected readonly photoTransform = signal('rotateY(0deg) rotateX(0deg)');
  protected readonly orb1Transform = signal('translate(0px, 0px)');
  protected readonly orb2Transform = signal('translate(0px, 0px)');

  protected onMouseMove(event: MouseEvent): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    this.photoTransform.set(`rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`);
    this.orb1Transform.set(`translate(${x * 30}px, ${y * 30}px)`);
    this.orb2Transform.set(`translate(${-x * 40}px, ${-y * 40}px)`);
  }

  protected onMouseLeave(): void {
    this.photoTransform.set('rotateY(0deg) rotateX(0deg)');
    this.orb1Transform.set('translate(0px, 0px)');
    this.orb2Transform.set('translate(0px, 0px)');
  }
}
