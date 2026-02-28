import { Routes } from '@angular/router';
import { Web } from './modules/web/web';
import { Admin } from './modules/admin/admin';


export const routes: Routes = [
    { path: 'web', component: Web },
    { path: 'admin', component: Admin },
    { path: '', redirectTo: 'web', pathMatch: 'full' },
    { path: '**', redirectTo: 'web', pathMatch: 'full' }
];
