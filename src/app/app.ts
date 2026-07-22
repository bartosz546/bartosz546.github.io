import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './components/nav/nav';
import { Hero } from './components/hero/hero';
import { TechMarquee } from './components/tech-marquee/tech-marquee';
import { Experience } from './components/experience/experience';
import { Stats } from './components/stats/stats';
import { Projects } from './components/projects/projects';
import { Contact } from './components/contact/contact';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Hero, TechMarquee, Experience, Stats, Projects, Contact],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
