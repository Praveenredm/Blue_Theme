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
  Save
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'secondary';
      case 'in-progress': return 'default';
      case 'scheduled': return 'outline';
      default: return 'outline';
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Patient Treatment</h2>
            <p className="text-muted-foreground">Manage appointments and document treatment</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Today's Progress</p>
              <p className="font-semibold">{completedToday} of {todayPatients.length} completed</p>
            </div>
            <div className="w-24">
              <Progress value={progressPercent} className="h-2" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList>
            <TabsTrigger value="today" className="gap-2">
              <Calendar className="h-4 w-4" />
              Today ({todayPatients.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-2">
              <Clock className="h-4 w-4" />
              Upcoming ({upcomingPatients.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            {todayPatients.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No Appointments Today</p>
                  <p className="text-muted-foreground">Your schedule is clear</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {todayPatients.map((patient) => (
                  <Card key={patient.id} className={cn(
                    "transition-all",
                    patient.status === 'in-progress' && "border-primary shadow-md"
                  )}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center text-center min-w-[80px]">
                            <span className="text-lg font-bold">{patient.appointmentTime}</span>
                            <Badge variant={getStatusColor(patient.status)} className="mt-1">
                              {patient.status === 'in-progress' && <Activity className="h-3 w-3 mr-1 animate-pulse" />}
                              {patient.status}
                            </Badge>
                          </div>
                          <div className="h-12 border-l border-border hidden lg:block" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <h3 className="font-semibold">{patient.name}</h3>
                              <span className="text-sm text-muted-foreground">
                                {patient.age} y/o {patient.gender}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-primary mb-1">{patient.condition}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">{getVisitTypeLabel(patient.visitType)}</Badge>
                              <span className="text-xs text-muted-foreground">
                                Referred by {patient.referredBy}
                              </span>
                            </div>
                            {patient.vitals && (
                              <div className="flex gap-4 mt-3 text-sm">
                                <span>BP: <strong>{patient.vitals.bp}</strong></span>
                                <span>HR: <strong>{patient.vitals.heartRate}</strong></span>
                                <span>Temp: <strong>{patient.vitals.temperature}°F</strong></span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 lg:flex-col lg:min-w-[140px]">
                          {patient.status === 'scheduled' && (
                            <Button onClick={() => startAppointment(patient)} className="flex-1 lg:w-full">
                              <Activity className="h-4 w-4 mr-2" />
                              Start Visit
                            </Button>
                          )}
                          {patient.status === 'in-progress' && (
                            <Button onClick={() => openTreatmentDialog(patient)} className="flex-1 lg:w-full">
                              <FileText className="h-4 w-4 mr-2" />
                              Document
                            </Button>
                          )}
                          {patient.status === 'completed' && (
                            <>
                              <Button variant="outline" onClick={() => openTreatmentDialog(patient)} className="flex-1 lg:w-full">
                                <FileText className="h-4 w-4 mr-2" />
                                View Notes
                              </Button>
                              <Button variant="secondary" className="flex-1 lg:w-full" asChild>
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
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No Upcoming Appointments</p>
                  <p className="text-muted-foreground">Check back later for new bookings</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingPatients.map((patient) => (
                  <Card key={patient.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[100px]">
                            <p className="text-sm text-muted-foreground">{format(patient.appointmentDate, 'MMM d')}</p>
                            <p className="font-semibold">{patient.appointmentTime}</p>
                          </div>
                          <div className="h-10 border-l border-border" />
                          <div>
                            <h3 className="font-semibold">{patient.name}</h3>
                            <p className="text-sm text-muted-foreground">{patient.condition}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{getVisitTypeLabel(patient.visitType)}</Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Treatment Documentation</DialogTitle>
              <DialogDescription>
                {selectedPatient?.name} - {selectedPatient?.condition}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {selectedPatient?.vitals && (
                <div>
                  <label className="text-sm font-medium">Current Vitals</label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Blood Pressure</p>
                      <p className="font-semibold">{selectedPatient.vitals.bp}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Heart Rate</p>
                      <p className="font-semibold">{selectedPatient.vitals.heartRate} bpm</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Temperature</p>
                      <p className="font-semibold">{selectedPatient.vitals.temperature}°F</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Clinical Notes</label>
                <Textarea
                  value={treatmentNotes}
                  onChange={(e) => setTreatmentNotes(e.target.value)}
                  placeholder="Document your clinical observations, patient complaints, examination findings..."
                  className="mt-2"
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Treatment Plan</label>
                <Textarea
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  placeholder="Outline the treatment plan, procedures recommended, lifestyle modifications..."
                  className="mt-2"
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Prescriptions</label>
                <Textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="List medications, dosages, and instructions..."
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Follow-up Required</label>
                <Select value={followUpNeeded} onValueChange={setFollowUpNeeded}>
                  <SelectTrigger className="mt-2">
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

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTreatmentDialog(false)}>Cancel</Button>
              <Button onClick={saveTreatment}>
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
