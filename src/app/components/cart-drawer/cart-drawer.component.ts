import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],   // مهم عشان *ngFor و *ngIf
  templateUrl: './cart-drawer.component.html',
  styleUrls: ['./cart-drawer.css']
})
export class CartDrawerComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  items: CartItem[] = [];
  private cartSubscription: Subscription = new Subscription();

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartSubscription = this.cartService.items$.subscribe(items => {
      this.items = items;
    });
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

  get subtotal(): number {
    return this.cartService.getSubtotal();
  }

  toggleCart() {
    if (this.isOpen) {
      this.close.emit();
    }
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  increment(id: number) {
    this.cartService.updateQuantity(id, 1);
  }

  decrement(id: number) {
    this.cartService.updateQuantity(id, -1);
  }

  checkout() {
    alert('Proceeding to checkout!');
    this.cartService.clearCart();
    this.close.emit();
  }

  trackByCartItem(index: number, item: CartItem): number {
    return item.id;
  }
}

