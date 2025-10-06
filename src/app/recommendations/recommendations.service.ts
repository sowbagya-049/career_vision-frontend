import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';
import { Job } from './models/job.model';
import { Course } from './models/course.model';

@Injectable({
  providedIn: 'root'
})
export class RecommendationsService {
  constructor(private apiService: ApiService) {}

  // Pass Job[] as the type parameter, as ApiService returns ApiResponse<T> anyway
  getJobRecommendations(): Observable<Job[]> {
    return this.apiService.get<Job[]>('/recommendations/jobs').pipe(
      map(response => response.data ?? []) // unwrap data from ApiResponse<T>
    );
  }

  getCourseRecommendations(): Observable<Course[]> {
    return this.apiService.get<Course[]>('/recommendations/courses').pipe(
      map(response => response.data ?? []) // unwrap data from ApiResponse<T>
    );
  }

  refreshRecommendations(): Observable<any> {
    return this.apiService.post('/recommendations/refresh', {});
  }
}
