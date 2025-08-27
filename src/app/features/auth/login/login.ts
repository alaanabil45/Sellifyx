import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email: string = '';
  password: string = '';
  message: string = '';
  toastType: string = ''; // success | error

  constructor(private auth: Auth, private router: Router) {}

  login() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then(() => {
        this.showToast('✅ Logged in successfully!', 'success');
        setTimeout(() => this.router.navigate(['/home']), 1500);
      })
      .catch(err => {
        if (err.code === 'auth/user-not-found') {
          this.showToast('❌ No account found. Please Sign Up first.', 'error');
        } else {
          this.showToast('⚠️ ' + err.message, 'error');
        }
      });
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      this.showToast(`🎉 Welcome ${result.user.displayName}`, 'success');
      setTimeout(() => this.router.navigate(['/home']), 1500);
    } catch (err: any) {
      this.showToast('❌ Google login failed', 'error');
    }
  }

  // دالة لإظهار التوست + اخفاءه بعد 3 ثواني
  showToast(msg: string, type: string) {
    this.message = msg;
    this.toastType = type;
    setTimeout(() => {
      this.message = '';
      this.toastType = '';
    }, 6000);
  }
}
