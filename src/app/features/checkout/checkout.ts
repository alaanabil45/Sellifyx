// checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service'; // Updated import

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = []; // Use your CartItem interface
  subtotal: number = 0;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService, // Your cart service
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.loadCartItems();
    this.initForm();
  }

  loadCartItems(): void {
    this.cartItems = this.cartService.getCart(); // Use getCart() instead of getCartItems()
    this.subtotal = this.cartService.getSubtotal(); // Use getSubtotal() instead of getTotalPrice()
  }

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

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      this.loading = true;
      console.log('Order placed:', this.checkoutForm.value);
      
      // Simulate API call
      setTimeout(() => {
        this.loading = false;
        this.cartService.clearCart(); // Use your clearCart method
        this.router.navigate(['/order-confirmation']);
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.checkoutForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get formControls() {
    return this.checkoutForm.controls;
  }
}