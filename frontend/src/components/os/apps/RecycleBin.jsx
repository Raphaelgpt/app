import React from 'react';
import { Trash2 } from 'lucide-react';

export const RecycleBin = () => {
  return (
    <div data-testid="recycle-bin" className="flex flex-col items-center justify-center h-full text-white/50">
      <Trash2 className="w-24 h-24 mb-4 text-white/20" strokeWidth={1} />
      <p className="text-lg">La corbeille est vide</p>
      <p className="text-sm text-white/30 mt-2">Les éléments supprimés apparaîtront ici</p>
    </div>
  );
};
