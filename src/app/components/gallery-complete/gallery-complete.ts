import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Firebase } from '../../services/firebase';
import { OrderUtils } from '../../utils/order.util';
import { DateUtils } from '../../utils/date.util';

@Component({
  selector: 'app-gallery-complete',
  imports: [],
  templateUrl: './gallery-complete.html',
  styleUrl: './gallery-complete.scss',
})
export class GalleryComplete implements OnDestroy, OnInit {

  portfolioImages = signal<any[]>([]);
  orderData = signal<any[]>([]);
  loadingData = signal(false);
  private dataSubscription?: any;
  totalCargas = signal(0);
  pageCurrent = signal(1);
  UseDateUtil = DateUtils;

  constructor(private readonly router: Router, private readonly firebase: Firebase,) { }

  ngOnInit(): void {
    this.getPortfolioImages();
  }

  backToWeb() {
    this.router.navigate(['/web']);
  }

  getPortfolioImages() {
    this.loadingData.set(true);
    this.dataSubscription = this.firebase.getPortfolioImages().subscribe({
      next: (response: any) => {
        this.orderData.set(OrderUtils.sortByDateDescending(response[0].urls));
        if (response[0].urls) {
          this.portfolioImages.set(this.orderData().slice(0, 6));
          this.totalCargas.set(Math.ceil(this.orderData().length / 6));
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

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadMoreImages() {
    const initslice = this.pageCurrent() * 6;
    const endSlice = initslice + 6;
    const currentImages = this.portfolioImages();
    const moreImages = this.orderData().slice(initslice, endSlice);
    this.portfolioImages.set([...currentImages, ...moreImages]);
    this.pageCurrent.set(this.pageCurrent() + 1);
  }

  convertDate(date: any): string {
    return this.UseDateUtil.formatFirebaseTimestamp(date);
  }

}
