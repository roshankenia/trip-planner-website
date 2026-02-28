import React from 'react';
import { OUTFIT_OCCASIONS } from '../../constants/categories';

export const OutfitCard = ({ outfit, onEdit, onDelete }) => {
  const occasion = OUTFIT_OCCASIONS.find(o => o.id === outfit.occasion);

  return (
    <div className="p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-bold text-base">{outfit.name}</h4>
          {occasion && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-gray-100">
              {occasion.icon} {occasion.name}
            </span>
          )}
        </div>
        <div className="flex gap-2 ml-3">
          <button
            onClick={() => onEdit(outfit)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(outfit)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Clothing item thumbnails */}
      <div className="flex gap-2 mt-3 items-center">
        {outfit.items.slice(0, 4).map((item, idx) => (
          <div key={idx} className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/placeholder.jpg'; }}
            />
          </div>
        ))}
        {outfit.items.length > 4 && (
          <span className="text-xs text-gray-500 font-medium">+{outfit.items.length - 4}</span>
        )}
        {outfit.items.length === 0 && (
          <span className="text-xs text-gray-400">No items selected</span>
        )}
      </div>

      {outfit.notes && (
        <p className="text-sm text-gray-500 mt-2">{outfit.notes}</p>
      )}
    </div>
  );
};
