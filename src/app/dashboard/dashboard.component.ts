import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { DashboardService } from './dashboard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser$: Observable<any>;
  
  // Stats
  resumesUploaded = 0;
  milestonesTracked = 0;
  recommendationsCount = 0;
  careerScore = 0;
  profileCompleteness = 0;
  
  // Loading state
  isLoading = true;
  errorMessage = '';

  // Quick actions with routing
  quickActions = [
    {
      icon: '📄',
      title: 'Upload Resume',
      description: 'Upload your resume or documents to extract career milestones',
      route: '/resume-upload',
      color: '#667eea'
    },
    {
      icon: '📈',
      title: 'Career Timeline',
      description: 'Visualize your career journey with an interactive timeline',
      route: '/timeline',
      color: '#f56565'
    },
    {
      icon: '💬',
      title: 'Ask Questions',
      description: 'Get insights about career gaps, skills, and opportunities',
      route: '/qna',
      color: '#48bb78'
    },
    {
      icon: '🎯',
      title: 'Recommendations',
      description: 'Discover jobs and courses tailored to your profile',
      route: '/recommendations',
      color: '#ed8936'
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'View detailed insights and analytics about your career',
      route: '/insights',
      color: '#9f7aea'
    }
  ];

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    console.log('📊 Dashboard component loaded');
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        console.log('✅ Dashboard stats loaded:', stats);
        this.milestonesTracked = stats.totalMilestones || 0;
        this.recommendationsCount = stats.totalRecommendations || 0;
        this.resumesUploaded = stats.resumesUploaded || 0;
        this.careerScore = stats.overallScore || 0;
        this.profileCompleteness = stats.profileCompleteness || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading dashboard stats:', error);
        this.errorMessage = 'Failed to load dashboard data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  retryLoad(): void {
    this.loadDashboardStats();
  }

  getCompletenessColor(): string {
    if (this.profileCompleteness >= 80) return '#48bb78';
    if (this.profileCompleteness >= 60) return '#ed8936';
    return '#f56565';
  }

  getScoreColor(): string {
    if (this.careerScore >= 80) return '#48bb78';
    if (this.careerScore >= 60) return '#ed8936';
    return '#f56565';
  }
}