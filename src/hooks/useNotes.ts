'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Note, NoteColor, NoteStatus } from '@/types';

const STORAGE_KEY = 'sticky-notes-data-v3';
const OLD_STORAGE_KEY_V2 = 'sticky-notes-data-v2';
const OLD_STORAGE_KEY_V1 = 'sticky-notes-data';

const generateId = () => `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const DEFAULT_NOTE_SIZE = {
  width: 220,
  height: 180,
};

// Migration function to add sortOrder to old notes
function migrateNotes(oldNotes: Partial<Note>[]): Note[] {
  // Group notes by status to assign proper sort orders
  const notesByStatus: Record<string, Partial<Note>[]> = {};
  
  oldNotes.forEach((note) => {
    const status = note.status || 'to-do';
    if (!notesByStatus[status]) {
      notesByStatus[status] = [];
    }
    notesByStatus[status].push(note);
  });

  // Sort each group by createdAt to maintain chronological order, then assign sortOrder
  const migratedNotes: Note[] = [];
  
  Object.keys(notesByStatus).forEach((status) => {
    const statusNotes = notesByStatus[status].sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
    statusNotes.forEach((note, index) => {
      migratedNotes.push({
        id: note.id || generateId(),
        status: (note.status as NoteStatus) || 'to-do',
        sortOrder: note.sortOrder ?? index,
        color: (note.color as NoteColor) || 'cbt',
        content: note.content || '',
        position: note.position || { x: 0, y: 0 },
        size: note.size || DEFAULT_NOTE_SIZE,
        zIndex: note.zIndex ?? index,
        createdAt: note.createdAt || Date.now(),
        updatedAt: note.updatedAt || Date.now(),
      });
    });
  });

  return migratedNotes;
}

// Check for and perform migration on first load
function checkAndMigrateData(): Note[] | null {
  if (typeof window === 'undefined') return null;

  // Check if v3 data already exists
  const v3Data = window.localStorage.getItem(STORAGE_KEY);
  if (v3Data) {
    try {
      const parsed = JSON.parse(v3Data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return null; // v3 data exists, no migration needed
      }
    } catch {
      // Invalid v3 data, continue to check for old data
    }
  }

  // Try to migrate from v2
  const v2Data = window.localStorage.getItem(OLD_STORAGE_KEY_V2);
  if (v2Data) {
    try {
      const oldNotes = JSON.parse(v2Data);
      if (Array.isArray(oldNotes) && oldNotes.length > 0) {
        console.log(`Migrating ${oldNotes.length} notes from v2 to v3...`);
        const migratedNotes = migrateNotes(oldNotes);
        
        // Save migrated data to v3
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedNotes));
        
        // Remove old v2 data
        window.localStorage.removeItem(OLD_STORAGE_KEY_V2);
        
        console.log('Migration complete!');
        return migratedNotes;
      }
    } catch (e) {
      console.error('Error migrating v2 data:', e);
    }
  }

  // Try to migrate from v1 (original key without version)
  const v1Data = window.localStorage.getItem(OLD_STORAGE_KEY_V1);
  if (v1Data) {
    try {
      const oldNotes = JSON.parse(v1Data);
      if (Array.isArray(oldNotes) && oldNotes.length > 0) {
        console.log(`Migrating ${oldNotes.length} notes from v1 to v3...`);
        const migratedNotes = migrateNotes(oldNotes);
        
        // Save migrated data to v3
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedNotes));
        
        // Remove old v1 data
        window.localStorage.removeItem(OLD_STORAGE_KEY_V1);
        
        console.log('Migration complete!');
        return migratedNotes;
      }
    } catch (e) {
      console.error('Error migrating v1 data:', e);
    }
  }

  return null;
}

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEY, []);
  const [newlyCreatedNoteId, setNewlyCreatedNoteId] = useState<string | null>(null);
  const [hasMigrated, setHasMigrated] = useState(false);

  // Run migration on first load
  useEffect(() => {
    if (hasMigrated) return;
    
    const migratedData = checkAndMigrateData();
    if (migratedData) {
      setNotes(migratedData);
    }
    // Defer setting hasMigrated to avoid cascading renders
    setTimeout(() => setHasMigrated(true), 0);
  }, [hasMigrated, setNotes]);

  // Sort notes by sortOrder within each status
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      // First sort by status, then by sortOrder
      if (a.status !== b.status) {
        return 0; // Keep original order for different statuses
      }
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    });
  }, [notes]);

  // Group notes by status for Kanban columns, sorted by sortOrder
  const notesByStatus = useMemo(() => {
    const grouped: Record<NoteStatus, Note[]> = {
      'to-come': [],
      'to-do': [],
      'doing': [],
      'done': [],
    };

    notes.forEach((note) => {
      const status = note.status || 'to-do';
      if (grouped[status]) {
        grouped[status].push(note);
      } else {
        grouped['to-do'].push(note);
      }
    });

    // Sort each group by sortOrder
    Object.keys(grouped).forEach((status) => {
      grouped[status as NoteStatus].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    });

    return grouped;
  }, [notes]);

  const maxZIndex = useMemo(() => {
    return notes.reduce((max, note) => Math.max(max, note.zIndex), 0);
  }, [notes]);

  const getMaxSortOrder = useCallback((status: NoteStatus) => {
    const statusNotes = notes.filter(n => n.status === status);
    if (statusNotes.length === 0) return 0;
    return Math.max(...statusNotes.map(n => n.sortOrder ?? 0));
  }, [notes]);

  const createNote = useCallback((
    color: NoteColor = 'cbt',
    status: NoteStatus = 'to-do',
    isNew: boolean = false,
    initialContent: string = ''
  ) => {
    const maxSort = getMaxSortOrder(status);
    const newNote: Note = {
      id: generateId(),
      content: initialContent,
      color,
      status,
      sortOrder: maxSort + 1,
      position: { x: 0, y: 0 },
      size: DEFAULT_NOTE_SIZE,
      zIndex: maxZIndex + 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isNew: isNew && !initialContent, // Only auto-edit if no content provided
    };

    setNotes((prev) => [...prev, newNote]);
    if (newNote.isNew) {
      setNewlyCreatedNoteId(newNote.id);
    }
    return newNote;
  }, [maxZIndex, setNotes, getMaxSortOrder]);

  const updateNote = useCallback((id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: Date.now() }
          : note
      )
    );
  }, [setNotes]);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, [setNotes]);

  const bringToFront = useCallback((id: string) => {
    setNotes((prev) => {
      const currentMax = prev.reduce((max, note) => Math.max(max, note.zIndex), 0);
      return prev.map((note) =>
        note.id === id
          ? { ...note, zIndex: currentMax + 1 }
          : note
      );
    });
  }, [setNotes]);

  const updatePosition = useCallback((id: string, position: { x: number; y: number }) => {
    updateNote(id, { position });
  }, [updateNote]);

  const updateSize = useCallback((id: string, size: { width: number; height: number }) => {
    updateNote(id, { size });
  }, [updateNote]);

  const updateContent = useCallback((id: string, content: string) => {
    updateNote(id, { content });
  }, [updateNote]);

  const updateColor = useCallback((id: string, color: NoteColor) => {
    updateNote(id, { color });
  }, [updateNote]);

  const updateStatus = useCallback((id: string, status: NoteStatus) => {
    updateNote(id, { status });
  }, [updateNote]);

  const moveNoteToStatus = useCallback((noteId: string, newStatus: NoteStatus, newIndex?: number) => {
    setNotes((prev) => {
      const noteToMove = prev.find(n => n.id === noteId);
      if (!noteToMove) return prev;

      // Get notes in the target status
      const targetNotes = prev
        .filter(n => n.status === newStatus && n.id !== noteId)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

      // Determine the new sort order
      let newSortOrder: number;
      if (newIndex !== undefined && newIndex < targetNotes.length) {
        // Insert at specific position
        newSortOrder = targetNotes[newIndex]?.sortOrder ?? 0;
      } else {
        // Add at the end
        newSortOrder = targetNotes.length > 0 
          ? Math.max(...targetNotes.map(n => n.sortOrder ?? 0)) + 1 
          : 0;
      }

      // Update sort orders for notes that need to shift
      return prev.map((note) => {
        if (note.id === noteId) {
          return { ...note, status: newStatus, sortOrder: newSortOrder, updatedAt: Date.now() };
        }
        // Shift notes in target column that are at or after the insert position
        if (note.status === newStatus && (note.sortOrder ?? 0) >= newSortOrder) {
          return { ...note, sortOrder: (note.sortOrder ?? 0) + 1 };
        }
        return note;
      });
    });
  }, [setNotes]);

  const reorderNote = useCallback((noteId: string, overNoteId: string) => {
    setNotes((prev) => {
      const activeNote = prev.find(n => n.id === noteId);
      const overNote = prev.find(n => n.id === overNoteId);
      
      if (!activeNote || !overNote) return prev;
      if (activeNote.status !== overNote.status) return prev; // Different columns, handled by moveNoteToStatus
      
      const columnNotes = prev
        .filter(n => n.status === activeNote.status)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      
      const activeIndex = columnNotes.findIndex(n => n.id === noteId);
      const overIndex = columnNotes.findIndex(n => n.id === overNoteId);
      
      if (activeIndex === -1 || overIndex === -1) return prev;
      if (activeIndex === overIndex) return prev;

      // Reorder the column notes
      const newColumnNotes = [...columnNotes];
      const [removed] = newColumnNotes.splice(activeIndex, 1);
      newColumnNotes.splice(overIndex, 0, removed);

      // Assign new sort orders
      const updatedIds = new Map<string, number>();
      newColumnNotes.forEach((note, index) => {
        updatedIds.set(note.id, index);
      });

      return prev.map((note) => {
        const newOrder = updatedIds.get(note.id);
        if (newOrder !== undefined) {
          return { ...note, sortOrder: newOrder, updatedAt: Date.now() };
        }
        return note;
      });
    });
  }, [setNotes]);

  const clearNewFlag = useCallback((id: string) => {
    updateNote(id, { isNew: false });
    if (newlyCreatedNoteId === id) {
      setNewlyCreatedNoteId(null);
    }
  }, [updateNote, newlyCreatedNoteId]);

  return {
    notes: sortedNotes,
    notesByStatus,
    newlyCreatedNoteId,
    createNote,
    updateNote,
    deleteNote,
    bringToFront,
    updatePosition,
    updateSize,
    updateContent,
    updateColor,
    updateStatus,
    moveNoteToStatus,
    reorderNote,
    clearNewFlag,
  };
}
