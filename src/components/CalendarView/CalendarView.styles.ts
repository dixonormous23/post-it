import styled from 'styled-components';
import { motion } from 'framer-motion';

export const CalendarContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #FAF8F5;
  overflow: hidden;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const MonthTitle = styled.h1`
  font-family: 'DM Sans', sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #2D2A26;
  margin: 0;
`;

export const NavButtons = styled.div`
  display: flex;
  gap: 4px;
`;

export const NavButton = styled(motion.button)`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.6);
  
  &:hover {
    background: #f5f5f5;
    color: rgba(0, 0, 0, 0.8);
  }
`;

export const TodayButton = styled(motion.button)`
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  
  &:hover {
    background: #f5f5f5;
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ViewToggle = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  padding: 4px;
`;

interface ViewButtonProps {
  $isActive: boolean;
}

export const ViewButton = styled(motion.button)<ViewButtonProps>`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: ${({ $isActive }) => ($isActive ? 'white' : 'transparent')};
  box-shadow: ${({ $isActive }) => ($isActive ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none')};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $isActive }) => ($isActive ? '#2D2A26' : 'rgba(0, 0, 0, 0.5)')};
  transition: all 0.2s ease;
  
  &:hover {
    color: #2D2A26;
  }
`;

export const CalendarGrid = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px 32px 32px;
  overflow: hidden;
`;

export const WeekDaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
`;

export const WeekDayLabel = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(0, 0, 0, 0.4);
  text-align: center;
  padding: 8px 0;
`;

export const DaysGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 4px;
  min-height: 0;
`;

interface DayCellProps {
  $isToday: boolean;
  $isCurrentMonth: boolean;
  $isWeekend: boolean;
}

export const DayCell = styled(motion.div)<DayCellProps>`
  background: ${({ $isToday }) => 
    $isToday 
      ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 142, 83, 0.1) 100%)'
      : 'rgba(255, 255, 255, 0.7)'
  };
  border-radius: 12px;
  padding: 8px;
  border: ${({ $isToday }) => 
    $isToday 
      ? '2px solid rgba(255, 107, 107, 0.4)' 
      : '1px solid rgba(0, 0, 0, 0.04)'
  };
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${({ $isCurrentMonth }) => ($isCurrentMonth ? 1 : 0.4)};
  
  &:hover {
    background: ${({ $isToday }) => 
      $isToday 
        ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 142, 83, 0.15) 100%)'
        : 'rgba(255, 255, 255, 0.9)'
    };
    border-color: ${({ $isToday }) => 
      $isToday 
        ? 'rgba(255, 107, 107, 0.6)' 
        : 'rgba(0, 0, 0, 0.12)'
    };
  }
`;

export const DayNumber = styled.span<{ $isToday: boolean }>`
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: ${({ $isToday }) => ($isToday ? '700' : '500')};
  color: ${({ $isToday }) => ($isToday ? '#FF6B6B' : '#2D2A26')};
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: ${({ $isToday }) => 
    $isToday 
      ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)' 
      : 'transparent'
  };
  color: ${({ $isToday }) => ($isToday ? 'white' : '#2D2A26')};
`;

export const EventsList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
  overflow: hidden;
`;

const eventColors = [
  { bg: '#E3F2FD', text: '#1565C0' },
  { bg: '#F3E5F5', text: '#7B1FA2' },
  { bg: '#E8F5E9', text: '#2E7D32' },
  { bg: '#FFF3E0', text: '#E65100' },
  { bg: '#FCE4EC', text: '#C2185B' },
];

interface EventPillProps {
  $colorIndex: number;
}

export const EventPill = styled(motion.div)<EventPillProps>`
  padding: 3px 8px;
  background: ${({ $colorIndex }) => eventColors[$colorIndex % eventColors.length].bg};
  border-radius: 4px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: ${({ $colorIndex }) => eventColors[$colorIndex % eventColors.length].text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MoreEvents = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.4);
  padding: 2px 0;
`;

// Week View Styles
export const WeekViewContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const WeekViewHeader = styled.div`
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
  gap: 4px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

export const WeekDayHeader = styled.div<{ $isToday: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background: ${({ $isToday }) => 
    $isToday 
      ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 142, 83, 0.1) 100%)'
      : 'transparent'
  };
  border-radius: 12px;
`;

export const WeekDayName = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(0, 0, 0, 0.4);
`;

export const WeekDayNumber = styled.span<{ $isToday: boolean }>`
  font-family: 'DM Sans', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: ${({ $isToday }) => ($isToday ? '#FF6B6B' : '#2D2A26')};
  margin-top: 4px;
`;

export const TimeColumn = styled.div`
  width: 60px;
`;

export const WeekViewGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
  gap: 4px;
  overflow-y: auto;
  padding: 8px 0;
`;

export const TimeSlot = styled.div`
  height: 60px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding-right: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.4);
`;

export const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

interface HourCellProps {
  $isCurrentHour: boolean;
}

export const HourCell = styled.div<HourCellProps>`
  height: 60px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  background: ${({ $isCurrentHour }) => 
    $isCurrentHour 
      ? 'rgba(255, 107, 107, 0.05)' 
      : 'transparent'
  };
  position: relative;
`;

export const CurrentTimeLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%);
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    background: #FF6B6B;
    border-radius: 50%;
  }
`;

// Google Calendar Integration
export const IntegrationSection = styled(motion.div)`
  padding: 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin: 24px 32px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const IntegrationIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #F1F3F4;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IntegrationInfo = styled.div`
  flex: 1;
`;

export const IntegrationTitle = styled.h3`
  font-family: 'DM Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2D2A26;
  margin: 0 0 4px;
`;

export const IntegrationDescription = styled.p`
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  margin: 0;
`;

export const GoogleButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
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

export const SignOutButton = styled.button`
  padding: 10px 16px;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  
  &:hover {
    background: rgba(0, 0, 0, 0.03);
    color: rgba(0, 0, 0, 0.7);
  }
`;

export const RefreshButton = styled(motion.button)`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.5);
  
  &:hover {
    background: #f5f5f5;
    color: rgba(0, 0, 0, 0.7);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LoadingOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(250, 248, 245, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

export const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #FF6B6B;
  border-radius: 50%;
`;
