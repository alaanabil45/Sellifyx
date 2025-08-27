import { Routes } from '@angular/router';
import { Blogs } from './features/blogs/blogs';
import { Contact } from './features/contact/contact';
import { Support} from './features/support/support';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./features/home/home/home').then(m => m.Home) },
  { path: 'auth/login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'auth/register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register) },
  { path: 'about', loadComponent: () => import('./features/about/about').then(m => m.About) },
  { path: 'support', loadComponent: () => import('./features/support/support').then(m => m.Support)},
  { path: 'contact', loadComponent: () => import('./features/contact/contact').then(m => m.Contact)},
  {path: 'blogs', loadComponent: () => import('./features/blogs/blogs').then(m => m.Blogs)},
  { path: 'support', component: Support },
  { path: 'contact', component: Contact },
  { path: 'blogs', loadComponent: () => import('./features/blogs/blogs').then(m => m.Blogs)},
  { path: 'blog/:id', loadComponent: () => import('./features/blog-details/blog-details').then(m => m.BlogDetails) },
  { path: 'product/:id',loadComponent: () => import('./features/product/product').then(m => m.ProductComponent)},
  { path: 'product/:id', loadComponent: () => import('./features/product/product').then(m => m.ProductComponent) },
  { path: '**', redirectTo: '' },
];
