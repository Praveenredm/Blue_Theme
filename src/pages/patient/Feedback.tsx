import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientSidebar } from '@/components/navigation/PatientSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Star,
  MessageSquare,
  Send,
  CheckCircle,
  Clock,
  User,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Meh,
  Frown
} from 'lucide-react';

interface PendingFeedback {
  id: string;
  type: 'appointment' | 'referral' | 'overall';
  doctor: string;
  specialty: string;
  date: Date;
  description: string;
}

interface SubmittedFeedback {
  id: string;
  type: 'appointment' | 'referral' | 'overall';
  doctor: string;
  date: Date;
  rating: number;
  submittedAt: Date;
}

const mockPendingFeedback: PendingFeedback[] = [
  {
    id: '1',
    type: 'appointment',
    doctor: 'Dr. Robert Martinez',
    specialty: 'Neurology',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    description: 'Migraine management consultation'
  },
  {
    id: '2',
    type: 'referral',
    doctor: 'Dr. Emily Rodriguez',
    specialty: 'Cardiology',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    description: 'Cardiology referral process'
  }
];

const mockSubmittedFeedback: SubmittedFeedback[] = [
  {
    id: '3',
    type: 'appointment',
    doctor: 'Dr. Michael Chen',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    rating: 5,
    submittedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
  },
  {
    id: '4',
    type: 'overall',
    doctor: 'CareFlow Platform',
    date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    rating: 4,
    submittedAt: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000)
  }
];

interface FeedbackFormData {
  overallRating: number;
  waitTimeRating: 'satisfied' | 'neutral' | 'dissatisfied' | '';
  communicationRating: 'satisfied' | 'neutral' | 'dissatisfied' | '';
  wouldRecommend: 'yes' | 'maybe' | 'no' | '';
  comments: string;
}

export default function Feedback() {
  const { toast } = useToast();
  const [pendingList, setPendingList] = useState(mockPendingFeedback);
  const [submittedList, setSubmittedList] = useState(mockSubmittedFeedback);
  const [selectedFeedback, setSelectedFeedback] = useState<PendingFeedback | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [formData, setFormData] = useState<FeedbackFormData>({
    overallRating: 0,
    waitTimeRating: '',
    communicationRating: '',
    wouldRecommend: '',
    comments: ''
  });

  const openFeedbackForm = (feedback: PendingFeedback) => {
    setSelectedFeedback(feedback);
    setFormData({
      overallRating: 0,
      waitTimeRating: '',
      communicationRating: '',
      wouldRecommend: '',
      comments: ''
    });
    setShowFeedbackDialog(true);
  };

  const submitFeedback = () => {
    if (!selectedFeedback) return;

    if (formData.overallRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide an overall rating.",
        variant: "destructive"
      });
      return;
    }

    setPendingList(prev => prev.filter(f => f.id !== selectedFeedback.id));
    setSubmittedList(prev => [{
      id: selectedFeedback.id,
      type: selectedFeedback.type,
      doctor: selectedFeedback.doctor,
      date: selectedFeedback.date,
      rating: formData.overallRating,
      submittedAt: new Date()
    }, ...prev]);

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! It helps us improve care quality.",
    });

    setShowFeedbackDialog(false);
    setSelectedFeedback(null);
  };

  const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg p-1 transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              "h-10 w-10 transition-all duration-200",
              star <= value 
                ? "fill-amber-400 text-amber-400 drop-shadow-md" 
                : "text-gray-300 hover:text-amber-300"
            )}
          />
        </button>
      ))}
    </div>
  );

  const SatisfactionOption = ({ 
    value, 
    selected, 
    onSelect,
    icon: Icon,
    label 
  }: { 
    value: string; 
    selected: boolean; 
    onSelect: () => void;
    icon: React.ElementType;
    label: string;
  }) => (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200",
        selected 
          ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200" 
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      )}
    >
      <Icon className={cn(
        "h-7 w-7 transition-colors",
        selected ? "text-blue-600" : "text-gray-400"
      )} />
      <span className={cn(
        "text-sm font-medium",
        selected ? "text-gray-900" : "text-gray-600"
      )}>{label}</span>
    </button>
  );

  return (
    <DashboardLayout sidebar={<PatientSidebar />} title="Feedback">
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Feedback</h1>
          <p className="text-lg text-gray-600">Share your experience to help improve care quality</p>
        </div>

        {/* Enhanced Stats */}
        <div className="grid gap-6 sm:grid-cols-3">
          {/* Pending Reviews */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-orange-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900">{pendingList.length}</p>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              </div>
            </div>
          </div>

          {/* Submitted */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-green-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900">{submittedList.length}</p>
                <p className="text-sm font-medium text-gray-600">Submitted</p>
              </div>
            </div>
          </div>

          {/* Avg Rating */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-amber-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900">
                  {submittedList.length > 0 
                    ? (submittedList.reduce((acc, f) => acc + f.rating, 0) / submittedList.length).toFixed(1)
                    : '-'
                  }
                </p>
                <p className="text-sm font-medium text-gray-600">Avg Rating Given</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Pending Feedback */}
        <Card className="border-2 rounded-2xl shadow-sm">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-xl flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              Pending Feedback
            </CardTitle>
            <CardDescription className="mt-1">Share your experience from recent appointments</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {pendingList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <p className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</p>
                <p className="text-gray-600">You have no pending feedback requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingList.map(feedback => (
                  <div
                    key={feedback.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 gap-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-100 rounded-xl shadow-sm">
                        <User className="h-6 w-6 text-orange-700" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">{feedback.doctor}</h3>
                          <Badge className="bg-white border-2 border-orange-200 text-orange-700 font-medium">
                            {feedback.specialty}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 font-medium mb-1">{feedback.description}</p>
                        <p className="text-xs text-gray-600">
                          Visit date: {format(feedback.date, 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => openFeedbackForm(feedback)} 
                      className="sm:min-w-[160px] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Leave Feedback
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Submitted Feedback */}
        <Card className="border-2 rounded-2xl shadow-sm">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Submitted Feedback
            </CardTitle>
            <CardDescription className="mt-1">Your previous feedback submissions</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {submittedList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <MessageSquare className="h-10 w-10 text-gray-600" />
                </div>
                <p className="text-gray-600">No feedback submitted yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {submittedList.map(feedback => (
                  <div
                    key={feedback.id}
                    className="flex items-center justify-between p-5 rounded-xl border-2 border-gray-100 bg-gray-50/50 hover:bg-gray-100/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{feedback.doctor}</h3>
                        <p className="text-sm text-gray-600">
                          Submitted: {format(feedback.submittedAt, 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: feedback.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                      ))}
                      {Array.from({ length: 5 - feedback.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-gray-300" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Feedback Dialog */}
        <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Share Your Feedback</DialogTitle>
              <DialogDescription className="text-base">
                {selectedFeedback?.doctor} - {selectedFeedback?.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-8 py-4">
              {/* Overall Rating */}
              <div>
                <Label className="text-base font-bold text-gray-900 mb-4 block">Overall Experience *</Label>
                <div className="flex justify-center">
                  <StarRating 
                    value={formData.overallRating} 
                    onChange={(v) => setFormData(prev => ({ ...prev, overallRating: v }))} 
                  />
                </div>
                <p className="text-center text-sm font-semibold text-gray-700 mt-3">
                  {formData.overallRating === 0 && "Click to rate"}
                  {formData.overallRating === 1 && "😞 Poor"}
                  {formData.overallRating === 2 && "😐 Fair"}
                  {formData.overallRating === 3 && "🙂 Good"}
                  {formData.overallRating === 4 && "😊 Very Good"}
                  {formData.overallRating === 5 && "🌟 Excellent"}
                </p>
              </div>

              {/* Wait Time */}
              <div>
                <Label className="text-base font-bold text-gray-900 mb-4 block">Wait Time Satisfaction</Label>
                <div className="grid grid-cols-3 gap-4">
                  <SatisfactionOption
                    value="satisfied"
                    selected={formData.waitTimeRating === 'satisfied'}
                    onSelect={() => setFormData(prev => ({ ...prev, waitTimeRating: 'satisfied' }))}
                    icon={Smile}
                    label="Satisfied"
                  />
                  <SatisfactionOption
                    value="neutral"
                    selected={formData.waitTimeRating === 'neutral'}
                    onSelect={() => setFormData(prev => ({ ...prev, waitTimeRating: 'neutral' }))}
                    icon={Meh}
                    label="Neutral"
                  />
                  <SatisfactionOption
                    value="dissatisfied"
                    selected={formData.waitTimeRating === 'dissatisfied'}
                    onSelect={() => setFormData(prev => ({ ...prev, waitTimeRating: 'dissatisfied' }))}
                    icon={Frown}
                    label="Dissatisfied"
                  />
                </div>
              </div>

              {/* Communication */}
              <div>
                <Label className="text-base font-bold text-gray-900 mb-4 block">Communication Quality</Label>
                <div className="grid grid-cols-3 gap-4">
                  <SatisfactionOption
                    value="satisfied"
                    selected={formData.communicationRating === 'satisfied'}
                    onSelect={() => setFormData(prev => ({ ...prev, communicationRating: 'satisfied' }))}
                    icon={Smile}
                    label="Clear"
                  />
                  <SatisfactionOption
                    value="neutral"
                    selected={formData.communicationRating === 'neutral'}
                    onSelect={() => setFormData(prev => ({ ...prev, communicationRating: 'neutral' }))}
                    icon={Meh}
                    label="Average"
                  />
                  <SatisfactionOption
                    value="dissatisfied"
                    selected={formData.communicationRating === 'dissatisfied'}
                    onSelect={() => setFormData(prev => ({ ...prev, communicationRating: 'dissatisfied' }))}
                    icon={Frown}
                    label="Unclear"
                  />
                </div>
              </div>

              {/* Would Recommend */}
              <div>
                <Label className="text-base font-bold text-gray-900 mb-4 block">Would you recommend this provider?</Label>
                <RadioGroup
                  value={formData.wouldRecommend}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, wouldRecommend: v as FeedbackFormData['wouldRecommend'] }))}
                  className="flex gap-4"
                >
                  <Label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 hover:bg-gray-50 transition-colors flex-1">
                    <RadioGroupItem value="yes" />
                    <ThumbsUp className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Yes</span>
                  </Label>
                  <Label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 hover:bg-gray-50 transition-colors flex-1">
                    <RadioGroupItem value="maybe" />
                    <Meh className="h-5 w-5 text-amber-600" />
                    <span className="font-medium">Maybe</span>
                  </Label>
                  <Label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 hover:bg-gray-50 transition-colors flex-1">
                    <RadioGroupItem value="no" />
                    <ThumbsDown className="h-5 w-5 text-red-600" />
                    <span className="font-medium">No</span>
                  </Label>
                </RadioGroup>
              </div>

              {/* Comments */}
              <div>
                <Label className="text-base font-bold text-gray-900 mb-3 block">Additional Comments</Label>
                <Textarea
                  value={formData.comments}
                  onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                  placeholder="Share any additional thoughts about your experience..."
                  className="min-h-[100px] resize-none border-2 rounded-xl"
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowFeedbackDialog(false)}
                className="border-2"
              >
                Cancel
              </Button>
              <Button 
                onClick={submitFeedback}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}