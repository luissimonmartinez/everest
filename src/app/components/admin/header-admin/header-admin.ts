import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Firebase } from '../../../services/firebase';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { DateUtils } from '../../../utils/date.util';

@Component({
  selector: 'app-header-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './header-admin.html',
  styleUrl: './header-admin.scss',
})
export class HeaderAdmin implements OnInit, OnDestroy {

  private dataSubscription?: any;
  formGroup: FormGroup;
  isLoadingChangeBrand = signal(false);
  isLoadingChangeFacebook = signal(false);
  isLoadingChangeInstagram = signal(false);
  formControlFacebook = new FormControl('', [Validators.maxLength(60), Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?facebook\.com\/(profile\.php\?id=\d+|[a-zA-Z0-9._-]+)\/?$/)]);
  formControlInstagram = new FormControl('', [Validators.maxLength(60), Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._-]+\/?$/)]);
  isMobileView = signal(false);
  url = signal('');
  name = signal('');
  date = signal('');
  filePerfil: File | null = null;
  loadingUploadPerfil: boolean = false;

  loadingDataBrand = signal(false);
  loadingDataPerfil = signal(false);

  constructor(private readonly firebase: Firebase) {
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.maxLength(12)]),
      subName: new FormControl('', [Validators.maxLength(22)]),
      since: new FormControl('', [Validators.maxLength(4)]),
    });
  }

  ngOnInit(): void {
    this.loadBrand();
    this.loadInfoPerfil();
    this.updateMobileView();
    window.addEventListener('resize', this.updateMobileView.bind(this));
  }

  loadBrand() {
    this.loadingDataBrand.set(true);
    this.dataSubscription = this.firebase.getDataHome('brand').subscribe({
      next: (response) => {
        this.formGroup.get('name')?.setValue(response[0]?.name || '');
        this.formGroup.get('subName')?.setValue(response[0]?.subName || '');
        this.formGroup.get('since')?.setValue(response[0]?.since || '');
        this.loadingDataBrand.set(false);
      },
      error: () => {
        console.error('Error al cargar datos de la marca');
        this.loadingDataBrand.set(false);
      }
    });
  }

  loadInfoPerfil() {
    this.loadingDataPerfil.set(true);
    this.dataSubscription = this.firebase.getDataImages('perfil').subscribe({
      next: (response) => {
        this.url.set(response[0]?.url || '');
        this.name.set(response[0]?.name || '');
        this.date.set(DateUtils.formatFirebaseTimestamp(response[0]?.date));
        this.loadingDataPerfil.set(false);
      },
      error: () => {
        console.error('Error al cargar datos de la marca');
        this.loadingDataPerfil.set(false);
      }
    });
  }

  changeDataHome() {
    if (this.formGroup.pristine) {
      return;
    }
    if (this.formGroup.valid) {
      this.isLoadingChangeBrand.set(true);
      const { name, subName, since } = this.formGroup.value;
      this.firebase.setNewDataHome({ name, subName, since }, 'brand').pipe(finalize(() => this.isLoadingChangeBrand.set(false))).subscribe({
        next: () => {
          alert('Datos de la marca actualizados con éxito');
          this.formGroup.markAsPristine();
        },
        error: () => {
          alert('Error al actualizar los datos de la marca');
        }
      });
    }
  }



  updateMobileView() {
    this.isMobileView.set(window.innerWidth <= 768);
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  openExternalUrl(url: string | null) {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      window.open(url, '_blank');
    } else {
      alert('La URL no es válida. Asegúrate de que comience con http:// o https://');
    }
  }

  onFileSelected($event: Event) {
    const file = ($event.target as HTMLInputElement).files?.[0] || null;
    if (file && !file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen.');
      // debe limpiar el input de tipo file para que el usuario pueda seleccionar otro archivo
      ($event.target as HTMLInputElement).value = '';
      this.filePerfil = null;
      return;
    }
    this.filePerfil = file;
  }

  uploadImage() {
    // sube la imagen de la variable perfilImage al storage de firebase, luego de subir la imagen
    if (!this.filePerfil) {
      alert('Por favor, selecciona una imagen primero.');
      return;
    }
    this.loadingUploadPerfil = true;
    this.dataSubscription = this.firebase.uploadImagePerfil(this.filePerfil).pipe(finalize(() => {
      this.loadingUploadPerfil = false;
    })).subscribe({
      next: () => {
        this.filePerfil = null;
        alert('Imagen subida con éxito');
      },
      error: (error) => {
        this.filePerfil = null;
        alert('Error al subir la imagen');
      }
    })
  }

}
