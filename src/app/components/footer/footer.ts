
import { Component } from '@angular/core';

@Component({
	selector: 'app-footer',
	standalone: true,
	templateUrl: './footer.html',
	styleUrl: './footer.scss'
})
export class FooterComponent {
    currentYear: number = new Date().getFullYear();
    urlFacebook: string = 'https://www.facebook.com/profile.php?id=100063881507244';
    urlInstagram: string = 'https://www.instagram.com/';
    urlDeveloper: string = 'https://www.facebook.com/profile.php?id=61574560770219';
    urlIframeMap: string = 'https://www.google.com/maps/embed?pb=!4v1769294452704!6m8!1m7!1sfAkeX9o7xraY5iIMIOPEJQ!2m2!1d-9.292129447596986!2d-75.99581795229395!3f356.6034246697067!4f-9.048742388883142!5f1.5714309922794523';
}
