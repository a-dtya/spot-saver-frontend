import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddSpotModal from '@/components/AddSpotModal';

interface Spot {
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  tags: string[];
  notes?: string;
}

const AddSpotPage = () => {
  const navigate = useNavigate();
  const [newSpotCoords, setNewSpotCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleSaveSpot = (spot: Spot) => {
    console.log('Spot saved', spot);
    // TODO: Add to your state or Supabase
    navigate('/'); // go back to map page
  };

  const handleClose = () => navigate('/');

  return (
    <div className="fixed inset-0 z-[10010] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <AddSpotModal
        isOpen={true}
        onClose={handleClose}
        onSave={handleSaveSpot}
        initialCoordinates={newSpotCoords}
      />
    </div>
  );
};

export default AddSpotPage;
