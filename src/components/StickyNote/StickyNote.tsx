'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, Calendar, CalendarPlus } from 'lucide-react';
import { Note } from '@/types';
import { useCategories } from '@/hooks/useCategories';
import { DueDateModal } from '@/components/Modal/DueDateModal';
import {
  NoteContainer,
  NoteHeader,
  HeaderLeft,
  ColorLabel,
  DeleteButton,
  NoteContent,
  NoteTextarea,
  NoteFooter,
  DueDateContainer,
  DueDateText,
  DueDateIcon,
  AddDueDateButton,
} from './StickyNote.styles';

interface StickyNoteProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onBringToFront: (id: string) => void;
  onClearNewFlag?: (id: string) => void;
}

function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
  if (diffDays <= 7) return `In ${diffDays} days`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isDueSoon(dateStr: string): boolean {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 0 && diffDays <= 2;
}

function isOverdue(dateStr: string): boolean {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date < today;
}

export const StickyNote: React.FC<StickyNoteProps> = ({
  note,
  onUpdate,
  onDelete,
  onBringToFront,
  onClearNewFlag,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDueDateModal, setShowDueDateModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    getCategoryColor,
    getCategoryAccentColor,
    getCategoryLabel,
    getCategoryShadowColor,
  } = useCategories();

  const bgColor = useMemo(() => getCategoryColor(note.color), [getCategoryColor, note.color]);
  const accentColor = useMemo(() => getCategoryAccentColor(note.color), [getCategoryAccentColor, note.color]);
  const shadowColor = useMemo(() => getCategoryShadowColor(note.color), [getCategoryShadowColor, note.color]);
  const categoryLabel = useMemo(() => getCategoryLabel(note.color), [getCategoryLabel, note.color]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: note.id,
    data: {
      note,
      type: 'note',
    },
    disabled: isEditing,
  });

  // Auto-focus when note is newly created
  useEffect(() => {
    if (note.isNew && textareaRef.current) {
      setTimeout(() => {
        setIsEditing(true);
      }, 0);
      textareaRef.current.focus();
      if (onClearNewFlag) {
        onClearNewFlag(note.id);
      }
    }
  }, [note.isNew, note.id, onClearNewFlag]);

  const handleMouseDown = useCallback(() => {
    onBringToFront(note.id);
  }, [note.id, onBringToFront]);

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    onBringToFront(note.id);
  }, [note.id, onBringToFront]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(note.id, { content: e.target.value });
  }, [note.id, onUpdate]);

  const handleTextBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
  }, [note.id, onDelete]);

  const handleDueDateClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDueDateModal(true);
    onBringToFront(note.id);
  }, [note.id, onBringToFront]);

  const handleSaveDate = useCallback((date: string) => {
    onUpdate(note.id, { dueDate: date });
  }, [note.id, onUpdate]);

  const handleRemoveDate = useCallback(() => {
    onUpdate(note.id, { dueDate: undefined });
  }, [note.id, onUpdate]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 9999 : note.zIndex,
    opacity: isDragging ? 0.5 : 1,
  };

  const dueDateOverdue = note.dueDate ? isOverdue(note.dueDate) : false;
  const dueDateSoon = note.dueDate ? isDueSoon(note.dueDate) : false;

  return (
    <>
      <NoteContainer
        ref={setNodeRef}
        style={style}
        $bgColor={bgColor}
        $shadowColor={shadowColor}
        $isDragging={isDragging}
        $isEditing={isEditing}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{
          opacity: isDragging ? 0.5 : 1,
          scale: 1,
          y: 0,
        }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        layout={!isDragging}
        {...attributes}
        {...listeners}
      >
        <NoteHeader>
          <HeaderLeft>
            <ColorLabel $accentColor={accentColor}>
              {categoryLabel}
            </ColorLabel>
          </HeaderLeft>
          <DeleteButton
            onClick={handleDelete}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <X size={16} />
          </DeleteButton>
        </NoteHeader>
        <NoteContent
          onClick={handleContentClick}
          onMouseDown={(e) => isEditing && e.stopPropagation()}
          onTouchStart={(e) => isEditing && e.stopPropagation()}
        >
          <NoteTextarea
            ref={textareaRef}
            value={note.content}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            placeholder="Write something..."
            readOnly={!isEditing}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          />
        </NoteContent>
        <NoteFooter>
          {note.dueDate ? (
            <DueDateContainer
              $isOverdue={dueDateOverdue}
              $isDueSoon={dueDateSoon}
              $accentColor={accentColor}
              onClick={handleDueDateClick}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <DueDateIcon
                $isOverdue={dueDateOverdue}
                $isDueSoon={dueDateSoon}
                $accentColor={accentColor}
              >
                <Calendar size={12} />
              </DueDateIcon>
              <DueDateText
                $isOverdue={dueDateOverdue}
                $isDueSoon={dueDateSoon}
                $accentColor={accentColor}
              >
                {formatDueDate(note.dueDate)}
              </DueDateText>
            </DueDateContainer>
          ) : (
            <AddDueDateButton
              $accentColor={accentColor}
              onClick={handleDueDateClick}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <CalendarPlus size={12} />
              Add due date
            </AddDueDateButton>
          )}
        </NoteFooter>
      </NoteContainer>

      <DueDateModal
        isOpen={showDueDateModal}
        onClose={() => setShowDueDateModal(false)}
        currentDate={note.dueDate}
        onSave={handleSaveDate}
        onRemove={handleRemoveDate}
        accentColor={accentColor}
      />
    </>
  );
};

export default StickyNote;
