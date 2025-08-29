import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  // Inject Firebase services
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // BehaviorSubject to hold and stream the current wishlist state
  private wishlistSubject = new BehaviorSubject<any[]>([]);
  // Public observable for components to subscribe to
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor() {
    // Load the wishlist when the service is created
    this.loadWishlist();
  }

  // Private method to load wishlist from Firestore
  private async loadWishlist() {
    const user = this.auth.currentUser;
    if (!user) {
      this.wishlistSubject.next([]); // No user = empty wishlist
      return;
    }

    try {
      // Reference to the user's document in Firestore
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        // Update with existing wishlist or empty array if none exists
        this.wishlistSubject.next(data?.['wishlist'] || []);
      } else {
        // Create user document if it doesn't exist
        await setDoc(userDocRef, { wishlist: [] });
        this.wishlistSubject.next([]);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      this.wishlistSubject.next([]); // Fallback to empty array on error
    }
  }

  // Add a product to wishlist
  async addToWishlist(product: any): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User must be logged in to add to wishlist');

    try {
      const userDocRef = doc(this.firestore, 'users', user.uid);
      // Use arrayUnion to add the product without duplicates
      await updateDoc(userDocRef, {
        wishlist: arrayUnion(product)
      });
      this.loadWishlist(); // Reload to update local state
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  // Remove a product from wishlist
  async removeFromWishlist(productId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User must be logged in to remove from wishlist');

    try {
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const currentWishlist = this.wishlistSubject.value;
      const updatedWishlist = currentWishlist.filter(item => item.id !== productId);
      
      await updateDoc(userDocRef, {
        wishlist: updatedWishlist
      });
      this.loadWishlist(); // Reload to update local state
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  // Check if a product is in the wishlist
  isInWishlist(productId: string): boolean {
    return this.wishlistSubject.value.some(item => item.id === productId);
  }

  // Get current wishlist count (for badge)
  getWishlistCount(): number {
    return this.wishlistSubject.value.length;
  }

  // Get all wishlist items
  getWishlistItems(): any[] {
    return this.wishlistSubject.value;
  }
}