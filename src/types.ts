export interface Subtopic {
  id: string;
  topic_id: string;
  name: string;
  completed: boolean;
  created_at?: string;
  notes?: string;
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  subtopics: Subtopic[];
}

export interface LearningStats {
  totalTopics: number;
  totalSubtopics: number;
  completedSubtopics: number;
  overallPercentage: number;
}
