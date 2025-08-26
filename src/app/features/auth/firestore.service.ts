import { Injectable, inject, runInInjectionContext  } from '@angular/core';
import {  Firestore, addDoc, collection, collectionData, query, where, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  
  products$: any;


  async addProduct(name: string, price: number) {
    try {
      const docRef = await addDoc(collection(this.firestore, 'Products'), {
        name,
        price
      });
      console.log("Product added with ID:", docRef.id);
    } catch (e) {
      console.error("Error adding product:", e);
    }
  }

   constructor(private firestore: Firestore) {}

  getGearProducts(): Observable<any[]> {
    const productsRef = collection(this.firestore, 'products'); // اسم الكوليكشن
    const q = query(productsRef, where('category', '==', 'geer'));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

async getProductById(id: string) {
    const docRef = doc(this.firestore, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  }
}
