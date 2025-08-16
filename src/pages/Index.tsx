import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, List, Plus, Heart, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SpotCard from '@/components/SpotCard';
import AddSpotModal from '@/components/AddSpotModal';
import FilterBar from '@/components/FilterBar';
import { supabase } from '@/lib/supabaseClient';
import MapPage from '@/components/MapPage'; // import your cleaned MapPage component
import { useNavigate } from 'react-router-dom';
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

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recent');
  const [newSpotCoordinates, setNewSpotCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Fetch spots from Supabase
  useEffect(() => {
    const fetchSpots = async () => {
      const { data, error } = await supabase.from('spots').select('*');
      if (error) {
        console.error('Error fetching spots:', error);
        toast({
          title: "Error fetching spots",
          description: error.message,
        });
        return;
      }

      const formattedSpots = data.map((spot: any) => ({
        id: spot.id.toString(),
        name: spot.name,
        location: spot.location,
        coordinates: spot.coordinates,
        tags: spot.tags || [],
        notes: spot.notes || '',
        visitedAt: spot.visited_at || undefined,
        rating: spot.rating || undefined,
        createdAt: spot.created_at || new Date().toISOString(),
      }));

      setSpots(formattedSpots);
    };

    fetchSpots();
  }, [toast]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    spots.forEach(spot => spot.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [spots]);

  const filteredSpots = useMemo(() => {
    let filtered = spots.filter(spot => {
      const matchesSearch = searchQuery === '' ||
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.notes?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => spot.tags.includes(tag));

      return matchesSearch && matchesTags;
    });

    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'location':
        filtered.sort((a, b) => a.location.localeCompare(b.location));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [spots, searchQuery, selectedTags, sortBy]);

  const handleSaveSpot = (spotData: {
  name: string;
  location: string;
  tags: string[];
  notes?: string;
  coordinates: { lat: number; lng: number };
}) => {
  const newSpot: Spot = {
    id: Date.now().toString(),
    ...spotData,
    visitedAt: undefined,
    rating: undefined,
    createdAt: new Date().toISOString(),
  };
  setSpots(prev => [newSpot, ...prev]);
  toast({
    title: "Spot saved! 🎉",
    description: `${spotData.name} has been added to your collection.`,
  });
};


  const handleSpotClick = (spot: Spot) => setSelectedSpot(spot);
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortBy('recent');
  };

  const totalSpots = spots.length;
  const visitedSpots = spots.filter(spot => spot.visitedAt).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-white shadow-warm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 animate-float" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">SpotSaver</h1>
              <p className="text-white/80 text-sm">Discover & save amazing places</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-lg">{totalSpots}</div>
              <div className="text-white/80">Spots</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{visitedSpots}</div>
              <div className="text-white/80">Visited</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="map" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm border border-primary/20">
            <TabsTrigger value="map" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MapPin className="w-4 h-4 mr-2" /> Map View
            </TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <List className="w-4 h-4 mr-2" /> List View
            </TabsTrigger>
          </TabsList>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-4">
            <MapPage
              spots={spots}
              onAddSpot={handleSaveSpot}
              onViewSpot={handleSpotClick}
            />
          </TabsContent>

          {/* List Tab */}
          <TabsContent value="list" className="space-y-4">
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              availableTags={availableTags}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onClearFilters={handleClearFilters}
            />

            {filteredSpots.length === 0 ? (
              <Card className="bg-gradient-card shadow-soft border-0">
                <CardContent className="p-12 text-center">
                  <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse-warm" />
                  <h3 className="text-lg font-semibold mb-2">No spots found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || selectedTags.length > 0
                      ? "Try adjusting your filters or search terms."
                      : "Start by adding your first amazing spot!"}
                  </p>
                  <Button
                    variant="hero"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Spot
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSpots.map((spot) => (
                  <SpotCard
                    key={spot.id}
                    {...spot}
                    onView={handleSpotClick}
                    onEdit={() => toast({ title: "Edit coming soon" })}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Floating Add Button */}
        <Button
          variant="hero"
          size="lg"
          onClick={() => navigate('/add-spot')}
          className="fixed bottom-6 right-6 rounded-full shadow-lg z-[10001] animate-float"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Spot
        </Button>

      </main>

      {/* Add Spot Modal */}
      {isAddModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-[10005] flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <AddSpotModal
              isOpen={isAddModalOpen}
              onClose={() => {
                setIsAddModalOpen(false);
                setNewSpotCoordinates(null);
              }}
              onSave={handleSaveSpot}
              initialCoordinates={newSpotCoordinates}
            />
          </div>
        </div>
      )}

      {/* Spot Detail Modal */}
      {selectedSpot && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={() => setSelectedSpot(null)}
        >
          <Card
            className="bg-gradient-card shadow-warm border-0 max-w-md w-full max-h-[80vh] overflow-y-auto relative z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <MapPin className="w-5 h-5" /> {selectedSpot.name}
              </CardTitle>
              <p className="text-muted-foreground">{selectedSpot.location}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedSpot.rating && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Rating:</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Heart
                        key={i}
                        className={`w-4 h-4 ${i < selectedSpot.rating! ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {selectedSpot.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">{tag}</Badge>
                ))}
              </div>
              {selectedSpot.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes:</h4>
                  <p className="text-muted-foreground">{selectedSpot.notes}</p>
                </div>
              )}
              {selectedSpot.visitedAt && (
                <div>
                  <span className="text-sm font-medium">Visited: </span>
                  <span className="text-muted-foreground">{selectedSpot.visitedAt}</span>
                </div>
              )}
              <Button variant="outline" onClick={() => setSelectedSpot(null)} className="w-full">Close</Button>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
};

export default Index;
