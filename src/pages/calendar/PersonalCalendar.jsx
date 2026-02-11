import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { CalendarContainer } from '../../components/calendar/CalendarContainer';
import { EventDetailsPanel } from '../../components/calendar/EventDetailsPanel';
import { EventCreationModal } from '../../components/calendar/EventCreationModal';
import { fetchEventsForMonth, saveEvent, updateEvent, deleteEvent } from '../../service/calendarService';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const PersonalCalendar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [eventsMap, setEventsMap] = useState({}); // { "2026-02-15": [...events] }
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      setLoading(false);
      return;
    }
    setUser(JSON.parse(userData));
    setLoading(false);
  }, []);

  // Load events for current month
  useEffect(() => {
    if (!user) return;

    const loadEvents = async () => {
      try {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;
        const monthEvents = await fetchEventsForMonth(user.email, year, month);

        // Convert to map: { "2026-02-15": [...events], ... }
        const map = {};
        monthEvents.forEach(dayData => {
          map[dayData.date] = dayData.events;
        });
        setEventsMap(map);
      } catch (error) {
        console.error('Error loading events:', error);
        toast.error('Failed to load events');
      }
    };

    loadEvents();
  }, [user, currentMonth]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleDeleteEvent = async (event) => {
    if (!window.confirm('Delete this event?')) return;

    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      await deleteEvent(user.email, dateStr, event.eventId);

      // Update local state
      const newEventsMap = { ...eventsMap };
      newEventsMap[dateStr] = newEventsMap[dateStr].filter(e => e.eventId !== event.eventId);
      if (newEventsMap[dateStr].length === 0) {
        delete newEventsMap[dateStr];
      }
      setEventsMap(newEventsMap);

      toast.success('Event deleted');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleSaveEvent = async (event) => {
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');

      if (editingEvent) {
        // Update existing event
        await updateEvent(user.email, dateStr, event.eventId, event);

        // Update local state
        const newEventsMap = { ...eventsMap };
        const eventIndex = newEventsMap[dateStr].findIndex(e => e.eventId === event.eventId);
        newEventsMap[dateStr][eventIndex] = event;
        setEventsMap(newEventsMap);

        toast.success('Event updated');
      } else {
        // Create new event
        await saveEvent(user.email, dateStr, event);

        // Update local state
        const newEventsMap = { ...eventsMap };
        if (!newEventsMap[dateStr]) {
          newEventsMap[dateStr] = [];
        }
        newEventsMap[dateStr].push(event);
        setEventsMap(newEventsMap);

        toast.success('Event created');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    }
  };

  // If not logged in, show sign-in prompt
  if (!loading && !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
            <h1 className="text-3xl font-bold mb-4">Personal Calendar</h1>
            <p className="text-gray-600 mb-6">Sign in with Google to start planning your days</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateEvents = eventsMap[dateStr] || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Calendar</h1>
          <p className="text-gray-600">Plan your days and stay organized</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar on the left */}
          <div>
            <CalendarContainer
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
              eventsMap={eventsMap}
            />
          </div>

          {/* Event details on the right */}
          <div>
            <EventDetailsPanel
              selectedDate={selectedDate}
              events={selectedDateEvents}
              onAddEvent={handleAddEvent}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          </div>
        </div>
      </div>

      <EventCreationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
        editingEvent={editingEvent}
      />

      <Footer />
    </div>
  );
};
