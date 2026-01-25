import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PCPSidebar } from '@/components/navigation/PCPSidebar';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  FileText,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Plus,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PCPDashboard() {
  const pendingReferrals = [
    {
      id: '1',
      patient: 'John Smith',
      urgency: 'high',
      specialty: 'Cardiology',
      aiScore: 87,
      submitted: '2 hours ago'
    },
    {
      id: '2',
      patient: 'Maria Garcia',
      urgency: 'medium',
      specialty: 'Orthopedics',
      aiScore: 72,
      submitted: '4 hours ago'
    },
    {
      id: '3',
      patient: 'Robert Wilson',
      urgency: 'low',
      specialty: 'Dermatology',
      aiScore: 45,
      submitted: '1 day ago'
    }
  ];

  const recentPatients = [
    { id: '1', name: 'Emily Chen', lastVisit: 'Today', status: 'Follow-up needed' },
    { id: '2', name: 'David Brown', lastVisit: 'Yesterday', status: 'Stable' },
    { id: '3', name: 'Lisa Johnson', lastVisit: '3 days ago', status: 'Referred' }
  ];

  return (
    <DashboardLayout sidebar={<PCPSidebar />} title="PCP Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome, Dr. Chen</h2>
            <p className="text-muted-foreground">Manage your patients and referrals efficiently</p>
          </div>
          <Link to="/pcp/patient-entry">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Patient Evaluation
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Patients"
            value={48}
            description="Under your care"
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Pending Referrals"
            value={7}
            description="Awaiting evaluation"
            icon={<FileText className="h-5 w-5" />}
          />
          <StatCard
            title="Avg Processing Time"
            value="1.2 days"
            description="30% faster than average"
            icon={<Clock className="h-5 w-5" />}
            trend={{ value: -30, label: 'improvement' }}
          />
          <StatCard
            title="Referral Accuracy"
            value="94%"
            description="AI-assisted decisions"
            icon={<TrendingUp className="h-5 w-5" />}
            trend={{ value: 8, label: 'vs manual' }}
          />
        </div>

        {/* AI Evaluation Summary */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">AI Triage Summary</h3>
                <p className="text-sm text-muted-foreground">Today's intelligent insights</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">High Priority</span>
                </div>
                <div className="text-2xl font-bold">2</div>
                <p className="text-sm text-muted-foreground">Require immediate attention</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-chart-4 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Referral Recommended</span>
                </div>
                <div className="text-2xl font-bold">5</div>
                <p className="text-sm text-muted-foreground">AI suggests specialist care</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-chart-2 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Primary Care OK</span>
                </div>
                <div className="text-2xl font-bold">12</div>
                <p className="text-sm text-muted-foreground">Can be managed in-house</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Referrals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pending Evaluations</CardTitle>
                <CardDescription>Cases awaiting your review</CardDescription>
              </div>
              <Link to="/pcp/evaluation">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingReferrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-4">
                    <div className={`h-2 w-2 rounded-full ${
                      referral.urgency === 'high' ? 'bg-destructive' :
                      referral.urgency === 'medium' ? 'bg-chart-4' : 'bg-chart-2'
                    }`} />
                    <div>
                      <p className="font-medium">{referral.patient}</p>
                      <p className="text-sm text-muted-foreground">{referral.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">AI Score:</span>
                        <Badge variant={referral.aiScore >= 70 ? 'default' : 'secondary'}>
                          {referral.aiScore}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{referral.submitted}</p>
                    </div>
                    <Button size="sm">Review</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>Latest patient interactions</CardDescription>
              </div>
              <Link to="/pcp/progress">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-medium">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">Last visit: {patient.lastVisit}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{patient.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
