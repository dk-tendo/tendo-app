export interface FeedbackSchema {
  id: string;
  userId: string;
  feedback: [
    {
      question: FeedbackQuestionSchema;
      answer: string | number | boolean | Date;
    }
  ];
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface FeedbackQuestionSchema {
  id: string;
  question: string;
  answerType: 'text' | 'number' | 'boolean' | 'date';
}
