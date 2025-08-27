import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  provider = new GoogleAuthProvider();

  // Login with Google
  async loginWithGoogle() {
    try {
      return await signInWithPopup(this.auth, this.provider);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  
  // Logout
  async logout() {
    return await signOut(this.auth);
  }
}
