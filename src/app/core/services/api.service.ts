import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
  token?: string;
  user?: any;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('🔧 ApiService initialized with baseUrl:', this.baseUrl);
  }

  private setLoading(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }
  
  // frontend/src/app/core/services/api.service.ts
  aiParseResume(resumeText: string) {
    return this.http.post<any>(`${this.baseUrl}/resumes/ai-parse`, { text: resumeText });
  }
 
  
  private getHeaders(contentTypeJson = true): HttpHeaders {
    const token = localStorage.getItem('token');
    let headersConfig: { [name: string]: string } = {
      Authorization: token ? `Bearer ${token}` : ''
    };
    if (contentTypeJson) {
      headersConfig['Content-Type'] = 'application/json';
    }
    return new HttpHeaders(headersConfig);
  }

  get<T>(endpoint: string): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('📤 GET request to:', url);

    this.setLoading(true);

    return this.http.get<ApiResponse<T>>(url, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('📥 GET response from', endpoint, ':', response)),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }

  post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('📤 POST request to:', url);
    console.log('📦 POST data:', data);

    this.setLoading(true);

    return this.http.post<ApiResponse<T>>(url, data, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('📥 POST response from', endpoint, ':', response)),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }

  put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('📤 PUT request to:', url);

    this.setLoading(true);

    return this.http.put<ApiResponse<T>>(url, data, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('📥 PUT response from', endpoint, ':', response)),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }

  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('📤 DELETE request to:', url);

    this.setLoading(true);

    return this.http.delete<ApiResponse<T>>(url, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('📥 DELETE response from', endpoint, ':', response)),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }

  upload<T>(endpoint: string, formData: FormData): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('📤 UPLOAD request to:', url);
    formData.forEach((value, key) => console.log(` - ${key}:`, value));

    this.setLoading(true);

    // For FormData, do not set Content-Type, let browser do it
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    });

    return this.http.post<ApiResponse<T>>(url, formData, { headers }).pipe(
      tap(response => console.log('📥 UPLOAD response from', endpoint, ':', response)),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error('🚨 API Error occurred:', error);

    let errorMessage = 'Something went wrong. Please try again.';

    if (error.error instanceof ErrorEvent) {
      // Client-side/network error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error && typeof error.error === 'object') {
        if (error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error.errors && Array.isArray(error.error.errors)) {
          errorMessage = error.error.errors.map((err: any) => err.message || err).join(', ');
        }
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check if the backend is running on port 3000.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized. Please log in again.';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else if (error.status === 400) {
        errorMessage = 'Invalid request. Please check your input.';
      } else if (error.status === 404) {
        errorMessage = 'Requested resource not found.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    }

    // Return observable with user-facing error message
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      error: error.error,
      originalError: error
    }));
  }
}
