import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { InsightData } from './insights.module'; // ✅ import shared interface

@Injectable({
  providedIn: 'root'
})
export class InsightService {
  private apiUrl = '/api/insights'; // Adjust your API endpoint

  constructor(private http: HttpClient) {}

  getInsights(): Observable<InsightData> {
    // ✅ Real HTTP request (uncomment when API is ready)
    // return this.http.get<InsightData>(this.apiUrl);

    // ✅ Mock data for now
    const mockData: InsightData = {
      totalResumesUploaded: 15,
      averageScore: 82.5,
      mostCommonSkills: ['JavaScript', 'TypeScript', 'Angular', 'Node.js', 'Python'],
      timelineProgress: [
        { milestone: 'Application Submitted', status: 'Completed' },
        { milestone: 'First Interview', status: 'Completed' },
        { milestone: 'Technical Assessment', status: 'Pending' },
        { milestone: 'Offer Received', status: 'Not Started' }
      ]
    };

    return of(mockData).pipe(delay(1000)); // Simulate network delay
  }
}
