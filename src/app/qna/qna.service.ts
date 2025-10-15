import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from '../core/services/api.service';

export interface QnaRequest {
  question: string;
  milestoneId?: string;
}


export interface QnaResponseData {
  answer: string;
  confidence: number;
  category: string;
  questionId: string;
}

export interface QnaResponse {
  success: boolean;
  data: QnaResponseData;
}

export interface QuestionHistoryItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  confidence: number;
  helpful?: boolean;
  createdAt: string;
}

export interface QuestionHistory {
  success: boolean;
  data: QuestionHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class QnaService {
  constructor(private apiService: ApiService) {}

  askQuestion(request: QnaRequest): Observable<QnaResponse> {
    return this.apiService.post<QnaResponseData>('/qna/ask', request).pipe(
      map(response => ({
        success: response.success,
        data: response.data!
      }))
    );
  }

  getQuestionHistory(page: number = 1, limit: number = 20): Observable<QuestionHistory> {
    return this.apiService.get<{ items: QuestionHistoryItem[], pagination: any }>(`/qna/history?page=${page}&limit=${limit}`).pipe(
      map(response => ({
        success: response.success,
        data: response.data?.items || [],
        pagination: response.data?.pagination || { page, limit, total: 0, pages: 0 }
      }))
    );
  }

  rateAnswer(questionId: string, helpful: boolean): Observable<ApiResponse<any>> {
    return this.apiService.post<any>(`/qna/${questionId}/rate`, { helpful });
  }
}