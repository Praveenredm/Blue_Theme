import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SpecialistSidebar } from '@/components/navigation/SpecialistSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Send,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  ClipboardCheck,
  MessageSquare
} from 'lucide-react';

interface CompletedCase {
  id: string;
  patientName: string;
  patientAge: number;
  condition: string;
  treatmentDate: Date;
  referredBy: string;
  treatmentProvided: string;
  outcomeSubmitted: boolean;
}

interface OutcomeData {
  clinicalOutcome: 'improved' | 'stable' | 'worsened' | 'resolved';
  patientSatisfaction: number;
  treatmentEffectiveness: number;
  complications: 'none' | 'minor' | 'moderate' | 'major';
  complicationDetails?: string;
  followUpRecommendation: string;
  feedbackToPCP: string;
  additionalNotes: string;
  referralAppropriate: 'yes' | 'partially' | 'no';
  referralFeedback?: string;
}

const mockCases: CompletedCase[] = [
  {
    id: '1',
    patientName: 'Emily Chen',
    patientAge: 45,
    condition: 'Atrial fibrillation',
    treatmentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    referredBy: 'Dr. Michael Chen',
    treatmentProvided: 'Cardioversion evaluation, anticoagulation therapy initiated',
    outcomeSubmitted: false
  },
  {
    id: '2',
    patientName: 'James Wilson',
    patientAge: 58,
    condition: 'Coronary artery disease',
    treatmentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    referredBy: 'Dr. Lisa Wong',
    treatmentProvided: 'Angioplasty with stent placement',
    outcomeSubmitted: false
  },
  {
    id: '3',
    patientName: 'Maria Garcia',
    patientAge: 34,
    condition: 'Palpitations with anxiety',
    treatmentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    referredBy: 'Dr. James Park',
    treatmentProvided: 'Holter monitoring, reassurance after normal results',
    outcomeSubmitted: true
  },
  {
    id: '4',
    patientName: 'Robert Johnson',
    patientAge: 67,
    condition: 'Heart failure exacerbation',
    treatmentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    referredBy: 'Dr. Emily Davis',
    treatmentProvided: 'Medication optimization, diuretic adjustment',
    outcomeSubmitted: true
  }
];

export default function OutcomeSubmission() {
  const { toast } = useToast();
  const [cases, setCases] = useState<CompletedCase[]>(mockCases);
  const [selectedCase, setSelectedCase] = useState<CompletedCase | null>(null);
  const [showOutcomeDialog, setShowOutcomeDialog] = useState(false);
  const [outcomeData, setOutcomeData] = useState<OutcomeData>({
    clinicalOutcome: 'improved',
    patientSatisfaction: 4,
    treatmentEffectiveness: 4,
    complications: 'none',
    followUpRecommendation: '',
    feedbackToPCP: '',
    additionalNotes: '',
    referralAppropriate: 'yes'
  });

  const pendingCases = cases.filter(c => !c.outcomeSubmitted);
  const submittedCases = cases.filter(c => c.outcomeSubmitted);

  const openOutcomeDialog = (caseItem: CompletedCase) => {
    setSelectedCase(caseItem);
    setOutcomeData({
      clinicalOutcome: 'improved',
      patientSatisfaction: 4,
      treatmentEffectiveness: 4,
      complications: 'none',
      followUpRecommendation: '',
      feedbackToPCP: '',
      additionalNotes: '',
      referralAppropriate: 'yes'
    });
    setShowOutcomeDialog(true);
  };

  const submitOutcome = () => {
    if (!selectedCase) return;

    if (!outcomeData.followUpRecommendation) {
      toast({
        title: "Missing Information",
        description: "Please provide follow-up recommendations.",
        variant: "destructive"
      });
      return;
    }

    setCases(prev => prev.map(c => 
      c.id === selectedCase.id ? { ...c, outcomeSubmitted: true } : c
    ));

    toast({
      title: "Outcome Submitted",
      description: `Treatment outcome for ${selectedCase.patientName} has been recorded and shared with the referring physician.`,
    });

    setShowOutcomeDialog(false);
    setSelectedCase(null);
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'improved':
      case 'resolved':
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-amber-600" />;
      case 'worsened':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout sidebar={<SpecialistSidebar />} title="Outcome Submission">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Outcome Submission</h2>
            <p className="text-muted-foreground">Submit treatment outcomes and provide feedback to referring physicians</p>
          </div>
          <div className="flex gap-4">
            <Badge variant="outline" className="text-lg py-2 px-4">
              <AlertCircle className="h-4 w-4 mr-2 text-amber-600" />
              {pendingCases.length} Pending
            </Badge>
            <Badge variant="secondary" className="text-lg py-2 px-4">
              <CheckCircle className="h-4 w-4 mr-2" />
              {submittedCases.length} Submitted
            </Badge>
          </div>
        </div>

        {/* Pending Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              Pending Outcome Reports
            </CardTitle>
            <CardDescription>Cases requiring outcome documentation</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingCases.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-600 mb-4" />
                <p className="text-lg font-medium">All Outcomes Submitted</p>
                <p className="text-muted-foreground">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-lg border border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-900/10 gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <User className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{caseItem.patientName}</h3>
                          <span className="text-sm text-muted-foreground">
                            {caseItem.patientAge} y/o
                          </span>
                        </div>
                        <p className="text-sm font-medium text-primary">{caseItem.condition}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Treatment: {caseItem.treatmentProvided}
                        </p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Treated: {format(caseItem.treatmentDate, 'MMM d, yyyy')}</span>
                          <span>Referred by: {caseItem.referredBy}</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => openOutcomeDialog(caseItem)} className="lg:min-w-[160px]">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Outcome
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recently Submitted */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recently Submitted
            </CardTitle>
            <CardDescription>Completed outcome reports</CardDescription>
          </CardHeader>
          <CardContent>
            {submittedCases.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No outcomes submitted yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {submittedCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center gap-4">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <div>
                        <h3 className="font-medium">{caseItem.patientName}</h3>
                        <p className="text-sm text-muted-foreground">{caseItem.condition}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">Submitted</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(caseItem.treatmentDate, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Outcome Submission Dialog */}
        <Dialog open={showOutcomeDialog} onOpenChange={setShowOutcomeDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit Treatment Outcome</DialogTitle>
              <DialogDescription>
                {selectedCase?.patientName} - {selectedCase?.condition}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Clinical Outcome */}
              <div>
                <Label className="text-sm font-medium">Clinical Outcome</Label>
                <RadioGroup
                  value={outcomeData.clinicalOutcome}
                  onValueChange={(value) => setOutcomeData(prev => ({ ...prev, clinicalOutcome: value as OutcomeData['clinicalOutcome'] }))}
                  className="grid grid-cols-2 gap-3 mt-2"
                >
                  {[
                    { value: 'resolved', label: 'Resolved', icon: CheckCircle, color: 'text-emerald-600' },
                    { value: 'improved', label: 'Improved', icon: TrendingUp, color: 'text-emerald-600' },
                    { value: 'stable', label: 'Stable', icon: Minus, color: 'text-amber-600' },
                    { value: 'worsened', label: 'Worsened', icon: TrendingDown, color: 'text-destructive' },
                  ].map((option) => (
                    <Label
                      key={option.value}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        outcomeData.clinicalOutcome === option.value ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                      )}
                    >
                      <RadioGroupItem value={option.value} />
                      <option.icon className={cn("h-4 w-4", option.color)} />
                      <span>{option.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Patient Satisfaction */}
              <div>
                <Label className="text-sm font-medium">Patient Satisfaction (1-5)</Label>
                <div className="flex items-center gap-4 mt-3">
                  <Slider
                    value={[outcomeData.patientSatisfaction]}
                    onValueChange={([value]) => setOutcomeData(prev => ({ ...prev, patientSatisfaction: value }))}
                    max={5}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-1 min-w-[60px]">
                    {Array.from({ length: outcomeData.patientSatisfaction }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Treatment Effectiveness */}
              <div>
                <Label className="text-sm font-medium">Treatment Effectiveness (1-5)</Label>
                <div className="flex items-center gap-4 mt-3">
                  <Slider
                    value={[outcomeData.treatmentEffectiveness]}
                    onValueChange={([value]) => setOutcomeData(prev => ({ ...prev, treatmentEffectiveness: value }))}
                    max={5}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <span className="font-semibold text-lg min-w-[30px] text-center">
                    {outcomeData.treatmentEffectiveness}/5
                  </span>
                </div>
              </div>

              {/* Complications */}
              <div>
                <Label className="text-sm font-medium">Complications</Label>
                <Select
                  value={outcomeData.complications}
                  onValueChange={(value) => setOutcomeData(prev => ({ ...prev, complications: value as OutcomeData['complications'] }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                  </SelectContent>
                </Select>
                {outcomeData.complications !== 'none' && (
                  <Textarea
                    value={outcomeData.complicationDetails || ''}
                    onChange={(e) => setOutcomeData(prev => ({ ...prev, complicationDetails: e.target.value }))}
                    placeholder="Describe complications..."
                    className="mt-2"
                    rows={2}
                  />
                )}
              </div>

              {/* Referral Appropriateness */}
              <div>
                <Label className="text-sm font-medium">Was this referral appropriate?</Label>
                <RadioGroup
                  value={outcomeData.referralAppropriate}
                  onValueChange={(value) => setOutcomeData(prev => ({ ...prev, referralAppropriate: value as OutcomeData['referralAppropriate'] }))}
                  className="flex gap-4 mt-2"
                >
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="yes" />
                    <span>Yes</span>
                  </Label>
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="partially" />
                    <span>Partially</span>
                  </Label>
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="no" />
                    <span>No</span>
                  </Label>
                </RadioGroup>
                {outcomeData.referralAppropriate !== 'yes' && (
                  <Textarea
                    value={outcomeData.referralFeedback || ''}
                    onChange={(e) => setOutcomeData(prev => ({ ...prev, referralFeedback: e.target.value }))}
                    placeholder="Provide constructive feedback for future referrals..."
                    className="mt-2"
                    rows={2}
                  />
                )}
              </div>

              {/* Follow-up Recommendation */}
              <div>
                <Label className="text-sm font-medium">Follow-up Recommendation *</Label>
                <Select
                  value={outcomeData.followUpRecommendation}
                  onValueChange={(value) => setOutcomeData(prev => ({ ...prev, followUpRecommendation: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select recommendation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="return-to-pcp">Return to PCP for ongoing care</SelectItem>
                    <SelectItem value="specialist-follow-up">Follow-up with specialist</SelectItem>
                    <SelectItem value="additional-specialist">Refer to additional specialist</SelectItem>
                    <SelectItem value="no-follow-up">No follow-up needed</SelectItem>
                    <SelectItem value="er-monitoring">ER monitoring recommended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Feedback to PCP */}
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Feedback to Referring Physician
                </Label>
                <Textarea
                  value={outcomeData.feedbackToPCP}
                  onChange={(e) => setOutcomeData(prev => ({ ...prev, feedbackToPCP: e.target.value }))}
                  placeholder="Provide feedback to the PCP about the case, treatment approach, or recommendations for similar cases..."
                  className="mt-2"
                  rows={3}
                />
              </div>

              {/* Additional Notes */}
              <div>
                <Label className="text-sm font-medium">Additional Notes</Label>
                <Textarea
                  value={outcomeData.additionalNotes}
                  onChange={(e) => setOutcomeData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                  placeholder="Any other relevant information..."
                  className="mt-2"
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowOutcomeDialog(false)}>Cancel</Button>
              <Button onClick={submitOutcome}>
                <Send className="h-4 w-4 mr-2" />
                Submit Outcome
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
