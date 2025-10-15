import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { InsightsComponent } from './insights/insights.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ResumeUploadComponent } from './resume-upload/resume-upload.component';
import { QnaComponent } from './qna/qna.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/signup', component: SignupComponent },
  { path: 'insights', component: InsightsComponent },
  { path: 'timeline', component: TimelineComponent },
  { path: 'resume-upload', component: ResumeUploadComponent },
  { path: 'qna', component: QnaComponent },
  { path: 'recommendations', loadComponent: () => import('./recommendations/recommendations.component').then(m => m.RecommendationsComponent) },
  { path: '**', redirectTo: '/dashboard' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
