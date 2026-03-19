import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'mind-maps', pathMatch: 'full' },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.Register),
    canActivate: [guestGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
    canActivate: [guestGuard]
  },
  {
    path: 'mind-maps',
    loadComponent: () => import('./pages/mind-map-list/mind-map-list').then(m => m.MindMapList),
    canActivate: [authGuard]
  },
  {
    path: 'mind-maps/:id',
    loadComponent: () => import('./pages/mind-map-editor/mind-map-editor').then(m => m.MindMapEditor),
    canActivate: [authGuard]
  }
];
