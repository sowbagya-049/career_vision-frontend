import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your CareerVision account</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              class="form-control"
              formControlName="email"
              placeholder="Enter your email"
              autocomplete="email"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            >
            <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
                 class="error-message">
              Please enter a valid email address
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              class="form-control"
              formControlName="password"
              placeholder="Enter your password"
              autocomplete="current-password"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            >
            <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                 class="error-message">
              Password is required
            </div>
          </div>
          
          <div *ngIf="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary btn-full"
            [disabled]="loginForm.invalid || isLoading"
          >
            <span *ngIf="isLoading" class="spinner"></span>
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/auth/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .auth-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .auth-header h1 {
      color: #1a202c;
      margin-bottom: 8px;
      font-size: 28px;
      font-weight: 700;
    }
    
    .auth-header p {
      color: #718096;
      font-size: 16px;
    }
    
    .form-group {
      margin-bottom: 24px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #1a202c;
      font-weight: 500;
    }
    
    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .form-control.error {
      border-color: #e53e3e;
    }
    
    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
    
    .btn-full {
      width: 100%;
    }
    
    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #ffffff;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 1s ease-in-out infinite;
      margin-right: 8px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .error-message {
      color: #e53e3e;
      font-size: 14px;
      margin-top: 8px;
    }
    
    .alert {
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    
    .alert-error {
      background: #fed7d7;
      color: #742a2a;
      border: 1px solid #feb2b2;
    }
    
    .auth-footer {
      text-align: center;
      margin-top: 24px;
    }
    
    .auth-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }
    
    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['test@example.com', [Validators.required, Validators.email]],
      password: ['password123', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      console.log('🔄 Submitting login form:', this.loginForm.value);
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('✅ Login successful:', response);
          this.isLoading = false;
          if (response.success) {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('❌ Login failed:', error);
          this.isLoading = false;
          this.errorMessage = error.message || 'Login failed. Please try again.';
        }
      });
    } else {
      console.log(' Form is invalid:', this.loginForm.errors);
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}