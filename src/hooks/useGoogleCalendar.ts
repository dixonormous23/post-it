'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { CalendarEvent } from '@/types';

export function useGoogleCalendar() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!session?.accessToken) {
      setEvents([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const now = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);

      const timeMin = now.toISOString();
      const timeMax = weekFromNow.toISOString();

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        `timeMin=${encodeURIComponent(timeMin)}&` +
        `timeMax=${encodeURIComponent(timeMax)}&` +
        `singleEvents=true&` +
        `orderBy=startTime&` +
        `maxResults=50`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }

      const data = await response.json();
      setEvents(data.items || []);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchEvents();
    }
  }, [status, fetchEvents]);

  const refresh = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    error,
    isAuthenticated: status === 'authenticated',
    isAuthLoading: status === 'loading',
    refresh,
  };
}

// Helper function to format event time
export function formatEventTime(event: CalendarEvent): string {
  const startDate = event.start.dateTime || event.start.date;
  if (!startDate) return '';

  const date = new Date(startDate);
  
  // All-day event
  if (event.start.date && !event.start.dateTime) {
    return 'All day';
  }

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Helper function to format event date
export function formatEventDate(event: CalendarEvent): string {
  const startDate = event.start.dateTime || event.start.date;
  if (!startDate) return '';

  const date = new Date(startDate);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Group events by date
export function groupEventsByDate(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
  const grouped: Record<string, CalendarEvent[]> = {};

  events.forEach((event) => {
    const dateKey = formatEventDate(event);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(event);
  });

  return grouped;
}

