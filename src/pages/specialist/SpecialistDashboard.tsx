import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SpecialistSidebar } from '@/components/navigation/SpecialistSidebar';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  FileInput,
  Calendar,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SpecialistDashboard() {
  const pendingRequests = [
    {
      id: '1',
      patient: 'John Smith',
      referredBy: 'Dr. Michael Chen',
      urgency: 'high',
      condition: 'Chest pain, suspected cardiac',
      receivedDate: '2 hours ago'
    },
    {
      id: '2',
      patient: 'Maria Garcia',
      referredBy: 'Dr. Lisa Wong',
      urgency: 'medium',
      condition: 'Chronic fatigue',
      receivedDate: '1 day ago'
    },
    {
      id: '3',
      patient: 'Robert Wilson',
      referredBy: 'Dr. James Park',
      urgency: 'low',
      condition: 'Routine follow-up',
      receivedDate: '2 days ago'
    }
  ];

  const todayAppointments = [
    {
      id: '1',
      patient: 'Emily Chen',
      time: '09:00 AM',
      type: 'Initial Consultation',
      status: 'completed'
    },
    {
      id: '2',
      patient: 'David Brown',
      time: '11:00 AM',
      type: 'Follow-up',
      status: 'in-progress'
    },
    {
      id: '3',
      patient: 'Lisa Johnson',
      time: '02:00 PM',
      type: 'Treatment Review',
      status: 'upcoming'
    }
  ];

  return (
    <DashboardLayout sidebar={<SpecialistSidebar />} title="Specialist Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome, Dr. Rodriguez</h2>
            <p className="text-muted-foreground">Cardiology • You have 3 new referral requests</p>
          </div>
          <div className="flex gap-2">
            <Link to="/specialist/availability">
              <Button variant="outline" className="gap-2">
                <Clock className="h-4 w-4" />
                Update Availability
              </Button>
            </Link>
            <Link to="/specialist/requests">
              <Button className="gap-2">
                <FileInput className="h-4 w-4" />
                View Requests
                <Badge variant="destructive" className="ml-1">3</Badge>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Pending Requests"
            value={3}
            description="Awaiting your response"
            icon={<FileInput className="h-5 w-5" />}
          />
          <StatCard
            title="Today's Appointments"
            value={5}
            description="2 completed, 3 remaining"
            icon={<Calendar className="h-5 w-5" />}
          />
          <StatCard
            title="Avg Wait Time"
            value="4 days"
            description="Better than peers"
            icon={<Clock className="h-5 w-5" />}
            trend={{ value: -15, label: 'improvement' }}
          />
          <StatCard
            title="Outcome Success"
            value="96%"
            description="Positive patient outcomes"
            icon={<Award className="h-5 w-5" />}
            trend={{ value: 3, label: 'vs last quarter' }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Referral Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pending Referral Requests</CardTitle>
                <CardDescription>New cases requiring your attention</CardDescription>
              </div>
              <Link to="/specialist/requests">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="p-4 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{request.patient}</p>
                        <Badge variant={
                          request.urgency === 'high' ? 'destructive' :
                          request.urgency === 'medium' ? 'default' : 'secondary'
                        } className="text-xs">
                          {request.urgency}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.condition}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{request.receivedDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">From: {request.referredBy}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8">
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                      <Button size="sm" className="h-8">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>January 25, 2026</CardDescription>
              </div>
              <Link to="/specialist/treatment">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium">{apt.time}</div>
                    </div>
                    <div className="h-8 border-l border-border"></div>
                    <div>
                      <p className="font-medium">{apt.patient}</p>
                      <p className="text-sm text-muted-foreground">{apt.type}</p>
                    </div>
                  </div>
                  <Badge variant={
                    apt.status === 'completed' ? 'secondary' :
                    apt.status === 'in-progress' ? 'default' : 'outline'
                  }>
                    {apt.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {apt.status === 'in-progress' && <Clock className="h-3 w-3 mr-1" />}
                    {apt.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
            <CardDescription>Your metrics compared to department average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Referrals Processed</span>
                  <span className="font-medium">18/20</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Patient Satisfaction</span>
                  <span className="font-medium">4.8/5.0</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Outcome Reports Filed</span>
                  <span className="font-medium">15/18</span>
                </div>
                <Progress value={83} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
