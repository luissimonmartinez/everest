import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HomeAdmin } from '../../components/admin/home-admin/home-admin';
import { PortfolioAdmin } from '../../components/admin/portfolio-admin/portfolio-admin';
import { ContactAdmin } from '../../components/admin/contact-admin/contact-admin';
import { Firebase } from '../../services/firebase';
import { HeaderAdmin } from "../../components/admin/header-admin/header-admin";

const INACTIVITY_WARNING_MS = 3 * 60 * 1000; // 3 minutos
const INACTIVITY_LOGOUT_MS = 5 * 60 * 1000; // 5 minutos

@Component({
  selector: 'app-admin',
  imports: [HomeAdmin, PortfolioAdmin, ContactAdmin, HeaderAdmin],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],

})
export class Admin implements OnDestroy, OnInit {

  brandName = signal('');
  brandSubName = signal('');
  // initTab que sea un signal para controlar la pestaña activa
  initTab = signal(1);
  private dataSubscription?: any;

  showInactivityModal = signal(false);
  private inactivityWarningTimeout?: any;
  private inactivityLogoutTimeout?: any;

  constructor(private readonly router: Router, private readonly firebase: Firebase) {

  }

  ngOnInit(): void {
    this.loadBrand();
    this.initInactivityHandler();
  }

  logout() {
    // Cierra cualquier modal abierto y limpia el DOM de clases/backdrops y estilos inline
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach((el) => el.remove());
    this.router.navigate(['/']);
  }

  changeTab(tab: number) {
    this.initTab.set(tab);
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

  // --- INACTIVIDAD ---
  private initInactivityHandler() {
    this.resetInactivityTimers();
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => {
      window.addEventListener(event, this.handleUserActivity, true);
    });
  }

  private readonly handleUserActivity = () => {
    if (this.showInactivityModal()) {
      this.showInactivityModal.set(false);
    }
    this.resetInactivityTimers();
  };

  private resetInactivityTimers() {
    if (this.inactivityWarningTimeout) {
      clearTimeout(this.inactivityWarningTimeout);
    }
    if (this.inactivityLogoutTimeout) {
      clearTimeout(this.inactivityLogoutTimeout);
    }
    this.inactivityWarningTimeout = setTimeout(() => {
      this.showInactivityModal.set(true);
    }, INACTIVITY_WARNING_MS);
    this.inactivityLogoutTimeout = setTimeout(() => {
      this.logout();
    }, INACTIVITY_LOGOUT_MS);
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => {
      window.removeEventListener(event, this.handleUserActivity, true);
    });
    if (this.inactivityWarningTimeout) {
      clearTimeout(this.inactivityWarningTimeout);
    }
    if (this.inactivityLogoutTimeout) {
      clearTimeout(this.inactivityLogoutTimeout);
    }
  }

}
