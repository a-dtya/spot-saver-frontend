import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { fetchCoordinates } from '@/utils/googleMaps';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MapPin, Plus, X } from 'lucide-react';

interface AddSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (spot: {
    name: string;
    location: string;
    tags: string[];
    notes: string;
    coordinates: { lat: number; lng: number };
  }) => void;
  initialCoordinates?: { lat: number; lng: number };
}

const AddSpotModal: React.FC<AddSpotModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCoordinates
}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [url, setUrl] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!name.trim() || !location.trim()) return;

    // Validate URL format if provided
    if (url) {
      const coordinates = await fetchCoordinates(url);
      if (coordinates) {
        initialCoordinates = coordinates;
      } else {
        console.error('Invalid Google Maps URL');
        return;
      }
    }

    onSave({
      name: name.trim(),
      location: location.trim(),
      tags,
      notes: notes.trim(),
      coordinates: initialCoordinates || { lat: 0, lng: 0 }
    });

    // Reset form
    setName('');
    setLocation('');
    setNotes('');
    setTags([]);
    setNewTag('');
    setUrl('');
    onClose();
  };

  const handleClose = () => {
    // Reset form on close
    setName('');
    setLocation('');
    setNotes('');
    setTags([]);
    setNewTag('');
    setUrl('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto bg-gradient-card border-0 shadow-warm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <MapPin className="w-5 h-5" />
            Add New Spot
          </DialogTitle>
          <DialogDescription>
            Save a special place you've discovered or want to visit.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Spot Name</Label>
            <Input
              id="name"
              placeholder="e.g., Cozy Corner Café"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-primary/20 focus:border-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Downtown, 5th Avenue"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Google Maps URL</Label>
            <Input
              id="url"
              placeholder="e.g., https://maps.google.com/?q=lat,lng"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="border-primary/20 focus:border-primary"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleAddTag}
                className="border-primary/20 hover:bg-primary/10"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="What makes this place special?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-primary/20 focus:border-primary min-h-[80px]"
            />
          </div>
        </div>
        
        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!name.trim() || !location.trim()}
            className="bg-gradient-primary hover:opacity-90"
          >
            Save Spot
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSpotModal;