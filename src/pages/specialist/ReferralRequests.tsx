import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SpecialistSidebar } from '@/components/navigation/SpecialistSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText,
  AlertTriangle,
  Calendar as CalendarIcon,
  Search,
  Filter,
  Eye
} from 'lucide-react';

interface ReferralRequest {
  id: string;
  patient: string;
  patientAge: number;
  patientGender: string;
  referredBy: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  condition: string;
  chiefComplaint: string;
  receivedDate: string;
  aiScore: number;
  aiRecommendation: string;
  vitals: {
    bp: string;
    heartRate: number;
    temperature: number;
    bmi: number;
  };
  medicalHistory: string[];
  notes?: string;
}

const mockRequests: ReferralRequest[] = [
  {
    id: '1',
    patient: 'John Smith',
    patientAge: 58,
    patientGender: 'Male',
    referredBy: 'Dr. Michael Chen',
    urgency: 'high',
    condition: 'Chest pain, suspected cardiac',
    chiefComplaint: 'Intermittent chest pain radiating to left arm, shortness of breath',
    receivedDate: '2 hours ago',
    aiScore: 87,
    aiRecommendation: 'Urgent cardiology consult recommended. High risk based on age, symptoms, and medical history.',
    vitals: { bp: '145/92', heartRate: 88, temperature: 98.6, bmi: 28.5 },
    medicalHistory: ['Hypertension', 'Type 2 Diabetes', 'Family history of heart disease'],
    notes: 'Patient reports symptoms worsening over past week'
  },
  {
    id: '2',
    patient: 'Maria Garcia',
    patientAge: 34,
    patientGender: 'Female',
    referredBy: 'Dr. Lisa Wong',
    urgency: 'medium',
    condition: 'Chronic fatigue with palpitations',
    chiefComplaint: 'Persistent fatigue for 3 months, occasional heart palpitations',
    receivedDate: '1 day ago',
    aiScore: 62,
    aiRecommendation: 'Cardiology evaluation recommended to rule out arrhythmia. Consider thyroid panel.',
    vitals: { bp: '118/76', heartRate: 92, temperature: 98.4, bmi: 23.1 },
    medicalHistory: ['Anxiety disorder'],
    notes: 'No previous cardiac history'
  },
  {
    id: '3',
    patient: 'Robert Wilson',
    patientAge: 67,
    patientGender: 'Male',
    referredBy: 'Dr. James Park',
    urgency: 'low',
    condition: 'Routine follow-up post stent',
    chiefComplaint: 'Annual cardiac checkup, 2 years post-stent placement',
    receivedDate: '2 days ago',
    aiScore: 35,
    aiRecommendation: 'Routine follow-up. Patient stable based on recent labs and symptom profile.',
    vitals: { bp: '128/82', heartRate: 72, temperature: 98.2, bmi: 26.8 },
    medicalHistory: ['Previous MI (2024)', 'Hypertension - controlled', 'Hyperlipidemia'],
    notes: 'Current medications: Aspirin, Atorvastatin, Metoprolol'
  },
  {
    id: '4',
    patient: 'Sarah Johnson',
    patientAge: 45,
    patientGender: 'Female',
    referredBy: 'Dr. Emily Davis',
    urgency: 'critical',
    condition: 'Acute chest pain with ECG changes',
    chiefComplaint: 'Sudden onset severe chest pain, diaphoresis, ECG showing ST elevation',
    receivedDate: '30 minutes ago',
    aiScore: 95,
    aiRecommendation: 'URGENT: Possible STEMI. Immediate cardiology intervention required.',
    vitals: { bp: '168/98', heartRate: 110, temperature: 99.1, bmi: 31.2 },
    medicalHistory: ['Obesity', 'Smoking history', 'Hypertension'],
    notes: 'ER referral - patient currently in emergency department'
  }
];

export default function ReferralRequests() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<ReferralRequest[]>(mockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<ReferralRequest | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState<Date>();
  const [appointmentTime, setAppointmentTime] = useState('');
  const [declineReason, setDeclineReason] = useState('');

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUrgency = urgencyFilter === 'all' || req.urgency === urgencyFilter;
    return matchesSearch && matchesUrgency;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getAiScoreColor = (score: number) => {
    if (score >= 80) return 'text-destructive';
    if (score >= 60) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const handleAccept = () => {
    if (!selectedRequest || !appointmentDate || !appointmentTime) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time for the appointment.",
        variant: "destructive"
      });
      return;
    }

    setRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
    toast({
      title: "Referral Accepted",
      description: `Appointment scheduled for ${selectedRequest.patient} on ${format(appointmentDate, 'PPP')} at ${appointmentTime}`,
    });
    setShowAcceptDialog(false);
    setSelectedRequest(null);
    setAppointmentDate(undefined);
    setAppointmentTime('');
  };

  const handleDecline = () => {
    if (!selectedRequest || !declineReason) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for declining this referral.",
        variant: "destructive"
      });
      return;
    }

    setRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
    toast({
      title: "Referral Declined",
      description: `Referral for ${selectedRequest.patient} has been declined and sent back to the referring physician.`,
    });
    setShowDeclineDialog(false);
    setSelectedRequest(null);
    setDeclineReason('');
  };

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  return (
    <DashboardLayout sidebar={<SpecialistSidebar />} title="Referral Requests">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Referral Requests</h2>
            <p className="text-muted-foreground">Review and manage incoming patient referrals</p>
          </div>
          <Badge variant="outline" className="w-fit">
            {filteredRequests.length} pending requests
          </Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Urgencies</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No pending requests</p>
                <p className="text-muted-foreground">All referrals have been processed</p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className={cn(
                "transition-all hover:shadow-md",
                request.urgency === 'critical' && "border-destructive/50 bg-destructive/5"
              )}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Patient Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{request.patient}</h3>
                            <p className="text-sm text-muted-foreground">
                              {request.patientAge} y/o {request.patientGender} • Referred by {request.referredBy}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getUrgencyColor(request.urgency)}>
                            {request.urgency === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {request.urgency}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{request.receivedDate}</span>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm font-medium mb-1">{request.condition}</p>
                        <p className="text-sm text-muted-foreground">{request.chiefComplaint}</p>
                      </div>

                      {/* AI Score */}
                      <div className="flex items-center gap-4 p-3 border rounded-lg bg-background">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">AI Referral Score:</span>
                          <span className={cn("text-lg font-bold", getAiScoreColor(request.aiScore))}>
                            {request.aiScore}/100
                          </span>
                        </div>
                        <div className="h-4 border-l border-border" />
                        <p className="text-sm text-muted-foreground flex-1">{request.aiRecommendation}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 lg:w-full"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 lg:w-full"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowAcceptDialog(true);
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 lg:w-full"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDeclineDialog(true);
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Referral Details</DialogTitle>
              <DialogDescription>Complete patient information and referral details</DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Patient</label>
                    <p className="font-medium">{selectedRequest.patient}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Age / Gender</label>
                    <p className="font-medium">{selectedRequest.patientAge} y/o {selectedRequest.patientGender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Referred By</label>
                    <p className="font-medium">{selectedRequest.referredBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Urgency</label>
                    <Badge variant={getUrgencyColor(selectedRequest.urgency)}>{selectedRequest.urgency}</Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Chief Complaint</label>
                  <p className="mt-1 p-3 bg-muted rounded-lg">{selectedRequest.chiefComplaint}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vitals</label>
                  <div className="grid grid-cols-4 gap-3 mt-2">
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Blood Pressure</p>
                      <p className="font-semibold">{selectedRequest.vitals.bp}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Heart Rate</p>
                      <p className="font-semibold">{selectedRequest.vitals.heartRate} bpm</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Temperature</p>
                      <p className="font-semibold">{selectedRequest.vitals.temperature}°F</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">BMI</p>
                      <p className="font-semibold">{selectedRequest.vitals.bmi}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Medical History</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRequest.medicalHistory.map((item, i) => (
                      <Badge key={i} variant="outline">{item}</Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-primary/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">AI Assessment</span>
                    <span className={cn("text-lg font-bold", getAiScoreColor(selectedRequest.aiScore))}>
                      Score: {selectedRequest.aiScore}/100
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedRequest.aiRecommendation}</p>
                </div>

                {selectedRequest.notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Additional Notes</label>
                    <p className="mt-1 p-3 bg-muted rounded-lg text-sm">{selectedRequest.notes}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>Close</Button>
              <Button onClick={() => {
                setShowDetailsDialog(false);
                setShowAcceptDialog(true);
              }}>
                Accept Referral
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Accept Dialog */}
        <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Accept Referral</DialogTitle>
              <DialogDescription>
                Schedule an appointment for {selectedRequest?.patient}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Select Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-2", !appointmentDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {appointmentDate ? format(appointmentDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={appointmentDate}
                      onSelect={setAppointmentDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium">Select Time</label>
                <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(slot => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>Cancel</Button>
              <Button onClick={handleAccept}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Decline Dialog */}
        <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Decline Referral</DialogTitle>
              <DialogDescription>
                Please provide a reason for declining this referral. This will be sent to the referring physician.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label className="text-sm font-medium">Reason for Declining</label>
              <Textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g., Patient would benefit more from a different specialty, not within my scope of practice..."
                className="mt-2"
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeclineDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDecline}>
                <XCircle className="h-4 w-4 mr-2" />
                Confirm Decline
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
