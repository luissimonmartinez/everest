import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Firebase } from '../../../services/firebase';
import { finalize } from 'rxjs';
import { DateUtils } from '../../../utils/date.util';
import { OrderUtils } from '../../../utils/order.util';
@Component({
  selector: 'app-portfolio-admin',
  imports: [],
  templateUrl: './portfolio-admin.html',
  styleUrl: './portfolio-admin.scss',
})
export class PortfolioAdmin implements OnDestroy, OnInit {

  files: File[] = [];
  loading = signal<boolean>(false);
  private dataSubscription?: any;
  portfolioImages = signal<any[]>([]);
  DateUtils = DateUtils;
  loadingData = signal(false);

  constructor(private readonly firebase: Firebase) { }

  ngOnInit(): void {
    this.getPortfolioImages();
  }

  onFileSelected($event: Event) {
    const target = $event.target as HTMLInputElement;
    if (target.files) {
      const selectedFiles = Array.from(target.files);
      const validImageTypes = new Set(['image/jpeg', 'image/png', 'image/gif']);
      this.files = selectedFiles.filter(file => validImageTypes.has(file.type));
      if (this.files.length < selectedFiles.length) {
        alert('Algunas de las imágenes seleccionadas no son válidas y han sido omitidas.');
      }
    }
  }

  uploadImages() {
    this.loading.set(true);
    this.dataSubscription = this.firebase.uploadImagesPortfolio(this.files).pipe(finalize(() => { this.loading.set(false) })).subscribe({
      next: () => {
        alert('Imagenes subidas con éxito');
        this.files = [];
      },
      error: () => {
        alert('Error al subir las imagenes: ');
      }
    })
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  getPortfolioImages() {
    this.loadingData.set(true);
    this.dataSubscription = this.firebase.getPortfolioImages().subscribe({
      next: (response: any) => {
        const orderData = OrderUtils.sortByDateDescending(response[0].urls);
        if (response[0].urls) {
          this.portfolioImages.set(orderData);
          this.loadingData.set(false);
        } else {
          this.portfolioImages.set([]);
          this.loadingData.set(false);
        }
      },
      error: () => {
        console.error('Error al obtener las imágenes del portafolio');
        this.loadingData.set(false);
      }
    });
  }

  openExternalUrl(url: string | null) {
    if (!url) {
      alert('URL no disponible');
      return;
    }
    window.open(url, '_blank');
  }

  deleteImage(imageName: string) {
    if (!confirm(`¿Estás seguro de que deseas eliminar la imagen "${imageName}"?`)) {
      return;
    }
    this.firebase.deletePortfolioImage(imageName).subscribe({
      next: () => {
        alert('Imagen eliminada con éxito');
      },
      error: () => {
        alert('Error al eliminar la imagen');
      }
    });
  }

}
