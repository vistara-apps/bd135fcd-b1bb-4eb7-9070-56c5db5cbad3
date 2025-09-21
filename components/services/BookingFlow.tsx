'use client';

import { useState, useEffect } from 'react';
import { Service } from '../../lib/types';
import { serviceApi, bookingApi } from '../../lib/api';
import { useWallet, usePayments } from '../../lib/hooks';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Calendar } from '../ui/Calendar';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { CalendarIcon, Clock, DollarSign, ArrowLeft, CheckCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface BookingFlowProps {
  service: Service;
  onComplete: () => void;
  onCancel: () => void;
}

type BookingStep = 'date-selection' | 'time-selection' | 'confirmation' | 'payment' | 'success';

export function BookingFlow({ service, onComplete, onCancel }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>('date-selection');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  const { isConnected, address } = useWallet();
  const { payForBooking } = usePayments();

  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDate]);

  const loadAvailableSlots = async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const response = await serviceApi.getAvailableSlots(
        service.serviceId,
        selectedDate.toISOString().split('T')[0]
      );

      if (response.success && response.data) {
        setAvailableSlots(response.data);
      }
    } catch (error) {
      console.error('Failed to load available slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentStep('time-selection');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep('confirmation');
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime || !address) return;

    setCurrentStep('payment');
  };

  const handlePayment = async () => {
    if (!service.price || !address) return;

    setLoading(true);
    try {
      const paymentResult = await payForBooking(service.price);

      if (paymentResult.success) {
        // Create the booking
        const bookingDateTime = new Date(selectedDate!);
        const [hours, minutes] = selectedTime.split(':').map(Number);
        bookingDateTime.setHours(hours, minutes, 0, 0);

        const bookingResponse = await bookingApi.create({
          userId: address, // Using wallet address as user ID for demo
          serviceId: service.serviceId,
          providerId: service.providerId,
          dateTime: bookingDateTime,
          paymentDetails: {
            amount: service.price,
            currency: 'USD',
            transactionHash: paymentResult.transactionHash,
            status: 'completed'
          },
          notes
        });

        if (bookingResponse.success) {
          setCurrentStep('success');
        } else {
          console.error('Failed to create booking:', bookingResponse.error);
          // Handle error - could show error message
        }
      } else {
        console.error('Payment failed:', paymentResult.error);
        // Handle payment error
      }
    } catch (error) {
      console.error('Booking process failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm');
  };

  const formatPrice = (price?: number) => {
    return price ? `$${price}` : 'Contact for pricing';
  };

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-card-foreground">
            Connect Your Wallet
          </h2>
          <p className="text-muted-foreground">
            Please connect your Base wallet to book this service
          </p>
        </div>

        <div className="space-y-4">
          <Button variant="primary" className="w-full">
            Connect Wallet
          </Button>

          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4">
        {(['date-selection', 'time-selection', 'confirmation', 'payment', 'success'] as BookingStep[]).map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === step
                  ? 'bg-accent text-white'
                  : ['date-selection', 'time-selection', 'confirmation', 'payment', 'success'].indexOf(currentStep) > index
                  ? 'bg-green-500 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {index + 1}
            </div>
            {index < 4 && (
              <div
                className={`w-12 h-0.5 mx-2 ${
                  ['date-selection', 'time-selection', 'confirmation', 'payment', 'success'].indexOf(currentStep) > index
                    ? 'bg-green-500'
                    : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 'date-selection' && (
        <Card variant="elevated" className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-card-foreground mb-2">
                Select a Date
              </h2>
              <p className="text-muted-foreground">
                Choose your preferred date for {service.name}
              </p>
            </div>

            <Calendar
              selectedDates={selectedDate ? [selectedDate] : []}
              onDateSelect={(dates) => dates.length > 0 && handleDateSelect(dates[0])}
              minDate={new Date()}
              maxDate={addDays(new Date(), 90)}
            />

            <div className="flex gap-4">
              <Button variant="ghost" onClick={onCancel} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {currentStep === 'time-selection' && (
        <Card variant="elevated" className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-card-foreground mb-2">
                Select a Time
              </h2>
              <p className="text-muted-foreground">
                Available times for {format(selectedDate!, 'EEEE, MMMM d')}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading available times...</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.getTime()}
                    variant={selectedTime === formatTime(slot) ? 'primary' : 'secondary'}
                    onClick={() => handleTimeSelect(formatTime(slot))}
                    className="py-3"
                  >
                    {formatTime(slot)}
                  </Button>
                ))}
              </div>
            )}

            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setCurrentStep('date-selection')} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </Card>
      )}

      {currentStep === 'confirmation' && (
        <Card variant="elevated" className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-card-foreground mb-2">
                Confirm Your Booking
              </h2>
              <p className="text-muted-foreground">
                Please review your booking details
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-medium">Service</span>
                <span>{service.name}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-medium">Date & Time</span>
                <span>
                  {format(selectedDate!, 'MMM d, yyyy')} at {selectedTime}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-medium">Duration</span>
                <span>{service.duration} minutes</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-medium">Price</span>
                <span className="font-bold text-accent">{formatPrice(service.price)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes (Optional)</label>
              <Input
                placeholder="Any special requests or notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setCurrentStep('time-selection')} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button variant="primary" onClick={handleConfirmBooking} className="flex-1">
                Confirm Booking
              </Button>
            </div>
          </div>
        </Card>
      )}

      {currentStep === 'payment' && (
        <Card variant="elevated" className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-card-foreground mb-2">
                Complete Payment
              </h2>
              <p className="text-muted-foreground">
                Pay {formatPrice(service.price)} to confirm your booking
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Total Amount</span>
                <span className="text-xl font-bold text-accent">{formatPrice(service.price)}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Payment will be processed on Base network</p>
              <p>• Booking confirmation will be sent to your wallet</p>
              <p>• Cancellation policy applies</p>
            </div>

            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setCurrentStep('confirmation')} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handlePayment}
                loading={loading}
                className="flex-1"
              >
                Pay & Book
              </Button>
            </div>
          </div>
        </Card>
      )}

      {currentStep === 'success' && (
        <Card variant="elevated" className="p-6">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-card-foreground mb-2">
                Booking Confirmed!
              </h2>
              <p className="text-muted-foreground">
                Your appointment has been successfully booked and paid for.
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span className="font-medium">
                    {format(selectedDate!, 'MMM d, yyyy')} at {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="font-medium text-accent">{formatPrice(service.price)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                A confirmation has been sent to your wallet. You'll receive reminders before your appointment.
              </p>
            </div>

            <Button variant="primary" onClick={onComplete} className="w-full">
              View My Bookings
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

