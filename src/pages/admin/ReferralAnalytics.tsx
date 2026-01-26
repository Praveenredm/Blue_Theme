import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminSidebar } from '@/components/navigation/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Calendar,
  Filter
} from 'lucide-react';

// Mock data for referral trends
const referralTrendData = [
  { month: 'Jan', total: 145, approved: 128, declined: 17, unnecessary: 12 },
  { month: 'Feb', total: 158, approved: 142, declined: 16, unnecessary: 10 },
  { month: 'Mar', total: 172, approved: 155, declined: 17, unnecessary: 14 },
  { month: 'Apr', total: 165, approved: 150, declined: 15, unnecessary: 11 },
  { month: 'May', total: 189, approved: 174, declined: 15, unnecessary: 9 },
  { month: 'Jun', total: 198, approved: 185, declined: 13, unnecessary: 8 },
  { month: 'Jul', total: 210, approved: 198, declined: 12, unnecessary: 7 },
  { month: 'Aug', total: 225, approved: 213, declined: 12, unnecessary: 6 },
  { month: 'Sep', total: 238, approved: 226, declined: 12, unnecessary: 5 },
  { month: 'Oct', total: 245, approved: 234, declined: 11, unnecessary: 5 },
  { month: 'Nov', total: 258, approved: 248, declined: 10, unnecessary: 4 },
  { month: 'Dec', total: 275, approved: 266, declined: 9, unnecessary: 3 }
];

const referralBySpecialty = [
  { specialty: 'Cardiology', count: 485, percentage: 24 },
  { specialty: 'Orthopedics', count: 342, percentage: 17 },
  { specialty: 'Dermatology', count: 298, percentage: 15 },
  { specialty: 'Neurology', count: 256, percentage: 13 },
  { specialty: 'Gastroenterology', count: 224, percentage: 11 },
  { specialty: 'Endocrinology', count: 198, percentage: 10 },
  { specialty: 'Other', count: 205, percentage: 10 }
];

const urgencyDistribution = [
  { name: 'Critical', value: 8, color: 'hsl(var(--destructive))' },
  { name: 'High', value: 22, color: 'hsl(var(--chart-4))' },
  { name: 'Medium', value: 45, color: 'hsl(var(--chart-3))' },
  { name: 'Low', value: 25, color: 'hsl(var(--chart-2))' }
];

const weeklyReferrals = [
  { day: 'Mon', referrals: 42 },
  { day: 'Tue', referrals: 38 },
  { day: 'Wed', referrals: 45 },
  { day: 'Thu', referrals: 48 },
  { day: 'Fri', referrals: 52 },
  { day: 'Sat', referrals: 15 },
  { day: 'Sun', referrals: 8 }
];

const aiAccuracyTrend = [
  { month: 'Jul', accuracy: 89.2, falsePositive: 5.8, falseNegative: 5.0 },
  { month: 'Aug', accuracy: 90.5, falsePositive: 5.2, falseNegative: 4.3 },
  { month: 'Sep', accuracy: 91.8, falsePositive: 4.5, falseNegative: 3.7 },
  { month: 'Oct', accuracy: 92.4, falsePositive: 4.1, falseNegative: 3.5 },
  { month: 'Nov', accuracy: 93.6, falsePositive: 3.5, falseNegative: 2.9 },
  { month: 'Dec', accuracy: 94.5, falsePositive: 3.0, falseNegative: 2.5 }
];

export default function ReferralAnalytics() {
  const [timeRange, setTimeRange] = useState('12m');
  const [specialty, setSpecialty] = useState('all');

  const totalReferrals = referralTrendData.reduce((acc, curr) => acc + curr.total, 0);
  const approvedReferrals = referralTrendData.reduce((acc, curr) => acc + curr.approved, 0);
  const declinedReferrals = referralTrendData.reduce((acc, curr) => acc + curr.declined, 0);
  const unnecessaryReferrals = referralTrendData.reduce((acc, curr) => acc + curr.unnecessary, 0);
  const approvalRate = ((approvedReferrals / totalReferrals) * 100).toFixed(1);

  return (
    <DashboardLayout sidebar={<AdminSidebar />} title="Referral Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Referral Analytics</h2>
            <p className="text-muted-foreground">Comprehensive referral data and trends analysis</p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="3m">Last 3 months</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
                  <p className="text-2xl font-bold">{totalReferrals.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-xs text-chart-2 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>+18.5% vs last year</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approval Rate</p>
                  <p className="text-2xl font-bold">{approvalRate}%</p>
                  <div className="flex items-center gap-1 text-xs text-chart-2 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>+2.3% improvement</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-chart-2/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-chart-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Declined</p>
                  <p className="text-2xl font-bold">{declinedReferrals}</p>
                  <div className="flex items-center gap-1 text-xs text-chart-2 mt-1">
                    <TrendingDown className="h-3 w-3" />
                    <span>-35% reduction</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unnecessary</p>
                  <p className="text-2xl font-bold">{unnecessaryReferrals}</p>
                  <div className="flex items-center gap-1 text-xs text-chart-2 mt-1">
                    <TrendingDown className="h-3 w-3" />
                    <span>-75% reduction</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-chart-4/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-chart-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList>
            <TabsTrigger value="trends">Referral Trends</TabsTrigger>
            <TabsTrigger value="specialty">By Specialty</TabsTrigger>
            <TabsTrigger value="ai">AI Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Trend Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Referral Volume Over Time</CardTitle>
                  <CardDescription>Total, approved, and declined referrals by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={referralTrendData}>
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
                        <Area
                          type="monotone"
                          dataKey="total"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.1}
                          stroke="hsl(var(--primary))"
                          name="Total"
                        />
                        <Line
                          type="monotone"
                          dataKey="approved"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          name="Approved"
                        />
                        <Line
                          type="monotone"
                          dataKey="declined"
                          stroke="hsl(var(--destructive))"
                          strokeWidth={2}
                          name="Declined"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Urgency Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Urgency Distribution</CardTitle>
                  <CardDescription>Referrals by urgency level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={urgencyDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {urgencyDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Pattern & Unnecessary Trend */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Pattern</CardTitle>
                  <CardDescription>Referral distribution by day of week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyReferrals}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="day" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar
                          dataKey="referrals"
                          fill="hsl(var(--chart-1))"
                          radius={[4, 4, 0, 0]}
                          name="Referrals"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Unnecessary Referral Reduction</CardTitle>
                  <CardDescription>AI-flagged unnecessary referrals over time</CardDescription>
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
                          dataKey="unnecessary"
                          stroke="hsl(var(--chart-4))"
                          fill="hsl(var(--chart-4))"
                          fillOpacity={0.3}
                          name="Unnecessary Referrals"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="specialty" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Referrals by Specialty</CardTitle>
                    <CardDescription>Distribution of referrals across medical specialties</CardDescription>
                  </div>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="All Specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="dermatology">Dermatology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={referralBySpecialty} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="specialty" type="category" className="text-xs" width={120} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="hsl(var(--chart-1))"
                        radius={[0, 4, 4, 0]}
                        name="Referrals"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Specialty Stats Table */}
            <Card>
              <CardHeader>
                <CardTitle>Specialty Performance</CardTitle>
                <CardDescription>Key metrics by medical specialty</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Specialty</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Referrals</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">% of Total</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg Wait</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Success Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referralBySpecialty.map((item) => (
                        <tr key={item.specialty} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{item.specialty}</td>
                          <td className="text-right py-3 px-4">{item.count}</td>
                          <td className="text-right py-3 px-4">{item.percentage}%</td>
                          <td className="text-right py-3 px-4">{Math.floor(Math.random() * 5) + 2} days</td>
                          <td className="text-right py-3 px-4">
                            <Badge variant="secondary">{(85 + Math.random() * 10).toFixed(1)}%</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Model Performance</CardTitle>
                <CardDescription>Accuracy and error rates over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={aiAccuracyTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" domain={[0, 100]} />
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
                        dataKey="accuracy"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={3}
                        name="Accuracy %"
                      />
                      <Line
                        type="monotone"
                        dataKey="falsePositive"
                        stroke="hsl(var(--chart-4))"
                        strokeWidth={2}
                        name="False Positive %"
                      />
                      <Line
                        type="monotone"
                        dataKey="falseNegative"
                        stroke="hsl(var(--destructive))"
                        strokeWidth={2}
                        name="False Negative %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-chart-2">94.5%</p>
                    <p className="text-sm text-muted-foreground mt-1">Current Accuracy</p>
                    <Badge variant="outline" className="mt-2 text-chart-2">+5.3% improvement</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-chart-4">3.0%</p>
                    <p className="text-sm text-muted-foreground mt-1">False Positive Rate</p>
                    <Badge variant="outline" className="mt-2 text-chart-2">-2.8% reduction</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-destructive">2.5%</p>
                    <p className="text-sm text-muted-foreground mt-1">False Negative Rate</p>
                    <Badge variant="outline" className="mt-2 text-chart-2">-2.5% reduction</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
