import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FirestoreService } from '../auth/firestore.service';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.html',
  styleUrls: ['./blogs.css'],
  imports: [CommonModule, RouterModule],
})
export class Blogs {

  blogs = [
    {
      id: 1,
      date: 'April 19, 2025',
      description: 'Top 10 Smart Home Gadgets for 2025',
      image: 'https://cdn.prod.website-files.com/67f0f4a4be1df2493a57a2d9/67f60e3efdf9d9be455f60f2_Home%20Gedget.webp'
    },
    {
      id: 2,
      date: 'April 12, 2025',
      description: 'How 5G Will Revolutionize Smart Devices in 2025',
      image: 'https://cdn.prod.website-files.com/67f0f4a4be1df2493a57a2d9/67f60e187163a2672fa4defd_Smart%20Device.webp'
    },
    {
      id: 3,
      date: 'April 5, 2025',
      description: '5 Tech Gadgets to Boost Your Productivity in 2025',
      image: 'https://cdn.prod.website-files.com/67f0f4a4be1df2493a57a2d9/67f60de60d6e594ba250cce1_Productivity.webp'
    },
    {
      id: 4,
      date: 'March 14, 2025',
      description: "Seasonal Sale: Best Deals You Can't Miss",
      image: 'https://cdn.prod.website-files.com/67f0f4a4be1df2493a57a2d9/67f60dad9013cc25ca0b28dd_Deals.webp'
    },
    {
      id: 5,
      date: 'March 12, 2025',
      description: 'How to Choose the Perfect Gift for Any Occasion',
      image: 'https://cdn.prod.website-files.com/67f0f4a4be1df2493a57a2d9/67f60d612c980f5579485875_Gift.webp'
    },
  ];


  constructor(
    private firestoreService: FirestoreService,
    private router: Router,
    private auth: Auth
  ) {}


showDropdown = false;
  user: User | null = null;
open: any;
scrolled: any;

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

  readMore(blogId: number) {
    alert('Opening blog with ID: ' + blogId);
  }
}
