// checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { CartUiService } from '../../services/cart-ui.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup; // Use definite assignment
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  loading: boolean = false;
  showDropdown: boolean = false;
  user: User | null = null;
  scrolled: any;
 open: any; 

  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
    private auth: Auth,
    private router: Router,
    private cartUi: CartUiService
  ) {}

  ngOnInit(): void {
    // Listen to auth state
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });

    this.loadCartItems();
    this.initForm();
  }

  // Load cart items and subtotal safely
  loadCartItems(): void {
    if (this.cartService.getCart) {
      this.cartItems = this.cartService.getCart();
    }
    if (this.cartService.getSubtotal) {
      this.subtotal = this.cartService.getSubtotal();
    }
  }

  // Initialize checkout form with validators
  initForm(): void {
    this.checkoutForm = this.fb.group({
      // Personal Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],

      // Shipping Address
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}(-[0-9]{4})?$/)]],
      country: ['', Validators.required],

      // Payment Information
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]],
      cardName: ['', Validators.required],

      // Additional Options
      sameAsShipping: [true],
      saveInfo: [false]
    });
  }

  // Form submission
  onSubmit(): void {
    if (this.checkoutForm.valid) {
      this.loading = true;
      console.log('Order placed:', this.checkoutForm.value);

      setTimeout(() => {
        this.loading = false;
        this.cartService.clearCart?.(); // safe call
        this.router.navigate(['/home']);
      }, 2000);
    } else {
      this.markFormGroupTouched(this.checkoutForm);
    }
  }

  // Mark all controls as touched to show validation errors
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Dropdown toggle
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  // Open cart UI
  openCart() {
    this.cartUi.open?.(); // safe call
  }

  // Logout
  logout() {
    if (this.user) {
      signOut(this.auth).then(() => {
        this.router.navigate(['/auth/login']);
        this.showDropdown = false;
      });
    }
  }

  // Navigate to login
  goToLogin() {
    this.router.navigate(['/auth/login']);
    this.showDropdown = false;
  }

  // Get username display
  get username(): string {
    return this.user?.displayName || this.user?.email || 'User';
  }

  // Shortcut to access form controls in template
  get formControls() {
    return this.checkoutForm.controls;
  }
}
