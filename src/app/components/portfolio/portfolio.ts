
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Firebase } from '../../services/firebase';
import { OrderUtils } from '../../utils/order.util';
import { Router } from '@angular/router';

@Component({
	selector: 'app-portfolio',
	standalone: true,
	templateUrl: './portfolio.html',
	styleUrl: './portfolio.scss'
})
export class PortfolioComponent implements OnDestroy, OnInit {

	loadingData = signal(false);
	private dataSubscription?: any;
	portfolioImages = signal<any[]>([]);

	constructor(private readonly firebase: Firebase, private readonly router: Router) { }

	ngOnInit(): void {
		this.getPortfolioImages();
	}

	getPortfolioImages() {
		this.loadingData.set(true);
		this.dataSubscription = this.firebase.getPortfolioImages().subscribe({
			next: (response: any) => {
				const orderData = OrderUtils.sortByDateDescending(response[0].urls);
				if (response[0].urls) {
					// solo quiero los primeros 6 elementos del array ordenado
					this.portfolioImages.set(orderData.slice(0, 6));
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

	openPageGallery() {
		this.router.navigate(['/gallery']);
	}
}
