'use client';

import { useState } from 'react';
import { cn } from '../../lib/utils';
import { CalendarProps } from '../../lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Calendar({
  variant = 'default',
  selectedDates = [],
  onDateSelect,
  minDate,
  maxDate,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (minDate && clickedDate < minDate) return;
    if (maxDate && clickedDate > maxDate) return;

    if (variant === 'multiSelect') {
      const isSelected = selectedDates.some(
        date => date.toDateString() === clickedDate.toDateString()
      );

      let newDates;
      if (isSelected) {
        newDates = selectedDates.filter(
          date => date.toDateString() !== clickedDate.toDateString()
        );
      } else {
        newDates = [...selectedDates, clickedDate];
      }
      onDateSelect?.(newDates);
    } else {
      onDateSelect?.([clickedDate]);
    }
  };

  const isDateSelected = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return selectedDates.some(
      selectedDate => selectedDate.toDateString() === date.toDateString()
    );
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  return (
    <div className="bg-card rounded-lg border p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-1 hover:bg-muted rounded-md transition-colors duration-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="font-semibold text-card-foreground">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={() => navigateMonth('next')}
          className="p-1 hover:bg-muted rounded-md transition-colors duration-200"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground p-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2" />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const isSelected = isDateSelected(day);
          const isDisabled = isDateDisabled(day);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={isDisabled}
              className={cn(
                'p-2 text-sm rounded-md transition-colors duration-200 hover:bg-muted',
                isSelected && 'bg-accent text-white hover:bg-accent/90',
                isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
