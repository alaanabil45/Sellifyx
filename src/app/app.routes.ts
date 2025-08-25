import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./features/home/home/home').then(m => m.Home) },
  { path: 'auth/login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'auth/register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register) },
  { path: 'about', loadComponent: () => import('./features/about/about').then(m => m.About) },
  { path: 'support', loadComponent: () => import('./features/support/support').then(m => m.Support)},
  { path: 'contact', loadComponent: () => import('./features/contact/contact').then(m => m.Contact)},
  { path: '**', redirectTo: '' },
];
