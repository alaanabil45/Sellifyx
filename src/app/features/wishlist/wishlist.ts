import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css']
})
export class Wishlist implements OnInit {
  wishlist: any[] = [];

  constructor() { }

  ngOnInit(): void {
    // جلب البيانات من localStorage لو موجودة
    const storedWishlist = localStorage.getItem('wishlist');
    this.wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
  }

  removeFromWishlist(item: any) {
    this.wishlist = this.wishlist.filter(i => i.id !== item.id);
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  addToCart(item: any) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    this.removeFromWishlist(item);
    alert(`${item.name} added to cart!`);
  }
}
