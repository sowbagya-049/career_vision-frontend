import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'resume-upload',
    loadComponent: () => import('./resume-upload/resume-upload.component').then(m => m.ResumeUploadComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'timeline',
    loadComponent: () => import('./timeline/timeline.component').then(m => m.TimelineComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'qna',
    loadComponent: () => import('./qna/qna.component').then(m => m.QnaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'recommendations',
    loadComponent: () => import('./recommendations/recommendations.component').then(m => m.RecommendationsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'insights',
    loadComponent: () => import('./insights/insights.component').then(m => m.InsightsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
