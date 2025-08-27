import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FirestoreService } from '../../auth/firestore.service';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  products: any[] = [];
  loading = true;

  // User Dropdown
  showDropdown = false;
  user: User | null = null;
open: any;
scrolled: any;

  constructor(
    private firestoreService: FirestoreService,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit() {
    this.loadGearProducts();

    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });
  }

  loadGearProducts() {
    this.loading = true;
    this.firestoreService.getGearProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }

  goToProduct(id: string) {
    this.router.navigate(['/product', id]);
  }

  // Dropdown
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
