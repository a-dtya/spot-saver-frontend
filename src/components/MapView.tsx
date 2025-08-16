import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Target } from 'lucide-react';

interface Spot {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  tags: string[];
  notes?: string;
}

interface MapViewProps {
  spots: Spot[];
  onAddSpot: (coordinates: { lat: number; lng: number }) => void;
  onSpotClick: (spot: Spot) => void;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({ 
  spots, 
  onAddSpot, 
  onSpotClick, 
  className = "" 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Simulate getting user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to a nice location if geolocation fails
          setUserLocation({ lat: 40.7128, lng: -74.0060 }); // NYC
        }
      );
    } else {
      setUserLocation({ lat: 40.7128, lng: -74.0060 });
    }
  }, []);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert click position to mock coordinates
    const lat = userLocation ? userLocation.lat + (y - rect.height / 2) * 0.001 : 40.7128;
    const lng = userLocation ? userLocation.lng + (x - rect.width / 2) * 0.001 : -74.0060;
    
    setSelectedCoordinates({ lat, lng });
  };

  const handleAddSpotAtLocation = () => {
    if (selectedCoordinates) {
      onAddSpot(selectedCoordinates);
      setSelectedCoordinates(null);
    }
  };

  const centerOnUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        }
      );
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Mock Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/10 rounded-lg overflow-hidden cursor-crosshair border border-primary/20"
        onClick={handleMapClick}
      >
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-muted-foreground/20"></div>
            ))}
          </div>
        </div>

        {/* User Location */}
        {userLocation && (
          <div 
            className="absolute w-4 h-4 -translate-x-2 -translate-y-2 animate-pulse-warm"
            style={{
              left: '50%',
              top: '50%',
            }}
          >
            <div className="w-full h-full bg-accent rounded-full shadow-lg border-2 border-white"></div>
          </div>
        )}

        {/* Selected Location */}
        {selectedCoordinates && (
          <div 
            className="absolute w-6 h-6 -translate-x-3 -translate-y-3 animate-bounce"
            style={{
              left: `${50 + (selectedCoordinates.lng - (userLocation?.lng || 0)) * 1000}%`,
              top: `${50 + (selectedCoordinates.lat - (userLocation?.lat || 0)) * 1000}%`,
            }}
          >
            <MapPin className="w-full h-full text-destructive drop-shadow-lg" />
          </div>
        )}

        {/* Existing Spots */}
        {spots.map((spot) => (
          <div
            key={spot.id}
            className="absolute w-6 h-6 -translate-x-3 -translate-y-3 cursor-pointer hover:scale-110 transition-transform"
            style={{
              left: `${50 + (spot.coordinates.lng - (userLocation?.lng || 0)) * 1000}%`,
              top: `${50 + (spot.coordinates.lat - (userLocation?.lat || 0)) * 1000}%`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSpotClick(spot);
            }}
          >
            <MapPin className="w-full h-full text-primary drop-shadow-lg" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-primary font-medium whitespace-nowrap shadow-soft">
              {spot.name}
            </div>
          </div>
        ))}

        {/* Map Instructions */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-soft max-w-xs">
          <p className="text-xs text-muted-foreground">
            {selectedCoordinates 
              ? "Click the button below to add a spot here" 
              : "Click anywhere on the map to add a new spot"
            }
          </p>
        </div>
      </div>

      {/* Floating Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button 
          variant="floating" 
          size="icon"
          onClick={centerOnUser}
          className="rounded-full"
        >
          <Target className="w-4 h-4" />
        </Button>
        
        {selectedCoordinates && (
          <Button 
            variant="hero" 
            onClick={handleAddSpotAtLocation}
            className="rounded-full shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Spot
          </Button>
        )}
      </div>
    </div>
  );
};

export default MapView;
