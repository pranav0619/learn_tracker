import { useState, useEffect, useRef, useMemo, type ChangeEvent } from 'react';
import {
  Plus,
  Search,
  BookOpen,
  Trash2,
  Download,
  Upload,
  Sparkles,
  CheckCircle2,
  ListTodo,
} from 'lucide-react';
import { Topic, Subtopic } from './types';
import {
  getStoredTopics,
  persistTopics,
  clearStoredTopics,
  SAMPLE_TOPICS,
} from './services/storage';
import TopicCard from './components/TopicCard';
import ProgressBar from './components/ProgressBar';
import AddTopicModal from './components/AddTopicModal';
import EditTopicModal from './components/EditTopicModal';
import ConfirmModal from './components/ConfirmModal';

export default function App() {
  // Initialize from localStorage immediately
  const [topics, setTopics] = useState<Topic[]>(() => {
    const saved = getStoredTopics();
    if (saved !== null) {
      return saved;
    }
    // If no prior data exists, start with empty dashboard (per section 20)
    return [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null);
  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isMounted = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state to localStorage whenever topics update (skipping before mount)
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    persistTopics(topics);
  }, [topics]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Overall calculations across all topics & subtopics
  const overallStats = useMemo(() => {
    let totalSubtopics = 0;
    let completedSubtopics = 0;

    topics.forEach((t) => {
      totalSubtopics += t.subtopics.length;
      completedSubtopics += t.subtopics.filter((s) => s.completed).length;
    });

    const percentage =
      totalSubtopics === 0
        ? 0
        : Math.round((completedSubtopics / totalSubtopics) * 100);

    return {
      totalTopics: topics.length,
      totalSubtopics,
      completedSubtopics,
      percentage,
    };
  }, [topics]);

  // Topic & Subtopic Handlers
  const handleCreateTopic = (newTopic: Topic) => {
    setTopics((prev) => [newTopic, ...prev]);
    showToast(`Created topic "${newTopic.name}"`);
  };

  const handleUpdateTopic = (
    topicId: string,
    name: string,
    description?: string,
  ) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, name, description } : t)),
    );
    showToast('Topic updated successfully');
  };

  const handleDeleteTopic = () => {
    if (!topicToDelete) return;
    const name = topicToDelete.name;
    setTopics((prev) => prev.filter((t) => t.id !== topicToDelete.id));
    setTopicToDelete(null);
    showToast(`Deleted topic "${name}"`);
  };

  const handleToggleSubtopic = (
    topicId: string,
    subtopicId: string,
    completed: boolean,
  ) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        return {
          ...t,
          subtopics: t.subtopics.map((s) =>
            s.id === subtopicId ? { ...s, completed } : s,
          ),
        };
      }),
    );
  };

  const handleAddSubtopic = (topicId: string, name: string) => {
    const newSub: Subtopic = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      topic_id: topicId,
      name,
      completed: false,
      created_at: new Date().toISOString(),
    };

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        return {
          ...t,
          subtopics: [...t.subtopics, newSub],
        };
      }),
    );
  };

  const handleEditSubtopic = (
    topicId: string,
    subtopicId: string,
    newName: string,
  ) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        return {
          ...t,
          subtopics: t.subtopics.map((s) =>
            s.id === subtopicId ? { ...s, name: newName } : s,
          ),
        };
      }),
    );
  };

  const handleDeleteSubtopic = (topicId: string, subtopicId: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        return {
          ...t,
          subtopics: t.subtopics.filter((s) => s.id !== subtopicId),
        };
      }),
    );
  };

  const handleClearAllData = () => {
    clearStoredTopics();
    setTopics([]);
    showToast('All learning data has been cleared');
  };

  const handleLoadSampleData = () => {
    setTopics(SAMPLE_TOPICS);
    showToast('Loaded sample learning topics');
  };

  // Export & Import features for extra convenience
  const handleExportData = () => {
    const dataStr = JSON.stringify(topics, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `learning-portfolio-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Learning portfolio exported');
  };

  const handleImportFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        let importedTopics: Topic[] = [];
        if (Array.isArray(parsed)) {
          importedTopics = parsed;
        } else if (parsed && Array.isArray(parsed.topics)) {
          importedTopics = parsed.topics;
        } else {
          throw new Error('Invalid JSON format');
        }
        setTopics(importedTopics);
        showToast(`Imported ${importedTopics.length} topics successfully`);
      } catch (err) {
        alert('Failed to parse backup file. Please ensure it is valid JSON.');
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Filtered topics based on search
  const filteredTopics = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return topics;
    return topics.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query)) ||
        t.subtopics.some((s) => s.name.toLowerCase().includes(query)),
    );
  }, [topics, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0c0e12] text-zinc-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Toast notification */}
      {toastMessage && (
        <div
          id="status-toast"
          className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-zinc-900 border border-emerald-500/50 rounded-xl shadow-2xl text-xs font-medium text-emerald-300 flex items-center gap-2 animate-fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFileChange}
        accept=".json"
        className="hidden"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Main Header */}
        <header className="text-center pb-8 border-b border-zinc-800/80">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono tracking-wider uppercase text-zinc-400 mb-3">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Personal Knowledge Base</span>
          </div>

          <h1
            id="app-main-title"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase font-mono"
          >
            My Learning
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Track what I&rsquo;m learning</p>

          {/* Quick utility controls */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs flex-wrap">
            <button
              type="button"
              id="export-data-btn"
              onClick={handleExportData}
              disabled={topics.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-40"
              title="Export portfolio as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              type="button"
              id="import-data-btn"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Import portfolio JSON backup"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>

            {topics.length > 0 && (
              <button
                type="button"
                id="clear-all-data-btn"
                onClick={() => setIsClearDataModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950/40 border border-zinc-800 hover:border-rose-900/60 text-zinc-400 hover:text-rose-300 transition-colors"
                title="Clear all saved data"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Data</span>
              </button>
            )}
          </div>
        </header>

        {/* Overall Progress Section */}
        <section id="overall-progress-section" className="py-8">
          <div className="bg-[#13161c] border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase font-mono">
                  Overall Learning Progress
                </span>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Calculated across all subtopics in your portfolio
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <span
                  id="overall-progress-percentage"
                  className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tracking-tight"
                >
                  {overallStats.percentage}%
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  ({overallStats.completedSubtopics} of {overallStats.totalSubtopics} completed)
                </span>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <ProgressBar
              percentage={overallStats.percentage}
              size="lg"
              id="overall-progress-bar"
            />

            {/* Quick Stat Badges */}
            <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 flex-wrap gap-3 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>Total Topics: <strong className="text-zinc-200">{overallStats.totalTopics}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400/60 inline-block" />
                <span>Completed: <strong className="text-zinc-200">{overallStats.completedSubtopics}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-600 inline-block" />
                <span>Remaining: <strong className="text-zinc-200">{overallStats.totalSubtopics - overallStats.completedSubtopics}</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* Action Controls & Search */}
        <div className="pb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            id="add-learning-topic-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm transition-colors shadow-md shadow-emerald-500/10 active:scale-[0.99]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Learning Topic</span>
          </button>

          {topics.length > 0 && (
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-topics-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics or subtopics..."
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <main id="topics-dashboard-main">
          {topics.length === 0 ? (
            /* Empty State (Prompt Section 13) */
            <div
              id="empty-state-view"
              className="my-8 text-center py-16 px-6 bg-[#13161c] border border-dashed border-zinc-800 rounded-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <ListTodo className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-zinc-100 mb-2">
                Start Your Learning Journey
              </h2>
              <p className="text-sm text-zinc-400 max-w-sm mx-auto mb-6">
                You haven&rsquo;t added any learning topics yet. Create one to organize your subtopics and track progress.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  id="empty-state-add-first-topic-btn"
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm transition-colors shadow-sm shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>+ Add Your First Topic</span>
                </button>
                <button
                  type="button"
                  id="empty-state-load-sample-btn"
                  onClick={handleLoadSampleData}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-sm transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Load Sample Topics</span>
                </button>
              </div>
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="text-center py-16 bg-[#13161c] rounded-2xl border border-zinc-800">
              <p className="text-sm text-zinc-400">
                No learning topics match &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs text-emerald-400 hover:underline"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            /* Cards List (Prompt Section 2 & 10) */
            <div id="topics-list" className="space-y-6">
              {filteredTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onToggleSubtopic={handleToggleSubtopic}
                  onAddSubtopic={handleAddSubtopic}
                  onEditSubtopic={handleEditSubtopic}
                  onDeleteSubtopic={handleDeleteSubtopic}
                  onEditTopic={(t) => setEditingTopic(t)}
                  onDeleteTopic={(t) => setTopicToDelete(t)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-zinc-800/60 text-center text-xs text-zinc-500 font-mono">
          <p>Local Storage Active • Offline Capable • Modular Learning Tracker</p>
        </footer>
      </div>

      {/* Modals */}
      <AddTopicModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreateTopic={handleCreateTopic}
      />

      <EditTopicModal
        topic={editingTopic}
        isOpen={Boolean(editingTopic)}
        onClose={() => setEditingTopic(null)}
        onSave={handleUpdateTopic}
      />

      {/* Delete Topic Confirmation */}
      <ConfirmModal
        isOpen={Boolean(topicToDelete)}
        title="Delete Learning Topic"
        message={`Are you sure you want to delete "${topicToDelete?.name}" and all of its ${topicToDelete?.subtopics.length || 0} subtopics? This action cannot be undone.`}
        confirmText="Delete Topic"
        isDestructive={true}
        onConfirm={handleDeleteTopic}
        onClose={() => setTopicToDelete(null)}
      />

      {/* Clear All Data Confirmation (Section 20 requirement) */}
      <ConfirmModal
        isOpen={isClearDataModalOpen}
        title="Clear All Learning Data"
        message="Are you sure you want to delete all your learning data? This cannot be undone."
        confirmText="Clear Everything"
        isDestructive={true}
        onConfirm={handleClearAllData}
        onClose={() => setIsClearDataModalOpen(false)}
      />
    </div>
  );
}
