'use client';

import { SERVICE_CATEGORIES } from '../../lib/constants';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ServiceFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function ServiceFilters({ selectedCategory, onCategoryChange }: ServiceFiltersProps) {
  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      onCategoryChange(''); // Deselect if already selected
    } else {
      onCategoryChange(categoryId);
    }
  };

  const clearFilters = () => {
    onCategoryChange('');
  };

  return (
    <Card variant="default" className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-card-foreground">Filter by Category</h3>
          {selectedCategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {SERVICE_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleCategoryClick(category.id)}
              className="flex flex-col items-center gap-1 h-auto py-3 px-2 text-xs"
            >
              <span className="text-lg">{category.icon}</span>
              <span className="text-center leading-tight">{category.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}

