'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CalendarPlus, Calendar } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { EVENT_COLORS } from '@/hooks/useLocalCalendar';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  TitleIcon,
  CloseButton,
  ModalBody,
  FormGroup,
  FormRow,
  Label,
  Input,
  Textarea,
  CheckboxContainer,
  Checkbox,
  ColorGrid,
  ColorSwatch,
  DateDisplay,
  DateIcon,
  DateInfo,
  DateText,
  DateSubtext,
  ModalFooter,
  Button,
} from './CalendarEventModal.styles';

interface CalendarEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD format
  onSave: (event: {
    title: string;
    description?: string;
    date: string;
    time?: string;
    isAllDay: boolean;
    color: string;
  }) => void;
}

function formatDateForDisplay(dateStr: string): { main: string; sub: string } {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const main = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
  
  let sub = '';
  if (diffDays === 0) sub = 'Today';
  else if (diffDays === 1) sub = 'Tomorrow';
  else if (diffDays === -1) sub = 'Yesterday';
  else if (diffDays > 1 && diffDays <= 7) sub = `In ${diffDays} days`;
  else if (diffDays < -1) sub = `${Math.abs(diffDays)} days ago`;
  
  return { main, sub };
}

export const CalendarEventModal: React.FC<CalendarEventModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [isAllDay, setIsAllDay] = useState(true);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Reset form
      setTitle('');
      setDescription('');
      setTime('');
      setIsAllDay(true);
      setSelectedColorIndex(0);
    }
  }, [isOpen]);

  const handleSave = useCallback(() => {
    if (!title.trim()) return;
    
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      date: selectedDate,
      time: isAllDay ? undefined : time || undefined,
      isAllDay,
      color: EVENT_COLORS[selectedColorIndex].color,
    });
    
    onClose();
  }, [title, description, selectedDate, time, isAllDay, selectedColorIndex, onSave, onClose]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [handleSave, onClose]);

  const dateDisplay = formatDateForDisplay(selectedDate);

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
                <TitleIcon>
                  <CalendarPlus size={18} />
                </TitleIcon>
                New Event
              </ModalTitle>
              <CloseButton onClick={onClose}>
                <X size={18} />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <DateDisplay>
                <DateIcon>
                  <Calendar size={20} />
                </DateIcon>
                <DateInfo>
                  <DateText>{dateDisplay.main}</DateText>
                  {dateDisplay.sub && <DateSubtext>{dateDisplay.sub}</DateSubtext>}
                </DateInfo>
              </DateDisplay>

              <FormGroup>
                <Label>Event Title</Label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event title..."
                  autoFocus
                />
              </FormGroup>

              <FormGroup>
                <Label>Description (optional)</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details..."
                />
              </FormGroup>

              <FormRow>
                <FormGroup style={{ flex: 1 }}>
                  <CheckboxContainer>
                    <Checkbox
                      type="checkbox"
                      checked={isAllDay}
                      onChange={(e) => setIsAllDay(e.target.checked)}
                    />
                    All day event
                  </CheckboxContainer>
                </FormGroup>
                
                {!isAllDay && (
                  <FormGroup style={{ flex: 1 }}>
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </FormGroup>
                )}
              </FormRow>

              <FormGroup>
                <Label>Color</Label>
                <ColorGrid>
                  {EVENT_COLORS.map((colorPreset, index) => (
                    <ColorSwatch
                      key={index}
                      $color={colorPreset.color}
                      $isSelected={selectedColorIndex === index}
                      onClick={() => setSelectedColorIndex(index)}
                      title={colorPreset.name}
                    />
                  ))}
                </ColorGrid>
              </FormGroup>
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
                disabled={!title.trim()}
              >
                Add Event
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CalendarEventModal;
