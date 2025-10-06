import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService, ApiResponse } from '../core/services/api.service';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  type: 'education' | 'job' | 'certification' | 'achievement' | 'project';
  company?: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current?: boolean;
  skills?: string[];
  technologies?: string[];
  achievements?: string[];
  url?: string;
  extractedFrom?: {
    resumeId: string;
    confidence: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface MilestonesResponseData {
  data: Milestone[];
  pagination: Pagination;
}

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  private milestonesSubject = new BehaviorSubject<Milestone[]>([]);
  public milestones$ = this.milestonesSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private http: HttpClient 
  ) {
    console.log('📈 TimelineService initialized');
  }

 getMilestones(filter?: { type?: string; limit?: number; page?: number }): Observable<ApiResponse<MilestonesResponseData>> {
  console.log('📋 Loading milestones with filter:', filter);
  const timestamp = Date.now();

  let queryParams = '';
  if (filter) {
    const params = new URLSearchParams();
    if (filter.type) params.append('type', filter.type);
    if (filter.limit) params.append('limit', filter.limit.toString());
    if (filter.page) params.append('page', filter.page.toString());
    queryParams = params.toString() ? `?${params.toString()}` : '';
  }

  const baseUrl = '/api';
  const url = `${baseUrl}/timelines/milestones${queryParams ? queryParams + '&' : '?'}cacheBust=${timestamp}`;

  return this.http.get<ApiResponse<MilestonesResponseData>>(url)
    .pipe(
      tap({
        next: (response: any) => {
          // Accept either {success, data: {data: []} } or {success, data: []}
          let milestonesArr = [];
          if (response?.success && Array.isArray(response?.data?.data)) {
            milestonesArr = response.data.data;
          } else if (response?.success && Array.isArray(response?.data)) {
            milestonesArr = response.data;
          }
          console.log('Full milestones API response:', response);
          this.milestonesSubject.next(milestonesArr);
        },
        error: (err: any) => {
          console.error('Milestone API error:', err);
          this.milestonesSubject.next([]);
        }
      })
    );
  }


  // Other formatting and helper methods remain unchanged

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  formatDateRange(startDate: Date | string, endDate?: Date | string, current?: boolean): string {
    const start = this.formatDate(startDate);
    if (current) {
      return `${start} - Present`;
    }
    if (endDate) {
      const end = this.formatDate(endDate);
      return `${start} - ${end}`;
    }
    return start;
  }

  calculateDuration(startDate: Date | string, endDate?: Date | string, current?: boolean): string {
    const start = new Date(startDate);
    const end = current ? new Date() : (endDate ? new Date(endDate) : new Date());

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);

      let duration = `${years} year${years !== 1 ? 's' : ''}`;
      if (remainingMonths > 0) {
        duration += ` ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
      }
      return duration;
    }
  }

  getTypeIcon(type: string): string {
    const icons = {
      education: '🎓',
      job: '💼',
      certification: '📜',
      achievement: '🏆',
      project: '💻'
    };
    return icons[type as keyof typeof icons] || '📌';
  }

  getTypeColor(type: string): string {
    const colors = {
      education: '#3182ce',
      job: '#38a169',
      certification: '#ed8936',
      achievement: '#d69e2e',
      project: '#805ad5'
    };
    return colors[type as keyof typeof colors] || '#4a5568';
  }
}
