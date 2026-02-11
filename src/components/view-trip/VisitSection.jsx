import React, { useState } from 'react';
import { CalendarView } from './CalendarView';
import { DayDetailsPanel } from './DayDetailsPanel';

export const VisitSection = ({ trip }) => {
  const [selectedDay, setSelectedDay] = useState(
    trip?.tripData?.itinerary?.[0] || null
  );

  return (
    <div className="mt-10">
      <h2 className="font-bold text-2xl mb-5">Your Itinerary</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar on the left */}
        <div>
          <CalendarView trip={trip} onDateSelect={setSelectedDay} />
        </div>

        {/* Day details on the right */}
        <div>
          <DayDetailsPanel dayData={selectedDay} />
        </div>
      </div>
    </div>
  );
};
