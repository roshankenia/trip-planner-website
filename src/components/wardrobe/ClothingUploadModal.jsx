import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { uploadClothingImage } from '../../service/storageService';
import { v4 as uuidv4 } from 'uuid';

export const ClothingUploadModal = ({ isOpen, onClose, categories, onSave, editingItem, userId }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    imageFile: null,
    imagePreview: null
  });
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        categoryId: editingItem.categoryId,
        imageFile: null,
        imagePreview: editingItem.imageUrl
      });
    } else {
      setFormData({
        name: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        imageFile: null,
        imagePreview: null
      });
    }
  }, [editingItem, isOpen, categories]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a name for this item');
      return;
    }
    if (!formData.categoryId) {
      alert('Please select a category');
      return;
    }
    if (!editingItem && !formData.imageFile) {
      alert('Please upload an image');
      return;
    }

    setUploading(true);
    try {
      const itemId = editingItem?.id || uuidv4();
      let imageUrl = editingItem?.imageUrl || '';
      let imagePath = editingItem?.imagePath || '';

      if (formData.imageFile) {
        const categoryName = categories.find(c => c.id === formData.categoryId)?.name || 'clothing';
        setUploadStatus('Removing background...');
        const result = await uploadClothingImage(userId, itemId, formData.imageFile, categoryName);
        setUploadStatus('');
        imageUrl = result.downloadUrl;
        imagePath = result.storagePath;
      }

      const item = {
        id: itemId,
        userId,
        name: formData.name,
        categoryId: formData.categoryId,
        imageUrl,
        imagePath,
        createdAt: editingItem?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onSave(item);
      onClose();
    } catch (error) {
      console.error('Error saving clothing item:', error);
      alert('Failed to save item. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit Clothing Item' : 'Add Clothing Item'}</DialogTitle>
          <DialogDescription>
            {editingItem ? 'Update the details for this clothing item.' : 'Upload a photo and add details for your clothing item.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div
            className="upload-dropzone"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {formData.imagePreview ? (
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="max-h-48 mx-auto rounded object-contain"
              />
            ) : (
              <div className="py-8">
                <p className="text-gray-500">Click or drag an image here</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Blue Oxford Shirt"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full border rounded p-2 text-sm"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose} disabled={uploading}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={uploading}>
              {uploading ? (uploadStatus || 'Uploading...') : (editingItem ? 'Update' : 'Add Item')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
