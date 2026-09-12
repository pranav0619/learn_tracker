import { useState, useRef, type KeyboardEvent, type Key } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Topic } from '../types';
import SubtopicItem from './SubtopicItem';
import ProgressBar from './ProgressBar';

interface TopicCardProps {
  key?: Key;
  topic: Topic;
  onToggleSubtopic: (topicId: string, subtopicId: string, completed: boolean) => void;
  onAddSubtopic: (topicId: string, name: string) => void;
  onEditSubtopic: (topicId: string, subtopicId: string, newName: string) => void;
  onDeleteSubtopic: (topicId: string, subtopicId: string) => void;
  onEditTopic: (topic: Topic) => void;
  onDeleteTopic: (topic: Topic) => void;
}

export default function TopicCard({
  topic,
  onToggleSubtopic,
  onAddSubtopic,
  onEditSubtopic,
  onDeleteSubtopic,
  onEditTopic,
  onDeleteTopic,
}: TopicCardProps) {
  const [isAddingSubtopic, setIsAddingSubtopic] = useState(false);
  const [newSubtopicName, setNewSubtopicName] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const addInputRef = useRef<HTMLInputElement>(null);

  const total = topic.subtopics.length;
  const completed = topic.subtopics.filter((s) => s.completed).length;
  const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const handleStartAdd = () => {
    setIsAddingSubtopic(true);
    setTimeout(() => {
      addInputRef.current?.focus();
    }, 50);
  };

  const handleSaveNewSubtopic = () => {
    const trimmed = newSubtopicName.trim();
    if (trimmed) {
      onAddSubtopic(topic.id, trimmed);
      setNewSubtopicName('');
    }
    setIsAddingSubtopic(false);
  };

  const handleAddKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = newSubtopicName.trim();
      if (trimmed) {
        onAddSubtopic(topic.id, trimmed);
        setNewSubtopicName('');
        // keep focus for rapid adding of multiple subtopics!
      }
    } else if (e.key === 'Escape') {
      setIsAddingSubtopic(false);
      setNewSubtopicName('');
    }
  };

  return (
    <div
      id={`topic-card-${topic.id}`}
      className="bg-[#14171d] rounded-xl border border-zinc-800/80 p-5 sm:p-6 shadow-md transition-all duration-200 hover:border-zinc-700/80 flex flex-col justify-between"
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4 mb-2.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3
                id={`topic-title-${topic.id}`}
                className="text-lg font-semibold text-zinc-100 truncate"
                title={topic.name}
              >
                {topic.name}
              </h3>
              {progressPercent === 100 && total > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 shrink-0">
                  <CheckCircle2 className="w-3 h-3" /> Done
                </span>
              )}
            </div>
            {topic.description && (
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                {topic.description}
              </p>
            )}
          </div>

          <div className="text-right shrink-0">
            <span
              id={`topic-progress-${topic.id}`}
              className="text-base font-bold font-mono text-zinc-100"
            >
              {progressPercent}%
            </span>
            <div className="text-[11px] text-zinc-500 font-mono">
              {completed}/{total}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <ProgressBar percentage={progressPercent} size="md" id={`topic-bar-${topic.id}`} />
        </div>

        {/* Subtopics List Header & Toggle */}
        <div className="flex items-center justify-between text-xs text-zinc-400 font-medium mb-1 px-1">
          <span>Subtopics ({total})</span>
          {total > 0 && (
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded transition-colors flex items-center gap-1"
              title={isCollapsed ? 'Expand subtopics' : 'Collapse subtopics'}
            >
              {isCollapsed ? (
                <>
                  <span className="text-[11px]">Show</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span className="text-[11px]">Hide</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Subtopics List */}
        {!isCollapsed && (
          <div className="space-y-1 mb-2">
            {topic.subtopics.map((subtopic) => (
              <SubtopicItem
                key={subtopic.id}
                subtopic={subtopic}
                onToggle={(subId, completedState) =>
                  onToggleSubtopic(topic.id, subId, completedState)
                }
                onEdit={(subId, newName) => onEditSubtopic(topic.id, subId, newName)}
                onDelete={(subId) => onDeleteSubtopic(topic.id, subId)}
              />
            ))}

            {/* Quick Inline Add Subtopic Input */}
            {isAddingSubtopic && (
              <div className="flex items-center gap-2 py-1.5 px-3 bg-zinc-900/90 rounded-lg border border-emerald-500/50 mt-1">
                <input
                  ref={addInputRef}
                  id={`new-subtopic-input-${topic.id}`}
                  type="text"
                  value={newSubtopicName}
                  placeholder="Subtopic name (press Enter to add)..."
                  onChange={(e) => setNewSubtopicName(e.target.value)}
                  onKeyDown={handleAddKeyDown}
                  className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                />
                <button
                  type="button"
                  id={`confirm-add-subtopic-${topic.id}`}
                  onClick={handleSaveNewSubtopic}
                  disabled={!newSubtopicName.trim()}
                  className="px-2 py-1 text-xs font-medium rounded bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 transition-colors shrink-0"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingSubtopic(false);
                    setNewSubtopicName('');
                  }}
                  className="px-1.5 py-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors shrink-0"
                >
                  Done
                </button>
              </div>
            )}

            {topic.subtopics.length === 0 && !isAddingSubtopic && (
              <div className="py-4 text-center text-xs text-zinc-500 italic bg-zinc-900/30 rounded-lg border border-dashed border-zinc-800">
                No subtopics yet. Click &ldquo;+ Add Subtopic&rdquo; below.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
        <button
          type="button"
          id={`add-subtopic-btn-${topic.id}`}
          onClick={handleStartAdd}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 py-1.5 px-2.5 rounded-lg hover:bg-emerald-950/40 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Subtopic</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id={`edit-topic-btn-${topic.id}`}
            onClick={() => onEditTopic(topic)}
            className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 py-1.5 px-2.5 rounded-lg hover:bg-zinc-800/60 transition-colors"
            title="Edit topic details"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            id={`delete-topic-btn-${topic.id}`}
            onClick={() => onDeleteTopic(topic)}
            className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-rose-400 py-1.5 px-2.5 rounded-lg hover:bg-rose-950/30 transition-colors"
            title="Delete topic"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
