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

    // Remove from pending and add to submitted
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
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
        >
          <Star
            className={cn(
              "h-8 w-8 transition-colors",
              star <= value 
                ? "fill-amber-400 text-amber-400" 
                : "text-muted-foreground hover:text-amber-300"
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
        "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all",
        selected 
          ? "border-primary bg-primary/5" 
          : "border-border hover:border-muted-foreground"
      )}
    >
      <Icon className={cn(
        "h-6 w-6",
        selected ? "text-primary" : "text-muted-foreground"
      )} />
      <span className={cn(
        "text-sm",
        selected ? "font-medium" : "text-muted-foreground"
      )}>{label}</span>
    </button>
  );

  return (
    <DashboardLayout sidebar={<PatientSidebar />} title="Feedback">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Feedback</h2>
          <p className="text-muted-foreground">Share your experience to help improve care quality</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingList.length}</p>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{submittedList.length}</p>
                <p className="text-sm text-muted-foreground">Submitted</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {submittedList.length > 0 
                    ? (submittedList.reduce((acc, f) => acc + f.rating, 0) / submittedList.length).toFixed(1)
                    : '-'
                  }
                </p>
                <p className="text-sm text-muted-foreground">Avg Rating Given</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Pending Feedback
            </CardTitle>
            <CardDescription>Share your experience from recent appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-600 mb-4" />
                <p className="text-lg font-medium">All Caught Up!</p>
                <p className="text-muted-foreground">You have no pending feedback requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingList.map(feedback => (
                  <div
                    key={feedback.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-900/10 gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <User className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{feedback.doctor}</h3>
                          <Badge variant="outline">{feedback.specialty}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{feedback.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Visit date: {format(feedback.date, 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => openFeedbackForm(feedback)} className="sm:min-w-[140px]">
                      <Star className="h-4 w-4 mr-2" />
                      Leave Feedback
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submitted Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Submitted Feedback
            </CardTitle>
            <CardDescription>Your previous feedback submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {submittedList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No feedback submitted yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {submittedList.map(feedback => (
                  <div
                    key={feedback.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center gap-4">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <div>
                        <h3 className="font-medium">{feedback.doctor}</h3>
                        <p className="text-sm text-muted-foreground">
                          Submitted: {format(feedback.submittedAt, 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: feedback.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                      {Array.from({ length: 5 - feedback.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-muted-foreground" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback Dialog */}
        <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Share Your Feedback</DialogTitle>
              <DialogDescription>
                {selectedFeedback?.doctor} - {selectedFeedback?.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Overall Rating */}
              <div>
                <Label className="text-sm font-medium">Overall Experience *</Label>
                <div className="flex justify-center mt-3">
                  <StarRating 
                    value={formData.overallRating} 
                    onChange={(v) => setFormData(prev => ({ ...prev, overallRating: v }))} 
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {formData.overallRating === 0 && "Click to rate"}
                  {formData.overallRating === 1 && "Poor"}
                  {formData.overallRating === 2 && "Fair"}
                  {formData.overallRating === 3 && "Good"}
                  {formData.overallRating === 4 && "Very Good"}
                  {formData.overallRating === 5 && "Excellent"}
                </p>
              </div>

              {/* Wait Time */}
              <div>
                <Label className="text-sm font-medium">Wait Time Satisfaction</Label>
                <div className="grid grid-cols-3 gap-3 mt-3">
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
                <Label className="text-sm font-medium">Communication Quality</Label>
                <div className="grid grid-cols-3 gap-3 mt-3">
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
                <Label className="text-sm font-medium">Would you recommend this provider?</Label>
                <RadioGroup
                  value={formData.wouldRecommend}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, wouldRecommend: v as FeedbackFormData['wouldRecommend'] }))}
                  className="flex gap-4 mt-3"
                >
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="yes" />
                    <ThumbsUp className="h-4 w-4 text-emerald-600" />
                    Yes
                  </Label>
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="maybe" />
                    <Meh className="h-4 w-4 text-amber-600" />
                    Maybe
                  </Label>
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="no" />
                    <ThumbsDown className="h-4 w-4 text-destructive" />
                    No
                  </Label>
                </RadioGroup>
              </div>

              {/* Comments */}
              <div>
                <Label className="text-sm font-medium">Additional Comments</Label>
                <Textarea
                  value={formData.comments}
                  onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                  placeholder="Share any additional thoughts about your experience..."
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>Cancel</Button>
              <Button onClick={submitFeedback}>
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
