import { Milestone } from './milestone.model'; // ✅ Correct import

// Pagination metadata returned by the API
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}


export interface TimelineApiResponseData {
  milestones: any[];
  analytics: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
// Generic API response wrapper


export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  "data": T; // This 'T' needs to be defined when you use ApiResponse
}
export interface MilestonesData {
  "data": Milestone[];      // Array of milestones
  "pagination": Pagination; // Pagination info
  
}
