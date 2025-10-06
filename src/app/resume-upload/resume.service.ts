import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService, ApiResponse } from '../core/services/api.service';

export interface Resume {
  id: string;
  filename: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  extractedText?: string;
  extractedData?: {
    personalInfo?: {
      name?: string;
      email?: string;
      phone?: string;
      location?: string;
    };
    skills?: string[];
    experience?: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
    education?: Array<{
      degree: string;
      institution: string;
      year: string;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadResponse {
  resumeId: string;
  filename: string;
  size: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private resumesSubject = new BehaviorSubject<Resume[]>([]);
  private uploadProgressSubject = new BehaviorSubject<number>(0);
  
  public resumes$ = this.resumesSubject.asObservable();
  public uploadProgress$ = this.uploadProgressSubject.asObservable();

  constructor(private apiService: ApiService) {
    console.log('📄 ResumeService initialized');
  }

  uploadResume(file: File): Observable<ApiResponse<UploadResponse>> {
    console.log('📤 Uploading resume:', file.name);
    
    const formData = new FormData();
    formData.append('resume', file);
    
    // Reset progress
    this.uploadProgressSubject.next(0);
    
    return this.apiService.upload<UploadResponse>('/resumes/upload', formData).pipe(
      tap(response => {
        console.log('📤 Resume upload response:', response);
        this.uploadProgressSubject.next(100);
        
        if (response.success) {
          // Refresh resumes list
          this.loadResumes().subscribe();
        }
      })
    );
  }

  loadResumes(): Observable<ApiResponse<Resume[]>> {
    console.log('📋 Loading user resumes');
    
    return this.apiService.get<Resume[]>('/resumes').pipe(
      tap(response => {
        if (response.success && response.data) {
          this.resumesSubject.next(response.data);
        }
      })
    );
  }

  getResumeDetails(resumeId: string): Observable<ApiResponse<Resume>> {
    console.log('📄 Getting resume details:', resumeId);
    
    return this.apiService.get<Resume>(`/resumes/${resumeId}`);
  }

  deleteResume(resumeId: string): Observable<ApiResponse<any>> {
    console.log('🗑️ Deleting resume:', resumeId);
    
    return this.apiService.delete(`/resumes/${resumeId}`).pipe(
      tap(response => {
        if (response.success) {
          // Refresh resumes list
          this.loadResumes().subscribe();
        }
      })
    );
  }

  // Utility methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(mimeType: string): string {
    switch (mimeType) {
      case 'application/pdf':
        return '📕';
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return '📘';
      default:
        return '📄';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return '#22543d';
      case 'processing':
        return '#ed8936';
      case 'failed':
        return '#e53e3e';
      case 'pending':
      default:
        return '#4a5568';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return '✅';
      case 'processing':
        return '⏳';
      case 'failed':
        return '❌';
      case 'pending':
      default:
        return '⏸️';
    }
  }
}