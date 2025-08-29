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
    imageUrl: 'https://www.w3schools.com/howto/img_avatar.png', // الصورة ثابتة
    name: '',
    email: '',
    bio: 'Passionate about technology, data science, and innovation.',
    phone: '',
    location: '',
    orders: []
  };

  editField: any = {
    bio: false,
    phone: false,
    location: false
  };

  constructor(private auth: Auth) {}

  ngOnInit() {
   
    onAuthStateChanged(this.auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        this.user.name = firebaseUser.displayName || 'User';
        this.user.email = firebaseUser.email || '';
   
      }
    });
  }

  toggleEdit(field: string) {
    this.editField[field] = !this.editField[field];
  }

  saveField(field: string) {
    this.editField[field] = false;
  }

  changePhoto(event: any) {
  }
}

