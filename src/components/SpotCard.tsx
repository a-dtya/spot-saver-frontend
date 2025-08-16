import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, Star } from 'lucide-react';

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

interface SpotCardProps {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  tags: string[];
  notes?: string;
  visitedAt?: string;
  rating?: number;
  createdAt: string;
  onView: (spot: Spot) => void;
  onEdit: (id: string) => void;
}

const SpotCard: React.FC<SpotCardProps> = (props) => {
  const {
    id,
    name,
    location,
    tags,
    notes,
    visitedAt,
    rating,
    onView,
    onEdit
  } = props;
  return (
    <Card className="bg-gradient-card shadow-soft hover:shadow-warm transition-all duration-300 hover:scale-105 cursor-pointer border-0">
      <CardContent className="p-4" onClick={() => onView(props)}>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-foreground line-clamp-1">{name}</h3>
            {rating && (
              <div className="flex items-center gap-1 text-primary">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">{rating}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>
          
          {notes && (
            <p className="text-sm text-muted-foreground line-clamp-2">{notes}</p>
          )}
          
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-2">
            {visitedAt && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{visitedAt}</span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
              className="ml-auto"
            >
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotCard;