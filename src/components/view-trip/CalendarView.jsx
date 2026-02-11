import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, parseISO } from 'date-fns';

export const CalendarView = ({ trip, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Get all trip dates from itinerary
  const tripDates = trip?.tripData?.itinerary?.map(day =>
    parseISO(day.date)
  ) || [];

  const minDate = tripDates[0];
  const maxDate = tripDates[tripDates.length - 1];

  // Check if date has activities
  const hasActivities = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return trip?.tripData?.itinerary?.some(day => day.date === dateStr);
  };

  // Style dates with activities
  const tileClassName = ({ date }) => {
    if (hasActivities(date)) {
      return 'has-activities';
    }
    return null;
  };

  const handleDateClick = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = trip?.tripData?.itinerary?.find(day => day.date === dateStr);

    if (dayData) {
      setSelectedDate(date);
      onDateSelect(dayData);
    }
  };

  return (
    <div className="calendar-container">
      <h2 className="font-bold text-2xl mb-4">Trip Calendar</h2>
      <Calendar
        value={selectedDate}
        onClickDay={handleDateClick}
        tileClassName={tileClassName}
        minDate={minDate}
        maxDate={maxDate}
        className="rounded-lg border shadow-md"
      />
    </div>
  );
};
