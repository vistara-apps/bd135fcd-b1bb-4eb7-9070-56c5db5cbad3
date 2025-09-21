'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '../../../components/layout/AppShell';
import { BookingFlow } from '../../../components/services/BookingFlow';
import { serviceApi, providerApi } from '../../../lib/api';
import { Service, Provider } from '../../../lib/types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Star, Clock, DollarSign, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    loadServiceDetails();
  }, [serviceId]);

  const loadServiceDetails = async () => {
    try {
      const [serviceResponse, providerResponse] = await Promise.all([
        serviceApi.get(serviceId),
        // For now, we'll get all providers and find the matching one
        providerApi.getAll()
      ]);

      if (serviceResponse.success && serviceResponse.data) {
        setService(serviceResponse.data);

        // Find the provider for this service
        if (providerResponse.success && providerResponse.data) {
          const matchingProvider = providerResponse.data.find(
            p => p.providerId === serviceResponse.data!.providerId
          );
          setProvider(matchingProvider || null);
        }
      }
    } catch (error) {
      console.error('Failed to load service details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    setShowBooking(true);
  };

  const handleBookingComplete = () => {
    setShowBooking(false);
    // Could show a success message or redirect
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading service details...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!service) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-card-foreground mb-4">
            Service Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The service you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push('/services')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>
        </div>
      </AppShell>
    );
  }

  if (showBooking) {
    return (
      <AppShell>
        <BookingFlow
          service={service}
          onComplete={handleBookingComplete}
          onCancel={() => setShowBooking(false)}
        />
      </AppShell>
    );
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const formatPrice = (price?: number) => {
    return price ? `$${price}` : 'Contact for pricing';
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/services')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Button>

        {/* Service Header */}
        <Card variant="elevated" className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-card-foreground">
                  {service.name}
                </h1>
                <Badge variant="secondary">
                  {service.category.replace('_', ' ')}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-accent">
                  {formatPrice(service.price)}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(service.duration)}</span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">
              {service.description}
            </p>

            <Button
              variant="primary"
              size="lg"
              onClick={handleBookNow}
              className="w-full md:w-auto"
            >
              Book This Service
            </Button>
          </div>
        </Card>

        {/* Provider Information */}
        {provider && (
          <Card variant="default" className="p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">
              Service Provider
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-muted-foreground">
                    {provider.name.charAt(0)}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {provider.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">
                      {provider.rating || 4.8} ({Math.floor(Math.random() * 50) + 10} reviews)
                    </span>
                  </div>
                  {provider.verified && (
                    <Badge variant="secondary" className="text-xs">
                      ✓ Verified Provider
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground">
                {provider.bio}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                {provider.contactInfo.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{provider.contactInfo.email}</span>
                  </div>
                )}

                {provider.contactInfo.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{provider.contactInfo.phone}</span>
                  </div>
                )}

                {provider.contactInfo.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={provider.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {provider.bookingPlatformUrl && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={provider.bookingPlatformUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Booking Platform
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Additional Information */}
        <Card variant="default" className="p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            What to Expect
          </h2>

          <div className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-medium text-card-foreground mb-2">Duration</h3>
              <p>This service typically takes {formatDuration(service.duration)} to complete.</p>
            </div>

            <div>
              <h3 className="font-medium text-card-foreground mb-2">Preparation</h3>
              <p>Please arrive 10-15 minutes early for your appointment. Bring any relevant medical history or preferences.</p>
            </div>

            <div>
              <h3 className="font-medium text-card-foreground mb-2">Cancellation Policy</h3>
              <p>Free cancellation up to 24 hours before your appointment. Late cancellations may incur a fee.</p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

