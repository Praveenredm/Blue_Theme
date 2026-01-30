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
  Eye,
  Activity,
  Brain
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

  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return { badge: 'bg-red-100 text-red-700 hover:bg-red-100 border-0', border: 'border-red-200', bg: 'bg-red-50' };
      case 'high':
        return { badge: 'bg-red-100 text-red-700 hover:bg-red-100 border-0', border: 'border-red-200', bg: 'bg-red-50' };
      case 'medium':
        return { badge: 'bg-orange-100 text-orange-700 hover:bg-orange-100 border-0', border: 'border-orange-200', bg: 'bg-orange-50' };
      case 'low':
        return { badge: 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-0', border: 'border-gray-200', bg: 'bg-gray-50' };
      default:
        return { badge: 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-0', border: 'border-gray-200', bg: 'bg-gray-50' };
    }
  };

  const getAiScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-green-600 bg-green-50 border-green-200';
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
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Referral Requests</h1>
            <p className="text-gray-500 mt-1">Review and manage incoming patient referrals</p>
          </div>
          <Badge className="w-fit bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 text-base px-4 py-2">
            {filteredRequests.length} pending requests
          </Badge>
        </div>

        {/* Filters */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by patient name or condition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-full sm:w-[200px] h-11">
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
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-lg font-semibold text-gray-900">No pending requests</p>
                <p className="text-gray-500 mt-1">All referrals have been processed</p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card 
                key={request.id} 
                className={cn(
                  "border shadow-sm transition-all hover:shadow-md",
                  request.urgency === 'critical' && "border-red-300 bg-red-50/30"
                )}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{request.patient}</h3>
                            <Badge className={getUrgencyStyles(request.urgency).badge}>
                              {request.urgency === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                              {request.urgency.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {request.patientAge} y/o {request.patientGender} • Referred by {request.referredBy}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{request.receivedDate}</span>
                    </div>

                    {/* Condition */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-sm font-semibold text-gray-900 mb-1">{request.condition}</p>
                      <p className="text-sm text-gray-600">{request.chiefComplaint}</p>
                    </div>

                    {/* AI Score Section */}
                    <div className={cn("p-4 rounded-xl border", getAiScoreColor(request.aiScore))}>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                          <Brain className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">AI Assessment</span>
                            <span className={cn("text-lg font-bold", request.aiScore >= 80 ? 'text-red-600' : request.aiScore >= 60 ? 'text-orange-600' : 'text-green-600')}>
                              {request.aiScore}/100
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{request.aiRecommendation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1 h-11 border-gray-300 hover:bg-gray-50"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 h-11 border-red-300 text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDeclineDialog(true);
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Decline
                      </Button>
                      <Button
                        className="flex-1 h-11 bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowAcceptDialog(true);
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept Referral
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Referral Details</DialogTitle>
              <DialogDescription>Complete patient information and referral details</DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-6 py-4">
                
                {/* Patient Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <label className="text-xs font-medium text-gray-600 block mb-1">Patient Name</label>
                    <p className="font-semibold text-gray-900">{selectedRequest.patient}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <label className="text-xs font-medium text-gray-600 block mb-1">Age / Gender</label>
                    <p className="font-semibold text-gray-900">{selectedRequest.patientAge} y/o {selectedRequest.patientGender}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <label className="text-xs font-medium text-gray-600 block mb-1">Referred By</label>
                    <p className="font-semibold text-gray-900">{selectedRequest.referredBy}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <label className="text-xs font-medium text-gray-600 block mb-1">Urgency Level</label>
                    <Badge className={getUrgencyStyles(selectedRequest.urgency).badge}>
                      {selectedRequest.urgency.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Chief Complaint */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 block mb-2">Chief Complaint</label>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-gray-700">{selectedRequest.chiefComplaint}</p>
                  </div>
                </div>

                {/* Vitals */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 block mb-3">Vital Signs</label>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                      <p className="text-xs text-gray-600 mb-1">Blood Pressure</p>
                      <p className="text-lg font-bold text-gray-900">{selectedRequest.vitals.bp}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                      <p className="text-xs text-gray-600 mb-1">Heart Rate</p>
                      <p className="text-lg font-bold text-gray-900">{selectedRequest.vitals.heartRate}</p>
                      <p className="text-xs text-gray-500">bpm</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                      <p className="text-xs text-gray-600 mb-1">Temperature</p>
                      <p className="text-lg font-bold text-gray-900">{selectedRequest.vitals.temperature}</p>
                      <p className="text-xs text-gray-500">°F</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                      <p className="text-xs text-gray-600 mb-1">BMI</p>
                      <p className="text-lg font-bold text-gray-900">{selectedRequest.vitals.bmi}</p>
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 block mb-3">Medical History</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.medicalHistory.map((item, i) => (
                      <Badge key={i} className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* AI Assessment */}
                <div className={cn("p-5 rounded-xl border", getAiScoreColor(selectedRequest.aiScore))}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      <span className="font-semibold text-gray-900">AI Assessment</span>
                    </div>
                    <span className={cn("text-2xl font-bold", selectedRequest.aiScore >= 80 ? 'text-red-600' : selectedRequest.aiScore >= 60 ? 'text-orange-600' : 'text-green-600')}>
                      {selectedRequest.aiScore}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{selectedRequest.aiRecommendation}</p>
                </div>

                {/* Additional Notes */}
                {selectedRequest.notes && (
                  <div>
                    <label className="text-sm font-semibold text-gray-900 block mb-2">Additional Notes</label>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-sm text-gray-700">{selectedRequest.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)} className="h-11">
                Close
              </Button>
              <Button onClick={() => {
                setShowDetailsDialog(false);
                setShowAcceptDialog(true);
              }} className="h-11 bg-blue-600 hover:bg-blue-700">
                Accept Referral
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Accept Dialog */}
        <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Accept Referral</DialogTitle>
              <DialogDescription>
                Schedule an appointment for {selectedRequest?.patient}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-2">Select Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={cn(
                        "w-full h-11 justify-start text-left font-normal border-gray-300",
                        !appointmentDate && "text-gray-500"
                      )}
                    >
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
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-2">Select Time</label>
                <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                  <SelectTrigger className="h-11">
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
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowAcceptDialog(false)} className="h-11">
                Cancel
              </Button>
              <Button onClick={handleAccept} className="h-11 bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Decline Dialog */}
        <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Decline Referral</DialogTitle>
              <DialogDescription>
                Please provide a reason for declining this referral. This will be sent to the referring physician.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label className="text-sm font-semibold text-gray-900 block mb-2">Reason for Declining</label>
              <Textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g., Patient would benefit more from a different specialty, not within my scope of practice..."
                className="min-h-[120px] resize-none"
                rows={5}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowDeclineDialog(false)} className="h-11">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDecline} className="h-11">
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