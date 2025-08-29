import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { FirestoreService } from '../auth/firestore.service';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { CartUiService } from '../../services/cart-ui.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {
  name = '';
  email = '';
  message = '';

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

 onSubmit(form: any) {
  if (form.invalid) {
    alert('Please fill out all required fields');
    return;
  }
  alert('Form submitted successfully!');
}

}
