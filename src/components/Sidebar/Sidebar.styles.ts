import styled from 'styled-components';
import { motion } from 'framer-motion';

export const SidebarContainer = styled(motion.div)`
  width: 96px;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  padding: 20px 14px;
  gap: 10px;
  flex-shrink: 0;
  z-index: 100;
  overflow-y: auto;
`;

export const SidebarTitle = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(0, 0, 0, 0.35);
  text-align: center;
  margin-bottom: 8px;
`;

interface DraggableColorItemProps {
  $bgColor: string;
  $isDragging?: boolean;
}

export const DraggableColorItem = styled(motion.div)<DraggableColorItemProps>`
  width: 68px;
  min-height: 64px;
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: 10px;
  cursor: grab;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  touch-action: none;
  user-select: none;
  position: relative;
  padding: 8px 4px;
  flex-shrink: 0;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    cursor: grab;
  }
  
  &:active {
    cursor: grabbing;
  }
`;

export const ColorLabel = styled.span<{ $accentColor: string }>`
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: ${({ $accentColor }) => $accentColor};
  text-align: center;
  line-height: 1.2;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`;

export const DragIcon = styled.div<{ $accentColor: string }>`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: ${({ $accentColor }) => $accentColor}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $accentColor }) => $accentColor};
`;

export const EditButton = styled.button<{ $accentColor: string }>`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: none;
  background: ${({ $accentColor }) => $accentColor}20;
  color: ${({ $accentColor }) => $accentColor};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${DraggableColorItem}:hover & {
    opacity: 1;
  }
  
  &:hover {
    background: ${({ $accentColor }) => $accentColor}40;
  }
`;

export const AddCategoryButton = styled(motion.button)`
  width: 68px;
  height: 48px;
  border-radius: 10px;
  border: 2px dashed rgba(0, 0, 0, 0.15);
  background: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: rgba(0, 0, 0, 0.35);
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    border-color: rgba(0, 0, 0, 0.25);
    background: rgba(0, 0, 0, 0.02);
    color: rgba(0, 0, 0, 0.5);
  }
`;

export const AddCategoryLabel = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 8px;
  font-weight: 600;
  text-transform: uppercase;
`;

export const DragHint = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 9px;
  color: rgba(0, 0, 0, 0.3);
  text-align: center;
  margin-top: auto;
  padding-top: 12px;
  line-height: 1.4;
`;

export const PreviewNote = styled(motion.div)<{ $bgColor: string }>`
  width: 200px;
  min-height: 120px;
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: 8px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 12px;
  display: flex;
  flex-direction: column;
  pointer-events: none;
`;

export const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const PreviewLabel = styled.span<{ $accentColor: string }>`
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  background: ${({ $accentColor }) => $accentColor}20;
  border: 1px solid ${({ $accentColor }) => $accentColor}40;
  border-radius: 12px;
  color: ${({ $accentColor }) => $accentColor};
`;

export const PreviewContent = styled.div`
  flex: 1;
  font-family: 'Caveat', cursive;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.4);
`;
