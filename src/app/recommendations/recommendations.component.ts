import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecommendationsService } from './recommendations.service';
import { Job } from './models/job.model';
import { Course } from './models/course.model';

// recommemdations
@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="recommendations-container">
      <div class="container">
        <div class="recommendations-header">
          <h1>Recommendations</h1>
          <p>Personalized job opportunities and courses based on your profile</p>
          
          <div class="tab-controls">
            <button 
              class="tab-btn"
              [class.active]="activeTab === 'jobs'"
              (click)="activeTab = 'jobs'"
            >
              💼 Jobs ({{ jobs.length }})
            </button>
            <button 
              class="tab-btn"
              [class.active]="activeTab === 'courses'"
              (click)="activeTab = 'courses'"
            >
              📚 Courses ({{ courses.length }})
            </button>
          </div>
        </div>
        
        <!-- Jobs Tab -->
        <div class="tab-content" *ngIf="activeTab === 'jobs'">
          <div class="content-header">
            <h2>Job Opportunities</h2>
            <button class="btn btn-secondary" (click)="refreshRecommendations()">
              Refresh
            </button>
          </div>
          
          <div class="recommendations-grid" *ngIf="!isLoading">
            <div class="job-card" *ngFor="let job of jobs">
              <div class="card-header">
                <div class="job-title">
                  <h3>{{ job.title }}</h3>
                  <span class="match-score">{{ job.matchScore }}% match</span>
                </div>
                <div class="job-company">
                  <strong>{{ job.company }}</strong>
                  <span>{{ job.location }}</span>
                </div>
              </div>
              
              <div class="job-details">
                <p class="job-description">{{ job.description }}</p>
                
                <div class="job-salary" *ngIf="job.salary">
                  💰 {{ job.salary }}
                </div>
                
                <div class="job-skills">
                  <span class="skill-tag" *ngFor="let skill of job.skills.slice(0, 5)">
                    {{ skill }}
                  </span>
                </div>
                
                <div class="job-meta">
                  <span class="source">Source: {{ job.source }}</span>
                  <span class="posted-date">{{ formatDate(job.postedDate) }}</span>
                </div>
              </div>
              
              <div class="card-actions">
                <a [href]="job.url" target="_blank" class="btn btn-primary">
                  Apply Now
                </a>
                <button class="btn btn-secondary">Save</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Courses Tab -->
        <div class="tab-content" *ngIf="activeTab === 'courses'">
          <div class="content-header">
            <h2>Recommended Courses</h2>
            <button class="btn btn-secondary" (click)="refreshRecommendations()">
              Refresh
            </button>
          </div>
          
          <div class="recommendations-grid" *ngIf="!isLoading">
            <div class="course-card" *ngFor="let course of courses">
              <div class="card-header">
                <div class="course-title">
                  <h3>{{ course.title }}</h3>
                  <span class="match-score">{{ course.matchScore }}% match</span>
                </div>
                <div class="course-provider">
                  <strong>{{ course.provider }}</strong>
                  <span *ngIf="course.instructor">by {{ course.instructor }}</span>
                </div>
              </div>
              
              <div class="course-details">
                <p class="course-description">{{ course.description }}</p>
                
                <div class="course-meta">
                  <div class="meta-item">
                    <span class="meta-label">Duration:</span>
                    <span>{{ course.duration }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Level:</span>
                    <span class="level-badge" [ngClass]="'level-' + course.level">
                      {{ course.level }}
                    </span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Rating:</span>
                    <span class="rating">
                      {{ course.rating }}/5 ⭐
                    </span>
                  </div>
                </div>
                
                <div class="course-skills">
                  <span class="skill-tag" *ngFor="let skill of course.skills.slice(0, 4)">
                    {{ skill }}
                  </span>
                </div>
                
                <div class="course-price">
                  {{ course.price }}
                </div>
              </div>
              
              <div class="card-actions">
                <a [href]="course.url" target="_blank" class="btn btn-primary">
                  Enroll Now
                </a>
                <button class="btn btn-secondary">Save</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="loading-container" *ngIf="isLoading">
          <div class="loading-spinner"></div>
          <p>Loading recommendations...</p>
        </div>
        
        <div class="empty-state" *ngIf="!isLoading && activeTab === 'jobs' && jobs.length === 0">
          <div class="empty-icon">💼</div>
          <h3>No job recommendations found</h3>
          <p>Upload your resume to get personalized job recommendations</p>
          <button class="btn btn-primary" routerLink="/resume-upload">Upload Resume</button>
        </div>
        
        <div class="empty-state" *ngIf="!isLoading && activeTab === 'courses' && courses.length === 0">
          <div class="empty-icon">📚</div>
          <h3>No course recommendations found</h3>
          <p>Complete your profile to get personalized course recommendations</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recommendations-container {
      padding: 40px 0;
      min-height: calc(100vh - 70px);
    }
    
    .recommendations-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .recommendations-header h1 {
      color: white;
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .recommendations-header p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 18px;
      margin-bottom: 32px;
    }
    
    .tab-controls {
      display: flex;
      justify-content: center;
      gap: 16px;
    }
    
    .tab-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }
    
    .tab-btn:hover,
    .tab-btn.active {
      background: white;
      color: #667eea;
    }
    
    .tab-content {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }
    
    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }
    
    .content-header h2 {
      color: #1a202c;
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }
    
    .recommendations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
    }
    
    .job-card,
    .course-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
      transition: all 0.3s ease;
    }
    
    .job-card:hover,
    .course-card:hover {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }
    
    .card-header {
      margin-bottom: 16px;
    }
    
    .job-title,
    .course-title {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    
    .job-title h3,
    .course-title h3 {
      color: #1a202c;
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      flex: 1;
      margin-right: 12px;
    }
    
    .match-score {
      background: #667eea;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      flex-shrink: 0;
    }
    
    .job-company,
    .course-provider {
      color: #4a5568;
    }
    
    .job-company strong,
    .course-provider strong {
      color: #667eea;
      margin-right: 8px;
    }
    
    .job-details,
    .course-details {
      margin-bottom: 20px;
    }
    
    .job-description,
    .course-description {
      color: #718096;
      line-height: 1.6;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .job-salary {
      color: #38a169;
      font-weight: 600;
      margin-bottom: 12px;
    }
    
    .course-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .meta-label {
      font-weight: 500;
      color: #4a5568;
      min-width: 60px;
    }
    
    .level-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: capitalize;
    }
    
    .level-beginner { background: #e6fffa; color: #234e52; }
    .level-intermediate { background: #fef5e7; color: #744210; }
    .level-advanced { background: #fed7d7; color: #742a2a; }
    
    .rating {
      color: #ed8936;
      font-weight: 500;
    }
    
    .job-skills,
    .course-skills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    
    .skill-tag {
      background: #e2e8f0;
      color: #4a5568;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .job-meta {
      display: flex;
      justify-content: space-between;
      color: #718096;
      font-size: 12px;
    }
    
    .source {
      text-transform: capitalize;
    }
    
    .course-price {
      color: #38a169;
      font-weight: 600;
      font-size: 16px;
    }
    
    .card-actions {
      display: flex;
      gap: 12px;
    }
    
    .card-actions .btn {
      flex: 1;
      text-align: center;
    }
    
    .loading-container {
      text-align: center;
      padding: 60px 20px;
    }
    
    .loading-container p {
      color: #718096;
      margin-top: 16px;
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }
    
    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }
    
    .empty-state h3 {
      color: #1a202c;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .empty-state p {
      color: #718096;
      margin-bottom: 24px;
    }
    
    @media (max-width: 768px) {
      .recommendations-grid {
        grid-template-columns: 1fr;
      }
      
      .content-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
    }
  `]
})
export class RecommendationsComponent implements OnInit {
  jobs: Job[] = [];
  courses: Course[] = [];
  activeTab: 'jobs' | 'courses' = 'jobs';
  isLoading = true;

  constructor(private recommendationsService: RecommendationsService) {}

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    this.isLoading = true;

    this.recommendationsService.getJobRecommendations().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading job recommendations:', error);
        this.checkLoadingComplete();
      }
    });

    this.recommendationsService.getCourseRecommendations().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading course recommendations:', error);
        this.checkLoadingComplete();
      }
    });
  }

  private checkLoadingComplete(): void {
    // A simple loading status check, improve if needed
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  refreshRecommendations(): void {
    this.recommendationsService.refreshRecommendations().subscribe({
      next: () => this.loadRecommendations(),
      error: (error) => console.error('Error refreshing recommendations:', error),
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}
