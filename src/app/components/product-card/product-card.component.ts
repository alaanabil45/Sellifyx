import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartUiService } from '../../services/cart-ui.service';
import { Router } from '@angular/router'; // Import Router


@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.css']
})
export class ProductCardComponent {
  @Input() product: any;
  isLoading = false;

  constructor(private cartService: CartService, private cartUi: CartUiService, private router: Router) {}

  addToCart() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.cartUi.showLoading('Loading to cart...');
    setTimeout(() => {
      const productToAdd = {
        ...this.product,
        // Extract only numeric part from price string before converting to Number
        price: Number(this.product.price.toString().replace(/[^0-9.]/g, '')) || 0,
        quantity: 1 // Always add 1 when first adding to cart, service handles increments
      };
      this.cartService.addToCart(productToAdd);
      this.cartUi.hideLoading();
      this.cartUi.open();
      this.isLoading = false;
    }, 600);
  }

  viewProductDetails() {
    this.router.navigate(['/product', this.product.id]);
  }
}

