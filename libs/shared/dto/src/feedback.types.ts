export interface Feedback {
  id: string;
  userId: string;
  feedback: FeedbackStep[] | [];
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface FeedbackQuestion {
  id: string;
  question: string;
  answerType: 'text' | 'number' | 'boolean' | 'date';
}

export interface FeedbackStep {
  id: string;
  question: FeedbackQuestion;
  answerType: 'text' | 'number' | 'boolean' | 'date';
  completedOn?: string;
}
