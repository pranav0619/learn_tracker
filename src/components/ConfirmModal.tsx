import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="confirm-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="bg-[#13161c] border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6">
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isDestructive
                ? 'bg-rose-950/60 border border-rose-800/40 text-rose-400'
                : 'bg-zinc-800 border border-zinc-700 text-zinc-300'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 id="confirm-modal-title" className="text-base font-semibold text-zinc-100 mb-1">
              {title}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-300 rounded hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
          <button
            type="button"
            id="confirm-modal-cancel-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            id="confirm-modal-action-btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
