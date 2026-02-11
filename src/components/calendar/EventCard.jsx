import React from 'react';
import { EVENT_CATEGORIES } from '../../constants/categories';

export const EventCard = ({ event, onEdit, onDelete }) => {
  const category = EVENT_CATEGORIES.find(c => c.id === event.category);

  return (
    <div
      className="border-l-4 p-3 rounded bg-white shadow-sm hover:shadow-md transition-shadow"
      style={{ borderLeftColor: event.color }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-bold text-base">{event.title}</h4>
          <p className="text-sm text-gray-600">{event.startTime} - {event.endTime}</p>
          {event.description && (
            <p className="text-sm text-gray-500 mt-1">{event.description}</p>
          )}
          <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-gray-100">
            {category?.icon} {category?.name}
          </span>
        </div>
        <div className="flex gap-2 ml-3">
          <button
            onClick={() => onEdit(event)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(event)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
