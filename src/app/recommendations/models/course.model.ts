export interface Course {
  id: string;
  title: string;
  provider: string;
  instructor?: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  source: 'coursera' | 'udemy' | 'edx';
  url: string;
  price: string;
  rating: number;
  matchScore: number;
}