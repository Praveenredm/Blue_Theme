import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientSidebar } from '@/components/navigation/PatientSidebar';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
  const referrals = [
    {
      id: '1',
      specialty: 'Cardiology',
      status: 'in-progress',
      date: 'Jan 15, 2026',
      doctor: 'Dr. Balaji Kumar'
    },
    {
      id: '2',
      specialty: 'Dermatology',
      status: 'pending',
      date: 'Jan 20, 2026',
      doctor: 'Pending Assignment'
    }
  ];

  const appointments = [
    {
      id: '1',
      type: 'Follow-up',
      doctor: 'Dr. Mukunthan',
      date: 'Jan 28, 2026',
      time: '10:00 AM'
    }
  ];

  return (
    <DashboardLayout sidebar={<PatientSidebar />} title="Patient Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back, Praveen</h2>
            <p className="text-muted-foreground">Here's an overview of your healthcare journey</p>
          </div>
          <Link to="/patient/chat">
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Talk to Health Assistant
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Referrals"
            value={2}
            description="Currently in progress"
            icon={<FileText className="h-5 w-5" />}
          />
          <StatCard
            title="Upcoming Appointments"
            value={1}
            description="Next: Jan 28"
            icon={<Calendar className="h-5 w-5" />}
          />
          <StatCard
            title="Avg Wait Time"
            value="5 days"
            description="Faster than average"
            icon={<Clock className="h-5 w-5" />}
            trend={{ value: -23, label: 'vs last month' }}
          />
          <StatCard
            title="Care Score"
            value="92%"
            description="Excellent progress"
            icon={<CheckCircle className="h-5 w-5" />}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Active Referrals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Referrals</CardTitle>
                <CardDescription>Track your specialist referrals</CardDescription>
              </div>
              <Link to="/patient/referrals">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{referral.specialty}</p>
                      <p className="text-sm text-muted-foreground">{referral.doctor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={referral.status === 'in-progress' ? 'default' : 'secondary'}>
                      {referral.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">{referral.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled visits</CardDescription>
              </div>
              <Link to="/patient/appointments">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {appointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-chart-2/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-chart-2" />
                    </div>
                    <div>
                      <p className="font-medium">{apt.type}</p>
                      <p className="text-sm text-muted-foreground">{apt.doctor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{apt.date}</p>
                    <p className="text-sm text-muted-foreground">{apt.time}</p>
                  </div>
                </div>
              ))}
              {appointments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming appointments
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Health Assistant Promo */}
        <Card className="bg-gradient-to-r from-primary/5 via-chart-1/5 to-chart-2/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-semibold mb-1">AI Health Assistant</h3>
                <p className="text-muted-foreground mb-4">
                  Get personalized health guidance, symptom analysis, and insurance recommendations through our guided conversation.
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="outline">Symptom Checker</Badge>
                  <Badge variant="outline">Insurance Helper</Badge>
                  <Badge variant="outline">Care Recommendations</Badge>
                </div>
              </div>
              <Link to="/patient/chat">
                <Button size="lg" className="gap-2">
                  Start Conversation <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
