import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PCPSidebar } from '@/components/navigation/PCPSidebar';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  FileText,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Plus,
  Brain,
  Timer
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
      <div className="space-y-8">
        {/* Welcome Section with Enhanced Layout */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Welcome, Dr. Chen
            </h1>
            <p className="text-lg text-gray-600">
              Manage your patients and referrals efficiently
            </p>
          </div>
          <Link to="/pcp/patient-entry">
            <Button 
              size="lg"
              className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
              New Patient Evaluation
            </Button>
          </Link>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Active Patients */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-cyan-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-cyan-100 rounded-xl">
                  <Users className="h-6 w-6 text-cyan-600" />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Active Patients</p>
                <p className="text-4xl font-bold text-gray-900">48</p>
                <p className="text-sm text-gray-500">Under your care</p>
              </div>
            </div>
          </div>

          {/* Pending Referrals */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Pending Referrals</p>
                <p className="text-4xl font-bold text-gray-900">7</p>
                <p className="text-sm text-gray-500">Awaiting evaluation</p>
              </div>
            </div>
          </div>

          {/* Avg Processing Time */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-emerald-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <Clock className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-gray-900">1.2 days</p>
                  <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    -30%
                  </span>
                </div>
                <p className="text-sm text-gray-500">30% faster than average</p>
              </div>
            </div>
          </div>

          {/* Referral Accuracy */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-purple-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Referral Accuracy</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-gray-900">94%</p>
                  <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                    +8%
                  </span>
                </div>
                <p className="text-sm text-gray-500">AI-assisted decisions</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Triage Summary - Enhanced Design */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-white rounded-3xl border-2 border-blue-100 shadow-sm">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-200/30 to-blue-300/30 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-200/30 to-cyan-300/30 rounded-full blur-3xl -ml-32 -mb-32" />
          
          <div className="relative p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">AI Triage Summary</h3>
                <p className="text-gray-600">Today's intelligent insights</p>
              </div>
            </div>
            
            {/* Triage Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* High Priority */}
              <div className="group bg-white rounded-2xl p-6 border-2 border-red-100 hover:border-red-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="font-semibold text-gray-900">High Priority</span>
                </div>
                <div className="mb-3">
                  <p className="text-5xl font-bold text-gray-900 mb-1">2</p>
                  <div className="h-1 w-16 bg-gradient-to-r from-red-500 to-red-300 rounded-full" />
                </div>
                <p className="text-sm text-gray-600">Require immediate attention</p>
              </div>

              {/* Referral Recommended */}
              <div className="group bg-white rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Timer className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="font-semibold text-gray-900">Referral Recommended</span>
                </div>
                <div className="mb-3">
                  <p className="text-5xl font-bold text-gray-900 mb-1">5</p>
                  <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full" />
                </div>
                <p className="text-sm text-gray-600">AI suggests specialist care</p>
              </div>

              {/* Primary Care OK */}
              <div className="group bg-white rounded-2xl p-6 border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="font-semibold text-gray-900">Primary Care OK</span>
                </div>
                <div className="mb-3">
                  <p className="text-5xl font-bold text-gray-900 mb-1">12</p>
                  <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-green-300 rounded-full" />
                </div>
                <p className="text-sm text-gray-600">Can be managed in-house</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Pending Evaluations & Recent Patients */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Evaluations */}
          <Card className="border-2 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Pending Evaluations</CardTitle>
                  <CardDescription className="mt-1">Cases awaiting your review</CardDescription>
                </div>
                <Link to="/pcp/evaluation">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {pendingReferrals.map((referral) => (
                <div 
                  key={referral.id} 
                  className="group flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-3 w-3 rounded-full shadow-md ${
                      referral.urgency === 'high' ? 'bg-red-500 animate-pulse' :
                      referral.urgency === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <p className="font-semibold text-gray-900">{referral.patient}</p>
                      <p className="text-sm text-gray-600">{referral.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">AI Score:</span>
                        <Badge 
                          variant={referral.aiScore >= 70 ? 'default' : 'secondary'}
                          className={`font-bold ${
                            referral.aiScore >= 70 
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {referral.aiScore}%
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{referral.submitted}</p>
                    </div>
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card className="border-2 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Recent Patients</CardTitle>
                  <CardDescription className="mt-1">Latest patient interactions</CardDescription>
                </div>
                <Link to="/pcp/progress">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {recentPatients.map((patient) => (
                <div 
                  key={patient.id} 
                  className="group flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-600">Last visit: {patient.lastVisit}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className="border-2 font-medium"
                  >
                    {patient.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}