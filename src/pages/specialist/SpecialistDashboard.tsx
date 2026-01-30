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
  XCircle,
  TrendingUp,
  TrendingDown,
  User
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
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, Dr. Rodriguez</h1>
            <p className="text-gray-500 mt-1">Cardiology Specialist • You have 3 new referral requests</p>
          </div>
          <div className="flex gap-3">
            <Link to="/specialist/availability">
              <Button variant="outline" className="h-11 gap-2 border-gray-300">
                <Clock className="h-4 w-4" />
                Update Availability
              </Button>
            </Link>
            <Link to="/specialist/requests">
              <Button className="h-11 gap-2 bg-blue-600 hover:bg-blue-700">
                <FileInput className="h-4 w-4" />
                View Requests
                <Badge variant="destructive" className="ml-1">3</Badge>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid - Matching Reference Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pending Requests */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FileInput className="h-5 w-5 text-red-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">Pending Requests</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">3</div>
              <div className="h-1 w-16 bg-red-500 rounded-full mb-3"></div>
              <p className="text-sm text-gray-600">Awaiting your response</p>
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">Today's Appointments</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">5</div>
              <div className="h-1 w-16 bg-blue-500 rounded-full mb-3"></div>
              <p className="text-sm text-gray-600">2 completed, 3 remaining</p>
            </CardContent>
          </Card>

          {/* Avg Wait Time */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">Avg Wait Time</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <div className="text-4xl font-bold text-gray-900">4</div>
                <div className="text-xl font-semibold text-gray-600">days</div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-16 bg-green-500 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <span className="text-xs font-medium text-green-600">-15%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Better than peers</p>
            </CardContent>
          </Card>

          {/* Outcome Success */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-purple-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">Outcome Success</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">96%</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-16 bg-purple-500 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-purple-500" />
                  <span className="text-xs font-medium text-purple-600">+3%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Positive patient outcomes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Referral Requests */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Pending Referral Requests</CardTitle>
                  <CardDescription className="mt-1">New cases requiring your attention</CardDescription>
                </div>
                <Link to="/specialist/requests">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-gray-900">{request.patient}</p>
                        <Badge 
                          className={`text-xs font-medium ${
                            request.urgency === 'high' 
                              ? 'bg-red-100 text-red-700 hover:bg-red-100' 
                              : request.urgency === 'medium' 
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                          } border-0`}
                        >
                          {request.urgency.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{request.condition}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User className="h-3 w-3" />
                        <span>Referred by {request.referredBy}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{request.receivedDate}</span>
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <Button size="sm" variant="outline" className="flex-1 h-9 border-gray-300 text-gray-700 hover:bg-gray-50">
                      <XCircle className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                    <Button size="sm" className="flex-1 h-9 bg-blue-600 hover:bg-blue-700">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Today's Schedule</CardTitle>
                  <CardDescription className="mt-1">January 25, 2026</CardDescription>
                </div>
                <Link to="/specialist/treatment">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {todayAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[70px]">
                      <div className="text-base font-semibold text-gray-900">{apt.time}</div>
                    </div>
                    <div className="h-12 w-px bg-gray-200"></div>
                    <div>
                      <p className="font-semibold text-gray-900">{apt.patient}</p>
                      <p className="text-sm text-gray-600">{apt.type}</p>
                    </div>
                  </div>
                  <Badge 
                    className={`font-medium ${
                      apt.status === 'completed' 
                        ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                        : apt.status === 'in-progress' 
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                    } border-0`}
                  >
                    {apt.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {apt.status === 'in-progress' && <Clock className="h-3 w-3 mr-1" />}
                    {apt.status === 'upcoming' && <Calendar className="h-3 w-3 mr-1" />}
                    {apt.status.replace('-', ' ')}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-lg font-semibold">Weekly Performance</CardTitle>
            <CardDescription className="mt-1">Your metrics compared to department average</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="font-medium text-gray-700">Referrals Processed</span>
                  <span className="text-2xl font-bold text-gray-900">18<span className="text-base text-gray-500">/20</span></span>
                </div>
                <Progress value={90} className="h-2.5 bg-gray-100" />
                <p className="text-xs text-gray-500 mt-2">90% completion rate</p>
              </div>
              <div>
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="font-medium text-gray-700">Patient Satisfaction</span>
                  <span className="text-2xl font-bold text-gray-900">4.8<span className="text-base text-gray-500">/5.0</span></span>
                </div>
                <Progress value={96} className="h-2.5 bg-gray-100" />
                <p className="text-xs text-gray-500 mt-2">Exceeds department average</p>
              </div>
              <div>
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="font-medium text-gray-700">Outcome Reports Filed</span>
                  <span className="text-2xl font-bold text-gray-900">15<span className="text-base text-gray-500">/18</span></span>
                </div>
                <Progress value={83} className="h-2.5 bg-gray-100" />
                <p className="text-xs text-gray-500 mt-2">3 reports pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}