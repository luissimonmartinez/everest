import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class Firebase {

  private readonly app = initializeApp(environment.firebaseConfig);
  private readonly db = getFirestore(this.app, 'everest');

  async getDataHome(): Promise<any[]> {
    try {
      const colRef = collection(this.db, 'data-home');
      const snapshot = await getDocs(colRef);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return docs;
    } catch (error) {
      console.error('Error en getDataHome:', error);
      return [];
    }
  }

}
