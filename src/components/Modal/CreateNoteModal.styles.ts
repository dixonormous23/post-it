import styled from 'styled-components';
import { motion } from 'framer-motion';
import { NOTE_COLORS, NOTE_COLOR_ACCENTS, NoteColor } from '@/types';

export const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

export const ModalContainer = styled(motion.div)`
  background: white;
  border-radius: 20px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 440px;
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  padding: 24px 28px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

export const ModalTitle = styled.h2`
  font-family: 'DM Sans', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #2D2A26;
  margin: 0 0 4px;
`;

export const ModalSubtitle = styled.p`
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  margin: 0;
`;

export const ModalBody = styled.div`
  padding: 24px 28px;
`;

export const FieldGroup = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const FieldLabel = styled.label`
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 12px;
`;

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

interface CategoryButtonProps {
  $color: NoteColor;
  $isSelected: boolean;
}

export const CategoryButton = styled.button<CategoryButtonProps>`
  padding: 14px 12px;
  background: ${({ $color, $isSelected }) => 
    $isSelected ? NOTE_COLORS[$color] : 'rgba(0, 0, 0, 0.03)'};
  border: 2px solid ${({ $color, $isSelected }) => 
    $isSelected ? NOTE_COLOR_ACCENTS[$color] : 'transparent'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: ${({ $color }) => NOTE_COLORS[$color]};
    border-color: ${({ $color }) => NOTE_COLOR_ACCENTS[$color]}60;
  }
`;

export const CategoryDot = styled.div<{ $color: NoteColor }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ $color }) => NOTE_COLOR_ACCENTS[$color]};
`;

export const CategoryLabel = styled.span<{ $color: NoteColor; $isSelected: boolean }>`
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $color, $isSelected }) => 
    $isSelected ? NOTE_COLOR_ACCENTS[$color] : 'rgba(0, 0, 0, 0.5)'};
`;

export const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

interface StatusButtonProps {
  $isSelected: boolean;
}

export const StatusButton = styled.button<StatusButtonProps>`
  padding: 14px 16px;
  background: ${({ $isSelected }) => 
    $isSelected ? '#6366F1' : 'rgba(0, 0, 0, 0.03)'};
  border: 2px solid ${({ $isSelected }) => 
    $isSelected ? '#6366F1' : 'transparent'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  
  &:hover {
    background: ${({ $isSelected }) => 
      $isSelected ? '#6366F1' : 'rgba(99, 102, 241, 0.1)'};
    border-color: ${({ $isSelected }) => 
      $isSelected ? '#6366F1' : 'rgba(99, 102, 241, 0.3)'};
  }
`;

export const StatusLabel = styled.span<{ $isSelected: boolean }>`
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $isSelected }) => 
    $isSelected ? 'white' : 'rgba(0, 0, 0, 0.6)'};
`;

export const ModalFooter = styled.div`
  padding: 20px 28px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
`;

export const CancelButton = styled.button`
  padding: 12px 24px;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  transition: all 0.15s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.04);
    border-color: rgba(0, 0, 0, 0.2);
  }
`;

export const CreateButton = styled(motion.button)`
  padding: 12px 28px;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  border: none;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  
  &:hover {
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
  }
`;

export const KeyboardHint = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.35);
  margin-left: 8px;
`;

export const KeyBadge = styled.kbd`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.5);
`;

export const NoteContentArea = styled.textarea<{ $color: NoteColor }>`
  width: 100%;
  min-height: 120px;
  padding: 16px;
  background: ${({ $color }) => NOTE_COLORS[$color]};
  border: 2px solid ${({ $color }) => NOTE_COLOR_ACCENTS[$color]}30;
  border-radius: 12px;
  font-family: 'Caveat', cursive;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.75);
  resize: vertical;
  outline: none;
  transition: background 0.2s ease, border-color 0.2s ease;
  
  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
  }
  
  &:focus {
    border-color: ${({ $color }) => NOTE_COLOR_ACCENTS[$color]}60;
  }
`;

