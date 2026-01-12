import styled from 'styled-components';
import { motion } from 'framer-motion';

export const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

export const ModalTitle = styled.h2`
  font-family: 'DM Sans', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #2D2A26;
  margin: 0;
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.4);
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.6);
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.6);
`;

export const Input = styled.input`
  padding: 12px 14px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  color: #2D2A26;
  outline: none;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: #6366F1;
  }
  
  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
  }
`;

export const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
`;

interface ColorSwatchProps {
  $color: string;
  $isSelected: boolean;
}

export const ColorSwatch = styled.button<ColorSwatchProps>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
  background: ${({ $color }) => $color};
  border: 3px solid ${({ $isSelected }) => 
    $isSelected ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)'
  };
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ $isSelected }) => 
    $isSelected ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
  };
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const Preview = styled.div<{ $bgColor: string; $accentColor: string }>`
  padding: 16px;
  background: ${({ $bgColor }) => $bgColor};
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const PreviewLabel = styled.span<{ $accentColor: string }>`
  display: inline-flex;
  padding: 4px 10px;
  background: ${({ $accentColor }) => $accentColor}20;
  border: 1px solid ${({ $accentColor }) => $accentColor}40;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $accentColor }) => $accentColor};
`;

export const PreviewText = styled.span`
  font-family: 'Caveat', cursive;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.5);
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
`;

export const Button = styled(motion.button)<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: 12px 20px;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ $variant = 'secondary' }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
          color: white;
          border: none;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
          
          &:hover {
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
          }
        `;
      case 'danger':
        return `
          background: transparent;
          color: #DC2626;
          border: 1px solid #DC2626;
          
          &:hover {
            background: #FEE2E2;
          }
        `;
      default:
        return `
          background: transparent;
          color: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(0, 0, 0, 0.12);
          
          &:hover {
            background: rgba(0, 0, 0, 0.03);
          }
        `;
    }
  }}
`;

export const DeleteSection = styled.div`
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
`;

export const DeleteButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #FCA5A5;
  background: #FEF2F2;
  color: #DC2626;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #FEE2E2;
    border-color: #F87171;
  }
`;
