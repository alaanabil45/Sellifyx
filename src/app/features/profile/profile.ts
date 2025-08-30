import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  imports: [CommonModule, FormsModule]
})
export class ProfileComponent implements OnInit {
  user: any = {
    imageUrl: 'https://www.w3schools.com/howto/img_avatar.png',
    name: '',
    email: '',
    bio: 'Passionate about technology, data science, and innovation.',
    phone: '',
    location: '',
    orders: [
      { name: 'Order #1234', status: 'Delivered', date: 'Apr 5, 2023' },
      { name: 'Order #5678', status: 'Shipped', date: 'Mar 27, 2023' }
    ]
  };

  editField: any = {
    bio: false,
    phone: false,
    location: false
  };

  open: boolean = false;
  showDropdown: boolean = false;
  scrolled: boolean = false;
  username: string = '';

  constructor(private auth: Auth) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        this.user.name = firebaseUser.displayName || 'User';
        this.user.email = firebaseUser.email || '';
        this.username = this.user.name;
      }
    });

   
    window.addEventListener('scroll', () => {
      this.scrolled = window.scrollY > 50;
    });
  }

  toggleEdit(field: string) {
    this.editField[field] = !this.editField[field];
  }

  saveField(field: string) {
    this.editField[field] = false;
    console.log(`Saved ${field}:`, this.user[field]);

  }

  changePhoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.imageUrl = e.target.result;
        console.log('Photo changed!');
      };
      reader.readAsDataURL(file);
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this.auth.signOut();
  }

  goToLogin() {
    
    console.log('Redirecting to login...');
  }

  openCart() {
    console.log('Opening cart...');
  }
}
