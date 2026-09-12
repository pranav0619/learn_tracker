import { useState, useRef, useEffect, type KeyboardEvent, type Key } from 'react';
import { Check, Edit2, Trash2, X } from 'lucide-react';
import { Subtopic } from '../types';

interface SubtopicItemProps {
  key?: Key;
  subtopic: Subtopic;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

export default function SubtopicItem({
  subtopic,
  onToggle,
  onEdit,
  onDelete,
}: SubtopicItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subtopic.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== subtopic.name) {
      onEdit(subtopic.id, trimmed);
    } else {
      setEditName(subtopic.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditName(subtopic.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      id={`subtopic-item-${subtopic.id}`}
      className="group flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-800/40 transition-colors text-sm border border-transparent hover:border-zinc-800/60"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Custom Dark Checkbox */}
        <button
          type="button"
          id={`checkbox-${subtopic.id}`}
          role="checkbox"
          aria-checked={subtopic.completed}
          aria-label={`Mark "${subtopic.name}" as ${subtopic.completed ? 'incomplete' : 'completed'}`}
          onClick={() => onToggle(subtopic.id, !subtopic.completed)}
          className={`w-5 h-5 rounded flex items-center justify-center transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
            subtopic.completed
              ? 'bg-emerald-500 text-zinc-950 border border-emerald-400 font-bold'
              : 'border border-zinc-600 bg-zinc-900/60 hover:border-zinc-400 text-transparent'
          }`}
        >
          <Check className={`w-3.5 h-3.5 stroke-[3] ${subtopic.completed ? 'opacity-100' : 'opacity-0'}`} />
        </button>

        {isEditing ? (
          <div className="flex items-center gap-1.5 flex-1 mr-2">
            <input
              ref={inputRef}
              id={`edit-input-${subtopic.id}`}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              className="w-full bg-zinc-950 px-2 py-1 text-sm text-zinc-100 rounded border border-zinc-700 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              id={`save-subtopic-btn-${subtopic.id}`}
              onClick={handleSaveEdit}
              title="Save"
              className="p-1 text-emerald-400 hover:text-emerald-300 rounded hover:bg-zinc-800"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              id={`cancel-subtopic-btn-${subtopic.id}`}
              onClick={() => {
                setEditName(subtopic.name);
                setIsEditing(false);
              }}
              title="Cancel"
              className="p-1 text-zinc-400 hover:text-zinc-200 rounded hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <span
            onClick={() => onToggle(subtopic.id, !subtopic.completed)}
            className={`truncate cursor-pointer select-none transition-colors ${
              subtopic.completed
                ? 'text-zinc-500 line-through decoration-zinc-600'
                : 'text-zinc-200 hover:text-white'
            }`}
            title={subtopic.name}
          >
            {subtopic.name}
          </span>
        )}
      </div>

      {/* Subtle Actions on hover */}
      {!isEditing && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity pl-2 shrink-0">
          <button
            type="button"
            id={`edit-subtopic-btn-${subtopic.id}`}
            onClick={() => setIsEditing(true)}
            title="Edit subtopic"
            aria-label="Edit subtopic"
            className="p-1 text-zinc-500 hover:text-zinc-200 rounded hover:bg-zinc-700/50 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            id={`delete-subtopic-btn-${subtopic.id}`}
            onClick={() => onDelete(subtopic.id)}
            title="Delete subtopic"
            aria-label="Delete subtopic"
            className="p-1 text-zinc-500 hover:text-rose-400 rounded hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
