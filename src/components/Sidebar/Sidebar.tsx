'use client';

import React, { useState, useCallback } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical, Pencil, Plus } from 'lucide-react';
import { Category } from '@/types';
import { useCategories } from '@/hooks/useCategories';
import { CategoryModal } from '@/components/Modal/CategoryModal';
import {
  SidebarContainer,
  SidebarTitle,
  DraggableColorItem,
  ColorLabel,
  DragIcon,
  DragHint,
  EditButton,
  AddCategoryButton,
  AddCategoryLabel,
} from './Sidebar.styles';

interface DraggableCategoryProps {
  category: Category;
  onEdit: (category: Category) => void;
}

const DraggableCategory: React.FC<DraggableCategoryProps> = ({ category, onEdit }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `create-${category.id}`,
    data: {
      type: 'create-note',
      color: category.id, // Keep using 'color' for backwards compatibility
    },
  });

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit(category);
  }, [category, onEdit]);

  return (
    <DraggableColorItem
      ref={setNodeRef}
      $bgColor={category.color}
      $isDragging={isDragging}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...attributes}
      {...listeners}
    >
      <EditButton
        $accentColor={category.accentColor}
        onClick={handleEditClick}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <Pencil size={10} />
      </EditButton>
      <ColorLabel $accentColor={category.accentColor}>
        {category.name}
      </ColorLabel>
    </DraggableColorItem>
  );
};

export const Sidebar: React.FC = () => {
  const {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
    resetCategory,
    isDefaultCategory,
    isCustomized,
  } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleEditCategory = useCallback((category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  }, []);

  const handleAddCategory = useCallback(() => {
    setEditingCategory(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingCategory(null);
  }, []);

  const handleSaveCategory = useCallback((name: string, color: string, accentColor: string) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, { name, color, accentColor });
    } else {
      createCategory(name, color, accentColor);
    }
  }, [editingCategory, updateCategory, createCategory]);

  const handleDeleteCategory = useCallback(() => {
    if (editingCategory) {
      deleteCategory(editingCategory.id);
    }
  }, [editingCategory, deleteCategory]);

  const handleResetCategory = useCallback(() => {
    if (editingCategory) {
      resetCategory(editingCategory.id);
    }
  }, [editingCategory, resetCategory]);

  return (
    <>
      <SidebarContainer
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <SidebarTitle>Categories</SidebarTitle>
        {categories.map((category) => (
          <DraggableCategory
            key={category.id}
            category={category}
            onEdit={handleEditCategory}
          />
        ))}
        <AddCategoryButton
          onClick={handleAddCategory}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={16} />
          <AddCategoryLabel>Add</AddCategoryLabel>
        </AddCategoryButton>
        <DragHint>Drag to<br />create</DragHint>
      </SidebarContainer>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
        onSave={handleSaveCategory}
        onDelete={editingCategory && !isDefaultCategory(editingCategory.id) ? handleDeleteCategory : undefined}
        onReset={editingCategory && isDefaultCategory(editingCategory.id) ? handleResetCategory : undefined}
        isDefaultCategory={editingCategory ? isDefaultCategory(editingCategory.id) : false}
        isCustomized={editingCategory ? isCustomized(editingCategory.id) : false}
      />
    </>
  );
};

export default Sidebar;
