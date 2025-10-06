export interface InsightData {
  totalResumesUploaded: number;
  averageScore: number;
  mostCommonSkills: string[];
  timelineProgress: { milestone: string, status: string }[];
}
