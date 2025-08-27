import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = ['all', 'technology', 'accessory', 'geer'];
  activeCategory: string = 'all';
  showDropdown = false;
  user: User | null = null;
open: any;
scrolled: any;

  constructor(
    private firestore: Firestore, 
    private route: ActivatedRoute, 
    private router: Router, 
    private auth: Auth
  ) {}

  ngOnInit() {
    const categoryFromRoute = this.route.snapshot.paramMap.get('id'); 

    const productsRef = collection(this.firestore, 'products');
    collectionData(productsRef, { idField: 'id' }).subscribe((data: any[]) => {
      this.products = data;
      
      if (categoryFromRoute) {
        this.activeCategory = categoryFromRoute;
        this.filterProducts(categoryFromRoute);
      } else {
        this.filteredProducts = this.products; // كل المنتجات
      }
    });

    // ✅ متابعة المستخدم
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });
  }

  setCategory(cat: string) {
    this.activeCategory = cat;
    this.filterProducts(cat);
  }

  private filterProducts(cat: string) {
    if (cat === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.category === cat);
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  goToProduct(id: string) {
    this.router.navigate(['/product', id]);
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
