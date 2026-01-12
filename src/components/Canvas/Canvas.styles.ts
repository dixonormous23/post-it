import styled from 'styled-components';
import { motion } from 'framer-motion';

export const CanvasContainer = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  background-color: #FAF8F5;
  background-image: 
    radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.03) 1px, transparent 0);
  background-size: 24px 24px;
  padding: 20px;
`;

export const KanbanBoard = styled.div`
  display: flex;
  gap: 16px;
  height: 100%;
  min-width: min-content;
`;

interface ColumnContainerProps {
  $isOver: boolean;
  $isCollapsed?: boolean;
}

export const ColumnContainer = styled(motion.div)<ColumnContainerProps>`
  flex: ${({ $isCollapsed }) => $isCollapsed ? '0 0 auto' : '1'};
  min-width: ${({ $isCollapsed }) => $isCollapsed ? '56px' : '260px'};
  max-width: ${({ $isCollapsed }) => $isCollapsed ? '56px' : '320px'};
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ $isOver, $isCollapsed }) => 
    $isCollapsed 
      ? 'rgba(34, 197, 94, 0.08)' 
      : $isOver 
        ? 'rgba(99, 102, 241, 0.05)' 
        : 'rgba(255, 255, 255, 0.5)'};
  border-radius: 16px;
  border: 2px dashed ${({ $isOver, $isCollapsed }) => 
    $isCollapsed 
      ? 'transparent'
      : $isOver 
        ? 'rgba(99, 102, 241, 0.3)' 
        : 'transparent'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
`;

interface ColumnHeaderProps {
  $isCollapsed?: boolean;
}

export const ColumnHeader = styled.div<ColumnHeaderProps>`
  padding: ${({ $isCollapsed }) => $isCollapsed ? '16px 8px 12px' : '16px 16px 12px'};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => $isCollapsed ? 'center' : 'space-between'};
  gap: 8px;
`;

interface ColumnTitleProps {
  $isCollapsed?: boolean;
}

export const ColumnTitle = styled.h2<ColumnTitleProps>`
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #2D2A26;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  
  ${({ $isCollapsed }) => $isCollapsed && `
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
  `}
`;

export const NoteCount = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.4);
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 8px;
  border-radius: 10px;
`;

export const CollapseButton = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.04);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.4);
  transition: all 0.15s ease;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(0, 0, 0, 0.08);
    color: rgba(0, 0, 0, 0.6);
  }
`;

export const ColumnContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 4px 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
`;

export const EmptyColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.25);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  text-align: center;
  padding: 24px;
`;

export const AddNoteButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.6);
  border: 2px dashed rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
  margin-top: auto;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(99, 102, 241, 0.3);
    color: rgba(99, 102, 241, 0.8);
  }
`;

export const CollapsedContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  gap: 8px;
`;

export const CollapsedNoteCount = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(34, 197, 94, 0.15);
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #16a34a;
`;

export const CollapsedLabel = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.4);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
