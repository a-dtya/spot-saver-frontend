import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, List, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSpots } from '@/hooks/useSpots';
import Header from '@/components/Header';
import SpotGrid from '@/components/Spotgrid';
import SpotModals from '@/components/SpotModals';
import MapPage from '@/components/MapPage';
import FilterBar from '@/components/FilterBar';

const Index = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [newSpotCoordinates, setNewSpotCoordinates] = useState(null);
  const { spots, setSpots, filteredSpots, searchQuery, setSearchQuery, selectedTags, setSelectedTags, sortBy, setSortBy, availableTags } = useSpots();

  const handleSaveSpot = (spotData) => setSpots(prev => [{ ...spotData, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...prev]);
  const handleSpotClick = (spot) => setSelectedSpot(spot);
  const handleTagToggle = (tag) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  const handleClearFilters = () => { setSearchQuery(''); setSelectedTags([]); setSortBy('recent'); };

  return (
    <div className="min-h-screen bg-background">
      <Header total={spots.length} visited={spots.filter(s => s.visitedAt).length} />

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="map" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm border border-primary/20">
            <TabsTrigger value="map"><MapPin className="w-4 h-4 mr-2" /> Map View</TabsTrigger>
            <TabsTrigger value="list"><List className="w-4 h-4 mr-2" /> List View</TabsTrigger>
          </TabsList>

          <TabsContent value="map"><MapPage spots={spots} onAddSpot={handleSaveSpot} onViewSpot={handleSpotClick} /></TabsContent>
          <TabsContent value="list">
            <FilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} selectedTags={selectedTags} onTagToggle={handleTagToggle} availableTags={availableTags} sortBy={sortBy} onSortChange={setSortBy} onClearFilters={handleClearFilters} />
            <SpotGrid spots={filteredSpots} onView={handleSpotClick} onAdd={() => setIsAddModalOpen(true)} searchQuery={searchQuery} selectedTags={selectedTags} />
          </TabsContent>
        </Tabs>

        <Button variant="hero" size="lg" onClick={() => navigate('/add-spot')} className="fixed bottom-6 right-6 rounded-full shadow-lg z-[10001] animate-float"><Plus className="w-5 h-5 mr-2" />Add Spot</Button>
      </main>

      <SpotModals selectedSpot={selectedSpot} setSelectedSpot={setSelectedSpot} isAddModalOpen={isAddModalOpen} setIsAddModalOpen={setIsAddModalOpen} onSave={handleSaveSpot} initialCoords={newSpotCoordinates} />
    </div>
  );
};

export default Index;