'use client';

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  useDroppable,
  DragOverlay,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Note, NoteColor, NoteStatus, NOTE_STATUS_LABELS, NOTE_STATUSES } from '@/types';
import { useCategories } from '@/hooks/useCategories';
import { StickyNote } from '../StickyNote/StickyNote';
import { Sidebar } from '../Sidebar/Sidebar';
import {
  CanvasContainer,
  KanbanBoard,
  ColumnContainer,
  ColumnHeader,
  ColumnTitle,
  NoteCount,
  ColumnContent,
  EmptyColumn,
  CollapseButton,
  CollapsedContent,
  CollapsedNoteCount,
  CollapsedLabel,
} from './Canvas.styles';
import styled from 'styled-components';

// Wrapper to contain both sidebar and board inside DndContext
const CanvasWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  overflow: hidden;
`;

// Preview note for drag overlay when creating from sidebar
const PreviewNoteContainer = styled.div<{ $bgColor: string }>`
  width: 220px;
  min-height: 140px;
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 12px;
  opacity: 0.95;
`;

const PreviewLabel = styled.span<{ $accentColor: string }>`
  display: inline-block;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  background: ${({ $accentColor }) => $accentColor}20;
  border: 1px solid ${({ $accentColor }) => $accentColor}40;
  border-radius: 12px;
  color: ${({ $accentColor }) => $accentColor};
  margin-bottom: 12px;
`;

const PreviewContent = styled.div`
  font-family: 'Caveat', cursive;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.3);
`;

const DragOverlayNote = styled.div<{ $bgColor: string }>`
  width: 220px;
  min-height: 140px;
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.15);
  padding: 12px;
  transform: rotate(2deg);
`;

interface CanvasProps {
  notesByStatus: Record<NoteStatus, Note[]>;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  onBringToFront: (id: string) => void;
  onMoveToStatus: (noteId: string, status: NoteStatus, newIndex?: number) => void;
  onReorderNote: (noteId: string, overNoteId: string) => void;
  onCreateNote: (color: NoteColor, status: NoteStatus) => void;
  onClearNewFlag: (id: string) => void;
}

interface KanbanColumnProps {
  status: NoteStatus;
  notes: Note[];
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  onBringToFront: (id: string) => void;
  onClearNewFlag: (id: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  notes,
  onUpdateNote,
  onDeleteNote,
  onBringToFront,
  onClearNewFlag,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'column',
      status,
    },
  });

  const noteIds = useMemo(() => notes.map(n => n.id), [notes]);
  const isDoneColumn = status === 'done';

  // Collapsed view for Done column
  if (isCollapsed && isDoneColumn) {
    return (
      <ColumnContainer
        ref={setNodeRef}
        $isOver={isOver}
        $isCollapsed={true}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={onToggleCollapse}
        style={{ cursor: 'pointer' }}
      >
        <CollapsedContent>
          <CollapsedNoteCount>{notes.length}</CollapsedNoteCount>
          <Check size={16} color="#16a34a" />
          <CollapsedLabel>Done</CollapsedLabel>
        </CollapsedContent>
      </ColumnContainer>
    );
  }

  return (
    <ColumnContainer
      ref={setNodeRef}
      $isOver={isOver}
      $isCollapsed={false}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ColumnHeader $isCollapsed={false}>
        <ColumnTitle>
          {NOTE_STATUS_LABELS[status]}
          <NoteCount>{notes.length}</NoteCount>
        </ColumnTitle>
        {isDoneColumn && onToggleCollapse && (
          <CollapseButton onClick={onToggleCollapse} title="Collapse Done column">
            <ChevronRight size={16} />
          </CollapseButton>
        )}
      </ColumnHeader>
      <ColumnContent>
        <SortableContext items={noteIds} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {notes.length === 0 ? (
              <EmptyColumn key="empty">
                Drag a category from the sidebar to create a note
              </EmptyColumn>
            ) : (
              notes.map((note) => (
                <StickyNote
                  key={note.id}
                  note={note}
                  onUpdate={onUpdateNote}
                  onDelete={onDeleteNote}
                  onBringToFront={onBringToFront}
                  onClearNewFlag={onClearNewFlag}
                />
              ))
            )}
          </AnimatePresence>
        </SortableContext>
      </ColumnContent>
    </ColumnContainer>
  );
};

const EMPTY_NOTES_BY_STATUS: Record<NoteStatus, Note[]> = {
  'to-come': [],
  'to-do': [],
  'doing': [],
  'done': [],
};

const DONE_COLLAPSED_KEY = 'sticky-notes-done-collapsed';

export const Canvas: React.FC<CanvasProps> = ({
  notesByStatus,
  onUpdateNote,
  onDeleteNote,
  onBringToFront,
  onMoveToStatus,
  onReorderNote,
  onCreateNote,
  onClearNewFlag,
}) => {
  const [activeItem, setActiveItem] = React.useState<{ type: 'note' | 'create'; note?: Note; color?: NoteColor } | null>(null);
  const [isDoneCollapsed, setIsDoneCollapsed] = useState(false);
  const { getCategoryColor, getCategoryAccentColor, getCategoryLabel } = useCategories();
  
  // Load collapsed state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(DONE_COLLAPSED_KEY);
      if (saved === 'true') {
        setIsDoneCollapsed(true);
      }
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleDoneCollapsed = useCallback(() => {
    setIsDoneCollapsed(prev => {
      const newValue = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(DONE_COLLAPSED_KEY, String(newValue));
      }
      return newValue;
    });
  }, []);
  
  // Ensure notesByStatus is always valid
  const safeNotesByStatus = notesByStatus || EMPTY_NOTES_BY_STATUS;

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  const sensors = useSensors(pointerSensor, touchSensor);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;
    
    if (data?.type === 'note' && data.note) {
      setActiveItem({ type: 'note', note: data.note });
    } else if (data?.type === 'create-note' && data.color) {
      setActiveItem({ type: 'create', color: data.color });
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    const activeData = active.data.current;
    const overData = over.data.current;
    
    // Check if this is a create-note drag from sidebar
    if (activeData?.type === 'create-note' && activeData.color) {
      // Dropped on a column
      if (NOTE_STATUSES.includes(overId as NoteStatus)) {
        onCreateNote(activeData.color, overId as NoteStatus);
        return;
      }
      // Dropped on a note - create in that note's column
      if (overData?.note) {
        onCreateNote(activeData.color, overData.note.status);
        return;
      }
      return;
    }
    
    // Regular note drag
    if (activeData?.type === 'note' && activeData.note) {
      const activeNote = activeData.note as Note;
      
      // Dropped on a column (empty area or column header)
      if (NOTE_STATUSES.includes(overId as NoteStatus)) {
        if (activeNote.status !== overId) {
          onMoveToStatus(activeId, overId as NoteStatus);
        }
        return;
      }
      
      // Dropped on another note
      if (overData?.note) {
        const overNote = overData.note as Note;
        
        if (activeNote.status === overNote.status) {
          // Same column - reorder
          if (activeId !== overId) {
            onReorderNote(activeId, overId);
          }
        } else {
          // Different column - move to that column
          onMoveToStatus(activeId, overNote.status);
        }
      }
    }
  }, [onMoveToStatus, onReorderNote, onCreateNote]);

  // Custom collision detection that prefers notes over columns
  const collisionDetection: CollisionDetection = useCallback((args) => {
    // First check for intersections with notes
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      // Prefer notes over columns
      const noteCollision = pointerCollisions.find(c => 
        c.data?.droppableContainer?.data?.current?.note
      );
      if (noteCollision) return [noteCollision];
      return pointerCollisions;
    }
    
    // Fall back to rect intersection for columns
    return rectIntersection(args);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CanvasWrapper>
        <Sidebar />
        <CanvasContainer>
          <KanbanBoard>
            {NOTE_STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                notes={safeNotesByStatus[status] || []}
                onUpdateNote={onUpdateNote}
                onDeleteNote={onDeleteNote}
                onBringToFront={onBringToFront}
                onClearNewFlag={onClearNewFlag}
                isCollapsed={status === 'done' ? isDoneCollapsed : false}
                onToggleCollapse={status === 'done' ? toggleDoneCollapsed : undefined}
              />
            ))}
          </KanbanBoard>
        </CanvasContainer>
      </CanvasWrapper>
      <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
        {activeItem?.type === 'note' && activeItem.note ? (
          <DragOverlayNote $bgColor={getCategoryColor(activeItem.note.color)}>
            <PreviewLabel $accentColor={getCategoryAccentColor(activeItem.note.color)}>
              {getCategoryLabel(activeItem.note.color)}
            </PreviewLabel>
            <PreviewContent style={{ color: 'rgba(0,0,0,0.6)' }}>
              {activeItem.note.content || 'Empty note...'}
            </PreviewContent>
          </DragOverlayNote>
        ) : activeItem?.type === 'create' && activeItem.color ? (
          <PreviewNoteContainer $bgColor={getCategoryColor(activeItem.color)}>
            <PreviewLabel $accentColor={getCategoryAccentColor(activeItem.color)}>
              {getCategoryLabel(activeItem.color)}
            </PreviewLabel>
            <PreviewContent>
              Drop in a column to create...
            </PreviewContent>
          </PreviewNoteContainer>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Canvas;
