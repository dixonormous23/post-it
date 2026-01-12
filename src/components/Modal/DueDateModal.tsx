'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Trash2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  TitleIcon,
  CloseButton,
  ModalBody,
  DateInputContainer,
  Label,
  DateInput,
  QuickOptions,
  QuickOption,
  ModalFooter,
  Button,
  RemoveButton,
} from './DueDateModal.styles';

interface DueDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate?: string;
  onSave: (date: string) => void;
  onRemove: () => void;
  accentColor: string;
}

function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getQuickDates() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  
  // Next Monday
  const nextMonday = new Date(today);
  const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
  nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
  
  return {
    today: formatDateForInput(today),
    tomorrow: formatDateForInput(tomorrow),
    nextWeek: formatDateForInput(nextWeek),
    nextMonth: formatDateForInput(nextMonth),
    nextMonday: formatDateForInput(nextMonday),
  };
}

export const DueDateModal: React.FC<DueDateModalProps> = ({
  isOpen,
  onClose,
  currentDate,
  onSave,
  onRemove,
  accentColor,
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const quickDates = useMemo(() => getQuickDates(), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(currentDate || quickDates.today);
    }
  }, [isOpen, currentDate, quickDates.today]);

  const handleSave = useCallback(() => {
    if (selectedDate) {
      onSave(selectedDate);
      onClose();
    }
  }, [selectedDate, onSave, onClose]);

  const handleRemove = useCallback(() => {
    onRemove();
    onClose();
  }, [onRemove, onClose]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [handleSave, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <ModalContent
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onKeyDown={handleKeyDown}
          >
            <ModalHeader>
              <ModalTitle>
                <TitleIcon $accentColor={accentColor}>
                  <Calendar size={18} />
                </TitleIcon>
                Set Due Date
              </ModalTitle>
              <CloseButton onClick={onClose}>
                <X size={18} />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <DateInputContainer>
                <Label>Select Date</Label>
                <DateInput
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  autoFocus
                />
              </DateInputContainer>

              <DateInputContainer>
                <Label>Quick Select</Label>
                <QuickOptions>
                  <QuickOption
                    $isSelected={selectedDate === quickDates.today}
                    onClick={() => setSelectedDate(quickDates.today)}
                  >
                    Today
                  </QuickOption>
                  <QuickOption
                    $isSelected={selectedDate === quickDates.tomorrow}
                    onClick={() => setSelectedDate(quickDates.tomorrow)}
                  >
                    Tomorrow
                  </QuickOption>
                  <QuickOption
                    $isSelected={selectedDate === quickDates.nextMonday}
                    onClick={() => setSelectedDate(quickDates.nextMonday)}
                  >
                    Next Monday
                  </QuickOption>
                  <QuickOption
                    $isSelected={selectedDate === quickDates.nextWeek}
                    onClick={() => setSelectedDate(quickDates.nextWeek)}
                  >
                    In a week
                  </QuickOption>
                  <QuickOption
                    $isSelected={selectedDate === quickDates.nextMonth}
                    onClick={() => setSelectedDate(quickDates.nextMonth)}
                  >
                    In a month
                  </QuickOption>
                </QuickOptions>
              </DateInputContainer>

              {currentDate && (
                <RemoveButton onClick={handleRemove}>
                  <Trash2 size={16} />
                  Remove Due Date
                </RemoveButton>
              )}
            </ModalBody>

            <ModalFooter>
              <Button $variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                $variant="primary"
                onClick={handleSave}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!selectedDate}
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default DueDateModal;
