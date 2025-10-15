import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from '../core/services/api.service';

// Interfaces for dashboard data
export interface DashboardStats {
  totalMilestones: number;
  totalRecommendations: number;
  resumesUploaded: number;
  overallScore: number;
  profileCompleteness: number;
}

export interface CareerReport {
  generatedAt: string;
  userId: string;
  summary: DashboardStats;
  insights: any[];
  topRecommendations: any[];
  careerTimeline: any[];
  analytics: any;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private apiService: ApiService) {}

  // Get dashboard statistics
  getDashboardStats(): Observable<DashboardStats> {
    return this.apiService.post<CareerReport>('/insights/report', {}).pipe(
      map(response => response.data?.summary || {
        totalMilestones: 0,
        totalRecommendations: 0,
        resumesUploaded: 0,
        overallScore: 0,
        profileCompleteness: 0
      })
    );
  }

  // Get full career report
  getCareerReport(): Observable<CareerReport> {
    return this.apiService.post<CareerReport>('/insights/report', {}).pipe(
      map(response => response.data!)
    );
  }
}