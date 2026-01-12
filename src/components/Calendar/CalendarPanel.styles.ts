import styled from 'styled-components';
import { motion } from 'framer-motion';

interface PanelContainerProps {
  $isCollapsed: boolean;
}

export const PanelContainer = styled(motion.div)<PanelContainerProps>`
  position: relative;
  width: ${({ $isCollapsed }) => ($isCollapsed ? '48px' : '340px')};
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  flex-shrink: 0;
`;

export const ToggleButton = styled.button`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 48px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.4);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 10;
  
  &:hover {
    background: #f5f5f5;
    color: rgba(0, 0, 0, 0.6);
  }
`;

export const PanelHeader = styled.div`
  padding: 20px 20px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

export const PanelTitle = styled.h2`
  font-family: 'DM Sans', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #2D2A26;
  margin: 0 0 4px;
`;

export const DateDisplay = styled.p`
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  margin: 0;
`;

export const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
`;

export const AuthSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 24px;
  text-align: center;
`;

export const AuthText = styled.p`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 16px;
  line-height: 1.5;
`;

export const GoogleButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2D2A26;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  &:hover {
    background: #fafafa;
    border-color: rgba(0, 0, 0, 0.18);
  }
`;

export const EventsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const DateGroup = styled.div``;

export const DateGroupTitle = styled.h3`
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(0, 0, 0, 0.4);
  margin: 0 0 10px;
`;

export const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface EventCardProps {
  $colorIndex: number;
}

const eventColors = [
  '#E3F2FD', // light blue
  '#F3E5F5', // light purple
  '#E8F5E9', // light green
  '#FFF3E0', // light orange
  '#FCE4EC', // light pink
];

export const EventCard = styled(motion.div)<EventCardProps>`
  padding: 12px 14px;
  background: ${({ $colorIndex }) => eventColors[$colorIndex % eventColors.length]};
  border-radius: 10px;
  cursor: default;
`;

export const EventTime = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.45);
  display: block;
  margin-bottom: 4px;
`;

export const EventTitle = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2D2A26;
  display: block;
  line-height: 1.3;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
`;

export const EmptyText = styled.p`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.4);
  margin: 12px 0 0;
`;

export const LoadingSpinner = styled(motion.div)`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #6366F1;
  border-radius: 50%;
  margin: 40px auto;
`;

export const SignOutButton = styled.button`
  margin-top: auto;
  padding: 12px;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  margin: 16px 20px 20px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.03);
    color: rgba(0, 0, 0, 0.7);
  }
`;

export const RefreshButton = styled.button`
  padding: 6px 12px;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  
  &:hover {
    background: rgba(0, 0, 0, 0.03);
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

