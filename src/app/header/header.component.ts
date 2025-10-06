import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { User } from '../core/models/user.model';

@Component({
  selector: 'app-header',
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <!-- Logo / Brand -->
          <div class="logo">
            <h2 routerLink="/dashboard">CareerVision</h2>
          </div>

          <!-- Navigation -->
          <nav class="nav">
            <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            <a routerLink="/resume-upload" routerLinkActive="active">Resume</a>
            <a routerLink="/timeline" routerLinkActive="active">Timeline</a>
            <a routerLink="/qna" routerLinkActive="active" *ngIf="isAuthenticated$ | async">Q&A</a>
            <a routerLink="/recommendations" routerLinkActive="active" *ngIf="isAuthenticated$ | async">Jobs & Courses</a>
            <a routerLink="/insights" routerLinkActive="active">Insights</a>
            
            <!-- Show Login only if NOT authenticated -->
            <a routerLink="/auth/login" routerLinkActive="active" *ngIf="!(isAuthenticated$ | async)">Login</a>
          </nav>

          <!-- User Info + Logout -->
          <div class="user-menu" *ngIf="isAuthenticated$ | async">
            <div class="user-info" *ngIf="currentUser$ | async as user">
              <span>{{ user.firstName }} {{ user.lastName }}</span>
              <button class="btn btn-logout" (click)="logout()">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      z-index: 1000;
      height: 70px;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
    }

    .logo h2 {
      color: #667eea;
      cursor: pointer;
      margin: 0;
      font-weight: 700;
      font-size: 24px;
    }

    .nav {
      display: flex;
      gap: 24px;
    }

    .nav a {
      text-decoration: none;
      color: #4a5568;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .nav a:hover,
    .nav a.active {
      color: #667eea;
      background: rgba(102, 126, 234, 0.1);
    }

    .user-menu {
      display: flex;
      align-items: center;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-info span {
      color: #4a5568;
      font-weight: 500;
    }

    .btn-logout {
      background: none;
      border: 2px solid #e2e8f0;
      color: #4a5568;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-logout:hover {
      border-color: #667eea;
      color: #667eea;
    }

    @media (max-width: 768px) {
      .nav {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    this.authService.logout();
  }
}
