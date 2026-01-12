'use client';

import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { CalendarView } from '@/components/CalendarView/CalendarView';

export default function CalendarPage() {
  return (
    <AppLayout>
      <CalendarView />
    </AppLayout>
  );
}
