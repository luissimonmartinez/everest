import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Login } from '../../services/login';
import { Router } from '@angular/router';
import { Firebase } from '../../services/firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  thisIsLogin: boolean = false;
  private dataSubscription?: any;
  urlFacebook = signal('');
  urlInstagram = signal('');
  brandName = signal('');
  brandSubName = signal('');
  showModal = signal(true);

  constructor(private readonly loginService: Login, private readonly router: Router, private readonly firebase: Firebase) { }

  ngOnInit() {
    this.loadURLfacebook();
    this.loadURLinstagram();
    this.loadBrand();
  }

  async login(user: string, pass: string) {
    this.thisIsLogin = await this.loginService.loginFirebase(user, pass);
    if (this.thisIsLogin) {
      // Cierra el modal de login manualmente
      const modal = document.getElementById('loginModal');
      if (modal) {
        (window as any).bootstrap.Modal.getOrCreateInstance(modal).hide();
        // Elimina la clase modal-open del body
        document.body.classList.remove('modal-open');
        // Elimina el backdrop si existe
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
      }
      this.showModal.set(false);
      this.router.navigate(['/admin']);
    }
  }

  loadBrand() {
    this.dataSubscription = this.firebase.getDataHome('brand').subscribe({
      next: (response) => {
        this.brandName.set(response[0]?.name || '');
        this.brandSubName.set(response[0]?.subName || '');
      },
      error: () => {
        console.error('Error al cargar datos de la marca');
      }
    });
  }

  loadURLfacebook() {
    this.dataSubscription = this.firebase.getDataHome('facebook').subscribe({
      next: (response) => {
        this.urlFacebook.set(response[0]?.url || '');
      },
      error: () => {
        console.error('Error al cargar datos de Facebook');
      }
    });
  }

  loadURLinstagram() {
    this.dataSubscription = this.firebase.getDataHome('instagram').subscribe({
      next: (response) => {
        this.urlInstagram.set(response[0]?.url || '');
      },
      error: () => {
        console.error('Error al cargar datos de Instagram');
      }
    });
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }


}
