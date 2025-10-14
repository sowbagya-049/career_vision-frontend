import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

export interface Insight {
  id: string;
  type: 'strength' | 'gap' | 'recommendation' | 'trend';
  title: string;
  description: string;
  score: number;
}

export interface CareerGapData {
  year: string;
  activeMonths: number;
}

export interface SkillDistribution {
  skill: string;
  count: number;
}

export interface CareerGrowthData {
  year: string;
  skillLevel: number;
  experienceLevel: number;
}

export interface IndustryComparison {
  metric: string;
  user: number;
  industry: number;
}

export interface AnalyticsData {
  careerGaps: CareerGapData[];
  skillsDistribution: SkillDistribution[];
  careerGrowthTrend: CareerGrowthData[];
  industryComparison: IndustryComparison[];
}

@Injectable({
  providedIn: 'root'
})
export class InsightsService {
  constructor(private apiService: ApiService) {}

  // Get career insights
  getCareerInsights(): Observable<Insight[]> {
    return this.apiService.get<Insight[]>('/insights/career').pipe(
      map(response => response.data || [])
    );
  }

  // Get analytics data for charts
  getAnalyticsData(): Observable<AnalyticsData> {
    return this.apiService.get<AnalyticsData>('/insights/analytics').pipe(
      map(response => response.data || {
        careerGaps: [],
        skillsDistribution: [],
        careerGrowthTrend: [],
        industryComparison: []
      })
    );
  }

  // Get career report
  getCareerReport(): Observable<any> {
    return this.apiService.post<any>('/insights/report', {}).pipe(
      map(response => response.data)
    );
  }
}