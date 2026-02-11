import React from 'react';
import { EventCard } from './EventCard';
import { Button } from '../ui/button';
import { format } from 'date-fns';

export const EventDetailsPanel = ({ selectedDate, events, onAddEvent, onEditEvent, onDeleteEvent }) => {
  const dateStr = selectedDate ? format(selectedDate, 'MMMM d, yyyy') : '';
  const sortedEvents = events.sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="event-details-panel p-4 bg-gray-50 rounded-lg h-full">
      <div className="mb-4">
        <h3 className="font-bold text-xl">{dateStr}</h3>
        <p className="text-gray-500 text-sm">{events.length} event{events.length !== 1 ? 's' : ''}</p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="mb-4">No events for this day</p>
          <Button onClick={onAddEvent}>Add Event</Button>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {sortedEvents.map((event) => (
              <EventCard
                key={event.eventId}
                event={event}
                onEdit={onEditEvent}
                onDelete={onDeleteEvent}
              />
            ))}
          </div>
          <Button onClick={onAddEvent} className="w-full">+ Add Event</Button>
        </>
      )}
    </div>
  );
};
