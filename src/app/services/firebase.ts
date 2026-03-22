import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';


@Injectable({
  providedIn: 'root',
})
export class Firebase {

  private readonly app = initializeApp(environment.firebaseConfig);
  private readonly db = getFirestore(this.app, 'everest');

  getDataHome(documentId: string): Observable<any[]> {
    return new Observable<any[]>(subscriber => {
      const docRef = doc(this.db, 'text', documentId);
      const unsubscribe = onSnapshot(docRef, {
        next: (snapshot) => {
          const data = snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
          subscriber.next(data ? [data] : []);
        },
        error: (error) => {
          console.error('Error en getDataHome:', error);
          subscriber.error(error);
        }
      });
      return () => unsubscribe();
    });
  }

  getDataImages(documentId: string): Observable<any[]> {
    return new Observable<any[]>(subscriber => {
      const docRef = doc(this.db, 'images', documentId);
      const unsubscribe = onSnapshot(docRef, {
        next: (snapshot) => {
          const data = snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
          subscriber.next(data ? [data] : []);
        },
        error: (error) => {
          console.error('Error en getDataImages:', error);
          subscriber.error(error);
        }
      });
      return () => unsubscribe();
    });
  }


  setNewDataHome(data: any, documentId: string): Observable<void> {
    return new Observable<void>(subscriber => {
      const docRef = doc(this.db, 'text', documentId);
      setDoc(docRef, data)
        .then(() => {
          subscriber.next();
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.error(error);
        });
    });
  }

  uploadImagePerfil(file: File): Observable<void> {
    return new Observable<void>(subscriber => {
      (async () => {
        try {
          const storage = getStorage(this.app);
          const storageRef = ref(storage, `everest/${file.name}`);
          // Usar uploadBytesResumable con promesa
          await uploadBytesResumable(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          const docRef = doc(this.db, 'images', 'perfil');
          await setDoc(docRef, {
            url: downloadURL,
            name: file.name,
            date: new Date()
          });
          subscriber.next();
          subscriber.complete();
        } catch (error) {
          subscriber.error(error);
        }
      })();
    });
  }

  uploadImagesPortfolio(files: File[]): Observable<void> {
    return new Observable<void>(subscriber => {
      (async () => {
        try {
          const storage = getStorage(this.app);
          const imagesData = await Promise.all(
            files.map(async (file) => {
              const storageRef = ref(storage, `everest/portafolio/${file.name}`);
              await uploadBytesResumable(storageRef, file);
              const downloadURL = await getDownloadURL(storageRef);
              return {
                url: downloadURL,
                name: file.name,
                date: new Date()
              };
            })
          );
          const docRef = doc(this.db, 'images', 'portafolio');
          const { getDoc } = await import('firebase/firestore');
          const snapshot = await getDoc(docRef);
          let existingUrls: any[] = [];
          if (snapshot.exists()) {
            const data: any = snapshot.data();
            existingUrls = Array.isArray(data.urls) ? data.urls : [];
          }
          const updatedUrls = [...existingUrls, ...imagesData];
          await setDoc(docRef, { urls: updatedUrls });
          subscriber.next();
          subscriber.complete();
        } catch (error) {
          subscriber.error(error);
        }
      })();
    });
  }

  getPortfolioImages(): Observable<any[]> {
    return new Observable<any[]>(subscriber => {
      const docRef = doc(this.db, 'images', 'portafolio');
      const unsubscribe = onSnapshot(docRef, {
        next: (snapshot) => {
          const data = snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
          subscriber.next(data ? [data] : []);
        },
        error: (error) => {
          subscriber.error(error);
        }
      });
      return () => unsubscribe();
    });
  }

  // metodo para eliminar una imagen del portafolio, recibe por parametro el nombre de la imagen a eliminar, debe eliminar la imagen del storage y luego eliminar la url de la imagen del documento portafolio en firestore
  deletePortfolioImage(imageName: string): Observable<void> {
    return new Observable<void>(subscriber => {
      (async () => {
        try {
          const storage = getStorage(this.app);
          const imageRef = ref(storage, `everest/portafolio/${imageName}`);
          await deleteObject(imageRef);
          const docRef = doc(this.db, 'images', 'portafolio');
          const { getDoc } = await import('firebase/firestore');
          const snapshot = await getDoc(docRef);
          if (!snapshot.exists()) {
            subscriber.error(new Error('Documento portafolio no encontrado'));
            return;
          }
          const data: any = snapshot.data();
          const updatedUrls = (data.urls || []).filter((img: any) => img.name !== imageName);
          await setDoc(docRef, { urls: updatedUrls });
          subscriber.next();
          subscriber.complete();
        } catch (error) {
          subscriber.error(error);
        }
      })();
    });
  }
}
