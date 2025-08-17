import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddSpotModal from '@/components/AddSpotModal';
import { supabase } from '@/lib/supabaseClient';

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

  const handleSaveSpot = async (spot: Spot) => {
    console.log('Spot saved', spot);
    const { data, error } = await supabase
    .from('spots')
    .insert([
      {
        name: spot.name,
        location: spot.location,
        tags: spot.tags,
        notes: spot.notes || null,
        coordinates: spot.coordinates,
      }
    ]);
    if (error) {
      console.error('Error saving spot:', error);
      return;
    }
    navigate('/'); // go back to map page
  };

  const handleClose = () => navigate('/');

  return (
    <div className="fixed z-[10010] flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
