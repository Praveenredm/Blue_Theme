import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientSidebar } from '@/components/navigation/PatientSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  ArrowRight,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Referral {
  id: string;
  specialty: string;
  condition: string;
  status: 'pending' | 'approved' | 'scheduled' | 'completed' | 'cancelled';
  urgency: 'low' | 'medium' | 'high';
  referredBy: string;
  specialist?: string;
  createdDate: Date;
  updatedDate: Date;
  appointmentDate?: Date;
  appointmentTime?: string;
  location?: string;
  phone?: string;
  notes?: string;
  steps: {
    label: string;
    status: 'completed' | 'current' | 'pending';
    date?: Date;
  }[];
}

const mockReferrals: Referral[] = [
  {
    id: '1',
    specialty: 'Cardiology',
    condition: 'Chest pain evaluation',
    status: 'scheduled',
    urgency: 'high',
    referredBy: 'Dr. Michael Chen',
    specialist: 'Dr. Emily Rodriguez',
    createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    appointmentTime: '10:00 AM',
    location: 'Heart Health Center, 456 Medical Plaza',
    phone: '(555) 234-5678',
    notes: 'Please bring previous ECG results if available',
    steps: [
      { label: 'Referral Submitted', status: 'completed', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { label: 'Specialist Review', status: 'completed', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { label: 'Appointment Scheduled', status: 'completed', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { label: 'Consultation', status: 'current' },
      { label: 'Follow-up Care', status: 'pending' }
    ]
  },
  {
    id: '2',
    specialty: 'Dermatology',
    condition: 'Skin lesion examination',
    status: 'approved',
    urgency: 'medium',
    referredBy: 'Dr. Lisa Wong',
    createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedDate: new Date(),
    notes: 'Awaiting specialist availability',
    steps: [
      { label: 'Referral Submitted', status: 'completed', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { label: 'Specialist Review', status: 'completed', date: new Date() },
      { label: 'Appointment Scheduled', status: 'current' },
      { label: 'Consultation', status: 'pending' },
      { label: 'Follow-up Care', status: 'pending' }
    ]
  },
  {
    id: '3',
    specialty: 'Orthopedics',
    condition: 'Knee pain assessment',
    status: 'pending',
    urgency: 'low',
    referredBy: 'Dr. James Park',
    createdDate: new Date(),
    updatedDate: new Date(),
    steps: [
      { label: 'Referral Submitted', status: 'completed', date: new Date() },
      { label: 'Specialist Review', status: 'current' },
      { label: 'Appointment Scheduled', status: 'pending' },
      { label: 'Consultation', status: 'pending' },
      { label: 'Follow-up Care', status: 'pending' }
    ]
  },
  {
    id: '4',
    specialty: 'Neurology',
    condition: 'Migraine management',
    status: 'completed',
    urgency: 'medium',
    referredBy: 'Dr. Sarah Kim',
    specialist: 'Dr. Robert Martinez',
    createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    appointmentDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    steps: [
      { label: 'Referral Submitted', status: 'completed', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { label: 'Specialist Review', status: 'completed', date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) },
      { label: 'Appointment Scheduled', status: 'completed', date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) },
      { label: 'Consultation', status: 'completed', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
      { label: 'Follow-up Care', status: 'completed', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    ]
  }
];

export default function ReferralStatus() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activeReferrals = mockReferrals.filter(r => !['completed', 'cancelled'].includes(r.status));
  const completedReferrals = mockReferrals.filter(r => r.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'secondary';
      case 'scheduled': return 'default';
      case 'approved': return 'default';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-emerald-600';
      default: return 'text-muted-foreground';
    }
  };

  const getProgressPercent = (steps: Referral['steps']) => {
    const completed = steps.filter(s => s.status === 'completed').length;
    return (completed / steps.length) * 100;
  };

  const ReferralCard = ({ referral }: { referral: Referral }) => {
    const isExpanded = expandedId === referral.id;
    
    return (
      <Card className={cn(
        "transition-all",
        referral.status === 'scheduled' && "border-primary/50"
      )}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{referral.specialty}</h3>
                    <Badge variant={getStatusColor(referral.status)}>{referral.status}</Badge>
                  </div>
                  <p className="text-muted-foreground">{referral.condition}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Referred by {referral.referredBy}
                    </span>
                    <span className={cn("font-medium", getUrgencyColor(referral.urgency))}>
                      {referral.urgency} priority
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedId(isExpanded ? null : referral.id)}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round(getProgressPercent(referral.steps))}%</span>
              </div>
              <Progress value={getProgressPercent(referral.steps)} className="h-2" />
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="pt-4 border-t space-y-6">
                {/* Appointment Details */}
                {referral.appointmentDate && (
                  <div className="bg-primary/5 rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Appointment Details
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Date & Time</p>
                        <p className="font-medium">{format(referral.appointmentDate, 'EEEE, MMMM d, yyyy')}</p>
                        <p className="font-medium">{referral.appointmentTime}</p>
                      </div>
                      {referral.specialist && (
                        <div>
                          <p className="text-muted-foreground">Specialist</p>
                          <p className="font-medium">{referral.specialist}</p>
                        </div>
                      )}
                      {referral.location && (
                        <div>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> Location
                          </p>
                          <p className="font-medium">{referral.location}</p>
                        </div>
                      )}
                      {referral.phone && (
                        <div>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" /> Contact
                          </p>
                          <p className="font-medium">{referral.phone}</p>
                        </div>
                      )}
                    </div>
                    {referral.notes && (
                      <div className="mt-3 p-3 bg-background rounded border">
                        <p className="text-sm text-muted-foreground">Note: {referral.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h4 className="font-medium mb-3">Referral Timeline</h4>
                  <div className="space-y-3">
                    {referral.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0",
                          step.status === 'completed' && "bg-emerald-100 text-emerald-600",
                          step.status === 'current' && "bg-primary text-primary-foreground",
                          step.status === 'pending' && "bg-muted text-muted-foreground"
                        )}>
                          {step.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : step.status === 'current' ? (
                            <Clock className="h-3 w-3" />
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-current" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={cn(
                            "font-medium",
                            step.status === 'pending' && "text-muted-foreground"
                          )}>{step.label}</p>
                          {step.date && (
                            <p className="text-sm text-muted-foreground">
                              {format(step.date, 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout sidebar={<PatientSidebar />} title="My Referrals">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Referrals</h2>
          <p className="text-muted-foreground">Track the status of your specialist referrals</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeReferrals.length}</p>
                <p className="text-sm text-muted-foreground">Active Referrals</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockReferrals.filter(r => r.status === 'scheduled').length}
                </p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedReferrals.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referrals List */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active ({activeReferrals.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedReferrals.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeReferrals.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No Active Referrals</p>
                  <p className="text-muted-foreground">All your referrals have been completed</p>
                </CardContent>
              </Card>
            ) : (
              activeReferrals.map(referral => (
                <ReferralCard key={referral.id} referral={referral} />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedReferrals.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No Completed Referrals</p>
                  <p className="text-muted-foreground">Your completed referrals will appear here</p>
                </CardContent>
              </Card>
            ) : (
              completedReferrals.map(referral => (
                <ReferralCard key={referral.id} referral={referral} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
