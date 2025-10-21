// Simple game types

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

export interface QuizGame {
  id: string;
  name: string;
  description: string;
  icon: any;
  creditCost: string;
  estimatedTime: number;
  href: string;
  requiresCourse: boolean;
  status: 'active' | 'coming-soon';
}
