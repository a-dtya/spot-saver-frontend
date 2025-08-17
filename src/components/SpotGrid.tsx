import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SpotCard from '@/components/SpotCard';
import { Spot } from '@/hooks/useSpots';

interface Props { spots: Spot[]; onView: (s: Spot) => void; onAdd: () => void; searchQuery: string; selectedTags: string[]; }

const SpotGrid: React.FC<Props> = ({ spots, onView, onAdd, searchQuery, selectedTags }) =>
  spots.length === 0 ? (
    <Card className="bg-gradient-card shadow-soft border-0">
      <CardContent className="p-12 text-center">
        <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse-warm" />
        <h3 className="text-lg font-semibold mb-2">No spots found</h3>
        <p className="text-muted-foreground mb-4">
          {searchQuery || selectedTags.length > 0 ? "Try adjusting your filters or search terms." : "Start by adding your first amazing spot!"}
        </p>
        <Button variant="hero" onClick={onAdd}><Plus className="w-4 h-4 mr-2"/>Add First Spot</Button>
      </CardContent>
    </Card>
  ) : (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {spots.map(s => <SpotCard key={s.id} {...s} onView={onView} onEdit={() => {}} />)}
    </div>
  );

export default SpotGrid;
