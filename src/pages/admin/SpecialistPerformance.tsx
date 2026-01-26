import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminSidebar } from '@/components/navigation/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import {
  Search,
  Filter,
  Download,
  Star,
  Clock,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  patientsServed: number;
  avgWaitTime: number;
  successRate: number;
  patientSatisfaction: number;
  referralsAccepted: number;
  referralsDeclined: number;
  avgTreatmentTime: number;
  outcomeScore: number;
}

const specialists: Specialist[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    patientsServed: 248,
    avgWaitTime: 3.2,
    successRate: 94.5,
    patientSatisfaction: 4.8,
    referralsAccepted: 245,
    referralsDeclined: 12,
    avgTreatmentTime: 45,
    outcomeScore: 92
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Orthopedics',
    patientsServed: 312,
    avgWaitTime: 4.5,
    successRate: 91.2,
    patientSatisfaction: 4.6,
    referralsAccepted: 305,
    referralsDeclined: 18,
    avgTreatmentTime: 60,
    outcomeScore: 88
  },
  {
    id: '3',
    name: 'Dr. Emily Davis',
    specialty: 'Dermatology',
    patientsServed: 425,
    avgWaitTime: 2.8,
    successRate: 96.8,
    patientSatisfaction: 4.9,
    referralsAccepted: 420,
    referralsDeclined: 8,
    avgTreatmentTime: 30,
    outcomeScore: 95
  },
  {
    id: '4',
    name: 'Dr. James Park',
    specialty: 'Neurology',
    patientsServed: 186,
    avgWaitTime: 5.8,
    successRate: 89.5,
    patientSatisfaction: 4.5,
    referralsAccepted: 180,
    referralsDeclined: 15,
    avgTreatmentTime: 55,
    outcomeScore: 85
  },
  {
    id: '5',
    name: 'Dr. Lisa Wong',
    specialty: 'Gastroenterology',
    patientsServed: 278,
    avgWaitTime: 4.1,
    successRate: 92.3,
    patientSatisfaction: 4.7,
    referralsAccepted: 272,
    referralsDeclined: 14,
    avgTreatmentTime: 50,
    outcomeScore: 90
  },
  {
    id: '6',
    name: 'Dr. Robert Martinez',
    specialty: 'Endocrinology',
    patientsServed: 198,
    avgWaitTime: 3.8,
    successRate: 93.1,
    patientSatisfaction: 4.6,
    referralsAccepted: 195,
    referralsDeclined: 10,
    avgTreatmentTime: 40,
    outcomeScore: 91
  }
];

const waitTimeBySpecialty = [
  { specialty: 'Dermatology', waitTime: 2.8, target: 3 },
  { specialty: 'Cardiology', waitTime: 3.2, target: 3 },
  { specialty: 'Endocrinology', waitTime: 3.8, target: 4 },
  { specialty: 'Gastro', waitTime: 4.1, target: 4 },
  { specialty: 'Orthopedics', waitTime: 4.5, target: 4 },
  { specialty: 'Neurology', waitTime: 5.8, target: 5 }
];

const monthlyPerformance = [
  { month: 'Jul', satisfaction: 4.4, outcomes: 86, waitTime: 5.2 },
  { month: 'Aug', satisfaction: 4.5, outcomes: 87, waitTime: 4.8 },
  { month: 'Sep', satisfaction: 4.5, outcomes: 88, waitTime: 4.5 },
  { month: 'Oct', satisfaction: 4.6, outcomes: 89, waitTime: 4.2 },
  { month: 'Nov', satisfaction: 4.7, outcomes: 91, waitTime: 3.8 },
  { month: 'Dec', satisfaction: 4.7, outcomes: 92, waitTime: 3.5 }
];

const topPerformerRadar = [
  { metric: 'Success Rate', value: 96.8 },
  { metric: 'Satisfaction', value: 98 },
  { metric: 'Wait Time', value: 93 },
  { metric: 'Outcomes', value: 95 },
  { metric: 'Volume', value: 85 },
  { metric: 'Response', value: 92 }
];

export default function SpecialistPerformance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('successRate');

  const filteredSpecialists = specialists.filter(spec => {
    const matchesSearch = spec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spec.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'all' || spec.specialty.toLowerCase() === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'successRate': return b.successRate - a.successRate;
      case 'satisfaction': return b.patientSatisfaction - a.patientSatisfaction;
      case 'waitTime': return a.avgWaitTime - b.avgWaitTime;
      case 'patients': return b.patientsServed - a.patientsServed;
      default: return 0;
    }
  });

  const avgSatisfaction = (specialists.reduce((acc, s) => acc + s.patientSatisfaction, 0) / specialists.length).toFixed(1);
  const avgSuccessRate = (specialists.reduce((acc, s) => acc + s.successRate, 0) / specialists.length).toFixed(1);
  const avgWaitTime = (specialists.reduce((acc, s) => acc + s.avgWaitTime, 0) / specialists.length).toFixed(1);
  const totalPatients = specialists.reduce((acc, s) => acc + s.patientsServed, 0);

  return (
    <DashboardLayout sidebar={<AdminSidebar />} title="Specialist Performance">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Specialist Performance</h2>
            <p className="text-muted-foreground">Monitor and analyze specialist metrics</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-chart-2/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Satisfaction</p>
                  <p className="text-2xl font-bold">{avgSatisfaction}/5.0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Success Rate</p>
                  <p className="text-2xl font-bold">{avgSuccessRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-chart-4/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                  <p className="text-2xl font-bold">{avgWaitTime} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-chart-1/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-chart-1" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold">{totalPatients.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Wait Time by Specialty */}
          <Card>
            <CardHeader>
              <CardTitle>Wait Time by Specialty</CardTitle>
              <CardDescription>Average days until appointment vs target</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waitTimeBySpecialty} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="specialty" type="category" className="text-xs" width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="waitTime" fill="hsl(var(--chart-1))" name="Actual (days)" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="target" fill="hsl(var(--muted))" name="Target (days)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Key metrics over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="outcomes"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      name="Outcome Score"
                    />
                    <Line
                      type="monotone"
                      dataKey="satisfaction"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      name="Satisfaction (x20)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performer & Radar */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-chart-4" />
                <CardTitle>Top Performer</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <Avatar className="h-20 w-20 mx-auto mb-3">
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">ED</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">Dr. Emily Davis</h3>
                <p className="text-muted-foreground">Dermatology</p>
                <div className="flex justify-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="h-4 w-4 fill-chart-4 text-chart-4" />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-medium">96.8%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Patients Served</span>
                  <span className="font-medium">425</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Wait Time</span>
                  <span className="font-medium">2.8 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Satisfaction</span>
                  <span className="font-medium">4.9/5.0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Performer Metrics</CardTitle>
              <CardDescription>Comprehensive performance radar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={topPerformerRadar}>
                    <PolarGrid className="stroke-border" />
                    <PolarAngleAxis dataKey="metric" className="text-xs" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs" />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Specialist List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>All Specialists</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search specialists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-[200px]"
                  />
                </div>
                <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="gastroenterology">Gastroenterology</SelectItem>
                    <SelectItem value="endocrinology">Endocrinology</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="successRate">Success Rate</SelectItem>
                    <SelectItem value="satisfaction">Satisfaction</SelectItem>
                    <SelectItem value="waitTime">Wait Time</SelectItem>
                    <SelectItem value="patients">Patients</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSpecialists.map((specialist, index) => (
                <div
                  key={specialist.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-sm font-medium">
                      {index + 1}
                    </div>
                    <Avatar>
                      <AvatarFallback>{specialist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{specialist.name}</h4>
                      <p className="text-sm text-muted-foreground">{specialist.specialty}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                      <div className="flex items-center gap-2">
                        <Progress value={specialist.successRate} className="h-2 w-16" />
                        <span className="text-sm font-medium">{specialist.successRate}%</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Satisfaction</p>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 fill-chart-4 text-chart-4" />
                        <span className="text-sm font-medium">{specialist.patientSatisfaction}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Wait Time</p>
                      <Badge variant={specialist.avgWaitTime <= 4 ? 'secondary' : 'outline'}>
                        {specialist.avgWaitTime} days
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Patients</p>
                      <span className="text-sm font-medium">{specialist.patientsServed}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {specialist.successRate >= 95 && (
                      <Badge className="gap-1 bg-chart-2/10 text-chart-2 hover:bg-chart-2/20">
                        <CheckCircle className="h-3 w-3" />
                        Top Performer
                      </Badge>
                    )}
                    {specialist.avgWaitTime > 5 && (
                      <Badge variant="outline" className="gap-1 text-chart-4">
                        <AlertCircle className="h-3 w-3" />
                        High Wait
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
