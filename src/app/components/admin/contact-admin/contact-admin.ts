import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Firebase } from '../../../services/firebase';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-contact-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-admin.html',
  styleUrl: './contact-admin.scss',
})
export class ContactAdmin implements OnInit, OnDestroy {

  private dataSubscription?: any;

  formGroupAddress: FormGroup;
  formControlFacebook = new FormControl('', [Validators.maxLength(60), Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?facebook\.com\/(profile\.php\?id=\d+|[a-zA-Z0-9._-]+)\/?$/)]);
  formControlInstagram = new FormControl('', [Validators.maxLength(60), Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._-]+\/?$/)]);
  loadingData = signal(false);
  isErrorInServer = signal(false);
  labelButton = signal('Actualizar');
  formControlEmail = new FormControl('', [Validators.maxLength(30), Validators.email, Validators.required]);
  formControlPhone = new FormControl('', [Validators.maxLength(9), Validators.minLength(9), Validators.required, Validators.pattern(/^[0-9]+$/)]);
  isMobileView = signal(false);
  isLoadingChangeFacebook = signal(false);
  isLoadingChangeInstagram = signal(false);
  isLoadingChangeEmail = signal(false);
  isLoadingChangePhone = signal(false);
  isLoadingChangeAddress = signal(false);

  constructor(private readonly firebase: Firebase) {
    this.formGroupAddress = new FormGroup({
      calle: new FormControl('', [Validators.maxLength(30), Validators.required]),
      ciudad: new FormControl('', [Validators.maxLength(20), Validators.required]),
      pais: new FormControl('', [Validators.maxLength(20), Validators.required])
    });
  }

  ngOnInit() {
    this.loadURLfacebook();
    this.loadURLinstagram();
    this.loadEmail();
    this.loadPhone();
    this.loadAdress();
    this.updateMobileView();
    window.addEventListener('resize', this.updateMobileView.bind(this));
  }

  loadAdress() {
    this.dataSubscription = this.firebase.getDataHome('direccion').subscribe({
      next: (response) => {
        this.formGroupAddress.setValue({
          calle: response[0]?.calle || '',
          ciudad: response[0]?.ciudad || '',
          pais: response[0]?.pais || ''
        });
      },
      error: () => {
        console.error('Error al cargar datos de dirección');
      }
    });
  }

  loadPhone() {
    this.dataSubscription = this.firebase.getDataHome('celular').subscribe({
      next: (response) => {
        this.formControlPhone.setValue(response[0]?.numero || '');
      },
      error: () => {
        console.error('Error al cargar datos de celular');
      }
    });
  }

  loadEmail() {
    this.dataSubscription = this.firebase.getDataHome('correo').subscribe({
      next: (response) => {
        this.formControlEmail.setValue(response[0]?.correo || '');
      },
      error: () => {
        console.error('Error al cargar datos de correo');
      }
    });
  }

  loadURLfacebook() {
    this.dataSubscription = this.firebase.getDataHome('facebook').subscribe({
      next: (response) => {
        this.formControlFacebook.setValue(response[0]?.url || '');
      },
      error: () => {
        console.error('Error al cargar datos de Facebook');
      }
    });
  }

  loadURLinstagram() {
    this.dataSubscription = this.firebase.getDataHome('instagram').subscribe({
      next: (response) => {
        this.formControlInstagram.setValue(response[0]?.url || '');
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

  updateMobileView() {
    this.isMobileView.set(window.innerWidth <= 768);
  }

  changeURLfacebook() {
    if (this.formControlFacebook.pristine) {
      return;
    }
    if (this.formControlFacebook.valid) {
      this.isLoadingChangeFacebook.set(true);
      const url = this.formControlFacebook.value;
      this.firebase.setNewDataHome({ url }, 'facebook').pipe(finalize(() => this.isLoadingChangeFacebook.set(false))).subscribe({
        next: () => {
          alert('URL de Facebook actualizada con éxito');
          this.formControlFacebook.markAsPristine();
        },
        error: () => {
          alert('Error al actualizar la URL de Facebook');
          this.formControlFacebook.markAsPristine();
        }
      });
    }
  }

  changeURLinstagram() {
    if (this.formControlInstagram.pristine) {
      return;
    }
    if (this.formControlInstagram.valid) {
      const url = this.formControlInstagram.value;
      this.isLoadingChangeInstagram.set(true);
      this.firebase.setNewDataHome({ url }, 'instagram').pipe(finalize(() => this.isLoadingChangeInstagram.set(false))).subscribe({
        next: () => {
          alert('URL de Instagram actualizada con éxito');
          this.formControlInstagram.markAsPristine();
        },
        error: () => {
          alert('Error al actualizar la URL de Instagram');
          this.formControlInstagram.markAsPristine();
        }
      });
    }
  }

  changeEmail() {
    if (this.formControlEmail.pristine) {
      return;
    }
    if (this.formControlEmail.valid) {
      const correo = this.formControlEmail.value;
      this.isLoadingChangeEmail.set(true);
      this.firebase.setNewDataHome({ correo }, 'correo').pipe(finalize(() => this.isLoadingChangeEmail.set(false))).subscribe({
        next: () => {
          alert('Correo actualizado con éxito');
          this.formControlEmail.markAsPristine();
        },
        error: () => {
          alert('Error al actualizar el correo');
          this.formControlEmail.markAsPristine();
        }
      });
    }
  }

  changePhone() {
    if (this.formControlPhone.pristine) {
      return;
    }
    if (this.formControlPhone.valid) {
      const numero = this.formControlPhone.value;
      this.isLoadingChangePhone.set(true);
      this.firebase.setNewDataHome({ numero }, 'celular').pipe(finalize(() => this.isLoadingChangePhone.set(false))).subscribe({
        next: () => {
          alert('Número de celular actualizado con éxito');
          this.formControlPhone.markAsPristine();
        },
        error: () => {
          alert('Error al actualizar el número de celular');
          this.formControlPhone.markAsPristine();
        }
      });
    }
  }

  changeAddress() {
    if (this.formGroupAddress.pristine) {
      return;
    }
    if (this.formGroupAddress.valid) {
      const { calle, ciudad, pais } = this.formGroupAddress.value;
      this.isLoadingChangeAddress.set(true);
      this.firebase.setNewDataHome({ calle, ciudad, pais }, 'direccion').pipe(finalize(() => this.isLoadingChangeAddress.set(false))).subscribe({
        next: () => {
          alert('Dirección actualizada con éxito');
          this.formGroupAddress.markAsPristine();
        },
        error: () => {
          alert('Error al actualizar la dirección');
          this.formGroupAddress.markAsPristine();
        }
      });
    }
  }

  openExternalUrl(url: string | null) {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      window.open(url, '_blank');
    } else {
      alert('La URL no es válida. Asegúrate de que comience con http:// o https://');
    }
  }

}
