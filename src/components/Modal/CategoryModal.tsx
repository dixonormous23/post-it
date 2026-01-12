'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, RotateCcw } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Category, PRESET_CATEGORY_COLORS } from '@/types';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  FormGroup,
  Label,
  Input,
  ColorGrid,
  ColorSwatch,
  Preview,
  PreviewLabel,
  PreviewText,
  ModalFooter,
  Button,
  DeleteSection,
  DeleteButton,
} from './CategoryModal.styles';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null; // null for new category
  onSave: (name: string, color: string, accentColor: string) => void;
  onDelete?: () => void;
  onReset?: () => void;
  isDefaultCategory?: boolean;
  isCustomized?: boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSave,
  onDelete,
  onReset,
  isDefaultCategory = false,
  isCustomized = false,
}) => {
  const [name, setName] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && category) {
      setName(category.name);
      // Find matching color in presets
      const index = PRESET_CATEGORY_COLORS.findIndex(
        c => c.color === category.color && c.accentColor === category.accentColor
      );
      setSelectedColorIndex(index >= 0 ? index : 0);
    } else if (isOpen && !category) {
      setName('');
      setSelectedColorIndex(0);
    }
  }, [isOpen, category]);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    const colorPreset = PRESET_CATEGORY_COLORS[selectedColorIndex];
    onSave(name.trim(), colorPreset.color, colorPreset.accentColor);
    onClose();
  }, [name, selectedColorIndex, onSave, onClose]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const selectedColor = PRESET_CATEGORY_COLORS[selectedColorIndex];

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
          >
            <ModalHeader>
              <ModalTitle>
                {category ? 'Edit Category' : 'New Category'}
              </ModalTitle>
              <CloseButton onClick={onClose}>
                <X size={18} />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <FormGroup>
                <Label>Category Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category name..."
                  autoFocus
                />
              </FormGroup>

              <FormGroup>
                <Label>Color</Label>
                <ColorGrid>
                  {PRESET_CATEGORY_COLORS.map((colorPreset, index) => (
                    <ColorSwatch
                      key={index}
                      $color={colorPreset.color}
                      $isSelected={selectedColorIndex === index}
                      onClick={() => setSelectedColorIndex(index)}
                    />
                  ))}
                </ColorGrid>
              </FormGroup>

              <FormGroup>
                <Label>Preview</Label>
                <Preview $bgColor={selectedColor.color} $accentColor={selectedColor.accentColor}>
                  <PreviewLabel $accentColor={selectedColor.accentColor}>
                    {name || 'Category Name'}
                  </PreviewLabel>
                  <PreviewText>Note content...</PreviewText>
                </Preview>
              </FormGroup>

              {category && !isDefaultCategory && onDelete && (
                <DeleteSection>
                  <DeleteButton onClick={() => { onDelete(); onClose(); }}>
                    <Trash2 size={16} />
                    Delete Category
                  </DeleteButton>
                </DeleteSection>
              )}

              {category && isDefaultCategory && isCustomized && onReset && (
                <DeleteSection>
                  <DeleteButton 
                    onClick={() => { onReset(); onClose(); }}
                    style={{ background: '#F0F9FF', borderColor: '#7DD3FC', color: '#0284C7' }}
                  >
                    <RotateCcw size={16} />
                    Reset to Default
                  </DeleteButton>
                </DeleteSection>
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
                disabled={!name.trim()}
              >
                {category ? 'Save Changes' : 'Create Category'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CategoryModal;
