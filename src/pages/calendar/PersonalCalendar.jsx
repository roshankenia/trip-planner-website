import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { CalendarContainer } from '../../components/calendar/CalendarContainer';
import { OutfitDetailsPanel } from '../../components/calendar/OutfitDetailsPanel';
import { OutfitCreationModal } from '../../components/calendar/OutfitCreationModal';
import { fetchOutfitsForMonth, saveOutfit, updateOutfit, deleteOutfit } from '../../service/outfitService';
import { fetchWardrobeItems, fetchCategories } from '../../service/wardrobeService';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const PersonalCalendar = () => {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [outfitsMap, setOutfitsMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState(null);
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      setLoading(false);
      return;
    }
    setUser(JSON.parse(userData));
    setLoading(false);
  }, []);

  // Load outfits for current month
  useEffect(() => {
    if (!user) return;

    const loadOutfits = async () => {
      try {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;
        const monthData = await fetchOutfitsForMonth(user.email, year, month);

        const map = {};
        monthData.forEach(dayData => {
          map[dayData.date] = dayData.outfits;
        });
        setOutfitsMap(map);
      } catch (error) {
        console.error('Error loading outfits:', error);
        toast.error('Failed to load outfits');
      }
    };

    loadOutfits();
  }, [user, currentMonth]);

  // Load wardrobe items and categories (for outfit creation modal)
  useEffect(() => {
    if (!user) return;

    const loadWardrobe = async () => {
      try {
        const [items, cats] = await Promise.all([
          fetchWardrobeItems(user.email),
          fetchCategories(user.email)
        ]);
        setWardrobeItems(items);
        setCategories(cats);
      } catch (error) {
        console.error('Error loading wardrobe:', error);
      }
    };

    loadWardrobe();
  }, [user]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleAddOutfit = () => {
    setEditingOutfit(null);
    setModalOpen(true);
  };

  const handleEditOutfit = (outfit) => {
    setEditingOutfit(outfit);
    setModalOpen(true);
  };

  const handleDeleteOutfit = async (outfit) => {
    if (!window.confirm('Delete this outfit?')) return;

    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      await deleteOutfit(user.email, dateStr, outfit.outfitId);

      const newMap = { ...outfitsMap };
      newMap[dateStr] = newMap[dateStr].filter(o => o.outfitId !== outfit.outfitId);
      if (newMap[dateStr].length === 0) {
        delete newMap[dateStr];
      }
      setOutfitsMap(newMap);

      toast.success('Outfit deleted');
    } catch (error) {
      console.error('Error deleting outfit:', error);
      toast.error('Failed to delete outfit');
    }
  };

  const handleSaveOutfit = async (outfit) => {
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');

      if (editingOutfit) {
        await updateOutfit(user.email, dateStr, outfit.outfitId, outfit);

        const newMap = { ...outfitsMap };
        const idx = newMap[dateStr].findIndex(o => o.outfitId === outfit.outfitId);
        newMap[dateStr][idx] = outfit;
        setOutfitsMap(newMap);

        toast.success('Outfit updated');
      } else {
        await saveOutfit(user.email, dateStr, outfit);

        const newMap = { ...outfitsMap };
        if (!newMap[dateStr]) {
          newMap[dateStr] = [];
        }
        newMap[dateStr].push(outfit);
        setOutfitsMap(newMap);

        toast.success('Outfit saved');
      }
    } catch (error) {
      console.error('Error saving outfit:', error);
      toast.error('Failed to save outfit');
    }
  };

  if (!loading && !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
            <h1 className="text-3xl font-bold mb-4">Outfit Planner</h1>
            <p className="text-gray-600 mb-6">Sign in with Google to start planning your outfits</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateOutfits = outfitsMap[dateStr] || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Outfit Planner</h1>
          <p className="text-gray-600">Plan your outfits for every day</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <CalendarContainer
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
              outfitsMap={outfitsMap}
            />
          </div>

          <div>
            <OutfitDetailsPanel
              selectedDate={selectedDate}
              outfits={selectedDateOutfits}
              onAddOutfit={handleAddOutfit}
              onEditOutfit={handleEditOutfit}
              onDeleteOutfit={handleDeleteOutfit}
            />
          </div>
        </div>
      </div>

      <OutfitCreationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSaveOutfit}
        editingOutfit={editingOutfit}
        wardrobeItems={wardrobeItems}
        categories={categories}
      />

      <Footer />
    </div>
  );
};
