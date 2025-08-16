import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { supabase } from '@/lib/supabaseClient';
import SpotCard from '@/components/SpotCard';
import { Button } from '@/components/ui/button';

interface Spot {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  tags: string[];
  notes?: string;
  visitedAt?: string;
  rating?: number;
  createdAt: string;
}

interface MapPageProps {
  spots: Spot[];
  onAddSpot: (spot: Spot) => void;
  onViewSpot: (spot: Spot) => void;
}

const MapPage: React.FC<MapPageProps> = ({ spots, onAddSpot, onViewSpot }) => {
  const [newSpotCoords, setNewSpotCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Fix default Leaflet icon issue
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });

  const AddSpotHandler = () => {
    useMapEvents({
      click(e) {
        setNewSpotCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  };

const handleSaveNewSpot = () => {
  if (!newSpotCoords) return;

  const newSpot: Spot = {
    id: Date.now().toString(),
    name: `New Spot`,
    location: `Lat: ${newSpotCoords.lat.toFixed(4)}, Lng: ${newSpotCoords.lng.toFixed(4)}`,
    coordinates: newSpotCoords,
    tags: [],
    notes: '',        // ✅ add this
    createdAt: new Date().toISOString(),
  };

  onAddSpot(newSpot);
  setNewSpotCoords(null);
};

  return (
    <MapContainer
      center={{ lat: 12.9716, lng: 77.5946 }}
      zoom={5}
      className="h-[500px] w-full"
      scrollWheelZoom={true}
      style={{ zIndex: 0 }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <AddSpotHandler />

      {/* Existing spots */}
      {spots.map((spot) => (
        <Marker key={spot.id} position={[spot.coordinates.lat, spot.coordinates.lng]}>
          <Popup>
            <SpotCard {...spot} onView={onViewSpot} onEdit={() => alert('Edit coming soon')} />
          </Popup>
        </Marker>
      ))}

      {/* New spot preview */}
      {newSpotCoords && (
        <Marker position={[newSpotCoords.lat, newSpotCoords.lng]}>
          <Popup>
            <div className="space-y-2">
              <div>
                <strong>New Spot</strong>
              </div>
              <div>
                Lat: {newSpotCoords.lat.toFixed(4)}, Lng: {newSpotCoords.lng.toFixed(4)}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveNewSpot}>Add Spot</Button>
                <Button size="sm" variant="outline" onClick={() => setNewSpotCoords(null)}>Close</Button>
              </div>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapPage;
