import { Routes } from '@angular/router';
import { Web } from './modules/web/web';
import { Admin } from './modules/admin/admin';
import { GalleryComplete } from './components/gallery-complete/gallery-complete';
import { AuthGuard } from './services/auth.guard';


export const routes: Routes = [
    { path: 'web', component: Web },
    { path: 'admin', component: Admin, canActivate: [AuthGuard] },
    { path: 'gallery', component: GalleryComplete },
    { path: '', redirectTo: 'web', pathMatch: 'full' },
    { path: '**', redirectTo: 'web', pathMatch: 'full' }
];
