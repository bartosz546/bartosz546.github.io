import { Component } from '@angular/core';
import { TECH_STACK } from '../../models';

@Component({
  selector: 'app-tech-marquee',
  standalone: true,
  imports: [],
  templateUrl: './tech-marquee.html',
  styleUrl: './tech-marquee.scss',
})
export class TechMarquee {
  protected readonly items = [...TECH_STACK, ...TECH_STACK];
}
