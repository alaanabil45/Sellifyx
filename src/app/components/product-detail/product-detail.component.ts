import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {  
  
  productId: string | null = null;
  product: any; // You would fetch actual product data here

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      // In a real application, you would fetch product details using this.productId
      // For now, let's simulate some data
      this.product = {
        id: this.productId,
        name: 'Sports digital watch',
        category: 'Technology',
        description: 'Rugged digital sports watch with stopwatch, backlight, water resistance, alarm, and durable design—perfect for workouts and outdoor adventures.',
        price: 129.99, 
        image: 'https://via.placeholder.com/400',
      };
    });
  }
}
