import { Topic } from '../types';

export const STORAGE_KEY = 'learningPortfolio';

export const SAMPLE_TOPICS: Topic[] = [
  {
    id: 'topic-ml-1',
    name: 'Machine Learning',
    description: 'Foundations of mathematical and statistical machine learning',
    created_at: new Date().toISOString(),
    subtopics: [
      { id: 'sub-ml-1', topic_id: 'topic-ml-1', name: 'Python Basics', completed: true },
      { id: 'sub-ml-2', topic_id: 'topic-ml-1', name: 'NumPy', completed: true },
      { id: 'sub-ml-3', topic_id: 'topic-ml-1', name: 'Pandas', completed: true },
      { id: 'sub-ml-4', topic_id: 'topic-ml-1', name: 'Statistics', completed: true },
      { id: 'sub-ml-5', topic_id: 'topic-ml-1', name: 'Probability', completed: false },
      { id: 'sub-ml-6', topic_id: 'topic-ml-1', name: 'Linear Regression', completed: false },
      { id: 'sub-ml-7', topic_id: 'topic-ml-1', name: 'Decision Trees', completed: false },
    ],
  },
  {
    id: 'topic-rag-2',
    name: 'RAG Engineering',
    description: 'Retrieval Augmented Generation pipelines and vector search',
    created_at: new Date().toISOString(),
    subtopics: [
      { id: 'sub-rag-1', topic_id: 'topic-rag-2', name: 'What is RAG?', completed: true },
      { id: 'sub-rag-2', topic_id: 'topic-rag-2', name: 'Embeddings', completed: true },
      { id: 'sub-rag-3', topic_id: 'topic-rag-2', name: 'Vector Databases', completed: false },
      { id: 'sub-rag-4', topic_id: 'topic-rag-2', name: 'Chunking', completed: false },
      { id: 'sub-rag-5', topic_id: 'topic-rag-2', name: 'Retrieval', completed: false },
      { id: 'sub-rag-6', topic_id: 'topic-rag-2', name: 'Reranking', completed: false },
    ],
  },
];

/**
 * Loads stored topics from localStorage.
 * If data exists in localStorage (including an empty array stored explicitly),
 * returns parsed topics.
 * Returns null if nothing has been stored yet.
 */
export function getStoredTopics(): Topic[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    // Also support { topics: [...] } format mentioned in spec
    if (parsed && Array.isArray(parsed.topics)) {
      return parsed.topics;
    }
    return null;
  } catch (error) {
    console.error('Error reading learning portfolio from localStorage:', error);
    return null;
  }
}

/**
 * Persists topics to localStorage.
 */
export function persistTopics(topics: Topic[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
  } catch (error) {
    console.error('Error saving learning portfolio to localStorage:', error);
  }
}

/**
 * Removes data from localStorage.
 */
export function clearStoredTopics(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing learning portfolio from localStorage:', error);
  }
}
