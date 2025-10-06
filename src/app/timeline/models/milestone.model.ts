export interface Milestone {
  id: string;
  title: string;
  description: string;
  type: 'education' | 'job' | 'certification' | 'achievement' | 'project';
  company?: string;
  location?: string;
  startDate: Date;      // Use startDate and endDate consistently
  endDate?: Date;
  current?: boolean;
  skills?: string[];
  duration?: string;
}
