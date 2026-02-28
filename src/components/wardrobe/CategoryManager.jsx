import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { createCategory, updateCategory, deleteCategory } from '../../service/wardrobeService';

export const CategoryManager = ({ isOpen, onClose, categories, onCategoriesChange, userId }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const sortOrder = categories.length;
      const newCat = await createCategory(userId, newCategoryName.trim(), sortOrder);
      onCategoriesChange([...categories, newCat]);
      setNewCategoryName('');
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category');
    }
  };

  const handleUpdateCategory = async (categoryId) => {
    if (!editingName.trim()) return;

    try {
      await updateCategory(categoryId, { name: editingName.trim() });
      onCategoriesChange(categories.map(c =>
        c.id === categoryId ? { ...c, name: editingName.trim() } : c
      ));
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Delete this category? Items in this category will not be deleted but will show as uncategorized.')) return;

    try {
      await deleteCategory(categoryId);
      onCategoriesChange(categories.filter(c => c.id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const startEditing = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Create, rename, or delete your clothing categories.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4 max-h-64 overflow-y-auto">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
              {editingId === cat.id ? (
                <>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 h-8 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateCategory(cat.id)}
                  />
                  <Button size="sm" onClick={() => handleUpdateCategory(cat.id)}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm">{cat.name}</span>
                  <button
                    onClick={() => startEditing(cat)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <Button onClick={handleAddCategory}>Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
