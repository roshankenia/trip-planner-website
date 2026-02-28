import React from 'react';
import { OutfitCard } from './OutfitCard';
import { Button } from '../ui/button';
import { format } from 'date-fns';

export const OutfitDetailsPanel = ({ selectedDate, outfits, onAddOutfit, onEditOutfit, onDeleteOutfit }) => {
  const dateStr = selectedDate ? format(selectedDate, 'MMMM d, yyyy') : '';

  return (
    <div className="p-4 bg-gray-50 rounded-lg h-full">
      <div className="mb-4">
        <h3 className="font-bold text-xl">{dateStr}</h3>
        <p className="text-gray-500 text-sm">{outfits.length} outfit{outfits.length !== 1 ? 's' : ''}</p>
      </div>

      {outfits.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="mb-4">No outfits planned for this day</p>
          <Button onClick={onAddOutfit}>Plan an Outfit</Button>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {outfits.map((outfit) => (
              <OutfitCard
                key={outfit.outfitId}
                outfit={outfit}
                onEdit={onEditOutfit}
                onDelete={onDeleteOutfit}
              />
            ))}
          </div>
          <Button onClick={onAddOutfit} className="w-full">+ Add Another Outfit</Button>
        </>
      )}
    </div>
  );
};
