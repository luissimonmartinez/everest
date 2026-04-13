import { Injectable } from '@angular/core';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Login {
  passEncoded: string = '076d6a8a32db09caf13943b27cdd6c163c8405ba460f29838aa0c82b1a605e09';
  userEncoded: string = '0279c23cb3b7ce45100db240c7a6cd30752ebe5b4eb98ff2bf94601e6499ae30';
  private readonly auth = getAuth(
    getApps().length ? getApp() : initializeApp(environment.firebaseConfig)
  );

  constructor() { }

  //metodo convertir string en sha256
  public async sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  }

  public async login(user: string, pass: string): Promise<boolean> {
    const userHash = await this.sha256(user);
    const passHash = await this.sha256(pass);
    return userHash === this.userEncoded && passHash === this.passEncoded;
  }

  async loginFirebase(email: string, password: string): Promise<boolean> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch {
      return false;
    }
  }

  async logoutFirebase(): Promise<boolean> {
    try {
      await signOut(this.auth);
      localStorage.removeItem('user');
      return true;
    } catch {
      return false;
    }
  }

}
