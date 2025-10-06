import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { InsightService } from './insights.service';
import { InsightData } from './insights.module'; // ✅ use shared model instead of inline interface

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit {
  insightData$!: Observable<InsightData | null>; // ✅ cleaner declaration
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private insightService: InsightService) {}

  ngOnInit(): void {
    this.loadInsights();
  }

  loadInsights(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.insightData$ = this.insightService.getInsights().pipe(
      map(data => {
        this.isLoading = false;
        return data;
      }),
      catchError(error => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load insights. Please try again later.';
        console.error('Error loading insights:', error);
        return of(null); // ✅ gracefully handle errors
      })
    );
  }
}
