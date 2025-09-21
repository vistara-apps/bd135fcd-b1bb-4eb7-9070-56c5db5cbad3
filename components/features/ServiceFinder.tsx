'use client';

import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Search, Star, MapPin, Clock } from 'lucide-react';
import { SERVICE_CATEGORIES, MOCK_DATA } from '../../lib/constants';
import { formatCurrency } from '../../lib/utils';

export function ServiceFinder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleBookService = (serviceId: string) => {
    console.log(`Booking service ${serviceId}`);
    // In a real app, this would open the booking flow
  };

  const filteredServices = MOCK_DATA.services.filter(service => {
    const matchesSearch = !searchQuery || 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-card-foreground">
          Find Niche Services
        </h2>
        <p className="text-muted-foreground">
          Discover specialized services that are hard to find elsewhere
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === '' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory('')}
            >
              All Categories
            </Button>
            {SERVICE_CATEGORIES.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon} {category.label}
              </Button>
            ))}
          </div>

          <Button
            variant="primary"
            onClick={handleSearch}
            loading={loading}
            className="w-full"
          >
            Search Services
          </Button>
        </div>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {filteredServices.map(service => {
          const provider = MOCK_DATA.providers.find(p => p.providerId === service.providerId);
          
          return (
            <Card key={service.serviceId} variant="elevated">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-card-foreground">
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {service.description}
                    </p>
                    {provider && (
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{provider.name}</span>
                        </div>
                        {provider.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{provider.rating}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{service.duration} min</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-card-foreground">
                      {formatCurrency(service.price || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per session
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleBookService(service.serviceId)}
                    className="flex-1"
                  >
                    Book Now
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                  >
                    Join Waitlist
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredServices.length === 0 && (
          <Card>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No services found matching your criteria.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                className="mt-2"
              >
                Clear filters
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
