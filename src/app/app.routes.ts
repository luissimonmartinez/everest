import { Routes } from '@angular/router';
import { Web } from './modules/web/web';
import { Admin } from './modules/admin/admin';
import { GalleryComplete } from './components/gallery-complete/gallery-complete';


export const routes: Routes = [
    { path: 'web', component: Web },
    { path: 'admin', component: Admin },
    { path: 'gallery', component: GalleryComplete },
    { path: '', redirectTo: 'web', pathMatch: 'full' },
    { path: '**', redirectTo: 'web', pathMatch: 'full' }
];
