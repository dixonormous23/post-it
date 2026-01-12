'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { ChevronLeft, ChevronRight, RefreshCw, Plus, StickyNote, Calendar as CalendarIcon2 } from 'lucide-react';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';
import { useLocalCalendar, useCalendarItems } from '@/hooks/useLocalCalendar';
import { useNotes } from '@/hooks/useNotes';
import { CalendarEvent, CalendarItem } from '@/types';
import { CalendarEventModal } from '@/components/Modal/CalendarEventModal';
import {
  CalendarContainer,
  CalendarHeader,
  HeaderLeft,
  MonthTitle,
  NavButtons,
  NavButton,
  TodayButton,
  HeaderRight,
  ViewToggle,
  ViewButton,
  CalendarGrid,
  WeekDaysRow,
  WeekDayLabel,
  DaysGrid,
  DayCell,
  DayNumber,
  EventsList,
  DynamicEventPill,
  EventTypeIcon,
  MoreEvents,
  AddEventButton,
  IntegrationSection,
  IntegrationIcon,
  IntegrationInfo,
  IntegrationTitle,
  IntegrationDescription,
  GoogleButton,
  SignOutButton,
  RefreshButton,
  LoadingOverlay,
  LoadingSpinner,
  WeekViewContainer,
  WeekViewHeader,
  WeekDayHeader,
  WeekDayName,
  WeekDayNumber,
  WeekViewGrid,
  TimeSlot,
  DayColumn,
  HourCell,
  CurrentTimeLine,
} from './CalendarView.styles';

type ViewMode = 'month' | 'week';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function formatDateToString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getGoogleEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter(event => {
    const eventDate = event.start.dateTime 
      ? new Date(event.start.dateTime) 
      : event.start.date 
        ? new Date(event.start.date + 'T00:00:00') 
        : null;
    return eventDate && isSameDay(eventDate, date);
  });
}

function getCalendarDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  
  const days: Date[] = [];
  
  // Previous month's days
  const prevMonth = new Date(year, month, 0);
  const prevMonthDays = prevMonth.getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month - 1, prevMonthDays - i));
  }
  
  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  
  // Next month's days
  const remainingDays = 42 - days.length; // 6 rows * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
}

function getWeekDays(date: Date): Date[] {
  const days: Date[] = [];
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }
  
  return days;
}

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

// Color presets for Google events
const googleEventColors = [
  { bg: '#E3F2FD', text: '#1565C0' },
  { bg: '#F3E5F5', text: '#7B1FA2' },
  { bg: '#E8F5E9', text: '#2E7D32' },
  { bg: '#FFF3E0', text: '#E65100' },
  { bg: '#FCE4EC', text: '#C2185B' },
];

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const CalendarIconSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path 
      d="M4 7a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" 
      stroke="#4285F4" 
      strokeWidth="2"
    />
    <path d="M8 3v4M16 3v4" stroke="#4285F4" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4 10h16" stroke="#4285F4" strokeWidth="2"/>
    <rect x="7" y="13" width="3" height="3" rx="0.5" fill="#EA4335"/>
    <rect x="14" y="13" width="3" height="3" rx="0.5" fill="#34A853"/>
  </svg>
);

export const CalendarView: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  
  const { status } = useSession();
  const { events: googleEvents, isLoading, refresh } = useGoogleCalendar();
  const { notes } = useNotes();
  const { createEvent } = useLocalCalendar();
  const { getItemsForDate } = useCalendarItems(notes);
  
  const today = useMemo(() => new Date(), []);
  const currentHour = today.getHours();
  
  const calendarDays = useMemo(() => 
    getCalendarDays(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate]
  );
  
  const weekDays = useMemo(() => 
    getWeekDays(currentDate),
    [currentDate]
  );
  
  const monthTitle = useMemo(() => 
    currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    [currentDate]
  );
  
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);
  
  const goToPrevious = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'month') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setDate(prev.getDate() - 7);
      }
      return newDate;
    });
  }, [viewMode]);
  
  const goToNext = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'month') {
        newDate.setMonth(prev.getMonth() + 1);
      } else {
        newDate.setDate(prev.getDate() + 7);
      }
      return newDate;
    });
  }, [viewMode]);
  
  const handleSignIn = () => {
    signIn('google', { callbackUrl: window.location.href });
  };
  
  const handleSignOut = () => {
    signOut({ callbackUrl: window.location.href });
  };

  const handleDayClick = useCallback((date: Date) => {
    setSelectedDate(formatDateToString(date));
    setShowEventModal(true);
  }, []);

  const handleAddEvent = useCallback((e: React.MouseEvent, date: Date) => {
    e.stopPropagation();
    setSelectedDate(formatDateToString(date));
    setShowEventModal(true);
  }, []);

  const handleSaveEvent = useCallback((event: {
    title: string;
    description?: string;
    date: string;
    time?: string;
    isAllDay: boolean;
    color: string;
  }) => {
    createEvent(event.title, event.date, {
      description: event.description,
      time: event.time,
      isAllDay: event.isAllDay,
      color: event.color,
    });
  }, [createEvent]);

  // Get all items for a date (Google events, local events, and notes)
  const getAllItemsForDate = useCallback((date: Date) => {
    const dateStr = formatDateToString(date);
    const localItems = getItemsForDate(dateStr);
    const googleEventsForDate = getGoogleEventsForDate(googleEvents, date);
    
    // Convert Google events to CalendarItem format
    const googleItems: CalendarItem[] = googleEventsForDate.map((event, index) => {
      const colorPreset = googleEventColors[index % googleEventColors.length];
      return {
        id: `google-${event.id}`,
        title: event.summary,
        description: event.description,
        date: dateStr,
        time: event.start.dateTime ? new Date(event.start.dateTime).toTimeString().slice(0, 5) : undefined,
        isAllDay: !event.start.dateTime,
        type: 'google' as const,
        color: colorPreset.bg,
        accentColor: colorPreset.text,
        sourceId: event.id,
      };
    });
    
    return [...googleItems, ...localItems];
  }, [getItemsForDate, googleEvents]);

  return (
    <CalendarContainer>
      <CalendarHeader>
        <HeaderLeft>
          <TodayButton
            onClick={goToToday}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Today
          </TodayButton>
          <NavButtons>
            <NavButton
              onClick={goToPrevious}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={18} />
            </NavButton>
            <NavButton
              onClick={goToNext}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight size={18} />
            </NavButton>
          </NavButtons>
          <MonthTitle>{monthTitle}</MonthTitle>
        </HeaderLeft>
        
        <HeaderRight>
          {status === 'authenticated' && (
            <RefreshButton
              onClick={refresh}
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={16} />
            </RefreshButton>
          )}
          <ViewToggle>
            <ViewButton
              $isActive={viewMode === 'month'}
              onClick={() => setViewMode('month')}
            >
              Month
            </ViewButton>
            <ViewButton
              $isActive={viewMode === 'week'}
              onClick={() => setViewMode('week')}
            >
              Week
            </ViewButton>
          </ViewToggle>
        </HeaderRight>
      </CalendarHeader>
      
      {status === 'unauthenticated' && (
        <IntegrationSection
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <IntegrationIcon>
            <CalendarIconSvg />
          </IntegrationIcon>
          <IntegrationInfo>
            <IntegrationTitle>Connect Google Calendar</IntegrationTitle>
            <IntegrationDescription>
              Optionally sync your Google Calendar to see those events here too
            </IntegrationDescription>
          </IntegrationInfo>
          <GoogleButton
            onClick={handleSignIn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <GoogleIcon />
            Sign in with Google
          </GoogleButton>
        </IntegrationSection>
      )}
      
      {status === 'authenticated' && (
        <IntegrationSection
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <IntegrationIcon>
            <CalendarIconSvg />
          </IntegrationIcon>
          <IntegrationInfo>
            <IntegrationTitle>Google Calendar Connected</IntegrationTitle>
            <IntegrationDescription>
              Your Google events are synced and displayed below
            </IntegrationDescription>
          </IntegrationInfo>
          <SignOutButton onClick={handleSignOut}>
            Disconnect
          </SignOutButton>
        </IntegrationSection>
      )}
      
      <CalendarGrid style={{ position: 'relative' }}>
        {isLoading && status === 'authenticated' && (
          <LoadingOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </LoadingOverlay>
        )}
        
        {viewMode === 'month' ? (
          <>
            <WeekDaysRow>
              {WEEKDAYS.map(day => (
                <WeekDayLabel key={day}>{day}</WeekDayLabel>
              ))}
            </WeekDaysRow>
            <DaysGrid>
              {calendarDays.map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                const isToday = isSameDay(date, today);
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const dayItems = getAllItemsForDate(date);
                const visibleItems = dayItems.slice(0, 2);
                const remainingCount = dayItems.length - visibleItems.length;
                
                return (
                  <DayCell
                    key={index}
                    $isToday={isToday}
                    $isCurrentMonth={isCurrentMonth}
                    $isWeekend={isWeekend}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: isCurrentMonth ? 1 : 0.4, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    onClick={() => handleDayClick(date)}
                    style={{ position: 'relative' }}
                  >
                    <AddEventButton
                      onClick={(e) => handleAddEvent(e, date)}
                      title="Add event"
                    >
                      <Plus size={12} />
                    </AddEventButton>
                    <DayNumber $isToday={isToday}>
                      {date.getDate()}
                    </DayNumber>
                    <EventsList>
                      {visibleItems.map((item) => (
                        <DynamicEventPill
                          key={item.id}
                          $bgColor={item.color}
                          $accentColor={item.accentColor}
                          $type={item.type}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          title={item.title}
                        >
                          {item.type === 'note' && (
                            <EventTypeIcon>
                              <StickyNote size={10} />
                            </EventTypeIcon>
                          )}
                          {item.type === 'local' && (
                            <EventTypeIcon>
                              <CalendarIcon2 size={10} />
                            </EventTypeIcon>
                          )}
                          {item.title}
                        </DynamicEventPill>
                      ))}
                      {remainingCount > 0 && (
                        <MoreEvents>+{remainingCount} more</MoreEvents>
                      )}
                    </EventsList>
                  </DayCell>
                );
              })}
            </DaysGrid>
          </>
        ) : (
          <WeekViewContainer>
            <WeekViewHeader>
              <div /> {/* Empty cell for time column */}
              {weekDays.map((date, index) => {
                const isToday = isSameDay(date, today);
                return (
                  <WeekDayHeader key={index} $isToday={isToday}>
                    <WeekDayName>{WEEKDAYS_FULL[date.getDay()].slice(0, 3)}</WeekDayName>
                    <WeekDayNumber $isToday={isToday}>{date.getDate()}</WeekDayNumber>
                  </WeekDayHeader>
                );
              })}
            </WeekViewHeader>
            <WeekViewGrid>
              {HOURS.map(hour => (
                <React.Fragment key={hour}>
                  <TimeSlot>{formatHour(hour)}</TimeSlot>
                  {weekDays.map((date, dayIndex) => {
                    const isToday = isSameDay(date, today);
                    const isCurrentHour = isToday && hour === currentHour;
                    const currentMinutes = today.getMinutes();
                    
                    return (
                      <DayColumn key={dayIndex}>
                        <HourCell $isCurrentHour={isCurrentHour}>
                          {isCurrentHour && (
                            <CurrentTimeLine 
                              style={{ top: `${(currentMinutes / 60) * 100}%` }}
                            />
                          )}
                        </HourCell>
                      </DayColumn>
                    );
                  })}
                </React.Fragment>
              ))}
            </WeekViewGrid>
          </WeekViewContainer>
        )}
      </CalendarGrid>

      <CalendarEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
      />
    </CalendarContainer>
  );
};

export default CalendarView;
