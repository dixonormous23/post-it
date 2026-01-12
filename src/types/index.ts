export interface Note {
  id: string;
  content: string;
  color: NoteColor;
  status: NoteStatus;
  sortOrder: number; // Order within the column
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  zIndex: number;
  createdAt: number;
  updatedAt: number;
  isNew?: boolean; // Flag for auto-editing new notes
  dueDate?: string; // Optional due date in ISO format (YYYY-MM-DD)
}

export type NoteStatus = 'to-come' | 'to-do' | 'doing' | 'done';

export const NOTE_STATUS_LABELS: Record<NoteStatus, string> = {
  'to-come': 'To Come',
  'to-do': 'To Do',
  'doing': 'Doing',
  'done': 'Done',
};

export const NOTE_STATUSES: NoteStatus[] = ['to-come', 'to-do', 'doing', 'done'];

export type NoteColor =
  | 'cbt'
  | 'firstThird'
  | 'stFrancis'
  | 'synchrony'
  | 'titanFlag'
  | 'life';

export const NOTE_COLORS: Record<NoteColor, string> = {
  cbt: '#BBDEFB',        // Blue
  firstThird: '#C8E6C9', // Green
  stFrancis: '#FFF9C4',  // Yellow
  synchrony: '#E1BEE7',  // Purple
  titanFlag: '#FFE0B2',  // Orange
  life: '#F8BBD9',       // Pink
};

// Color labels/categories - what each color represents
export const NOTE_COLOR_LABELS: Record<NoteColor, string> = {
  cbt: 'CBT',
  firstThird: 'First & Third',
  stFrancis: 'St Francis',
  synchrony: 'Synchrony',
  titanFlag: 'Titan Flag',
  life: 'Life',
};

// Darker versions for text/accents
export const NOTE_COLOR_ACCENTS: Record<NoteColor, string> = {
  cbt: '#1976D2',
  firstThird: '#388E3C',
  stFrancis: '#F9A825',
  synchrony: '#7B1FA2',
  titanFlag: '#E65100',
  life: '#C2185B',
};

export const NOTE_SHADOW_COLORS: Record<NoteColor, string> = {
  cbt: 'rgba(33, 150, 243, 0.2)',
  firstThird: 'rgba(76, 175, 80, 0.2)',
  stFrancis: 'rgba(255, 193, 7, 0.3)',
  synchrony: 'rgba(156, 39, 176, 0.2)',
  titanFlag: 'rgba(255, 152, 0, 0.25)',
  life: 'rgba(233, 30, 99, 0.2)',
};

export const NOTE_COLOR_OPTIONS: NoteColor[] = ['cbt', 'firstThird', 'stFrancis', 'synchrony', 'titanFlag', 'life'];

// Category system for customizable note categories
export interface Category {
  id: string;
  name: string;
  color: string;       // Background color (e.g., '#BBDEFB')
  accentColor: string; // Text/accent color (e.g., '#1976D2')
}

// Default categories matching the original colors
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cbt', name: 'CBT', color: '#BBDEFB', accentColor: '#1976D2' },
  { id: 'firstThird', name: 'First & Third', color: '#C8E6C9', accentColor: '#388E3C' },
  { id: 'stFrancis', name: 'St Francis', color: '#FFF9C4', accentColor: '#F9A825' },
  { id: 'synchrony', name: 'Synchrony', color: '#E1BEE7', accentColor: '#7B1FA2' },
  { id: 'titanFlag', name: 'Titan Flag', color: '#FFE0B2', accentColor: '#E65100' },
  { id: 'life', name: 'Life', color: '#F8BBD9', accentColor: '#C2185B' },
];

// Preset colors for new categories
export const PRESET_CATEGORY_COLORS: { color: string; accentColor: string }[] = [
  { color: '#BBDEFB', accentColor: '#1976D2' }, // Blue
  { color: '#C8E6C9', accentColor: '#388E3C' }, // Green
  { color: '#FFF9C4', accentColor: '#F9A825' }, // Yellow
  { color: '#E1BEE7', accentColor: '#7B1FA2' }, // Purple
  { color: '#FFE0B2', accentColor: '#E65100' }, // Orange
  { color: '#F8BBD9', accentColor: '#C2185B' }, // Pink
  { color: '#B2EBF2', accentColor: '#00838F' }, // Cyan
  { color: '#DCEDC8', accentColor: '#558B2F' }, // Light Green
  { color: '#F5F5F5', accentColor: '#616161' }, // Grey
  { color: '#FFE0E0', accentColor: '#C62828' }, // Red
  { color: '#E8EAF6', accentColor: '#3F51B5' }, // Indigo
  { color: '#FFF8E1', accentColor: '#FF8F00' }, // Amber
];

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  colorId?: string;
}

// Local calendar events (created without Google integration)
export interface LocalCalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date format (YYYY-MM-DD)
  time?: string; // Optional time in HH:MM format
  isAllDay: boolean;
  color: string; // Hex color
  createdAt: number;
  updatedAt: number;
}

// Unified calendar item for display purposes
export type CalendarItemType = 'google' | 'local' | 'note';

export interface CalendarItem {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  isAllDay: boolean;
  type: CalendarItemType;
  color: string;
  accentColor: string;
  // Reference to the original item
  sourceId: string;
  // For notes, include the note status
  noteStatus?: NoteStatus;
}

export interface DragState {
  isDragging: boolean;
  activeId: string | null;
  offset: { x: number; y: number };
}
