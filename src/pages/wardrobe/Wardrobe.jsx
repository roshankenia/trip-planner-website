import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { ClothingCard } from '../../components/wardrobe/ClothingCard';
import { ClothingUploadModal } from '../../components/wardrobe/ClothingUploadModal';
import { CategoryManager } from '../../components/wardrobe/CategoryManager';
import { fetchWardrobeItems, saveWardrobeItem, updateWardrobeItem, deleteWardrobeItem, initializeDefaultCategories } from '../../service/wardrobeService';
import { deleteClothingImage } from '../../service/storageService';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

export const Wardrobe = () => {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      setLoading(false);
      return;
    }
    setUser(JSON.parse(userData));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const cats = await initializeDefaultCategories(user.email);
        setCategories(cats);

        const items = await fetchWardrobeItems(user.email);
        setWardrobeItems(items);
      } catch (error) {
        console.error('Error loading wardrobe:', error);
        toast.error('Failed to load wardrobe');
      }
    };

    loadData();
  }, [user]);

  const handleSaveItem = async (item) => {
    try {
      if (editingItem) {
        await updateWardrobeItem(item.id, item);
        setWardrobeItems(wardrobeItems.map(i => i.id === item.id ? item : i));
        toast.success('Item updated');
      } else {
        await saveWardrobeItem(item);
        setWardrobeItems([...wardrobeItems, item]);
        toast.success('Item added to wardrobe');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setUploadModalOpen(true);
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;

    try {
      if (item.imagePath) {
        await deleteClothingImage(item.imagePath);
      }
      await deleteWardrobeItem(item.id);
      setWardrobeItems(wardrobeItems.filter(i => i.id !== item.id));
      toast.success('Item deleted');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setUploadModalOpen(true);
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat?.name || 'Uncategorized';
  };

  const filteredItems = activeCategory === 'all'
    ? wardrobeItems
    : wardrobeItems.filter(item => item.categoryId === activeCategory);

  if (!loading && !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
            <h1 className="text-3xl font-bold mb-4">My Wardrobe</h1>
            <p className="text-gray-600 mb-6">Sign in with Google to manage your wardrobe</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Wardrobe</h1>
            <p className="text-gray-600">{wardrobeItems.length} item{wardrobeItems.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCategoryModalOpen(true)}>
              Manage Categories
            </Button>
            <Button onClick={handleAddItem}>
              + Add Item
            </Button>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
            }`}
          >
            All ({wardrobeItems.length})
          </button>
          {categories.map(cat => {
            const count = wardrobeItems.filter(i => i.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Clothing grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-4">
              {activeCategory === 'all'
                ? 'Your wardrobe is empty'
                : 'No items in this category'}
            </p>
            <Button onClick={handleAddItem}>Upload your first item</Button>
          </div>
        ) : (
          <div className="wardrobe-grid">
            {filteredItems.map(item => (
              <ClothingCard
                key={item.id}
                item={item}
                categoryName={getCategoryName(item.categoryId)}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      <ClothingUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        categories={categories}
        onSave={handleSaveItem}
        editingItem={editingItem}
        userId={user?.email}
      />

      <CategoryManager
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        categories={categories}
        onCategoriesChange={setCategories}
        userId={user?.email}
      />

      <Footer />
    </div>
  );
};
