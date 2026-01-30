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
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-500 text-white';
      case 'approved': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-700 border-2 border-gray-300';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-500';
      case 'medium': return 'text-orange-600 bg-orange-500';
      case 'low': return 'text-green-600 bg-green-500';
      default: return 'text-gray-600 bg-gray-500';
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
        "border-2 rounded-2xl transition-all duration-300 hover:shadow-lg",
        referral.status === 'scheduled' && "border-blue-300 bg-blue-50/30"
      )}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{referral.specialty}</h3>
                    <Badge className={cn("font-semibold", getStatusColor(referral.status))}>
                      {referral.status}
                    </Badge>
                  </div>
                  <p className="text-gray-700 font-medium mb-3">{referral.condition}</p>
                  <div className="flex items-center flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <User className="h-4 w-4" />
                      Referred by {referral.referredBy}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className={cn("h-3 w-3 rounded-full shadow-md", getUrgencyColor(referral.urgency))} />
                      <span className={cn("font-semibold", getUrgencyColor(referral.urgency).replace('bg-', 'text-'))}>
                        {referral.urgency} priority
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedId(isExpanded ? null : referral.id)}
                className="ml-2"
              >
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </div>

            {/* Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Progress</span>
                <span className="font-bold text-gray-900">{Math.round(getProgressPercent(referral.steps))}%</span>
              </div>
              <Progress value={getProgressPercent(referral.steps)} className="h-3" />
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="pt-6 border-t-2 border-gray-100 space-y-6">
                {/* Appointment Details */}
                {referral.appointmentDate && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Appointment Details
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Date & Time</p>
                        <p className="font-bold text-gray-900">{format(referral.appointmentDate, 'EEEE, MMMM d, yyyy')}</p>
                        <p className="font-semibold text-blue-600">{referral.appointmentTime}</p>
                      </div>
                      {referral.specialist && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Specialist</p>
                          <p className="font-bold text-gray-900">{referral.specialist}</p>
                        </div>
                      )}
                      {referral.location && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> Location
                          </p>
                          <p className="font-semibold text-gray-900">{referral.location}</p>
                        </div>
                      )}
                      {referral.phone && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                            <Phone className="h-4 w-4" /> Contact
                          </p>
                          <p className="font-semibold text-gray-900">{referral.phone}</p>
                        </div>
                      )}
                    </div>
                    {referral.notes && (
                      <div className="mt-4 p-4 bg-white rounded-xl border-2 border-blue-100">
                        <p className="text-sm font-medium text-gray-700">
                          <AlertCircle className="h-4 w-4 inline mr-1 text-blue-600" />
                          Note: {referral.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h4 className="font-bold text-lg mb-4 text-gray-900">Referral Timeline</h4>
                  <div className="space-y-4">
                    {referral.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md transition-all",
                          step.status === 'completed' && "bg-green-500 text-white",
                          step.status === 'current' && "bg-blue-500 text-white ring-4 ring-blue-100",
                          step.status === 'pending' && "bg-gray-200 text-gray-500"
                        )}>
                          {step.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : step.status === 'current' ? (
                            <Clock className="h-5 w-5" />
                          ) : (
                            <span className="h-3 w-3 rounded-full bg-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className={cn(
                            "font-semibold text-base",
                            step.status === 'pending' ? "text-gray-500" : "text-gray-900"
                          )}>{step.label}</p>
                          {step.date && (
                            <p className="text-sm text-gray-600 mt-1">
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
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">My Referrals</h1>
          <p className="text-lg text-gray-600">Track the status of your specialist referrals</p>
        </div>

        {/* Enhanced Stats */}
        <div className="grid gap-6 sm:grid-cols-3">
          {/* Active Referrals */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-orange-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900">{activeReferrals.length}</p>
                <p className="text-sm font-medium text-gray-600">Active Referrals</p>
              </div>
            </div>
          </div>

          {/* Scheduled */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900">
                  {mockReferrals.filter(r => r.status === 'scheduled').length}
                </p>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
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
                <p className="text-4xl font-bold text-gray-900">{completedReferrals.length}</p>
                <p className="text-sm font-medium text-gray-600">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referrals List */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active" className="font-semibold">
              Active ({activeReferrals.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="font-semibold">
              Completed ({completedReferrals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeReferrals.length === 0 ? (
              <Card className="border-2 rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  <p className="text-xl font-bold text-gray-900 mb-2">No Active Referrals</p>
                  <p className="text-gray-600">All your referrals have been completed</p>
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
              <Card className="border-2 rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <FileText className="h-12 w-12 text-gray-600" />
                  </div>
                  <p className="text-xl font-bold text-gray-900 mb-2">No Completed Referrals</p>
                  <p className="text-gray-600">Your completed referrals will appear here</p>
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