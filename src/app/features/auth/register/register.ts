import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  email: string = '';
  password: string = '';
  message: string = '';
  toastType: string = '';

  constructor(private auth: Auth, private router: Router) {}

  // Email + Password register
  register() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(() => {
        this.showToast('🎉 Account created successfully!', 'success');
        setTimeout(() => this.router.navigate(['/home']), 1500);
      })
      .catch(err => {
        if (err.code === 'auth/email-already-in-use') {
          this.showToast('❌ This email is already registered.', 'error');
        } else if (err.code === 'auth/invalid-email') {
          this.showToast('❌ Invalid email format.', 'error');
        } else if (err.code === 'auth/weak-password') {
          this.showToast('❌ Password should be at least 6 characters.', 'error');
        } else {
          this.showToast('⚠️ ' + err.message, 'error');
        }
      });
  }

  // Google Sign Up
  async registerWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      this.showToast(`🎉 Account created for ${result.user.displayName}`, 'success');
      setTimeout(() => this.router.navigate(['/home']), 1500);
    } catch (err: any) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        this.showToast('❌ This Google account is already registered with a different method.', 'error');
      } else {
        this.showToast('❌ Google Sign Up failed', 'error');
      }
    }
  }

  // Toast helper
  showToast(msg: string, type: string) {
    this.message = msg;
    this.toastType = type;
    setTimeout(() => {
      this.message = '';
      this.toastType = '';
    }, 3000);
  }
}
