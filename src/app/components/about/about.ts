import { Component, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { Firebase } from '../../services/firebase';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class AboutComponent implements OnInit, OnDestroy {

  private dataSubscription?: any;
  city = signal('');
  brandName = signal('');
  brandSubName = signal('');
  since = signal('');
  url = signal('');
  name = signal('');

  constructor(private readonly firebase: Firebase) { }

  ngOnInit() {
    this.loadCity();
    this.loadBrand();
    this.loadInfoPerfil();
  }

  loadCity() {
    this.dataSubscription = this.firebase.getDataHome('direccion').subscribe({
      next: (response) => {
        this.city.set(response[0]?.ciudad || '');
      },
      error: () => {
        console.error('Error al cargar datos de la ciudad');
      }
    });
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadBrand() {
    this.dataSubscription = this.firebase.getDataHome('brand').subscribe({
      next: (response) => {
        this.brandName.set(response[0]?.name || '');
        this.brandSubName.set(response[0]?.subName || '');
        this.since.set(response[0]?.since || '');
      },
      error: () => {
        console.error('Error al cargar datos de la marca');
      }
    });
  }

  loadInfoPerfil() {
    this.dataSubscription = this.firebase.getDataImages('perfil').subscribe({
      next: (response) => {
        this.url.set(response[0]?.url || '');
        this.name.set(response[0]?.name || '');
      },
      error: () => {
        console.error('Error al cargar datos de la marca');
      }
    });
  }

}
