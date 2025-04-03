export interface Subject {
    id: number;
    name: string;
    color: string;
  }
  
  export interface StudySession {
    id: number;
    subjectId: number;
    date: string;
    duration: number; // in minutes
    content: string;
    notes?: string;
  }
  
  export interface MonthlyGoal {
    id: number;
    subjectId: number;
    month: string; // YYYY-MM format
    targetHours: number;
    completed: boolean;
  }