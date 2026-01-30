import React, { useState, useEffect, useRef } from 'react';
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
  Bell,
  Navigation,
  Zap
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
  coordinates?: {
    doctorLat: number;
    doctorLng: number;
    patientLat: number;
    patientLng: number;
  };
}

// Helper function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

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
    ],
    coordinates: {
      doctorLat: 40.7589,
      doctorLng: -73.9851,
      patientLat: 40.7614,
      patientLng: -73.9776
    }
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
    notes: 'Skin lesion examination',
    coordinates: {
      doctorLat: 40.7505,
      doctorLng: -73.9972,
      patientLat: 40.7614,
      patientLng: -73.9776
    }
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
    notes: 'Migraine management consultation',
    coordinates: {
      doctorLat: 40.7549,
      doctorLng: -73.9840,
      patientLat: 40.7614,
      patientLng: -73.9776
    }
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

// OpenStreetMap Component
const MapComponent = ({ appointment }: { appointment: Appointment | null }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const mapLoaded = useRef(false);

  useEffect(() => {
    if (!mapContainer.current || !appointment?.coordinates) return;

    // Dynamically load Leaflet
    if (!mapLoaded.current) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.onload = () => {
        initializeMap();
      };
      document.body.appendChild(script);
      mapLoaded.current = true;
    } else {
      initializeMap();
    }

    function initializeMap() {
      const L = (window as any).L;
      if (!L) return;

      const { doctorLat, doctorLng, patientLat, patientLng } = appointment.coordinates!;
      const distance = calculateDistance(patientLat, patientLng, doctorLat, doctorLng);

      // Calculate center point
      const centerLat = (patientLat + doctorLat) / 2;
      const centerLng = (patientLng + doctorLng) / 2;

      // Initialize map
      if (!map.current) {
        map.current = L.map(mapContainer.current).setView([centerLat, centerLng], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map.current);
      } else {
        map.current.setView([centerLat, centerLng], 14);
      }

      // Clear existing markers
      map.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.current.removeLayer(layer);
        }
      });

      // Custom icons HTML
      const patientIcon = L.divIcon({
        html: `
          <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-4 border-white shadow-lg">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      const doctorIcon = L.divIcon({
        html: `
          <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full border-4 border-white shadow-lg">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.5 1.5H9.5a.5.5 0 00-.5.5v1h2v-1a.5.5 0 00-.5-.5zM6 4H4a2 2 0 00-2 2v3a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2v-.5a.5.5 0 00-1 0V4h-2v-.5a.5.5 0 00-1 0V4H6v-.5a.5.5 0 00-1 0V4zm-2 9a2 2 0 002 2h12a2 2 0 002-2v-1H4v1z" />
            </svg>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      // Add markers
      L.marker([patientLat, patientLng], { icon: patientIcon })
        .addTo(map.current)
        .bindPopup(`<div class="font-semibold text-gray-900">📍 Your Location</div>`)
        .openPopup();

      L.marker([doctorLat, doctorLng], { icon: doctorIcon })
        .addTo(map.current)
        .bindPopup(`<div class="font-semibold text-gray-900">🏥 ${appointment.doctor}</div>`)
        .openPopup();

      // Draw line between points
      const polyline = L.polyline([
        [patientLat, patientLng],
        [doctorLat, doctorLng]
      ], {
        color: '#3b82f6',
        weight: 3,
        opacity: 0.7,
        dashArray: '5, 5',
        lineCap: 'round'
      }).addTo(map.current);

      // Fit bounds
      const bounds = L.latLngBounds([
        [patientLat, patientLng],
        [doctorLat, doctorLng]
      ]);
      map.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [appointment?.coordinates]);

  if (!appointment?.coordinates) {
    return (
      <div className="h-96 rounded-xl border-2 border-gray-200 flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 font-medium">Telehealth appointments don't require location information</p>
      </div>
    );
  }

  return (
    <div>
      <div ref={mapContainer} className="h-96 rounded-xl border-2 border-gray-200 overflow-hidden shadow-md" />
      {appointment.coordinates && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <Navigation className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-gray-900">
              Distance: {calculateDistance(
                appointment.coordinates.patientLat,
                appointment.coordinates.patientLng,
                appointment.coordinates.doctorLat,
                appointment.coordinates.doctorLng
              ).toFixed(2)} km
            </span>
          </div>
          <p className="text-sm text-gray-600">Direct distance from your location to the medical facility</p>
        </div>
      )}
    </div>
  );
};

export default function Appointments() {
  const { toast } = useToast();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);

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
    const distance = appointment.coordinates
      ? calculateDistance(
          appointment.coordinates.patientLat,
          appointment.coordinates.patientLng,
          appointment.coordinates.doctorLat,
          appointment.coordinates.doctorLng
        )
      : null;

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
                  {distance && (
                    <span className="flex items-center gap-1.5 font-medium text-gray-600">
                      <Navigation className="h-4 w-4 text-emerald-600" />
                      {distance.toFixed(1)} km away
                    </span>
                  )}
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
                {appointment.type === 'in-person' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-2 hover:border-emerald-300 hover:bg-emerald-50"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setShowMapDialog(true);
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Map
                  </Button>
                )}
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

        {/* Map Dialog */}
        <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <MapPin className="h-6 w-6 text-emerald-600" />
                Location Map
              </DialogTitle>
              <DialogDescription className="text-base">
                View your location and {selectedAppointment?.doctor}'s clinic
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <MapComponent appointment={selectedAppointment} />
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowMapDialog(false)}
                className="border-2"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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

                {selectedAppointment.coordinates && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                      <Navigation className="h-4 w-4 text-emerald-600" /> Distance
                    </p>
                    <p className="font-semibold text-gray-900">
                      {calculateDistance(
                        selectedAppointment.coordinates.patientLat,
                        selectedAppointment.coordinates.patientLng,
                        selectedAppointment.coordinates.doctorLat,
                        selectedAppointment.coordinates.doctorLng
                      ).toFixed(2)} km
                    </p>
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