'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { LocalCalendarEvent, CalendarItem, Note } from '@/types';
import { useCategories } from './useCategories';

const STORAGE_KEY = 'sticky-notes-calendar-events';

const generateEventId = () => `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Preset colors for calendar events
export const EVENT_COLORS = [
  { color: '#E3F2FD', accentColor: '#1565C0', name: 'Blue' },
  { color: '#E8F5E9', accentColor: '#2E7D32', name: 'Green' },
  { color: '#FFF3E0', accentColor: '#E65100', name: 'Orange' },
  { color: '#F3E5F5', accentColor: '#7B1FA2', name: 'Purple' },
  { color: '#FCE4EC', accentColor: '#C2185B', name: 'Pink' },
  { color: '#ECEFF1', accentColor: '#455A64', name: 'Gray' },
];

export function useLocalCalendar() {
  const [events, setEvents] = useLocalStorage<LocalCalendarEvent[]>(STORAGE_KEY, []);

  const createEvent = useCallback((
    title: string,
    date: string,
    options?: {
      description?: string;
      time?: string;
      isAllDay?: boolean;
      color?: string;
    }
  ) => {
    const newEvent: LocalCalendarEvent = {
      id: generateEventId(),
      title,
      description: options?.description,
      date,
      time: options?.time,
      isAllDay: options?.isAllDay ?? !options?.time,
      color: options?.color || EVENT_COLORS[0].color,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, [setEvents]);

  const updateEvent = useCallback((id: string, updates: Partial<Omit<LocalCalendarEvent, 'id' | 'createdAt'>>) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? { ...event, ...updates, updatedAt: Date.now() } 
        : event
    ));
  }, [setEvents]);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  }, [setEvents]);

  const getEventsForDate = useCallback((date: string) => {
    return events.filter(event => event.date === date);
  }, [events]);

  return {
    events,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
  };
}

// Hook to get all calendar items (local events + notes with due dates)
export function useCalendarItems(notes: Note[]) {
  const { events: localEvents } = useLocalCalendar();
  const { getCategoryColor, getCategoryAccentColor, getCategoryLabel } = useCategories();

  const calendarItems = useMemo(() => {
    const items: CalendarItem[] = [];

    // Add local calendar events
    localEvents.forEach(event => {
      const colorPreset = EVENT_COLORS.find(c => c.color === event.color) || EVENT_COLORS[0];
      items.push({
        id: `local-${event.id}`,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        isAllDay: event.isAllDay,
        type: 'local',
        color: event.color,
        accentColor: colorPreset.accentColor,
        sourceId: event.id,
      });
    });

    // Add notes with due dates
    notes.forEach(note => {
      if (note.dueDate) {
        items.push({
          id: `note-${note.id}`,
          title: note.content.slice(0, 50) || 'Untitled note',
          description: note.content,
          date: note.dueDate,
          isAllDay: true,
          type: 'note',
          color: getCategoryColor(note.color),
          accentColor: getCategoryAccentColor(note.color),
          sourceId: note.id,
          noteStatus: note.status,
        });
      }
    });

    return items;
  }, [localEvents, notes, getCategoryColor, getCategoryAccentColor]);

  const getItemsForDate = useCallback((date: string) => {
    return calendarItems.filter(item => item.date === date);
  }, [calendarItems]);

  return {
    calendarItems,
    getItemsForDate,
  };
}
