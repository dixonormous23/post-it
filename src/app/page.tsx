'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Canvas } from '@/components/Canvas/Canvas';
import { CreateNoteModal } from '@/components/Modal/CreateNoteModal';
import { useNotes } from '@/hooks/useNotes';
import { NoteColor, NoteStatus } from '@/types';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    notesByStatus,
    createNote,
    updateNote,
    deleteNote,
    bringToFront,
    moveNoteToStatus,
    reorderNote,
    clearNewFlag,
  } = useNotes();

  // Keyboard shortcut for opening create modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Open modal on 'c' key
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Create note from modal with content
  const handleCreateNoteFromModal = useCallback((color: NoteColor, status: NoteStatus, content: string) => {
    createNote(color, status, false, content);
  }, [createNote]);

  // Create note from sidebar drag (auto-edit mode)
  const handleCreateNoteFromSidebar = useCallback((color: NoteColor, status: NoteStatus) => {
    createNote(color, status, true);
  }, [createNote]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <AppLayout>
      <Canvas
        notesByStatus={notesByStatus}
        onUpdateNote={updateNote}
        onDeleteNote={deleteNote}
        onBringToFront={bringToFront}
        onMoveToStatus={moveNoteToStatus}
        onReorderNote={reorderNote}
        onCreateNote={handleCreateNoteFromSidebar}
        onClearNewFlag={clearNewFlag}
      />
      <CreateNoteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onCreateNote={handleCreateNoteFromModal}
      />
    </AppLayout>
  );
}
