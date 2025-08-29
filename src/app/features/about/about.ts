import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FirestoreService } from '../auth/firestore.service';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { CartUiService } from '../../services/cart-ui.service';
import { CartService } from '../../services/cart.service';
@Component({
  selector: 'app-about',
  imports: [RouterModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {

  showDropdown = false;
  user: User | null = null;
open: any; 
scrolled: any;

constructor(
    private firestoreService: FirestoreService,
    private router: Router,
    private auth: Auth,
    private cartUi: CartUiService,
    public cartService: CartService
  ) {}

  openCart() {
    this.cartUi.open();
  }
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

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
