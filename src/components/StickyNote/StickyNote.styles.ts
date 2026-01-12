import styled from 'styled-components';
import { motion } from 'framer-motion';

interface NoteContainerProps {
  $bgColor: string;
  $shadowColor: string;
  $isDragging: boolean;
  $isEditing: boolean;
}

export const NoteContainer = styled(motion.div)<NoteContainerProps>`
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: 8px;
  box-shadow: ${({ $isDragging, $shadowColor }) =>
    $isDragging
      ? `0 20px 40px ${$shadowColor}, 0 8px 16px rgba(0, 0, 0, 0.1)`
      : `0 2px 8px ${$shadowColor}, 0 1px 3px rgba(0, 0, 0, 0.05)`};
  cursor: ${({ $isDragging }) => ($isDragging ? 'grabbing' : 'grab')};
  touch-action: none;
  user-select: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-origin: center center;
  width: 100%;
  min-height: 120px;
  margin-bottom: 0.2rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 24px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
  }
`;

export const NoteHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 6px;
  flex-shrink: 0;
  gap: 8px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

interface ColorLabelProps {
  $accentColor: string;
}

export const ColorLabel = styled.span<ColorLabelProps>`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  background-color: ${({ $accentColor }) => $accentColor}20;
  border: 1px solid ${({ $accentColor }) => $accentColor}40;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: ${({ $accentColor }) => $accentColor};
  white-space: nowrap;
  flex-shrink: 0;
`;

export const ColorPicker = styled.div`
  display: flex;
  gap: 3px;
  flex-shrink: 0;
`;

interface ColorDotProps {
  $bgColor: string;
  $isActive: boolean;
}

export const ColorDot = styled.button<ColorDotProps>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: ${({ $bgColor }) => $bgColor};
  border: 2px solid ${({ $isActive }) => ($isActive ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.1)')};
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease;
  flex-shrink: 0;
  
  &:hover {
    transform: scale(1.15);
    border-color: rgba(0, 0, 0, 0.25);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

export const DeleteButton = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.4);
  transition: background-color 0.15s ease, color 0.15s ease;
  flex-shrink: 0;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    color: rgba(0, 0, 0, 0.6);
  }
  
  &:active {
    background-color: rgba(0, 0, 0, 0.12);
  }
`;

export const NoteContent = styled.div`
  flex: 1;
  padding: 4px 12px 12px;
  overflow: hidden;
`;

export const NoteTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  min-height: 60px;
  background: transparent;
  border: none;
  resize: none;
  font-family: 'Caveat', cursive;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.75);
  outline: none;
  
  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
  }
`;

export const ResizeHandle = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: nwse-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-right: 2px solid rgba(0, 0, 0, 0.15);
    border-bottom: 2px solid rgba(0, 0, 0, 0.15);
    border-radius: 0 0 2px 0;
  }
  
  &:hover::after {
    border-color: rgba(0, 0, 0, 0.3);
  }
`;

// Due Date Styles
export const NoteFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
`;

interface DueDateProps {
  $isOverdue: boolean;
  $isDueSoon: boolean;
  $accentColor: string;
}

export const DueDateContainer = styled.div<DueDateProps>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  background: ${({ $isOverdue, $isDueSoon }) => 
    $isOverdue 
      ? 'rgba(220, 38, 38, 0.1)' 
      : $isDueSoon 
        ? 'rgba(245, 158, 11, 0.1)' 
        : 'rgba(0, 0, 0, 0.04)'
  };
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ $isOverdue, $isDueSoon }) => 
      $isOverdue 
        ? 'rgba(220, 38, 38, 0.15)' 
        : $isDueSoon 
          ? 'rgba(245, 158, 11, 0.15)' 
          : 'rgba(0, 0, 0, 0.08)'
    };
  }
`;

export const DueDateText = styled.span<DueDateProps>`
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: ${({ $isOverdue, $isDueSoon, $accentColor }) => 
    $isOverdue 
      ? '#DC2626' 
      : $isDueSoon 
        ? '#D97706' 
        : $accentColor
  };
`;

export const DueDateIcon = styled.span<DueDateProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $isOverdue, $isDueSoon, $accentColor }) => 
    $isOverdue 
      ? '#DC2626' 
      : $isDueSoon 
        ? '#D97706' 
        : $accentColor
  };
`;

export const AddDueDateButton = styled.button<{ $accentColor: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px dashed ${({ $accentColor }) => $accentColor}40;
  background: transparent;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: ${({ $accentColor }) => $accentColor};
  opacity: 0.6;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 1;
    border-style: solid;
    background: ${({ $accentColor }) => $accentColor}10;
  }
`;
