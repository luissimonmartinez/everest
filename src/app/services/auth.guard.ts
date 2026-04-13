import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private readonly auth = getAuth(
        getApps().length ? getApp() : initializeApp(environment.firebaseConfig)
    );

    constructor(private readonly router: Router) { }

    canActivate(): Promise<boolean | UrlTree> {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(this.auth, (user) => {
                unsubscribe();
                resolve(user ? true : this.router.parseUrl('/web'));
            });
        });
    }
}
