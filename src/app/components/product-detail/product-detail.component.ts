import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { FirestoreService } from '../../features/auth/firestore.service';
import { CartService } from '../../services/cart.service';
import { CartUiService } from '../../services/cart-ui.service';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  productId: string | null = null;
  product: any = null;
  isLoading: any;
  showDropdown = false;
  user: User | null = null;
  scrolled: any;
  open = false;

  testimonials = [
    { name: 'Jhon Makkaw', comment: 'This shockproof camera bag is a game-changer! It’s durable, protective, and has plenty of space for all my gear. The compartments keep everything organized, while the comfortable straps make it easy to carry. Perfect for photographers on the go who need reliability and style in one bag.', rating: 5 },
    { name: 'David Foster', comment: 'I love this smart table clock! It’s sleek and functional, displaying time, temperature, and alarms effortlessly. The wireless charging feature is a game-changer, keeping my phone charged while I sleep. The design fits perfectly on my desk, blending style and technology. Highly recommend for modern spaces!', rating: 4 },
    { name: 'Emma Lawson', comment: 'These headphones are absolutely fantastic! The sound quality is rich and well-balanced, with deep bass and clear highs that make listening to music a real pleasure. The noise isolation works incredibly well, blocking out background noise so I can focus on my work or enjoy my favorite playlists without distractions.', rating: 5 },
    { name: 'Jason Mitchell', comment: 'I couldn’t be happier with these headphones! The battery life is outstanding—I can go days without needing to recharge. The wireless connection is seamless, with no lag or dropouts, making them perfect for both work calls and gaming. The build quality feels premium, and the ear cushions are so soft and comfortable.', rating: 4 },
  ];

  carouselInterval: any;
  isHovering = false;
  loading = true;


  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    public cartService: CartService,
    private cartUi: CartUiService,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      this.productId = params.get('id');
      if (this.productId) {
        const docRef = doc(this.firestore, `products/${this.productId}`);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) this.product = snapshot.data();
        else console.log('Product not found!');
      }
    });

    this.loadGearProducts();

    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });
  }

  ngAfterViewInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    if (this.carouselInterval) clearInterval(this.carouselInterval);
  }

  // الكاروسيل التلقائي
  startCarousel() {
    const container = document.querySelector<HTMLElement>('.testimonial-wrapper');
    if (!container) return;

    const scrollAmount = container.children[0]?.clientWidth + 20 || 300; // عرض كل testimonial + gap
    this.carouselInterval = setInterval(() => {
      if (!this.isHovering) {
        container.scrollLeft += scrollAmount;
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollLeft = 0;
        }
      }
    }, 3000); // كل 3 ثواني يتحرك testimonial واحد
  }

  onHover() { this.isHovering = true; }
  onLeave() { this.isHovering = false; }

  scrollLeft() {
    const container = document.querySelector<HTMLElement>('.testimonial-wrapper');
    if (!container) return;
    const scrollAmount = container.children[0]?.clientWidth + 20 || 270;
    container.scrollLeft -= scrollAmount;
  }

  scrollRight() {
    const container = document.querySelector<HTMLElement>('.testimonial-wrapper');
    if (!container) return;
    const scrollAmount = container.children[0]?.clientWidth + 20 || 270;
    container.scrollLeft += scrollAmount;
  }

  loadGearProducts() {
    this.loading = true;
    this.firestoreService.getGearProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }

  // Cart & User functions
  openCart() { this.cartUi.open(); }

  addToCart(product: any) {
  // نضيف خاصية isLoading على المنتج نفسه
  if (product.isLoading) return;

  product.isLoading = true;
  this.cartUi.showLoading('Loading to cart...');

  setTimeout(() => {
    const productToAdd = {
      ...product,
      price: Number(product.price.toString().replace(/[^0-9.]/g, '')) || 0,
      quantity: 1
    };

    this.cartService.addToCart(productToAdd);
    this.cartUi.hideLoading();
    this.cartUi.open();
    product.isLoading = false; // بس المنتج ده يرجع عادي
  }, 600);
}


  categories: string[] = ['all', 'technology', 'accessory', 'geer'];
  activeCategory: string = 'all';
  products: any[] = [];
  filteredProducts: any[] = [];

  setCategory(cat: string) {
    this.activeCategory = cat;
    this.filterProducts(cat);
  }

  private filterProducts(cat: string) {
    if (cat === 'all') this.filteredProducts = this.products;
    else this.filteredProducts = this.products.filter(p => p.category === cat);
  }

  toggleDropdown() { this.showDropdown = !this.showDropdown; }

  logout() {
    if (this.user) {
      signOut(this.auth).then(() => {
        this.router.navigate(['/auth/login']);
        this.showDropdown = false;
      });
    }
  }

  goToLogin() { this.router.navigate(['/auth/login']); this.showDropdown = false; }

  get username() { return this.user?.displayName || this.user?.email || 'User'; }

  goToProduct(id: number) { this.router.navigate(['/productdetails', id]); }
}
