import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HomeAdmin } from '../../components/admin/home-admin/home-admin';
import { AboutAdmin } from "../../components/admin/about-admin/about-admin";
import { PortfolioAdmin } from '../../components/admin/portfolio-admin/portfolio-admin';
import { ContactAdmin } from '../../components/admin/contact-admin/contact-admin';

@Component({
  selector: 'app-admin',
  imports: [HomeAdmin, AboutAdmin, PortfolioAdmin, ContactAdmin],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
  
})
export class Admin {

  constructor(private readonly router: Router) { }
  initTab = 1;

  logout() {
    this.router.navigate(['/web']);
  }

  changeTab(tab: number) {
    this.initTab = tab;
  }

}
