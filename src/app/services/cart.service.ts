import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  constructor() {
    // Optionally load cart from local storage here if needed
  }

  private saveCart() {
    this.itemsSubject.next(this.itemsSubject.getValue());
  }

  getCart() {
    return this.itemsSubject.getValue();
  }

  addToCart(product: CartItem) {
    const currentItems = this.itemsSubject.getValue();
    const existing = currentItems.find(i => i.id === product.id);
    if (existing) {
      const updatedItems = currentItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      this.itemsSubject.next(updatedItems);
    } else {
      const newCart = [...currentItems, { ...product, quantity: 1 }];
      this.itemsSubject.next(newCart);
    }
  }

  removeFromCart(id: number) {
    const updatedItems = this.itemsSubject.getValue().filter(i => i.id !== id);
    this.itemsSubject.next(updatedItems);
  }

  clearCart() {
    this.itemsSubject.next([]);
  }

  updateQuantity(id: number, delta: number) {
    const currentItems = this.itemsSubject.getValue();
    const updatedItems = currentItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) {
          return null; // Mark for removal
        } else {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    }).filter(Boolean) as CartItem[]; // Filter out nulls and cast back
    this.itemsSubject.next(updatedItems);
  }

  getTotalQuantity(): number {
    return this.itemsSubject.getValue().reduce((sum, i) => sum + i.quantity, 0);
  }

  getSubtotal(): number {
    return this.itemsSubject.getValue().reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
}
