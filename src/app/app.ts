import { Component, signal } from '@angular/core';


import { HeaderComponent } from './components/header/header';
import { HomeComponent } from './components/home/home';
import { AboutComponent } from './components/about/about';

import { PortfolioComponent } from './components/portfolio/portfolio';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, HomeComponent, AboutComponent, PortfolioComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('everest');
}
