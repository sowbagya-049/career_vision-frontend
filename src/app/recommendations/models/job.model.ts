// job interface
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  requirements: string[];
  skills: string[];
  source: 'linkedin' | 'indeed' | 'unstop';
  url: string;
  postedDate: Date;
  matchScore: number;
}
