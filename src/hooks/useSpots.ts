import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export interface Spot {
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

export const useSpots = () => {
  const { toast } = useToast();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    const fetchSpots = async () => {
      const { data, error } = await supabase.from('spots').select('*');
      if (error) return toast({ title: 'Error fetching spots', description: error.message });
      const formatted = data.map((s: any) => ({
        id: s.id.toString(),
        name: s.name,
        location: s.location,
        coordinates: s.coordinates,
        tags: s.tags || [],
        notes: s.notes || '',
        visitedAt: s.visited_at || undefined,
        rating: s.rating || undefined,
        createdAt: s.created_at || new Date().toISOString(),
      }));
      setSpots(formatted);
    };
    fetchSpots();
  }, [toast]);

  const availableTags = useMemo(() => Array.from(new Set(spots.flatMap(s => s.tags))).sort(), [spots]);

  const filteredSpots = useMemo(() => {
    let f = spots.filter(
      s =>
        (!searchQuery ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.notes?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!selectedTags.length || selectedTags.some(t => s.tags.includes(t)))
    );

    switch (sortBy) {
      case 'name': f.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'location': f.sort((a, b) => a.location.localeCompare(b.location)); break;
      case 'rating': f.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: f.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    }

    return f;
  }, [spots, searchQuery, selectedTags, sortBy]);

  return { spots, setSpots, filteredSpots, searchQuery, setSearchQuery, selectedTags, setSelectedTags, sortBy, setSortBy, availableTags };
};
