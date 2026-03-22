
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Firebase } from '../../services/firebase';

@Component({
    selector: 'app-footer',
    standalone: true,
    templateUrl: './footer.html',
    styleUrls: ['./footer.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
    currentYear: number = new Date().getFullYear();
    // convertir a signal las variables
    urlFacebook = signal('');
    urlInstagram = signal('');
    address = signal({ calle: '', ciudad: '', pais: '' });
    phone = signal('');
    urlDeveloper = signal('https://growthdigital.pe/');
    private dataSubscription?: any;
    brandName = signal('');
    brandSubName = signal('');
    correo = signal('');

    constructor(private readonly firebase: Firebase) { }

    ngOnInit() {
        this.loadAdress();
        this.loadURLfacebook();
        this.loadURLinstagram();
        this.loadPhone();
        this.loadBrand();
        this.loadEmail();
    }

    loadAdress() {
        this.dataSubscription = this.firebase.getDataHome('direccion').subscribe({
            next: (response) => {
                this.address.set({
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

    loadPhone() {
        this.dataSubscription = this.firebase.getDataHome('celular').subscribe({
            next: (response) => {
                this.phone.set(response[0]?.numero || '');
            },
            error: () => {
                console.error('Error al cargar datos de celular');
            }
        });
    }

    ngOnDestroy() {
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
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

    loadEmail() {
        this.dataSubscription = this.firebase.getDataHome('correo').subscribe({
            next: (response) => {
                this.correo.set(response[0]?.correo || 'https://growthdigital.pe/');
            },
            error: () => {
                console.error('Error al cargar datos de correo');
            }
        });
    }
}
