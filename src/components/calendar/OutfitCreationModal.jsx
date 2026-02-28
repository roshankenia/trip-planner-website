import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { OUTFIT_OCCASIONS } from '../../constants/categories';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';

export const OutfitCreationModal = ({ isOpen, onClose, selectedDate, onSave, editingOutfit, wardrobeItems, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    occasion: 'casual',
    selectedItemIds: [],
    notes: ''
  });
  const [activePickerCategory, setActivePickerCategory] = useState('all');

  useEffect(() => {
    if (editingOutfit) {
      setFormData({
        name: editingOutfit.name,
        occasion: editingOutfit.occasion || 'casual',
        selectedItemIds: editingOutfit.items.map(i => i.itemId),
        notes: editingOutfit.notes || ''
      });
    } else {
      setFormData({
        name: '',
        occasion: 'casual',
        selectedItemIds: [],
        notes: ''
      });
    }
    setActivePickerCategory('all');
  }, [editingOutfit, isOpen]);

  const toggleItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      selectedItemIds: prev.selectedItemIds.includes(itemId)
        ? prev.selectedItemIds.filter(id => id !== itemId)
        : [...prev.selectedItemIds, itemId]
    }));
  };

  const filteredPickerItems = activePickerCategory === 'all'
    ? wardrobeItems
    : wardrobeItems.filter(item => item.categoryId === activePickerCategory);

  const selectedItems = wardrobeItems.filter(item => formData.selectedItemIds.includes(item.id));

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Please enter a name for this outfit');
      return;
    }
    if (formData.selectedItemIds.length === 0) {
      alert('Please select at least one clothing item');
      return;
    }

    const outfit = {
      outfitId: editingOutfit?.outfitId || uuidv4(),
      name: formData.name,
      occasion: formData.occasion,
      items: formData.selectedItemIds.map(itemId => {
        const item = wardrobeItems.find(w => w.id === itemId);
        return {
          itemId: item.id,
          name: item.name,
          imageUrl: item.imageUrl,
          categoryId: item.categoryId
        };
      }),
      notes: formData.notes,
      createdAt: editingOutfit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(outfit);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingOutfit ? 'Edit Outfit' : 'Create Outfit'}</DialogTitle>
          <DialogDescription>
            {editingOutfit ? 'Update your outfit details and selected items.' : 'Name your outfit and pick items from your wardrobe.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Outfit Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Morning Meeting"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Occasion</label>
              <select
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                className="w-full border rounded p-2 text-sm"
              >
                {OUTFIT_OCCASIONS.map(occ => (
                  <option key={occ.id} value={occ.id}>{occ.icon} {occ.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Wardrobe picker */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Items from Wardrobe</label>

            {wardrobeItems.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-3">Your wardrobe is empty!</p>
                <Link to="/wardrobe">
                  <Button variant="outline" size="sm">Go to Wardrobe</Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Category filter tabs */}
                <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
                  <button
                    onClick={() => setActivePickerCategory('all')}
                    className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                      activePickerCategory === 'all'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActivePickerCategory(cat.id)}
                      className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                        activePickerCategory === cat.id
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Item grid */}
                <div className="picker-grid">
                  {filteredPickerItems.map(item => {
                    const isSelected = formData.selectedItemIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`picker-item ${isSelected ? 'selected' : ''}`}
                      >
                        <div className="aspect-square overflow-hidden rounded bg-gray-100 relative">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">&#10003;</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs mt-1 truncate text-center">{item.name}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Selected items summary */}
          {selectedItems.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Selected ({selectedItems.length})</label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {selectedItems.map(item => (
                  <div key={item.id} className="flex-shrink-0 relative">
                    <div className="w-14 h-14 rounded overflow-hidden bg-gray-100">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                      />
                    </div>
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
                    >
                      &#10005;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Optional notes about this outfit"
              className="w-full border rounded p-2 text-sm"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>
              {editingOutfit ? 'Update' : 'Create'} Outfit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
