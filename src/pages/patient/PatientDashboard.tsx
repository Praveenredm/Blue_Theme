import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientSidebar } from '@/components/navigation/PatientSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle,
  ArrowRight,
  FileText,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
  return (
    <DashboardLayout title="Patient Dashboard" sidebar={<PatientSidebar />}>
      <div className="space-y-8">

        {/* Welcome Section - Enhanced */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Welcome back, Praveen
            </h1>
            <p className="text-lg text-gray-600">
              Here's a simple overview of your care journey
            </p>
          </div>
          <Link to="/patient/chat">
            <Button 
              size="lg"
              className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <MessageSquare className="h-5 w-5" />
              Talk to Health Assistant
            </Button>
          </Link>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Active Referrals Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                  In Progress
                </Badge>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Active Referrals</p>
                <p className="text-4xl font-bold text-gray-900">3 Referrals</p>
                <p className="text-sm text-gray-500">Specialist care in progress</p>
              </div>
            </div>
          </div>

          {/* Upcoming Appointment Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-green-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Upcoming Appointment</p>
                <p className="text-3xl font-bold text-gray-900">Jan 28, 2026</p>
                <p className="text-sm text-gray-600 font-medium">10:00 AM · Dr. Mukunthan</p>
                <p className="text-xs text-gray-500">Your next visit</p>
              </div>
            </div>
          </div>

          {/* Average Wait Time Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-orange-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Average Wait Time</p>
                <p className="text-4xl font-bold text-gray-900">~5 Days</p>
                <p className="text-sm text-green-600 font-semibold">Faster than usual</p>
                <p className="text-xs text-gray-500">Estimated specialist access</p>
              </div>
            </div>
          </div>

          {/* Care Score Card */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-purple-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Care Score</p>
                <p className="text-4xl font-bold text-gray-900">Excellent</p>
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold">
                  92% Score
                </Badge>
                <p className="text-xs text-gray-500 mt-1">Overall care quality</p>
              </div>
            </div>
          </div>

        </div>

        {/* CTA Banner - Enhanced */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100 hover:border-blue-200 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Need more details?</h3>
              <p className="text-sm text-gray-600">
                View your referrals, appointments and care plans
              </p>
            </div>
            <Link to="/patient/referrals">
              <Button variant="ghost" className="gap-1 hover:bg-white">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Details Section - Enhanced */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Active Referrals List - Enhanced */}
          <Card className="border-2 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Active Referrals</CardTitle>
                  <CardDescription className="mt-1">Track your specialist referrals</CardDescription>
                </div>
                <Link to="/patient/referrals">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              
              {/* Referral Item 1 - Cardiology */}
              <div className="group flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Cardiology</p>
                    <p className="text-sm text-gray-600">Dr. Balaji Kumar</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="mb-1 bg-blue-500 text-white hover:bg-blue-600">
                    in-progress
                  </Badge>
                  <p className="text-xs text-gray-500">Jan 15, 2026</p>
                </div>
              </div>

              {/* Referral Item 2 - Dermatology */}
              <div className="group flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Dermatology</p>
                    <p className="text-sm text-gray-600">Pending Assignment</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1 bg-gray-200 text-gray-700 border-2">
                    pending
                  </Badge>
                  <p className="text-xs text-gray-500">Jan 20, 2026</p>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Upcoming Appointments - Enhanced */}
          <Card className="border-2 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
                  <CardDescription className="mt-1">Your scheduled visits</CardDescription>
                </div>
                <Link to="/patient/appointments">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              
              {/* Appointment Item */}
              <div className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-100 hover:border-green-200 transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500 rounded-xl shadow-md">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Follow-up</p>
                    <p className="text-sm text-gray-600">Dr. Mukunthan</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">Jan 28, 2026</p>
                  <p className="text-sm text-gray-600">10:00 AM</p>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* AI Health Assistant - Enhanced */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 rounded-3xl border-2 border-purple-100 shadow-sm">
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-blue-300/30 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-200/30 to-cyan-300/30 rounded-full blur-3xl -ml-32 -mb-32" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-6 p-8">
            
            {/* Icon */}
            <div className="p-5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg">
              <MessageSquare className="h-10 w-10 text-white" />
            </div>
            
            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <h3 className="text-2xl font-bold text-gray-900">AI Health Assistant</h3>
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-gray-600 mb-4 max-w-2xl">
                Get personalized health guidance, symptom analysis, and insurance
                recommendations through our guided conversation.
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="outline" className="border-2 border-purple-200 bg-white text-purple-700 font-medium">
                  Symptom Checker
                </Badge>
                <Badge variant="outline" className="border-2 border-blue-200 bg-white text-blue-700 font-medium">
                  Insurance Helper
                </Badge>
                <Badge variant="outline" className="border-2 border-green-200 bg-white text-green-700 font-medium">
                  Care Guidance
                </Badge>
              </div>
            </div>
            
            {/* CTA Button */}
            <Link to="/patient/chat">
              <Button 
                size="lg"
                className="gap-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Conversation <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}