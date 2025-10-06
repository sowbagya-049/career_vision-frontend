import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join CareerVision to plan your future</p>
        </div>
        
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                class="form-control"
                formControlName="firstName"
                placeholder="First name"
                autocomplete="given-name"
                [class.error]="signupForm.get('firstName')?.invalid && signupForm.get('firstName')?.touched"
              >
              <div *ngIf="signupForm.get('firstName')?.invalid && signupForm.get('firstName')?.touched" 
                   class="error-message">
                First name is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                class="form-control"
                formControlName="lastName"
                placeholder="Last name"
                autocomplete="family-name"
                [class.error]="signupForm.get('lastName')?.invalid && signupForm.get('lastName')?.touched"
              >
              <div *ngIf="signupForm.get('lastName')?.invalid && signupForm.get('lastName')?.touched" 
                   class="error-message">
                Last name is required
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              class="form-control"
              formControlName="email"
              placeholder="Enter your email"
              autocomplete="email"
              [class.error]="signupForm.get('email')?.invalid && signupForm.get('email')?.touched"
            >
            <div *ngIf="signupForm.get('email')?.invalid && signupForm.get('email')?.touched" 
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
              placeholder="Create a password"
              autocomplete="new-password"
              [class.error]="signupForm.get('password')?.invalid && signupForm.get('password')?.touched"
            >
            <div *ngIf="signupForm.get('password')?.invalid && signupForm.get('password')?.touched" 
                 class="error-message">
              Password must be at least 6 characters long
            </div>
          </div>
          
          <div *ngIf="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary btn-full"
            [disabled]="signupForm.invalid || isLoading"
          >
            <span *ngIf="isLoading" class="spinner"></span>
            {{ isLoading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/auth/login">Sign in</a></p>
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
      max-width: 450px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }
    
    .form-row {
      display: flex;
      gap: 16px;
    }
    
    .form-row .form-group {
      flex: 1;
    }
    
    .form-group {
      margin-bottom: 20px;
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
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
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
    
    .error-message {
      color: #e53e3e;
      font-size: 14px;
      margin-top: 5px;
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
  `]
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['John', [Validators.required, Validators.minLength(2)]],
      lastName: ['Doe', [Validators.required, Validators.minLength(2)]],
      email: ['john.doe@example.com', [Validators.required, Validators.email]],
      password: ['password123', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      console.log('🔄 Submitting signup form:', this.signupForm.value);
      
      this.authService.signup(this.signupForm.value).subscribe({
        next: (response) => {
          console.log('✅ Signup successful:', response);
          this.isLoading = false;
          if (response.success) {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('❌ Signup failed:', error);
          this.isLoading = false;
          this.errorMessage = error.message || 'Signup failed. Please try again.';
        }
      });
    } else {
      console.log('❌ Form is invalid');
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}