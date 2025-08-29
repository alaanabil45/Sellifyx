import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { CartService } from '../../services/cart.service';
import { CartUiService } from '../../services/cart-ui.service';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {  
  productId: string | null = null;
  product: any = null;
  isLoading: any;
  showDropdown = false;
  user: User | null = null;
open: any;
scrolled: any;

  constructor(private route: ActivatedRoute, private router: Router, private firestore: Firestore,public cartService: CartService, private cartUi: CartUiService,private auth: Auth,) {}

  openCart() {
    this.cartUi.open();
  }
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
  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      this.productId = params.get('id');

      if (this.productId) {
        const docRef = doc(this.firestore, `products/${this.productId}`);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          this.product = snapshot.data();
        } else {
          console.log('Product not found!');
        }
      }
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  // Open cart like Webflow when clicking cart icon in header


  logout() {
    if (this.user) {
      signOut(this.auth).then(() => {
        this.router.navigate(['/auth/login']);
        this.showDropdown = false;
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
    this.showDropdown = false;
  }

  get username() {
    return this.user?.displayName || this.user?.email || 'User';
  }
}
