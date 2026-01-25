import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminSidebar } from '@/components/navigation/AdminSidebar';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  FileText,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Shield,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const referralTrendData = [
  { month: 'Jul', total: 120, unnecessary: 45 },
  { month: 'Aug', total: 135, unnecessary: 40 },
  { month: 'Sep', total: 148, unnecessary: 35 },
  { month: 'Oct', total: 160, unnecessary: 28 },
  { month: 'Nov', total: 175, unnecessary: 22 },
  { month: 'Dec', total: 190, unnecessary: 18 },
  { month: 'Jan', total: 205, unnecessary: 15 }
];

const specialtyPerformance = [
  { specialty: 'Cardiology', efficiency: 94, waitTime: 3 },
  { specialty: 'Orthopedics', efficiency: 88, waitTime: 5 },
  { specialty: 'Dermatology', efficiency: 91, waitTime: 4 },
  { specialty: 'Neurology', efficiency: 86, waitTime: 6 },
  { specialty: 'Gastro', efficiency: 89, waitTime: 5 }
];

export default function AdminDashboard() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />} title="Admin Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">System Overview</h2>
            <p className="text-muted-foreground">Monitor platform performance and manage users</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/analytics">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Full Analytics
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button className="gap-2">
                <Users className="h-4 w-4" />
                Manage Users
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value="1,284"
            description="Active platform users"
            icon={<Users className="h-5 w-5" />}
            trend={{ value: 12, label: 'vs last month' }}
          />
          <StatCard
            title="Referrals This Month"
            value="205"
            description="15 flagged as unnecessary"
            icon={<FileText className="h-5 w-5" />}
          />
          <StatCard
            title="Avg Wait Time"
            value="4.2 days"
            description="40% reduction YoY"
            icon={<Clock className="h-5 w-5" />}
            trend={{ value: -40, label: 'improvement' }}
          />
          <StatCard
            title="AI Accuracy"
            value="94.5%"
            description="Referral necessity prediction"
            icon={<TrendingUp className="h-5 w-5" />}
            trend={{ value: 5, label: 'vs baseline' }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Referral Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Referral Trends</CardTitle>
              <CardDescription>Total vs unnecessary referrals over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={referralTrendData}>
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
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stackId="1"
                      stroke="hsl(var(--chart-1))" 
                      fill="hsl(var(--chart-1))" 
                      fillOpacity={0.3}
                      name="Total Referrals"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="unnecessary" 
                      stackId="2"
                      stroke="hsl(var(--destructive))" 
                      fill="hsl(var(--destructive))" 
                      fillOpacity={0.3}
                      name="Unnecessary"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Specialty Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Specialty Performance</CardTitle>
              <CardDescription>Efficiency scores by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={specialtyPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" domain={[0, 100]} className="text-xs" />
                    <YAxis dataKey="specialty" type="category" className="text-xs" width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="efficiency" 
                      fill="hsl(var(--chart-2))" 
                      radius={[0, 4, 4, 0]}
                      name="Efficiency %"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* System Health */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-chart-2" />
                <CardTitle>System Health</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Response Time</span>
                <Badge variant="outline" className="text-chart-2">42ms</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Model Status</span>
                <Badge variant="outline" className="text-chart-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Load</span>
                <Badge variant="outline">23%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Backup</span>
                <Badge variant="outline">2h ago</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Compliance */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Compliance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>HIPAA Compliance</span>
                  <span className="text-chart-2">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Audit Logs Coverage</span>
                  <span className="text-chart-2">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Data Encryption</span>
                  <span className="text-chart-2">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-chart-4" />
                <CardTitle>Recent Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-chart-4/10 border border-chart-4/20">
                <div className="flex items-center gap-2 text-sm font-medium text-chart-4">
                  <AlertCircle className="h-4 w-4" />
                  High wait time detected
                </div>
                <p className="text-xs text-muted-foreground mt-1">Neurology dept - 8 day avg</p>
              </div>
              <div className="p-3 rounded-lg bg-chart-2/10 border border-chart-2/20">
                <div className="flex items-center gap-2 text-sm font-medium text-chart-2">
                  <CheckCircle className="h-4 w-4" />
                  AI model updated
                </div>
                <p className="text-xs text-muted-foreground mt-1">v2.4.1 deployed successfully</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
