import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagToggle,
  availableTags,
  sortBy,
  onSortChange,
  onClearFilters
}) => {
  const hasActiveFilters = searchQuery || selectedTags.length > 0 || sortBy !== 'recent';

  return (
    <div className="space-y-3 p-4 bg-gradient-card rounded-lg shadow-soft border border-primary/10">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search spots..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-primary/20 focus:border-primary"
        />
      </div>

      {/* Tags and Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Tag Filter */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filter by tags:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border-primary/20 hover:bg-primary/10 hover:border-primary/40"
                }`}
                onClick={() => onTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="sm:w-48">
          <label className="text-sm font-medium text-muted-foreground block mb-2">
            Sort by:
          </label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="border-primary/20 focus:border-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;