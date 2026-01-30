import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SpecialistSidebar } from '@/components/navigation/SpecialistSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Clock,
  Plus,
  X,
  Save,
  Calendar as CalendarIcon,
  AlertCircle,
  CheckCircle,
  CheckCircle2
} from 'lucide-react';

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  isAvailable: boolean;
  appointmentType: 'consultation' | 'follow-up' | 'procedure' | 'any';
}

interface DaySchedule {
  date: Date;
  isWorkingDay: boolean;
  slots: TimeSlot[];
}

const defaultTimeSlots: Omit<TimeSlot, 'id'>[] = [
  { start: '09:00', end: '09:30', isAvailable: true, appointmentType: 'any' },
  { start: '09:30', end: '10:00', isAvailable: true, appointmentType: 'any' },
  { start: '10:00', end: '10:30', isAvailable: true, appointmentType: 'any' },
  { start: '10:30', end: '11:00', isAvailable: true, appointmentType: 'any' },
  { start: '11:00', end: '11:30', isAvailable: true, appointmentType: 'any' },
  { start: '11:30', end: '12:00', isAvailable: true, appointmentType: 'any' },
  { start: '14:00', end: '14:30', isAvailable: true, appointmentType: 'any' },
  { start: '14:30', end: '15:00', isAvailable: true, appointmentType: 'any' },
  { start: '15:00', end: '15:30', isAvailable: true, appointmentType: 'any' },
  { start: '15:30', end: '16:00', isAvailable: true, appointmentType: 'any' },
  { start: '16:00', end: '16:30', isAvailable: true, appointmentType: 'any' },
  { start: '16:30', end: '17:00', isAvailable: true, appointmentType: 'any' },
];

const appointmentTypes = [
  { value: 'any', label: 'Any Type' },
  { value: 'consultation', label: 'Initial Consultation' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'procedure', label: 'Procedure' },
];

export default function AvailabilityCalendar() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddSlotDialog, setShowAddSlotDialog] = useState(false);
  const [newSlotStart, setNewSlotStart] = useState('');
  const [newSlotEnd, setNewSlotEnd] = useState('');
  const [newSlotType, setNewSlotType] = useState<string>('any');

  // Initialize schedules for the next 30 days
  const [schedules, setSchedules] = useState<DaySchedule[]>(() => {
    const today = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const date = addDays(today, i);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      return {
        date,
        isWorkingDay: !isWeekend,
        slots: !isWeekend ? defaultTimeSlots.map((slot, idx) => ({
          ...slot,
          id: `${format(date, 'yyyy-MM-dd')}-${idx}`,
        })) : [],
      };
    });
  });

  const selectedSchedule = schedules.find(s => isSameDay(s.date, selectedDate));

  const toggleWorkingDay = (date: Date) => {
    setSchedules(prev => prev.map(schedule => {
      if (isSameDay(schedule.date, date)) {
        return {
          ...schedule,
          isWorkingDay: !schedule.isWorkingDay,
          slots: !schedule.isWorkingDay ? defaultTimeSlots.map((slot, idx) => ({
            ...slot,
            id: `${format(date, 'yyyy-MM-dd')}-${idx}`,
          })) : [],
        };
      }
      return schedule;
    }));
  };

  const toggleSlotAvailability = (slotId: string) => {
    setSchedules(prev => prev.map(schedule => {
      if (isSameDay(schedule.date, selectedDate)) {
        return {
          ...schedule,
          slots: schedule.slots.map(slot => 
            slot.id === slotId ? { ...slot, isAvailable: !slot.isAvailable } : slot
          ),
        };
      }
      return schedule;
    }));
  };

  const updateSlotType = (slotId: string, type: string) => {
    setSchedules(prev => prev.map(schedule => {
      if (isSameDay(schedule.date, selectedDate)) {
        return {
          ...schedule,
          slots: schedule.slots.map(slot => 
            slot.id === slotId ? { ...slot, appointmentType: type as TimeSlot['appointmentType'] } : slot
          ),
        };
      }
      return schedule;
    }));
  };

  const removeSlot = (slotId: string) => {
    setSchedules(prev => prev.map(schedule => {
      if (isSameDay(schedule.date, selectedDate)) {
        return {
          ...schedule,
          slots: schedule.slots.filter(slot => slot.id !== slotId),
        };
      }
      return schedule;
    }));
  };

  const addNewSlot = () => {
    if (!newSlotStart || !newSlotEnd) {
      toast({
        title: "Missing Information",
        description: "Please select both start and end times.",
        variant: "destructive"
      });
      return;
    }

    const newSlot: TimeSlot = {
      id: `${format(selectedDate, 'yyyy-MM-dd')}-custom-${Date.now()}`,
      start: newSlotStart,
      end: newSlotEnd,
      isAvailable: true,
      appointmentType: newSlotType as TimeSlot['appointmentType'],
    };

    setSchedules(prev => prev.map(schedule => {
      if (isSameDay(schedule.date, selectedDate)) {
        return {
          ...schedule,
          slots: [...schedule.slots, newSlot].sort((a, b) => a.start.localeCompare(b.start)),
        };
      }
      return schedule;
    }));

    setShowAddSlotDialog(false);
    setNewSlotStart('');
    setNewSlotEnd('');
    setNewSlotType('any');
    toast({
      title: "Time Slot Added",
      description: `New slot added for ${newSlotStart} - ${newSlotEnd}`,
    });
  };

  const saveSchedule = () => {
    toast({
      title: "Schedule Saved",
      description: "Your availability has been updated successfully.",
    });
  };

  const getAvailableCount = (schedule?: DaySchedule) => {
    if (!schedule) return 0;
    return schedule.slots.filter(s => s.isAvailable).length;
  };

  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const timeOptions = Array.from({ length: 24 }, (_, hour) => {
    return ['00', '30'].map(min => {
      const time = `${hour.toString().padStart(2, '0')}:${min}`;
      return time;
    });
  }).flat().filter(t => {
    const hour = parseInt(t.split(':')[0]);
    return hour >= 7 && hour <= 19;
  });

  return (
    <DashboardLayout sidebar={<SpecialistSidebar />} title="Availability Calendar">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Availability Calendar</h1>
            <p className="text-gray-500 mt-1">Manage your schedule and appointment slots</p>
          </div>
          <Button onClick={saveSchedule} className="h-11 gap-2 bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Calendar Card */}
          <Card className="lg:col-span-1 border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg font-semibold">Select Date</CardTitle>
              <CardDescription className="mt-1">Click on a date to manage slots</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="rounded-lg border-0"
                modifiers={{
                  working: (date) => {
                    const schedule = schedules.find(s => isSameDay(s.date, date));
                    return schedule?.isWorkingDay ?? false;
                  }
                }}
                modifiersClassNames={{
                  working: "bg-blue-50 text-blue-700 font-semibold"
                }}
              />
              <div className="mt-6 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Working Day</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Day Schedule Card */}
          <Card className="lg:col-span-2 border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {selectedSchedule?.isWorkingDay 
                      ? `${getAvailableCount(selectedSchedule)} available slots`
                      : 'Not a working day'
                    }
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Working Day</span>
                    <Switch
                      checked={selectedSchedule?.isWorkingDay ?? false}
                      onCheckedChange={() => toggleWorkingDay(selectedDate)}
                    />
                  </div>
                  {selectedSchedule?.isWorkingDay && (
                    <Button size="sm" onClick={() => setShowAddSlotDialog(true)} className="h-9 bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Slot
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {!selectedSchedule?.isWorkingDay ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <CalendarIcon className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">Day Off</p>
                  <p className="text-gray-500 mt-1">Toggle "Working Day" to add availability</p>
                </div>
              ) : selectedSchedule.slots.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">No Time Slots</p>
                  <p className="text-gray-500 mt-1 mb-4">Add your first time slot for this day</p>
                  <Button onClick={() => setShowAddSlotDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Time Slot
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                  {selectedSchedule.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border transition-all",
                        slot.isAvailable 
                          ? "bg-white border-gray-200 hover:shadow-sm" 
                          : "bg-gray-50 border-gray-200"
                      )}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            slot.isAvailable ? "bg-blue-100" : "bg-gray-200"
                          )}>
                            <Clock className={cn(
                              "h-5 w-5",
                              slot.isAvailable ? "text-blue-600" : "text-gray-500"
                            )} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{slot.start} - {slot.end}</p>
                            <p className="text-xs text-gray-500">30 minutes</p>
                          </div>
                        </div>
                        <Select
                          value={slot.appointmentType}
                          onValueChange={(value) => updateSlotType(slot.id, value)}
                        >
                          <SelectTrigger className="w-[180px] h-9 border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {appointmentTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={cn(
                          "font-medium border-0",
                          slot.isAvailable 
                            ? "bg-green-100 text-green-700 hover:bg-green-100" 
                            : "bg-gray-200 text-gray-700 hover:bg-gray-200"
                        )}>
                          {slot.isAvailable ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Available
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Blocked
                            </>
                          )}
                        </Badge>
                        <Switch
                          checked={slot.isAvailable}
                          onCheckedChange={() => toggleSlotAvailability(slot.id)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeSlot(slot.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Week Overview */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-lg font-semibold">Week Overview</CardTitle>
            <CardDescription className="mt-1">Quick view of your availability this week</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-7 gap-3">
              {weekDays.map((day) => {
                const schedule = schedules.find(s => isSameDay(s.date, day));
                const availableCount = getAvailableCount(schedule);
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "p-4 rounded-xl border transition-all hover:shadow-sm",
                      isSelected && "border-blue-300 bg-blue-50 shadow-sm",
                      !isSelected && schedule?.isWorkingDay && "border-gray-200 bg-white hover:border-blue-200",
                      !schedule?.isWorkingDay && "bg-gray-50 border-gray-200"
                    )}
                  >
                    <p className="text-xs font-medium text-gray-600 mb-1">{format(day, 'EEE')}</p>
                    <p className={cn(
                      "text-2xl font-bold mb-2",
                      isToday && "text-blue-600",
                      !isToday && "text-gray-900"
                    )}>
                      {format(day, 'd')}
                    </p>
                    {schedule?.isWorkingDay ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 text-xs font-medium">
                        {availableCount} slots
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-200 border-0 text-xs font-medium">
                        Off
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Add Slot Dialog */}
        <Dialog open={showAddSlotDialog} onOpenChange={setShowAddSlotDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Time Slot</DialogTitle>
              <DialogDescription>
                Create a new availability slot for {format(selectedDate, 'MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-900 block mb-2">Start Time</label>
                  <Select value={newSlotStart} onValueChange={setNewSlotStart}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select start" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900 block mb-2">End Time</label>
                  <Select value={newSlotEnd} onValueChange={setNewSlotEnd}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select end" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-2">Appointment Type</label>
                <Select value={newSlotType} onValueChange={setNewSlotType}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowAddSlotDialog(false)} className="h-11">
                Cancel
              </Button>
              <Button onClick={addNewSlot} className="h-11 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Slot
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}