import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HomeAdmin } from '../../components/admin/home-admin/home-admin';
import { PortfolioAdmin } from '../../components/admin/portfolio-admin/portfolio-admin';
import { ContactAdmin } from '../../components/admin/contact-admin/contact-admin';
import { Firebase } from '../../services/firebase';
import { HeaderAdmin } from "../../components/admin/header-admin/header-admin";

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

  constructor(private readonly router: Router, private readonly firebase: Firebase) {

  }

  ngOnInit(): void {
    this.loadBrand();
  }



  logout() {
    this.router.navigate(['/web']);
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

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

}
