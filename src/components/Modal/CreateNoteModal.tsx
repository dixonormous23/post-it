'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import { NoteColor, NoteStatus, NOTE_COLOR_LABELS, NOTE_COLOR_OPTIONS, NOTE_STATUS_LABELS, NOTE_STATUSES } from '@/types';
import {
  Overlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalSubtitle,
  ModalBody,
  FieldGroup,
  FieldLabel,
  CategoryGrid,
  CategoryButton,
  CategoryDot,
  CategoryLabel,
  StatusGrid,
  StatusButton,
  StatusLabel,
  ModalFooter,
  CancelButton,
  CreateButton,
  KeyboardHint,
  KeyBadge,
  NoteContentArea,
} from './CreateNoteModal.styles';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNote: (color: NoteColor, status: NoteStatus, content: string) => void;
}

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  onCreateNote,
}) => {
  const [selectedColor, setSelectedColor] = useState<NoteColor>('cbt');
  const [selectedStatus, setSelectedStatus] = useState<NoteStatus>('to-do');
  const [content, setContent] = useState('');
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset selections and focus textarea when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedColor('cbt');
      setSelectedStatus('to-do');
      setContent('');
      // Focus textarea after a short delay to allow animation
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleCreate = useCallback(() => {
    onCreateNote(selectedColor, selectedStatus, content);
    onClose();
  }, [selectedColor, selectedStatus, content, onCreateNote, onClose]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Create on Cmd/Ctrl + Enter
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleCreate();
        return;
      }

      // Only handle number keys when not focused on textarea
      if (document.activeElement !== textareaRef.current) {
        // Number keys 1-6 for category selection
        const num = parseInt(e.key);
        if (num >= 1 && num <= 6) {
          e.preventDefault();
          setSelectedColor(NOTE_COLOR_OPTIONS[num - 1]);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleCreate]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={handleOverlayClick}
        >
          <ModalContainer
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Create Note</ModalTitle>
              <ModalSubtitle>
                Write your note and select a category and status
              </ModalSubtitle>
            </ModalHeader>

            <ModalBody>
              <FieldGroup>
                <FieldLabel>Note Content</FieldLabel>
                <NoteContentArea
                  ref={textareaRef}
                  $color={selectedColor}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note here..."
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>
                  Category
                  <KeyboardHint>
                    Press <KeyBadge>1</KeyBadge>-<KeyBadge>6</KeyBadge> to select
                  </KeyboardHint>
                </FieldLabel>
                <CategoryGrid>
                  {NOTE_COLOR_OPTIONS.map((color) => (
                    <CategoryButton
                      key={color}
                      $color={color}
                      $isSelected={selectedColor === color}
                      onClick={() => setSelectedColor(color)}
                      type="button"
                    >
                      <CategoryDot $color={color} />
                      <CategoryLabel $color={color} $isSelected={selectedColor === color}>
                        {NOTE_COLOR_LABELS[color]}
                      </CategoryLabel>
                    </CategoryButton>
                  ))}
                </CategoryGrid>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Status</FieldLabel>
                <StatusGrid>
                  {NOTE_STATUSES.map((status) => (
                    <StatusButton
                      key={status}
                      $isSelected={selectedStatus === status}
                      onClick={() => setSelectedStatus(status)}
                      type="button"
                    >
                      <StatusLabel $isSelected={selectedStatus === status}>
                        {NOTE_STATUS_LABELS[status]}
                      </StatusLabel>
                    </StatusButton>
                  ))}
                </StatusGrid>
              </FieldGroup>
            </ModalBody>

            <ModalFooter>
              <CancelButton onClick={onClose} type="button">
                Cancel
                <KeyboardHint>
                  <KeyBadge>Esc</KeyBadge>
                </KeyboardHint>
              </CancelButton>
              <CreateButton
                onClick={handleCreate}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Note
                <KeyboardHint style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <KeyBadge style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>⌘↵</KeyBadge>
                </KeyboardHint>
              </CreateButton>
            </ModalFooter>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CreateNoteModal;
