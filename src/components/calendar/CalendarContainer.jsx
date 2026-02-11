import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

export const CalendarContainer = ({ selectedDate, onDateClick, eventsMap }) => {
  // eventsMap: { "2026-02-15": [...events], "2026-02-16": [...events] }

  const tileContent = ({ date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayEvents = eventsMap[dateStr];

    if (dayEvents && dayEvents.length > 0) {
      return (
        <div className="event-indicator">
          {dayEvents.slice(0, 3).map((event, idx) => (
            <div
              key={idx}
              className="event-dot"
              style={{ backgroundColor: event.color }}
            />
          ))}
          {dayEvents.length > 3 && <span className="more-indicator">+{dayEvents.length - 3}</span>}
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
