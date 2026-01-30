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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  User,
  Calendar,
  Clock,
  FileText,
  Pill,
  Activity,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Plus,
  Save,
  CheckCircle2
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  appointmentDate: Date;
  appointmentTime: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  referredBy: string;
  visitType: 'initial' | 'follow-up' | 'procedure';
  treatmentPlan?: string;
  notes?: string;
  vitals?: {
    bp: string;
    heartRate: number;
    temperature: number;
  };
}

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Emily Chen',
    age: 45,
    gender: 'Female',
    condition: 'Atrial fibrillation',
    appointmentDate: new Date(),
    appointmentTime: '09:00 AM',
    status: 'completed',
    referredBy: 'Dr. Michael Chen',
    visitType: 'initial',
    treatmentPlan: 'Initiated anticoagulation therapy. Scheduled for cardioversion evaluation.',
    notes: 'Patient responded well to initial consultation.',
    vitals: { bp: '132/84', heartRate: 88, temperature: 98.4 }
  },
  {
    id: '2',
    name: 'David Brown',
    age: 62,
    gender: 'Male',
    condition: 'Post-stent follow-up',
    appointmentDate: new Date(),
    appointmentTime: '11:00 AM',
    status: 'in-progress',
    referredBy: 'Dr. Lisa Wong',
    visitType: 'follow-up',
    vitals: { bp: '128/78', heartRate: 72, temperature: 98.2 }
  },
  {
    id: '3',
    name: 'Lisa Johnson',
    age: 38,
    gender: 'Female',
    condition: 'Mitral valve prolapse',
    appointmentDate: new Date(),
    appointmentTime: '02:00 PM',
    status: 'scheduled',
    referredBy: 'Dr. James Park',
    visitType: 'initial'
  },
  {
    id: '4',
    name: 'Robert Martinez',
    age: 55,
    gender: 'Male',
    condition: 'Hypertrophic cardiomyopathy',
    appointmentDate: new Date(),
    appointmentTime: '03:30 PM',
    status: 'scheduled',
    referredBy: 'Dr. Sarah Kim',
    visitType: 'procedure'
  }
];

export default function PatientTreatment() {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showTreatmentDialog, setShowTreatmentDialog] = useState(false);
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [prescription, setPrescription] = useState('');
  const [followUpNeeded, setFollowUpNeeded] = useState('');

  const todayPatients = patients.filter(p => 
    format(p.appointmentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const upcomingPatients = patients.filter(p => 
    p.appointmentDate > new Date()
  );

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 hover:bg-green-100 border-0';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-0';
      case 'scheduled':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-0';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-0';
    }
  };

  const getVisitTypeLabel = (type: string) => {
    switch (type) {
      case 'initial': return 'Initial Consultation';
      case 'follow-up': return 'Follow-up';
      case 'procedure': return 'Procedure';
      default: return type;
    }
  };

  const startAppointment = (patient: Patient) => {
    setPatients(prev => prev.map(p => 
      p.id === patient.id ? { ...p, status: 'in-progress' as const } : p
    ));
    setSelectedPatient({ ...patient, status: 'in-progress' });
    toast({
      title: "Appointment Started",
      description: `Now seeing ${patient.name}`,
    });
  };

  const openTreatmentDialog = (patient: Patient) => {
    setSelectedPatient(patient);
    setTreatmentNotes(patient.notes || '');
    setTreatmentPlan(patient.treatmentPlan || '');
    setShowTreatmentDialog(true);
  };

  const saveTreatment = () => {
    if (!selectedPatient) return;

    setPatients(prev => prev.map(p => 
      p.id === selectedPatient.id ? {
        ...p,
        status: 'completed' as const,
        treatmentPlan,
        notes: treatmentNotes
      } : p
    ));

    toast({
      title: "Treatment Saved",
      description: `Treatment notes for ${selectedPatient.name} have been saved.`,
    });

    setShowTreatmentDialog(false);
    setSelectedPatient(null);
    setTreatmentNotes('');
    setTreatmentPlan('');
    setPrescription('');
    setFollowUpNeeded('');
  };

  const completedToday = todayPatients.filter(p => p.status === 'completed').length;
  const progressPercent = (completedToday / todayPatients.length) * 100;

  return (
    <DashboardLayout sidebar={<SpecialistSidebar />} title="Patient Treatment">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Treatment</h1>
            <p className="text-gray-500 mt-1">Manage appointments and document treatment</p>
          </div>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6 pb-4 px-6">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Today's Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{completedToday} <span className="text-base text-gray-600">of {todayPatients.length}</span></p>
                </div>
                <div className="w-24">
                  <Progress value={progressPercent} className="h-2.5 bg-white" />
                  <p className="text-xs text-gray-600 mt-1 text-center">{Math.round(progressPercent)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger value="today" className="gap-2 data-[state=active]:bg-white">
              <Calendar className="h-4 w-4" />
              Today ({todayPatients.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-2 data-[state=active]:bg-white">
              <Clock className="h-4 w-4" />
              Upcoming ({upcomingPatients.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            {todayPatients.length === 0 ? (
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">No Appointments Today</p>
                  <p className="text-gray-500 mt-1">Your schedule is clear</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {todayPatients.map((patient) => (
                  <Card key={patient.id} className={cn(
                    "border shadow-sm transition-all",
                    patient.status === 'in-progress' && "border-blue-300 bg-blue-50/30 shadow-md"
                  )}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        
                        {/* Patient Info Section */}
                        <div className="flex items-start gap-4 flex-1">
                          
                          {/* Time & Status */}
                          <div className="flex flex-col items-center text-center min-w-[90px] bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <Clock className="h-5 w-5 text-gray-600 mb-2" />
                            <span className="text-base font-bold text-gray-900">{patient.appointmentTime}</span>
                            <Badge className={cn("mt-2 font-medium", getStatusStyles(patient.status))}>
                              {patient.status === 'in-progress' && <Activity className="h-3 w-3 mr-1 animate-pulse" />}
                              {patient.status === 'completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {patient.status}
                            </Badge>
                          </div>

                          {/* Patient Details */}
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <User className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                                  <span className="text-sm text-gray-600">
                                    {patient.age} y/o {patient.gender}
                                  </span>
                                </div>
                                <p className="text-sm font-medium text-blue-600 mb-2">{patient.condition}</p>
                                <div className="flex flex-wrap gap-2 items-center">
                                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0">
                                    {getVisitTypeLabel(patient.visitType)}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    Referred by {patient.referredBy}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Vitals */}
                            {patient.vitals && (
                              <div className="grid grid-cols-3 gap-3 mt-4">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                                  <p className="text-xs text-gray-600 mb-1">BP</p>
                                  <p className="font-bold text-gray-900">{patient.vitals.bp}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                                  <p className="text-xs text-gray-600 mb-1">HR</p>
                                  <p className="font-bold text-gray-900">{patient.vitals.heartRate}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                                  <p className="text-xs text-gray-600 mb-1">Temp</p>
                                  <p className="font-bold text-gray-900">{patient.vitals.temperature}°F</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 lg:min-w-[160px]">
                          {patient.status === 'scheduled' && (
                            <Button 
                              onClick={() => startAppointment(patient)} 
                              className="h-11 bg-blue-600 hover:bg-blue-700"
                            >
                              <Activity className="h-4 w-4 mr-2" />
                              Start Visit
                            </Button>
                          )}
                          {patient.status === 'in-progress' && (
                            <Button 
                              onClick={() => openTreatmentDialog(patient)} 
                              className="h-11 bg-blue-600 hover:bg-blue-700"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Document
                            </Button>
                          )}
                          {patient.status === 'completed' && (
                            <>
                              <Button 
                                variant="outline" 
                                onClick={() => openTreatmentDialog(patient)} 
                                className="h-11 border-gray-300"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                View Notes
                              </Button>
                              <Button 
                                className="h-11 bg-green-600 hover:bg-green-700"
                                asChild
                              >
                                <a href="/specialist/outcomes">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Submit Outcome
                                </a>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingPatients.length === 0 ? (
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">No Upcoming Appointments</p>
                  <p className="text-gray-500 mt-1">Check back later for new bookings</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingPatients.map((patient) => (
                  <Card key={patient.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[100px] bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <p className="text-xs text-gray-600 mb-1">{format(patient.appointmentDate, 'MMM d')}</p>
                            <p className="text-base font-bold text-gray-900">{patient.appointmentTime}</p>
                          </div>
                          <div className="w-px h-12 bg-gray-200" />
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                              <p className="text-sm text-gray-600">{patient.condition}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0">
                            {getVisitTypeLabel(patient.visitType)}
                          </Badge>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Treatment Documentation Dialog */}
        <Dialog open={showTreatmentDialog} onOpenChange={setShowTreatmentDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Treatment Documentation</DialogTitle>
              <DialogDescription>
                {selectedPatient?.name} - {selectedPatient?.condition}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              
              {/* Vitals */}
              {selectedPatient?.vitals && (
                <div>
                  <label className="text-sm font-semibold text-gray-900 block mb-3">Current Vitals</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                      <p className="text-xs text-gray-600 mb-1">Blood Pressure</p>
                      <p className="text-lg font-bold text-gray-900">{selectedPatient.vitals.bp}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                      <p className="text-xs text-gray-600 mb-1">Heart Rate</p>
                      <p className="text-lg font-bold text-gray-900">{selectedPatient.vitals.heartRate}</p>
                      <p className="text-xs text-gray-500">bpm</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                      <p className="text-xs text-gray-600 mb-1">Temperature</p>
                      <p className="text-lg font-bold text-gray-900">{selectedPatient.vitals.temperature}</p>
                      <p className="text-xs text-gray-500">°F</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Clinical Notes */}
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-2">Clinical Notes</label>
                <Textarea
                  value={treatmentNotes}
                  onChange={(e) => setTreatmentNotes(e.target.value)}
                  placeholder="Document your clinical observations, patient complaints, examination findings..."
                  className="min-h-[100px] resize-none"
                  rows={4}
                />
              </div>

              {/* Treatment Plan */}
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-2">Treatment Plan</label>
                <Textarea
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  placeholder="Outline the treatment plan, procedures recommended, lifestyle modifications..."
                  className="min-h-[100px] resize-none"
                  rows={4}
                />
              </div>

              {/* Prescriptions */}
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-2">Prescriptions</label>
                <Textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="List medications, dosages, and instructions..."
                  className="min-h-[80px] resize-none"
                  rows={3}
                />
              </div>

              {/* Follow-up */}
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-2">Follow-up Required</label>
                <Select value={followUpNeeded} onValueChange={setFollowUpNeeded}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select follow-up timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-week">1 Week</SelectItem>
                    <SelectItem value="2-weeks">2 Weeks</SelectItem>
                    <SelectItem value="1-month">1 Month</SelectItem>
                    <SelectItem value="3-months">3 Months</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="1-year">1 Year</SelectItem>
                    <SelectItem value="as-needed">As Needed</SelectItem>
                    <SelectItem value="none">No Follow-up Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowTreatmentDialog(false)} className="h-11">
                Cancel
              </Button>
              <Button onClick={saveTreatment} className="h-11 bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save & Complete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}