import React from 'react';
import AddSpotModal from '@/components/AddSpotModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button} from '@/components/ui/button';
import { Badge } from './ui/badge';
import { Heart, MapPin } from 'lucide-react';
import { Spot } from '@/hooks/useSpots';

interface Props {
  selectedSpot: Spot | null;
  setSelectedSpot: (s: Spot | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (b: boolean) => void;
  onSave: (s: any) => void;
  initialCoords: { lat: number; lng: number } | null;
}

const SpotModals: React.FC<Props> = ({ selectedSpot, setSelectedSpot, isAddModalOpen, setIsAddModalOpen, onSave, initialCoords }) => (
  <>
    {isAddModalOpen && <AddSpotModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={onSave} initialCoordinates={initialCoords} />}
    {selectedSpot && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setSelectedSpot(null)}>
        <Card className="bg-gradient-card shadow-warm border-0 max-w-md w-full max-h-[80vh] overflow-y-auto relative z-[10000]" onClick={e => e.stopPropagation()}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary"><MapPin className="w-5 h-5" />{selectedSpot.name}</CardTitle>
            <p className="text-muted-foreground">{selectedSpot.location}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedSpot.rating && <div className="flex items-center gap-2"><span className="text-sm font-medium">Rating:</span><div className="flex">{Array.from({ length: 5 }).map((_, i) => <Heart key={i} className={`w-4 h-4 ${i < selectedSpot.rating! ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />)}</div></div>}
            <div className="flex flex-wrap gap-1">{selectedSpot.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}</div>
            {selectedSpot.notes && <div><h4 className="font-medium mb-2">Notes:</h4><p className="text-muted-foreground">{selectedSpot.notes}</p></div>}
            {selectedSpot.visitedAt && <div><span className="text-sm font-medium">Visited: </span><span className="text-muted-foreground">{selectedSpot.visitedAt}</span></div>}
            <Button variant="outline" onClick={() => setSelectedSpot(null)} className="w-full">Close</Button>
          </CardContent>
        </Card>
      </div>
    )}
  </>
);

export default SpotModals;
