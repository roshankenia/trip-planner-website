import React from "react";

export const PlaceCardItem = ({ place }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-default">
      <div className="flex gap-4">
        <img
          src={place?.PlaceImageUrl || '/placeholder.jpg'}
          alt={place?.PlaceName}
          className="w-32 h-32 object-cover rounded-lg"
        />

        <div className="flex-1">
          <h3 className="font-bold text-lg">{place?.PlaceName}</h3>
          <p className="text-sm text-gray-600 mt-1">{place?.PlaceDetails}</p>

          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <span className="text-blue-600">🕒 {place?.Time}</span>
            <span className="text-green-600">💵 {place?.TicketPricing}</span>
            <span className="text-yellow-600">⭐ {place?.Rating}</span>
            <span className="text-purple-600">⏱️ {place?.TimeTravel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
