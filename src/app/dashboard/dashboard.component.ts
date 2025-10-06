import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <div class="container">
        <div class="dashboard-header">
          <h1>Welcome back, {{ (currentUser$ | async)?.firstName || 'User' }}!</h1>
          <p>Track your career progress and discover new opportunities</p>
        </div>
        
        <div class="dashboard-grid">
          <div class="dashboard-card" routerLink="/resume-upload">
            <div class="card-icon">📄</div>
            <h3>Upload Resume</h3>
            <p>Upload your resume or documents to extract career milestones</p>
          </div>
          
          <div class="dashboard-card"  routerLink="/timeline">
            <div class="card-icon">📈</div>
            <h3>Career Timeline</h3>
            <p>Visualize your career journey with an interactive timeline</p>
            <small>Coming Soon</small>
          </div>
          
          <div class="dashboard-card"     routerLink="/qna">
            <div class="card-icon">💬</div>
            <h3>Ask Questions</h3>
            <p>Get insights about career gaps, skills, and opportunities</p>
            <small>Coming Soon</small>
          </div>
          
          <div class="dashboard-card" routerLink="/recommendations">
            <div class="card-icon">🎯</div>
            <h3>Recommendations</h3>
            <p>Discover jobs and courses tailored to your profile</p>
            <small>Coming Soon</small>
          </div>
        </div>
        
        <div class="quick-stats">
          <div class="stat-card">
            <h3>0</h3>
            <p>Resumes Uploaded</p>
          </div>
          <div class="stat-card">
            <h3>0</h3>
            <p>Milestones Tracked</p>
          </div>
          <div class="stat-card">
            <h3>0</h3>
            <p>Recommendations</p>
          </div>
          <div class="stat-card">
            <h3>0</h3>
            <p>Career Score</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 40px 0;
      min-height: calc(100vh - 70px);
      background: linear-gradient(135deg, #07154aff 0%, #764ba2 100%);
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .dashboard-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .dashboard-header h1 {
      color: white;
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .dashboard-header p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 18px;
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }
    
    .dashboard-card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      color: inherit;
      position: relative;
    }
    
    .dashboard-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }
    
    .card-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    
    .dashboard-card h3 {
      color: #1a202c;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .dashboard-card p {
      color: #718096;
      line-height: 1.6;
      margin-bottom: 8px;
    }
    
    .dashboard-card small {
      color: #ed8936;
      font-weight: 600;
      font-size: 12px;
    }
    
    .quick-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }
    
    .stat-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .stat-card h3 {
      color: white;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .stat-card p {
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser$: Observable<any>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    console.log('📊 Dashboard component loaded');
  }
}