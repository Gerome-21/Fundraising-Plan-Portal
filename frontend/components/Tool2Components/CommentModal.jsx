import React, { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

const CommentModal = ({ isOpen, onClose, onSave, initialComment, position }) => {
  const [comment, setComment] = useState(initialComment || "");
  const modalRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setComment(initialComment || "");
      // Focus the textarea when modal opens
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialComment]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSave = () => {
    onSave(comment);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000]" style={{ pointerEvents: 'none' }}>
      <div
        ref={modalRef}
        className="absolute bg-white rounded-lg shadow-xl border border-gray-200 w-80 z-[1001]"
        style={{
          top: position?.top ?? 0,
          left: (position?.left ?? 0) - 320, 
          transform: 'translateY(-40%)',  
          pointerEvents: 'auto'
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <h3 className="text-sm font-semibold text-gray-700">Edit Comment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#22864D] focus:border-transparent outline-none resize-none"
          />
          <div className="text-xs text-gray-500 mt-2">
            {comment.length} characters
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-sm bg-[#22864D] text-white rounded-lg hover:bg-[#1a6b3c] transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal