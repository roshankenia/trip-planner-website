import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { EVENT_CATEGORIES } from '../../constants/categories';
import { v4 as uuidv4 } from 'uuid';

export const EventCreationModal = ({ isOpen, onClose, selectedDate, onSave, editingEvent }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '09:00',
    endTime: '10:00',
    category: 'personal'
  });

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        description: editingEvent.description || '',
        startTime: editingEvent.startTime,
        endTime: editingEvent.endTime,
        category: editingEvent.category
      });
    } else {
      setFormData({
        title: '',
        description: '',
        startTime: '09:00',
        endTime: '10:00',
        category: 'personal'
      });
    }
  }, [editingEvent, isOpen]);

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Please enter an event title');
      return;
    }

    const category = EVENT_CATEGORIES.find(c => c.id === formData.category);
    const event = {
      eventId: editingEvent?.eventId || uuidv4(),
      title: formData.title,
      description: formData.description,
      startTime: formData.startTime,
      endTime: formData.endTime,
      category: formData.category,
      color: category?.color || '#95A5A6',
      createdAt: editingEvent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(event);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Event title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Event description (optional)"
              className="w-full border rounded p-2 text-sm"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full border rounded p-2 text-sm"
            >
              {EVENT_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>
              {editingEvent ? 'Update' : 'Create'} Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
