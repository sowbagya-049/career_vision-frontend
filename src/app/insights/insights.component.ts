import { Component, OnInit } from '@angular/core';
import { InsightsService, Insight, AnalyticsData } from './insights.service';

// Insights component to display career insights and analytics
@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit {
  // Insights data
  insights: Insight[] = [];
  analyticsData: AnalyticsData | null = null;
  
  // Loading states
  isLoadingInsights = false;
  isLoadingAnalytics = false;
  errorMessage = '';
  
  // Chart data (will be used by chart components)
  careerGapsData: any[] = [];
  skillsData: any[] = [];
  growthData: any[] = [];
  comparisonData: any[] = [];

  constructor(private insightsService: InsightsService) {}

  ngOnInit(): void {
    this.loadInsights();
    this.loadAnalytics();
  }

  loadInsights(): void {
    this.isLoadingInsights = true;
    this.errorMessage = '';

    this.insightsService.getCareerInsights().subscribe({
      next: (insights) => {
        console.log('✅ Insights loaded:', insights);
        this.insights = insights;
        this.isLoadingInsights = false;
      },
      error: (error) => {
        console.error('❌ Error loading insights:', error);
        this.errorMessage = 'Failed to load insights. Please try again.';
        this.isLoadingInsights = false;
      }
    });
  }

  loadAnalytics(): void {
    this.isLoadingAnalytics = true;

    this.insightsService.getAnalyticsData().subscribe({
      next: (data) => {
        console.log('✅ Analytics data loaded:', data);
        this.analyticsData = data;
        
        // Prepare data for charts
        this.careerGapsData = data.careerGaps;
        this.skillsData = data.skillsDistribution;
        this.growthData = data.careerGrowthTrend;
        this.comparisonData = data.industryComparison;
        
        this.isLoadingAnalytics = false;
      },
      error: (error) => {
        console.error('❌ Error loading analytics:', error);
        this.isLoadingAnalytics = false;
      }
    });
  }

  retryLoad(): void {
    this.loadInsights();
    this.loadAnalytics();
  }

  getInsightsByType(type: string): Insight[] {
    return this.insights.filter(insight => insight.type === type);
  }

  getInsightIcon(type: string): string {
    const icons = {
      strength: '💪',
      gap: '⚠️',
      recommendation: '💡',
      trend: '📈'
    };
    return icons[type as keyof typeof icons] || '📊';
  }

  getInsightColor(type: string): string {
    const colors = {
      strength: '#48bb78',
      gap: '#f56565',
      recommendation: '#ed8936',
      trend: '#4299e1'
    };
    return colors[type as keyof typeof colors] || '#718096';
  }

  getScoreColor(score: number): string {
    if (score >= 80) return '#48bb78';
    if (score >= 60) return '#ed8936';
    return '#f56565';
  }
}