import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, List, Plus, Heart, Sparkles, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MapView from '@/components/MapView';
import SpotCard from '@/components/SpotCard';
import AddSpotModal from '@/components/AddSpotModal';
import FilterBar from '@/components/FilterBar';

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
  const { toast } = useToast();
  const [spots, setSpots] = useState<Spot[]>([
    {
      id: '1',
      name: 'Cozy Corner Café',
      location: 'Downtown Arts District',
      coordinates: { lat: 40.7128, lng: -74.0059 },
      tags: ['coffee', 'cozy', 'wifi'],
      notes: 'Perfect for morning dates. Amazing lavender latte!',
      visitedAt: '2024-01-15',
      rating: 5,
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Sunset Viewpoint',
      location: 'Riverside Park',
      coordinates: { lat: 40.7127, lng: -74.0061 },
      tags: ['sunset', 'romantic', 'outdoor'],
      notes: 'Best sunset spot in the city. Bring a blanket!',
      visitedAt: '2024-01-20',
      rating: 5,
      createdAt: '2024-01-20T18:00:00Z'
    },
    {
      id: '3',
      name: 'Hidden Bookstore',
      location: 'Old Town Square',
      coordinates: { lat: 40.7130, lng: -74.0058 },
      tags: ['books', 'quiet', 'indoor'],
      notes: 'Rare first editions and a cat named Whiskers.',
      createdAt: '2024-01-25T14:00:00Z'
    }
  ]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recent');
  const [newSpotCoordinates, setNewSpotCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Get all available tags
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    spots.forEach(spot => spot.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [spots]);

  // Filter and sort spots
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

    // Sort spots
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

  const handleAddSpot = (coordinates: { lat: number; lng: number }) => {
    setNewSpotCoordinates(coordinates);
    setIsAddModalOpen(true);
  };

  const handleSaveSpot = (spotData: {
    name: string;
    location: string;
    tags: string[];
    notes: string;
    coordinates: { lat: number; lng: number };
  }) => {
    const newSpot: Spot = {
      id: Date.now().toString(),
      ...spotData,
      createdAt: new Date().toISOString(),
    };
    
    setSpots(prev => [newSpot, ...prev]);
    toast({
      title: "Spot saved! 🎉",
      description: `${spotData.name} has been added to your collection.`,
    });
  };

  const handleSpotClick = (spot: Spot) => {
    setSelectedSpot(spot);
  };

  const handleEditSpot = (spotId: string) => {
    const spot = spots.find(s => s.id === spotId);
    if (spot) {
      setSelectedSpot(spot);
      // In a real app, you'd open an edit modal here
      toast({
        title: "Edit feature coming soon! ✏️",
        description: "Spot editing will be available in the next update.",
      });
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
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
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
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
        </div>
      </header>

      {/* Navigation Info */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-primary/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="w-4 h-4" />
            <span>This is a web version of the spot-saving app. For backend features, connect to Supabase using the button in the top right.</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="map" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm border border-primary/20">
            <TabsTrigger value="map" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <List className="w-4 h-4 mr-2" />
              List View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardContent className="p-0">
                <MapView
                  spots={filteredSpots}
                  onAddSpot={handleAddSpot}
                  onSpotClick={handleSpotClick}
                  className="h-[500px]"
                />
              </CardContent>
            </Card>
          </TabsContent>

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
                      : "Start by adding your first amazing spot!"
                    }
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
                    onEdit={handleEditSpot}
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
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-6 right-6 rounded-full shadow-lg z-50 animate-float"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Spot
        </Button>
      </main>

      {/* Add Spot Modal */}
      <AddSpotModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewSpotCoordinates(null);
        }}
        onSave={handleSaveSpot}
        initialCoordinates={newSpotCoordinates}
      />

      {/* Spot Detail Modal */}
      {selectedSpot && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSpot(null)}
        >
          <Card 
            className="bg-gradient-card shadow-warm border-0 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <MapPin className="w-5 h-5" />
                {selectedSpot.name}
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
                  <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
                    {tag}
                  </Badge>
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
              
              <Button 
                variant="outline" 
                onClick={() => setSelectedSpot(null)}
                className="w-full"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
