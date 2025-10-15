import { Component } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-resume-upload',
  templateUrl: './resume-upload.component.html',
  styleUrls: ['./resume-upload.component.scss']
})
export class ResumeUploadComponent {
  selectedFile: File | null = null;
  isUploading = false;
  isDragOver = false;
  uploadResult: any = null;
  errorMessage = '';

  parsedResumeText: string = '';
  aiParsingResult: string = '';
  isParsingWithAI = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  goToTimeline(): void {
    this.router.navigate(['/timeline']);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.errorMessage = '';
    this.uploadResult = null;
    this.aiParsingResult = '';

    const formData = new FormData();
    formData.append('resume', this.selectedFile);

    this.apiService.upload('/resumes/upload', formData).subscribe({
      next: (response: any) => {
        this.isUploading = false;
        this.uploadResult = response.data;
        // Optionally fetch extracted text for AI parsing after upload finish if available
      },
      error: (error) => {
        this.isUploading = false;
        this.errorMessage = error.error?.message || 'Upload failed. Please try again.';
      }
    });
  }

  // New method to send resume text to AI parse endpoint
  parseResumeWithAI(): void {
    if (!this.parsedResumeText || this.parsedResumeText.trim().length === 0) {
      this.errorMessage = 'Please enter or upload resume text to parse.';
      return;
    }

    this.isParsingWithAI = true;
    this.errorMessage = '';
    this.aiParsingResult = '';

    this.apiService.post('/resumes/ai-parse', { text: this.parsedResumeText }).subscribe({
      next: (response: any) => {
        this.isParsingWithAI = false;
        if (response.success) {
          this.aiParsingResult = response.parsed;
        } else {
          this.errorMessage = 'AI parsing failed. Please try again later.';
        }
      },
      error: (error) => {
        this.isParsingWithAI = false;
        this.errorMessage = error.error?.message || 'AI parsing failed. Please try again.';
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Helper methods for template null safety
  getFileName(): string {
    return this.selectedFile?.name || '';
  }

  getFileSize(): number {
    return this.selectedFile?.size || 0;
  }
 
}