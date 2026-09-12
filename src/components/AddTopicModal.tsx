import { useState, type FormEvent } from 'react';
import { X, Plus, Trash2, BookOpen } from 'lucide-react';
import { Subtopic, Topic } from '../types';

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTopic: (newTopic: Topic) => void;
}

export default function AddTopicModal({
  isOpen,
  onClose,
  onCreateTopic,
}: AddTopicModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subtopics, setSubtopics] = useState<string[]>(['']);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddSubtopicField = () => {
    setSubtopics([...subtopics, '']);
  };

  const handleSubtopicChange = (index: number, val: string) => {
    const updated = [...subtopics];
    updated[index] = val;
    setSubtopics(updated);
  };

  const handleRemoveSubtopicField = (index: number) => {
    if (subtopics.length === 1) {
      setSubtopics(['']);
      return;
    }
    const updated = subtopics.filter((_, i) => i !== index);
    setSubtopics(updated);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please provide a topic name.');
      return;
    }

    let parsedSubtopicNames: string[] = [];

    if (bulkMode) {
      parsedSubtopicNames = bulkText
        .split('\n')
        .map((s) => s.replace(/^[-*•\d.]+\s*/, '').trim())
        .filter(Boolean);
    } else {
      parsedSubtopicNames = subtopics.map((s) => s.trim()).filter(Boolean);
    }

    const topicId = `topic-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const createdSubtopics: Subtopic[] = parsedSubtopicNames.map((subName, idx) => ({
      id: `sub-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
      topic_id: topicId,
      name: subName,
      completed: false,
      created_at: new Date().toISOString(),
    }));

    const newTopic: Topic = {
      id: topicId,
      name: trimmedName,
      description: description.trim() || undefined,
      created_at: new Date().toISOString(),
      subtopics: createdSubtopics,
    };

    onCreateTopic(newTopic);
    // Reset state & close
    setName('');
    setDescription('');
    setSubtopics(['']);
    setBulkText('');
    setBulkMode(false);
    setError('');
    onClose();
  };

  return (
    <div
      id="add-topic-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-topic-modal-title"
    >
      <div className="bg-[#13161c] border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 id="add-topic-modal-title" className="text-base font-semibold text-zinc-100">
                Add Learning Topic
              </h2>
              <p className="text-xs text-zinc-400">Create a new subject and its subtopics</p>
            </div>
          </div>
          <button
            type="button"
            id="close-add-topic-modal-btn"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-800/60 rounded-lg text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="topic-name-input" className="block text-xs font-medium text-zinc-300 mb-1.5">
              Topic Name <span className="text-emerald-400">*</span>
            </label>
            <input
              id="topic-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. REST APIs, Machine Learning, System Design"
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="topic-desc-input" className="block text-xs font-medium text-zinc-300 mb-1.5">
              Description <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <textarea
              id="topic-desc-input"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary or objective for this learning topic..."
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Subtopics Section */}
          <div className="pt-2 border-t border-zinc-800/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-zinc-300">
                Initial Subtopics <span className="text-zinc-500 font-normal">(can be edited later)</span>
              </label>
              <button
                type="button"
                onClick={() => setBulkMode(!bulkMode)}
                className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                {bulkMode ? 'Switch to line-by-line' : 'Paste multiple list'}
              </button>
            </div>

            {bulkMode ? (
              <div>
                <textarea
                  id="bulk-subtopics-input"
                  rows={6}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={`HTTP\nGET\nPOST\nPUT\nDELETE\nStatus Codes\nAuthentication`}
                  className="w-full font-mono text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg p-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                />
                <p className="text-[11px] text-zinc-500 mt-1">One subtopic per line. Bullets or numbers will be stripped automatically.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {subtopics.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 w-5 text-right font-mono">{idx + 1}.</span>
                    <input
                      id={`subtopic-input-field-${idx}`}
                      type="text"
                      value={sub}
                      onChange={(e) => handleSubtopicChange(idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubtopicField();
                        }
                      }}
                      placeholder={`e.g. Subtopic ${idx + 1}`}
                      className="flex-1 bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtopicField(idx)}
                      disabled={subtopics.length <= 1 && !sub}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 disabled:opacity-30 rounded hover:bg-zinc-800"
                      title="Remove subtopic"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  id="add-subtopic-row-btn"
                  onClick={handleAddSubtopicField}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 py-1 px-2 rounded hover:bg-emerald-950/40 transition-colors mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add another subtopic</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800/80">
            <button
              type="button"
              id="cancel-create-topic-btn"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-create-topic-btn"
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors shadow-sm shadow-emerald-500/20"
            >
              Create Topic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
