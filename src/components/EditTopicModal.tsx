import { useState, useEffect, type FormEvent } from 'react';
import { X, Edit3 } from 'lucide-react';
import { Topic } from '../types';

interface EditTopicModalProps {
  topic: Topic | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (topicId: string, name: string, description?: string) => void;
}

export default function EditTopicModal({
  topic,
  isOpen,
  onClose,
  onSave,
}: EditTopicModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (topic) {
      setName(topic.name);
      setDescription(topic.description || '');
      setError('');
    }
  }, [topic]);

  if (!isOpen || !topic) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Topic name cannot be empty.');
      return;
    }
    onSave(topic.id, trimmed, description.trim() || undefined);
    onClose();
  };

  return (
    <div
      id="edit-topic-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-topic-modal-title"
    >
      <div className="bg-[#13161c] border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 id="edit-topic-modal-title" className="text-base font-semibold text-zinc-100">
                Edit Topic
              </h2>
              <p className="text-xs text-zinc-400">Update topic name and details</p>
            </div>
          </div>
          <button
            type="button"
            id="close-edit-topic-modal-btn"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 bg-rose-950/50 border border-rose-800/60 rounded-lg text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="edit-topic-name-input" className="block text-xs font-medium text-zinc-300 mb-1.5">
              Topic Name <span className="text-emerald-400">*</span>
            </label>
            <input
              id="edit-topic-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="edit-topic-desc-input" className="block text-xs font-medium text-zinc-300 mb-1.5">
              Description <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <textarea
              id="edit-topic-desc-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-800/80">
            <button
              type="button"
              id="cancel-edit-topic-btn"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-edit-topic-btn"
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
