import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QnaService } from './qna.service';
import { ActivatedRoute } from '@angular/router';

interface QnaMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  confidence?: number;
  category?: string;
}


@Component({
  selector: 'app-qna',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="qna-container">
      <div class="container">
        <div class="qna-header">
          <h1>Ask CareerVision</h1>
          <p>Get insights about your career, skills, and opportunities</p>
          <div class="milestone-context" *ngIf="milestoneContext">
            <span class="context-icon">📍</span>
            <span class="context-text">Discussing: {{ milestoneContext }}</span>
          </div>
        </div>
        
        <div class="chat-container">
          <div class="chat-messages" #chatMessages>
            <div class="welcome-message" *ngIf="messages.length === 0">
              <div class="message-avatar">🤖</div>
              <div class="message-content bot-message">
                <div class="message-text">
                  Hello! I'm your CareerVision AI assistant. I can help you with:
                  <ul>
                    <li>Analyzing career gaps in your timeline</li>
                    <li>Understanding your skills and experience</li>
                    <li>Finding matching job opportunities</li>
                    <li>Recommending courses for growth</li>
                    <li>Career advancement strategies</li>
                  </ul>
                  {{milestoneId ? 'I see you have a specific milestone in mind. ' : ''}}Try asking one of the questions below!
                </div>
              </div>
            </div>

            <div class="message-item" 
                 *ngFor="let message of messages"
                 [class.user-message]="message.isUser"
                 [class.bot-message]="!message.isUser">
              
              <div class="message-avatar">
                {{ message.isUser ? '👤' : '🤖' }}
              </div>
              
              <div class="message-content">
                <div class="message-text" [innerHTML]="formatMessage(message.text)"></div>
                <div class="message-meta">
                  <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                  <span class="message-confidence" *ngIf="!message.isUser && message.confidence">
                    {{ message.confidence }}% confidence
                  </span>
                </div>
              </div>
            </div>
            
            <div class="typing-indicator" *ngIf="isTyping">
              <div class="message-avatar">🤖</div>
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <div class="error-message" *ngIf="errorMessage">
              <div class="message-avatar">⚠️</div>
              <div class="message-content error">
                <div class="message-text">{{ errorMessage }}</div>
                <button class="retry-btn" (click)="retryLastQuestion()">Retry</button>
              </div>
            </div>
          </div>
          
          <div class="quick-questions" *ngIf="messages.length === 0">
            <h3>Try asking these questions:</h3>
            <div class="question-buttons">
              <button 
                *ngFor="let question of quickQuestions"
                class="question-btn"
                (click)="askQuestion(question)"
                [disabled]="isTyping"
              >
                {{ question }}
              </button>
            </div>
          </div>
          
          <div class="chat-input">
            <div class="input-group">
              <input 
                type="text" 
                [(ngModel)]="currentQuestion"
                (keyup.enter)="sendQuestion()"
                placeholder="Ask about your career, skills, or opportunities..."
                class="form-control"
                [disabled]="isTyping"
                #questionInput
              >
              <button 
                class="btn btn-primary"
                (click)="sendQuestion()"
                [disabled]="!currentQuestion.trim() || isTyping"
              >
                <span *ngIf="!isTyping">Send</span>
                <span *ngIf="isTyping">Sending...</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .qna-container {
      padding: 40px 20px;
      min-height: calc(100vh - 70px);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .qna-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .qna-header h1 {
      color: white;
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .qna-header p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 18px;
    }

    .milestone-context {
      margin-top: 16px;
      padding: 12px 20px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: white;
      font-size: 14px;
    }

    .context-icon {
      font-size: 18px;
    }
    
    .chat-container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      max-width: 900px;
      margin: 0 auto;
      height: 650px;
      display: flex;
      flex-direction: column;
    }
    
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .welcome-message {
      display: flex;
      gap: 12px;
    }

    .welcome-message .message-content ul {
      margin: 12px 0 0 0;
      padding-left: 20px;
    }

    .welcome-message .message-content li {
      margin: 6px 0;
    }
    
    .message-item {
      display: flex;
      gap: 12px;
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .user-message {
      justify-content: flex-end;
    }

    .user-message .message-avatar {
      order: 2;
    }
    
    .user-message .message-content {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .bot-message .message-content {
      background: #f7fafc;
      color: #1a202c;
      border: 1px solid #e2e8f0;
    }
    
    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e2e8f0;
      font-size: 20px;
      flex-shrink: 0;
    }
    
    .message-content {
      max-width: 70%;
      border-radius: 16px;
      padding: 12px 16px;
    }
    
    .message-text {
      line-height: 1.6;
      margin-bottom: 6px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .message-text ::ng-deep strong {
      font-weight: 600;
      color: inherit;
    }

    .message-text ::ng-deep ul,
    .message-text ::ng-deep ol {
      margin: 8px 0;
      padding-left: 20px;
    }

    .message-text ::ng-deep li {
      margin: 4px 0;
    }
    
    .message-meta {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .message-time {
      font-size: 11px;
      opacity: 0.7;
    }

    .message-confidence {
      font-size: 11px;
      opacity: 0.8;
      font-weight: 500;
    }
    
    .typing-indicator {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    
    .typing-dots {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
      background: #f7fafc;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }
    
    .typing-dots span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #667eea;
      animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typing {
      0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }

    .error-message {
      display: flex;
      gap: 12px;
    }

    .error-message .message-content {
      background: #fff5f5;
      border: 1px solid #fc8181;
      color: #c53030;
    }

    .retry-btn {
      margin-top: 8px;
      padding: 6px 12px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
    }

    .retry-btn:hover {
      background: #5568d3;
    }
    
    .quick-questions {
      padding: 24px;
      border-top: 1px solid #e2e8f0;
      background: #f9fafb;
    }
    
    .quick-questions h3 {
      color: #1a202c;
      font-size: 16px;
      margin-bottom: 16px;
      font-weight: 600;
    }
    
    .question-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 10px;
    }
    
    .question-btn {
      background: white;
      border: 1px solid #e2e8f0;
      padding: 12px 16px;
      border-radius: 8px;
      text-align: left;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #4a5568;
      font-size: 14px;
    }
    
    .question-btn:hover:not(:disabled) {
      background: #667eea;
      color: white;
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .question-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .chat-input {
      padding: 20px 24px;
      border-top: 1px solid #e2e8f0;
      background: white;
    }
    
    .input-group {
      display: flex;
      gap: 12px;
    }
    
    .input-group .form-control {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 15px;
      transition: border-color 0.3s ease;
    }

    .input-group .form-control:focus {
      outline: none;
      border-color: #667eea;
    }

    .input-group .form-control:disabled {
      background: #f7fafc;
      cursor: not-allowed;
    }

    .input-group .btn {
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .input-group .btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .input-group .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  `]
})
export class QnaComponent implements OnInit {
  messages: QnaMessage[] = [];
  currentQuestion = '';
  lastQuestion = '';
  isTyping = false;
  errorMessage = '';
  milestoneId?: string;
  milestoneContext?: string;

  quickQuestions = [
    "What are the gaps in my career timeline?",
    "What skills should I focus on developing?",
    "Which jobs best match my experience?",
    "What courses would help me advance?",
    "How can I improve my career trajectory?",
    "Analyze my skill distribution"
  ];

  constructor(
    private qnaService: QnaService,
    private route: ActivatedRoute
  ) {
    console.log('QnA Component initialized');
  }

  ngOnInit(): void {
    // Check if milestone ID is passed via query params
    this.route.queryParams.subscribe(params => {
      this.milestoneId = params['milestoneId'];
      this.milestoneContext = params['milestoneTitle'];
      
      if (this.milestoneId) {
        console.log('QnA opened for milestone:', this.milestoneId);
      }
    });
  }

  askQuestion(question: string): void {
    this.currentQuestion = question;
    this.sendQuestion();
  }

  sendQuestion(): void {
    const trimmedQuestion = this.currentQuestion.trim();
    if (!trimmedQuestion || this.isTyping) return;

    this.errorMessage = '';
    this.lastQuestion = trimmedQuestion;

    // Add user message
    this.messages.push({
      text: trimmedQuestion,
      isUser: true,
      timestamp: new Date()
    });

    this.currentQuestion = '';
    this.isTyping = true;
    this.scrollToBottom();

    // Prepare request with optional milestone ID
    const request: any = { question: trimmedQuestion };
    if (this.milestoneId) {
      request.milestoneId = this.milestoneId;
    }

    // Call API via service
    this.qnaService.askQuestion(request).subscribe({
      next: (response) => {
        console.log('QnA Response:', response);
        this.isTyping = false;
        
        if (response.success && response.data) {
          this.messages.push({
            text: response.data.answer,
            isUser: false,
            timestamp: new Date(),
            confidence: response.data.confidence,
            category: response.data.category
          });
        } else {
          this.showError('Received invalid response from server');
        }
        
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('QnA Error:', error);
        this.isTyping = false;
        this.showError(error.error?.message || 'Failed to get response. Please try again.');
        this.scrollToBottom();
      }
    });
  }

  retryLastQuestion(): void {
    if (this.lastQuestion) {
      this.currentQuestion = this.lastQuestion;
      this.sendQuestion();
    }
  }

  private showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  formatMessage(text: string): string {
    // Convert markdown-style formatting to HTML
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  formatTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 100);
  }
}