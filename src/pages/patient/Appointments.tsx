import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientSidebar } from '@/components/navigation/PatientSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { format, isToday, isTomorrow, isThisWeek, isPast } from 'date-fns';
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
        "transition-all hover:shadow-md",
        isNearby && isUpcoming && "border-primary/50 bg-primary/5"
      )}>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            {/* Date/Time Column */}
            <div className="flex items-start gap-4">
              <div className="text-center min-w-[80px]">
                <div className={cn(
                  "text-2xl font-bold",
                  isNearby && isUpcoming ? "text-primary" : "text-foreground"
                )}>
                  {format(appointment.date, 'd')}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(appointment.date, 'MMM')}
                </div>
                <Badge variant={isNearby && isUpcoming ? "default" : "secondary"} className="mt-1">
                  {dateLabel}
                </Badge>
              </div>

              <div className="h-16 border-l border-border hidden sm:block" />

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{appointment.specialty}</h3>
                  <Badge variant="outline" className="gap-1">
                    {appointment.type === 'telehealth' ? (
                      <><Video className="h-3 w-3" /> Telehealth</>
                    ) : (
                      <><MapPin className="h-3 w-3" /> In-Person</>
                    )}
                  </Badge>
                  {appointment.status === 'cancelled' && (
                    <Badge variant="destructive">Cancelled</Badge>
                  )}
                  {appointment.status === 'completed' && (
                    <Badge variant="secondary">Completed</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <User className="h-4 w-4" />
                  <span>{appointment.doctor}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {appointment.time} ({appointment.duration})
                  </span>
                  {appointment.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {appointment.location.split(',')[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            {isUpcoming && (
              <div className="flex gap-2 lg:flex-col lg:min-w-[140px]">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
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
                    className="flex-1"
                    onClick={() => handleJoinTelehealth(appointment)}
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Join
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-destructive hover:text-destructive"
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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Appointments</h2>
          <p className="text-muted-foreground">View and manage your scheduled appointments</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Bell className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {upcomingAppointments.filter(a => isToday(a.date) || isTomorrow(a.date)).length}
                </p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockAppointments.filter(a => a.status === 'completed').length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No Upcoming Appointments</p>
                  <p className="text-muted-foreground">Your scheduled appointments will appear here</p>
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
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No Past Appointments</p>
                  <p className="text-muted-foreground">Your appointment history will appear here</p>
                </CardContent>
              </Card>
            ) : (
              pastAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                {selectedAppointment?.specialty} with {selectedAppointment?.doctor}
              </DialogDescription>
            </DialogHeader>
            {selectedAppointment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{format(selectedAppointment.date, 'EEEE, MMMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{selectedAppointment.time} ({selectedAppointment.duration})</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge variant="outline" className="mt-1">
                    {selectedAppointment.type === 'telehealth' ? (
                      <><Video className="h-3 w-3 mr-1" /> Telehealth</>
                    ) : (
                      <><MapPin className="h-3 w-3 mr-1" /> In-Person</>
                    )}
                  </Badge>
                </div>

                {selectedAppointment.location && (
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Location
                    </p>
                    <p className="font-medium">{selectedAppointment.location}</p>
                  </div>
                )}

                {selectedAppointment.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Contact
                    </p>
                    <p className="font-medium">{selectedAppointment.phone}</p>
                  </div>
                )}

                {selectedAppointment.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">{selectedAppointment.notes}</p>
                  </div>
                )}

                {selectedAppointment.prepInstructions && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-medium mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      Preparation Instructions
                    </p>
                    <ul className="space-y-1 text-sm">
                      {selectedAppointment.prepInstructions.map((instruction, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Appointment</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your appointment with {selectedAppointment?.doctor} on {selectedAppointment && format(selectedAppointment.date, 'MMMM d, yyyy')}?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  Cancelling this appointment may affect your referral status. Please contact your primary care provider if you need to reschedule.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>Keep Appointment</Button>
              <Button variant="destructive" onClick={handleCancelAppointment}>
                Cancel Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
