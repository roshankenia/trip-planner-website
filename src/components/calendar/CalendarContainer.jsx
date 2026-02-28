import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

export const CalendarContainer = ({ selectedDate, onDateClick, outfitsMap }) => {
  const tileContent = ({ date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayOutfits = outfitsMap[dateStr];

    if (dayOutfits && dayOutfits.length > 0) {
      const firstOutfit = dayOutfits[0];
      const firstImage = firstOutfit.items?.[0]?.imageUrl;

      return (
        <div className="outfit-indicator">
          {firstImage ? (
            <img src={firstImage} alt="" className="outfit-thumbnail" />
          ) : (
            <div className="outfit-dot" />
          )}
          {dayOutfits.length > 1 && (
            <span className="outfit-count">+{dayOutfits.length - 1}</span>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <Calendar
        value={selectedDate}
        onClickDay={onDateClick}
        tileContent={tileContent}
        className="rounded-lg border shadow-md w-full"
      />
    </div>
  );
};
