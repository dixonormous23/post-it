import styled from 'styled-components';
import { motion } from 'framer-motion';

export const NavContainer = styled(motion.nav)`
  width: 72px;
  height: 100%;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  gap: 8px;
  flex-shrink: 0;
  z-index: 200;
`;

export const LogoContainer = styled.div`
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
`;

export const LogoIcon = styled.span`
  font-size: 20px;
`;

interface NavItemProps {
  $isActive: boolean;
}

export const NavItem = styled(motion.button)<NavItemProps>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: none;
  background: ${({ $isActive }) => 
    $isActive 
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)' 
      : 'transparent'
  };
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $isActive }) => ($isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.45)')};
  transition: all 0.2s ease;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: ${({ $isActive }) => ($isActive ? '24px' : '0')};
    background: linear-gradient(180deg, #FF6B6B 0%, #FF8E53 100%);
    border-radius: 0 4px 4px 0;
    transition: height 0.2s ease;
  }
  
  &:hover {
    background: ${({ $isActive }) => 
      $isActive 
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)' 
        : 'rgba(255, 255, 255, 0.06)'
    };
    color: #ffffff;
  }
  
  svg {
    width: 22px;
    height: 22px;
  }
`;

export const NavDivider = styled.div`
  width: 32px;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 12px 0;
`;

export const NavSpacer = styled.div`
  flex: 1;
`;

export const NavTooltip = styled(motion.div)`
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 12px;
  padding: 8px 12px;
  background: #2a2a2a;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  z-index: 1000;
  
  &::before {
    content: '';
    position: absolute;
    left: -6px;
    top: 50%;
    transform: translateY(-50%);
    border: 6px solid transparent;
    border-right-color: #2a2a2a;
    border-left: none;
  }
`;
