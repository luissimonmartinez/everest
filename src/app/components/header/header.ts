import { Component } from '@angular/core';
import { Login } from '../../services/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {

  constructor(private readonly loginService: Login, private readonly router: Router) { }

  thisIsLogin: boolean = false;

  async login(user: string, pass: string) {
      this.thisIsLogin = await this.loginService.login(user, pass);
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
        this.router.navigate(['/admin']);
      }
  }     

}
