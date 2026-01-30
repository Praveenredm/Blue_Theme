import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientSidebar } from '@/components/navigation/PatientSidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Video,
  AlertCircle,
  CheckCircle,
  X,
  FileText,
  Bell
} from 'lucide-react';

interface Appointment {
  id: string;
  type: 'in-person' | 'telehealth';
  specialty: string;
  doctor: string;
  date: Date;
  time: string;
  duration: string;
  location?: string;
  phone?: string;
  meetingLink?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  prepInstructions?: string[];
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    type: 'in-person',
    specialty: 'Cardiology',
    doctor: 'Dr. Emily Rodriguez',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: '10:00 AM',
    duration: '45 min',
    location: 'Heart Health Center, 456 Medical Plaza, Suite 302',
    phone: '(555) 234-5678',
    status: 'upcoming',
    notes: 'Initial consultation for chest pain evaluation',
    prepInstructions: [
      'Bring previous ECG results if available',
      'List of current medications',
      'Arrive 15 minutes early to complete paperwork',
      'Wear comfortable clothing for examination'
    ]
  },
  {
    id: '2',
    type: 'telehealth',
    specialty: 'Primary Care',
    doctor: 'Dr. Michael Chen',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: '2:30 PM',
    duration: '30 min',
    meetingLink: 'https://telehealth.careflow.com/room/abc123',
    phone: '(555) 123-4567',
    status: 'upcoming',
    notes: 'Follow-up on lab results',
    prepInstructions: [
      'Ensure stable internet connection',
      'Find a quiet, private space',
      'Have your medication list ready',
      'Test your camera and microphone beforehand'
    ]
  },
  {
    id: '3',
    type: 'in-person',
    specialty: 'Dermatology',
    doctor: 'Dr. Amanda Lee',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    time: '11:00 AM',
    duration: '30 min',
    location: 'Skin Care Clinic, 789 Health Ave',
    phone: '(555) 345-6789',
    status: 'upcoming',
    notes: 'Skin lesion examination'
  },
  {
    id: '4',
    type: 'in-person',
    specialty: 'Neurology',
    doctor: 'Dr. Robert Martinez',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    time: '9:00 AM',
    duration: '60 min',
    location: 'Neuro Center, 321 Brain Way',
    status: 'completed',
    notes: 'Migraine management consultation'
  },
  {
    id: '5',
    type: 'telehealth',
    specialty: 'Mental Health',
    doctor: 'Dr. Sarah Kim',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    time: '3:00 PM',
    duration: '45 min',
    status: 'cancelled',
    notes: 'Rescheduled by patient'
  }
];

export default function Appointments() {
  const { toast } = useToast();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const upcomingAppointments = mockAppointments.filter(a => a.status === 'upcoming');
  const pastAppointments = mockAppointments.filter(a => ['completed', 'cancelled'].includes(a.status));

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d, yyyy');
  };

  const handleCancelAppointment = () => {
    toast({
      title: "Appointment Cancelled",
      description: `Your appointment with ${selectedAppointment?.doctor} has been cancelled.`,
    });
    setShowCancelDialog(false);
    setSelectedAppointment(null);
  };

  const handleJoinTelehealth = (appointment: Appointment) => {
    toast({
      title: "Joining Telehealth Session",
      description: "Opening video consultation link...",
    });
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const isUpcoming = appointment.status === 'upcoming';
    const dateLabel = getDateLabel(appointment.date);
    const isNearby = isToday(appointment.date) || isTomorrow(appointment.date);

    return (
      <Card className={cn(
        "border-2 rounded-2xl transition-all duration-300 hover:shadow-lg",
        isNearby && isUpcoming && "border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50"
      )}>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* Date/Time Column - Enhanced */}
            <div className="flex items-start gap-6">
              <div className="text-center min-w-[90px]">
                <div className={cn(
                  "text-4xl font-bold mb-1",
                  isNearby && isUpcoming ? "text-blue-600" : "text-gray-900"
                )}>
                  {format(appointment.date, 'd')}
                </div>
                <div className="text-sm font-medium text-gray-600 mb-2">
                  {format(appointment.date, 'MMM')}
                </div>
                <Badge 
                  className={cn(
                    "font-semibold",
                    isNearby && isUpcoming 
                      ? "bg-blue-500 text-white hover:bg-blue-600" 
                      : "bg-gray-200 text-gray-700"
                  )}
                >
                  {dateLabel}
                </Badge>
              </div>

              <div className="h-20 border-l-2 border-gray-200 hidden sm:block" />

              {/* Details - Enhanced */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="text-xl font-bold text-gray-900">{appointment.specialty}</h3>
                  <Badge variant="outline" className="gap-1 border-2 font-medium">
                    {appointment.type === 'telehealth' ? (
                      <><Video className="h-3 w-3" /> Telehealth</>
                    ) : (
                      <><MapPin className="h-3 w-3" /> In-Person</>
                    )}
                  </Badge>
                  {appointment.status === 'cancelled' && (
                    <Badge className="bg-red-100 text-red-700 border-2 border-red-200">Cancelled</Badge>
                  )}
                  {appointment.status === 'completed' && (
                    <Badge className="bg-green-100 text-green-700 border-2 border-green-200">Completed</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <User className="h-4 w-4" />
                  <span className="font-semibold">{appointment.doctor}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1.5 font-medium text-gray-600">
                    <Clock className="h-4 w-4 text-blue-600" />
                    {appointment.time} ({appointment.duration})
                  </span>
                  {appointment.location && (
                    <span className="flex items-center gap-1.5 font-medium text-gray-600">
                      <MapPin className="h-4 w-4 text-green-600" />
                      {appointment.location.split(',')[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions - Enhanced */}
            {isUpcoming && (
              <div className="flex gap-2 lg:flex-col lg:min-w-[150px]">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-2 hover:border-blue-300 hover:bg-blue-50"
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setShowDetailsDialog(true);
                  }}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Details
                </Button>
                {appointment.type === 'telehealth' && isToday(appointment.date) && (
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-md"
                    onClick={() => handleJoinTelehealth(appointment)}
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Join Now
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setShowCancelDialog(true);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout sidebar={<PatientSidebar />} title="Appointments">
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">My Appointments</h1>
          <p className="text-lg text-gray-600">View and manage your scheduled appointments</p>
        </div>

        {/* Enhanced Stats */}
        <div className="grid gap-6 sm:grid-cols-3">
          {/* Upcoming */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900">{upcomingAppointments.length}</p>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
              </div>
            </div>
          </div>

          {/* This Week */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-orange-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Bell className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900">
                  {upcomingAppointments.filter(a => isToday(a.date) || isTomorrow(a.date)).length}
                </p>
                <p className="text-sm font-medium text-gray-600">This Week</p>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-green-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900">
                  {mockAppointments.filter(a => a.status === 'completed').length}
                </p>
                <p className="text-sm font-medium text-gray-600">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming" className="font-semibold">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="font-semibold">
              Past ({pastAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <Card className="border-2 rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-blue-100 rounded-full mb-4">
                    <Calendar className="h-12 w-12 text-blue-600" />
                  </div>
                  <p className="text-xl font-bold text-gray-900 mb-2">No Upcoming Appointments</p>
                  <p className="text-gray-600">Your scheduled appointments will appear here</p>
                </CardContent>
              </Card>
            ) : (
              upcomingAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastAppointments.length === 0 ? (
              <Card className="border-2 rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <Clock className="h-12 w-12 text-gray-600" />
                  </div>
                  <p className="text-xl font-bold text-gray-900 mb-2">No Past Appointments</p>
                  <p className="text-gray-600">Your appointment history will appear here</p>
                </CardContent>
              </Card>
            ) : (
              pastAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Enhanced Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Appointment Details</DialogTitle>
              <DialogDescription className="text-base">
                {selectedAppointment?.specialty} with {selectedAppointment?.doctor}
              </DialogDescription>
            </DialogHeader>
            {selectedAppointment && (
              <div className="space-y-6 py-2">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Date</p>
                    <p className="font-bold text-gray-900">{format(selectedAppointment.date, 'EEEE, MMMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Time</p>
                    <p className="font-bold text-gray-900">{selectedAppointment.time}</p>
                    <p className="text-sm text-gray-600">({selectedAppointment.duration})</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Type</p>
                  <Badge variant="outline" className="border-2 font-medium">
                    {selectedAppointment.type === 'telehealth' ? (
                      <><Video className="h-3 w-3 mr-1" /> Telehealth</>
                    ) : (
                      <><MapPin className="h-3 w-3 mr-1" /> In-Person</>
                    )}
                  </Badge>
                </div>

                {selectedAppointment.location && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-green-600" /> Location
                    </p>
                    <p className="font-semibold text-gray-900">{selectedAppointment.location}</p>
                  </div>
                )}

                {selectedAppointment.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                      <Phone className="h-4 w-4 text-blue-600" /> Contact
                    </p>
                    <p className="font-semibold text-gray-900">{selectedAppointment.phone}</p>
                  </div>
                )}

                {selectedAppointment.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Notes</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedAppointment.notes}</p>
                  </div>
                )}

                {selectedAppointment.prepInstructions && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border-2 border-amber-100">
                    <p className="font-bold text-base mb-3 flex items-center gap-2 text-gray-900">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      Preparation Instructions
                    </p>
                    <ul className="space-y-2">
                      {selectedAppointment.prepInstructions.map((instruction, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowDetailsDialog(false)}
                className="border-2"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Enhanced Cancel Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Cancel Appointment</DialogTitle>
              <DialogDescription className="text-base">
                Are you sure you want to cancel your appointment with {selectedAppointment?.doctor} on {selectedAppointment && format(selectedAppointment.date, 'MMMM d, yyyy')}?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-700 flex items-start gap-2 font-medium">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  Cancelling this appointment may affect your referral status. Please contact your primary care provider if you need to reschedule.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowCancelDialog(false)}
                className="border-2"
              >
                Keep Appointment
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancelAppointment}
                className="bg-red-600 hover:bg-red-700"
              >
                Cancel Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}