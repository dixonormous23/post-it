'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Category, DEFAULT_CATEGORIES, NOTE_COLORS, NOTE_COLOR_LABELS, NOTE_COLOR_ACCENTS, NoteColor } from '@/types';

const CATEGORIES_STORAGE_KEY = 'sticky-notes-categories';

const generateCategoryId = () => `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export function useCategories() {
  const [categories, setCategories] = useLocalStorage<Category[]>(CATEGORIES_STORAGE_KEY, []);

  // Merge default categories with custom ones
  // If a default category ID exists in custom categories, use the custom version
  const allCategories = useMemo(() => {
    const customCategoryIds = new Set(categories.map(c => c.id));
    
    // Start with default categories (allowing overrides from custom)
    const merged: Category[] = DEFAULT_CATEGORIES.map(defaultCat => {
      const customVersion = categories.find(c => c.id === defaultCat.id);
      return customVersion || defaultCat;
    });
    
    // Add any purely custom categories (not overriding defaults)
    const customOnly = categories.filter(c => !DEFAULT_CATEGORIES.some(d => d.id === c.id));
    
    return [...merged, ...customOnly];
  }, [categories]);

  // Get color for a category (supports both old NoteColor keys and new category IDs)
  const getCategoryColor = useCallback((categoryId: string): string => {
    const category = allCategories.find(c => c.id === categoryId);
    if (category) return category.color;
    // Fallback to old NOTE_COLORS for backwards compatibility
    if (categoryId in NOTE_COLORS) return NOTE_COLORS[categoryId as NoteColor];
    return '#F5F5F5'; // Default grey
  }, [allCategories]);

  // Get accent color for a category
  const getCategoryAccentColor = useCallback((categoryId: string): string => {
    const category = allCategories.find(c => c.id === categoryId);
    if (category) return category.accentColor;
    // Fallback to old NOTE_COLOR_ACCENTS for backwards compatibility
    if (categoryId in NOTE_COLOR_ACCENTS) return NOTE_COLOR_ACCENTS[categoryId as NoteColor];
    return '#616161'; // Default grey
  }, [allCategories]);

  // Get label for a category
  const getCategoryLabel = useCallback((categoryId: string): string => {
    const category = allCategories.find(c => c.id === categoryId);
    if (category) return category.name;
    // Fallback to old NOTE_COLOR_LABELS for backwards compatibility
    if (categoryId in NOTE_COLOR_LABELS) return NOTE_COLOR_LABELS[categoryId as NoteColor];
    return 'Unknown';
  }, [allCategories]);

  // Get shadow color for a category
  const getCategoryShadowColor = useCallback((categoryId: string): string => {
    const accentColor = getCategoryAccentColor(categoryId);
    // Convert hex to rgba with 0.2 opacity
    const hex = accentColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  }, [getCategoryAccentColor]);

  // Create a new category
  const createCategory = useCallback((name: string, color: string, accentColor: string) => {
    const newCategory: Category = {
      id: generateCategoryId(),
      name,
      color,
      accentColor,
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, [setCategories]);

  // Update an existing category
  const updateCategory = useCallback((id: string, updates: Partial<Omit<Category, 'id'>>) => {
    setCategories(prev => {
      // Check if this is a default category that hasn't been customized yet
      const existingCustom = prev.find(c => c.id === id);
      
      if (existingCustom) {
        // Update existing custom category
        return prev.map(c => c.id === id ? { ...c, ...updates } : c);
      } else {
        // This is a default category being edited for the first time
        const defaultCat = DEFAULT_CATEGORIES.find(c => c.id === id);
        if (defaultCat) {
          return [...prev, { ...defaultCat, ...updates }];
        }
      }
      return prev;
    });
  }, [setCategories]);

  // Delete a category (only custom ones, not defaults)
  const deleteCategory = useCallback((id: string) => {
    // Only allow deleting non-default categories
    if (DEFAULT_CATEGORIES.some(c => c.id === id)) {
      // For default categories, just remove any custom overrides
      setCategories(prev => prev.filter(c => c.id !== id));
    } else {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  }, [setCategories]);

  // Reset a category to its default (if it's a default category)
  const resetCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, [setCategories]);

  // Check if a category has been customized
  const isCustomized = useCallback((id: string) => {
    return categories.some(c => c.id === id);
  }, [categories]);

  // Check if a category is a default category
  const isDefaultCategory = useCallback((id: string) => {
    return DEFAULT_CATEGORIES.some(c => c.id === id);
  }, []);

  return {
    categories: allCategories,
    getCategoryColor,
    getCategoryAccentColor,
    getCategoryLabel,
    getCategoryShadowColor,
    createCategory,
    updateCategory,
    deleteCategory,
    resetCategory,
    isCustomized,
    isDefaultCategory,
  };
}
