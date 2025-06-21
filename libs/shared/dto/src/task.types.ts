import { Feedback } from './feedback.types';

export interface Task {
  id: string;
  type: 'feedback';
  createdAt?: string;
  updatedAt?: string;
  completedOn?: string;
  data?: Feedback;
}
