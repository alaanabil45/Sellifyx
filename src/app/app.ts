import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { CartUiService } from './services/cart-ui.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent, CartDrawerComponent, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
}) 
export class App {
  protected readonly title = signal('sellifyx-clone');
  cartOpen = false;
  cartLoading = false;
  
  cartLoadingMessage = '';
  open: any;
  scrolled: false | undefined;

  constructor(private cartUi: CartUiService) {
    // sync component state to service
    this.cartOpen = this.cartUi.isOpen;
    this.cartUi.isOpen$.subscribe(value => this.cartOpen = value);
    this.cartUi.loading$.subscribe(v => this.cartLoading = v);
    this.cartUi.loadingMessage$.subscribe(m => this.cartLoadingMessage = m);
  }

  onCartClose() {
    this.cartUi.close();
  }
}