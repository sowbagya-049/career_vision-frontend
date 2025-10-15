import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

// Guard to protect routes that require 
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuth = this.authService.isAuthenticated();
    console.log('🛡️ AuthGuard check:', isAuth);
    
    if (isAuth) {
      return true;
    } else {
      console.log('🚫 Access denied, redirecting to login');
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}