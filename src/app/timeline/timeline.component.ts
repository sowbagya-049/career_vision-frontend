import { Component, OnInit } from '@angular/core';
import { TimelineService, Milestone } from './timeline.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  milestones: Milestone[] = [];
  filteredMilestones: Milestone[] = [];
  isLoading = true;
  selectedType = 'all';

  milestoneTypes = [
    { value: 'all', label: 'All' },
    { value: 'education', label: 'Education' },
    { value: 'job', label: 'Experience' },
    { value: 'certification', label: 'Certifications' },
    { value: 'achievement', label: 'Achievements' },
    { value: 'project', label: 'Projects' }
  ];

  constructor(public timelineService: TimelineService) {}

  ngOnInit(): void {
    this.loadMilestones();
  }

  loadMilestones(): void {
    this.isLoading = true;
    this.timelineService.getMilestones().subscribe({
      next: (response: any) => {
        console.log('API response:', response);

        if (response.success && response.data) {
          const milestonesData = Array.isArray(response.data) 
            ? response.data 
            : [];

          console.log('Milestones count:', milestonesData.length);
          console.log('Milestone types breakdown:', this.countByType(milestonesData));

          this.milestones = milestonesData.sort((a: Milestone, b: Milestone) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
          this.filteredMilestones = [...this.milestones];
        } else {
          console.warn('No milestones data in response');
          this.milestones = [];
          this.filteredMilestones = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading milestones:', error);
        this.isLoading = false;
        this.milestones = [];
        this.filteredMilestones = [];
      }
    });
  }

  filterByType(type: string): void {
    this.selectedType = type;
    console.log('Filtering by type:', type);
    
    if (type === 'all') {
      this.filteredMilestones = [...this.milestones];
    } else {
      this.filteredMilestones = this.milestones.filter(m => m.type === type);
    }
    
    console.log('Filtered count:', this.filteredMilestones.length);
  }

  private countByType(milestones: Milestone[]): any {
    const counts: any = {};
    milestones.forEach(m => {
      counts[m.type] = (counts[m.type] || 0) + 1;
    });
    return counts;
  }
}