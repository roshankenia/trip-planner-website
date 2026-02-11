import React from 'react';
import { PlaceCardItem } from './PlaceCardItem';
import { format, parseISO } from 'date-fns';

export const DayDetailsPanel = ({ dayData }) => {
  if (!dayData) {
    return (
      <div className="text-center text-gray-500 py-10">
        <p>Select a date from the calendar to view activities</p>
      </div>
    );
  }

  return (
    <div className="day-details">
      <div className="mb-4">
        <h3 className="font-bold text-xl">
          Day {dayData.Day} - {format(parseISO(dayData.date), 'MMMM d, yyyy')}
        </h3>
        <p className="text-gray-500">
          {dayData.Plan?.length || 0} activities planned
        </p>
      </div>

      <div className="space-y-4">
        {dayData.Plan?.map((place, index) => (
          <PlaceCardItem key={index} place={place} />
        ))}
      </div>
    </div>
  );
};
