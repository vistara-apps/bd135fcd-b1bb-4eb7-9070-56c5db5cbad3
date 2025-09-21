'use client';

import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Calendar } from '../ui/Calendar';
import { Users, Plus, Check, X } from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

interface GroupMember {
  id: string;
  name: string;
  availability: Date[];
  responded: boolean;
}

export function GroupScheduler() {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [step, setStep] = useState<'setup' | 'collecting' | 'results'>('setup');

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const newMember: GroupMember = {
        id: Date.now().toString(),
        name: newMemberName.trim(),
        availability: [],
        responded: false,
      };
      setMembers([...members, newMember]);
      setNewMemberName('');
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  const handleCreateGroup = () => {
    if (groupName && members.length > 0) {
      setStep('collecting');
      // In a real app, this would send invitations to members
    }
  };

  const handleDateSelect = (dates: Date[]) => {
    setSelectedDates(dates);
  };

  const simulateResponses = () => {
    // Simulate some members responding with availability
    const updatedMembers = members.map(member => ({
      ...member,
      responded: Math.random() > 0.3,
      availability: Math.random() > 0.3 ? selectedDates.slice(0, Math.floor(Math.random() * 3) + 1) : [],
    }));
    setMembers(updatedMembers);
    setStep('results');
  };

  const findCommonSlots = () => {
    const respondedMembers = members.filter(m => m.responded);
    if (respondedMembers.length === 0) return [];

    // Find dates that work for most people
    const dateCount: { [key: string]: number } = {};
    respondedMembers.forEach(member => {
      member.availability.forEach(date => {
        const dateKey = date.toDateString();
        dateCount[dateKey] = (dateCount[dateKey] || 0) + 1;
      });
    });

    return Object.entries(dateCount)
      .filter(([_, count]) => count >= Math.ceil(respondedMembers.length * 0.6))
      .map(([dateString, count]) => ({
        date: new Date(dateString),
        count,
        percentage: Math.round((count / respondedMembers.length) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  };

  if (step === 'setup') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-card-foreground">
            Create Group Schedule
          </h2>
          <p className="text-muted-foreground">
            Find the perfect time when everyone is available
          </p>
        </div>

        <Card>
          <div className="space-y-4">
            <Input
              label="Event Name"
              placeholder="Team lunch, Study session, etc."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />

            <Input
              label="Description (optional)"
              variant="textarea"
              placeholder="Add any details about the event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium text-card-foreground">
                Group Members
              </label>
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter member name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                />
                <Button
                  variant="secondary"
                  onClick={handleAddMember}
                  disabled={!newMemberName.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {members.length > 0 && (
                <div className="space-y-2">
                  {members.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{member.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="primary"
              onClick={handleCreateGroup}
              disabled={!groupName || members.length === 0}
              className="w-full"
            >
              Create Group & Send Invites
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step === 'collecting') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-card-foreground">
            Collecting Availability
          </h2>
          <p className="text-muted-foreground">
            Waiting for {groupName} members to respond
          </p>
        </div>

        <Card>
          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-card-foreground">Member Status</h3>
              {members.map(member => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{member.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {member.responded ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <Check className="h-4 w-4" />
                        <span className="text-sm">Responded</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Waiting...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Invitations sent! Members will receive notifications to add their availability.
              </p>
              <Button
                variant="secondary"
                onClick={simulateResponses}
              >
                Simulate Responses (Demo)
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const commonSlots = findCommonSlots();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-card-foreground">
          Schedule Results
        </h2>
        <p className="text-muted-foreground">
          Here are the best times for {groupName}
        </p>
      </div>

      <Card>
        <div className="space-y-4">
          <h3 className="font-semibold text-card-foreground">Recommended Times</h3>
          
          {commonSlots.length > 0 ? (
            <div className="space-y-3">
              {commonSlots.map((slot, index) => (
                <div
                  key={slot.date.toISOString()}
                  className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors duration-200"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-card-foreground">
                      {formatDateTime(slot.date)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {slot.count} of {members.filter(m => m.responded).length} members available ({slot.percentage}%)
                    </div>
                  </div>
                  <Button
                    variant={index === 0 ? 'primary' : 'secondary'}
                    size="sm"
                  >
                    {index === 0 ? 'Best Match' : 'Select'}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                No common availability found. Try suggesting different times.
              </p>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              variant="secondary"
              onClick={() => setStep('setup')}
              className="flex-1"
            >
              Start Over
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              disabled={commonSlots.length === 0}
            >
              Confirm Schedule
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
