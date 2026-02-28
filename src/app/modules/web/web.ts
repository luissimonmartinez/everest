import { Component, AfterViewInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header';
import { HomeComponent } from '../../components/home/home';
import { AboutComponent } from '../../components/about/about';
import { PortfolioComponent } from '../../components/portfolio/portfolio';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-web',
  imports: [HeaderComponent, HomeComponent, AboutComponent, PortfolioComponent, FooterComponent],
  templateUrl: './web.html',
  styleUrl: './web.scss',
})
export class Web implements AfterViewInit {
  
  ngAfterViewInit() {
    // Llama a la función global de inicialización de efectos si existe
    if (typeof (globalThis as any).initCustomEffects === 'function') {
      setTimeout(() => (globalThis as any).initCustomEffects(), 0);
    }
  }
}
