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
  const totalCases = cases.length;
  const completionRate = totalCases === 0 ? 0 : Math.round((submittedCases.length / totalCases) * 100);

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
        title: 'Missing Information',
        description: 'Please provide follow-up recommendations.',
        variant: 'destructive'
      });
      return;
    }

    setCases(prev =>
      prev.map(c => (c.id === selectedCase.id ? { ...c, outcomeSubmitted: true } : c))
    );

    toast({
      title: 'Outcome Submitted',
      description: `Treatment outcome for ${selectedCase.patientName} has been recorded and shared with the referring physician.`
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
        {/* Hero / Page Header – matches dashboard feel */}
        <div className="rounded-2xl border bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-sky-700 dark:text-sky-300 mb-1">
              Outcome Submission
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Capture treatment outcomes in seconds
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Close the loop with referring physicians by documenting results and sharing follow‑up recommendations.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className="flex items-center gap-2 rounded-full bg-white/70 dark:bg-slate-900/60 px-4 py-2"
              >
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium">{pendingCases.length} Pending</span>
              </Badge>
              <Badge
                variant="secondary"
                className="flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 px-4 py-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{submittedCases.length} Submitted</span>
              </Badge>
            </div>
            <Button
              size="sm"
              variant="default"
              className="shadow-sm"
              disabled={pendingCases.length === 0}
              onClick={() => {
                if (pendingCases[0]) openOutcomeDialog(pendingCases[0]);
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              {pendingCases.length ? 'Complete next outcome' : 'All outcomes complete'}
            </Button>
          </div>
        </div>

        {/* Stat cards row – similar to dashboard metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-[0_12px_40px_-24px_rgba(15,23,42,0.6)] border-slate-100">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-medium">Pending Outcomes</CardTitle>
                <CardDescription>Awaiting your documentation</CardDescription>
              </div>
              <div className="h-9 w-9 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center">
                <AlertCircle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-2xl font-semibold">{pendingCases.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Complete these to keep PCPs up to date.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-[0_12px_40px_-24px_rgba(15,23,42,0.6)] border-slate-100">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-medium">Submitted Outcomes</CardTitle>
                <CardDescription>Shared with referring providers</CardDescription>
              </div>
              <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-2xl font-semibold">{submittedCases.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Recorded for longitudinal tracking and analytics.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-[0_12px_40px_-24px_rgba(15,23,42,0.6)] border-slate-100">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-medium">Outcome Completion Rate</CardTitle>
                <CardDescription>Across recent referred cases</CardDescription>
              </div>
              <div className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center">
                {completionRate >= 80 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : completionRate >= 50 ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold">{completionRate}%</p>
                <span className="text-xs text-muted-foreground">of {totalCases} recent cases</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    completionRate >= 80
                      ? 'bg-emerald-500'
                      : completionRate >= 50
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  )}
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content – two-column layout to match dashboard density */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Pending Outcomes */}
          <Card className="border-slate-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    Pending Outcome Reports
                  </CardTitle>
                  <CardDescription>Newly completed visits requiring documentation</CardDescription>
                </div>
                <Input
                  placeholder="Search patients or conditions"
                  className="hidden md:block max-w-xs h-9 text-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              {pendingCases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CheckCircle className="h-12 w-12 text-emerald-600 mb-3" />
                  <p className="text-base font-medium">All outcomes submitted</p>
                  <p className="text-sm text-muted-foreground">
                    Great work — you’re completely up to date.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCases.map(caseItem => (
                    <div
                      key={caseItem.id}
                      className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-amber-100 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20 px-4 py-3"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                          <User className="h-5 w-5 text-amber-700 dark:text-amber-300" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold leading-none">
                              {caseItem.patientName}
                            </h3>
                            <span className="text-xs rounded-full bg-white/80 px-2 py-0.5 text-muted-foreground">
                              {caseItem.patientAge} yrs
                            </span>
                          </div>
                          <p className="mt-1 text-sm font-medium text-primary">
                            {caseItem.condition}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Treatment: {caseItem.treatmentProvided}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span>
                              Treated{' '}
                              <span className="font-medium">
                                {format(caseItem.treatmentDate, 'MMM d, yyyy')}
                              </span>
                            </span>
                            <span>Referred by {caseItem.referredBy}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => openOutcomeDialog(caseItem)}
                        className="lg:min-w-[160px]"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Submit outcome
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recently Submitted */}
          <Card className="border-slate-100">
            <CardHeader className="pb-3">
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
                  <p className="text-sm text-muted-foreground">No outcomes submitted yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submittedCases.map(caseItem => (
                    <div
                      key={caseItem.id}
                      className="flex items-center justify-between rounded-xl border bg-muted/40 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">{caseItem.patientName}</h3>
                          <p className="text-xs text-muted-foreground">
                            {caseItem.condition}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className="rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 px-3 py-0.5 text-[11px]"
                        >
                          Submitted
                        </Badge>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {format(caseItem.treatmentDate, 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Outcome Submission Dialog */}
        <Dialog open={showOutcomeDialog} onOpenChange={setShowOutcomeDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit treatment outcome</DialogTitle>
              <DialogDescription>
                {selectedCase?.patientName} • {selectedCase?.condition}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Clinical Outcome */}
              <div>
                <Label className="text-sm font-medium">Clinical outcome</Label>
                <RadioGroup
                  value={outcomeData.clinicalOutcome}
                  onValueChange={value =>
                    setOutcomeData(prev => ({
                      ...prev,
                      clinicalOutcome: value as OutcomeData['clinicalOutcome']
                    }))
                  }
                  className="grid grid-cols-2 gap-3 mt-2"
                >
                  {[
                    {
                      value: 'resolved',
                      label: 'Resolved',
                      icon: CheckCircle,
                      color: 'text-emerald-600'
                    },
                    {
                      value: 'improved',
                      label: 'Improved',
                      icon: TrendingUp,
                      color: 'text-emerald-600'
                    },
                    {
                      value: 'stable',
                      label: 'Stable',
                      icon: Minus,
                      color: 'text-amber-600'
                    },
                    {
                      value: 'worsened',
                      label: 'Worsened',
                      icon: TrendingDown,
                      color: 'text-destructive'
                    }
                  ].map(option => (
                    <Label
                      key={option.value}
                      className={cn(
                        'flex items-center gap-3 rounded-lg border bg-background p-3 text-sm cursor-pointer transition-colors',
                        outcomeData.clinicalOutcome === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground'
                      )}
                    >
                      <RadioGroupItem value={option.value} />
                      <option.icon className={cn('h-4 w-4', option.color)} />
                      <span>{option.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Patient Satisfaction */}
              <div>
                <Label className="text-sm font-medium">Patient satisfaction (1–5)</Label>
                <div className="mt-3 flex items-center gap-4">
                  <Slider
                    value={[outcomeData.patientSatisfaction]}
                    onValueChange={([value]) =>
                      setOutcomeData(prev => ({ ...prev, patientSatisfaction: value }))
                    }
                    max={5}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-1 min-w-[72px] justify-end">
                    {Array.from({ length: outcomeData.patientSatisfaction }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400 drop-shadow-[0_1px_3px_rgba(251,191,36,0.6)]"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Treatment Effectiveness */}
              <div>
                <Label className="text-sm font-medium">Treatment effectiveness (1–5)</Label>
                <div className="mt-3 flex items-center gap-4">
                  <Slider
                    value={[outcomeData.treatmentEffectiveness]}
                    onValueChange={([value]) =>
                      setOutcomeData(prev => ({ ...prev, treatmentEffectiveness: value }))
                    }
                    max={5}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <span className="min-w-[40px] text-center text-lg font-semibold">
                    {outcomeData.treatmentEffectiveness}/5
                  </span>
                </div>
              </div>

              {/* Complications */}
              <div>
                <Label className="text-sm font-medium">Complications</Label>
                <Select
                  value={outcomeData.complications}
                  onValueChange={value =>
                    setOutcomeData(prev => ({
                      ...prev,
                      complications: value as OutcomeData['complications']
                    }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select complications" />
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
                    onChange={e =>
                      setOutcomeData(prev => ({ ...prev, complicationDetails: e.target.value }))
                    }
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
                  onValueChange={value =>
                    setOutcomeData(prev => ({
                      ...prev,
                      referralAppropriate: value as OutcomeData['referralAppropriate']
                    }))
                  }
                  className="mt-2 flex gap-4"
                >
                  <Label className="flex items-center gap-2 cursor-pointer text-sm">
                    <RadioGroupItem value="yes" />
                    <span>Yes</span>
                  </Label>
                  <Label className="flex items-center gap-2 cursor-pointer text-sm">
                    <RadioGroupItem value="partially" />
                    <span>Partially</span>
                  </Label>
                  <Label className="flex items-center gap-2 cursor-pointer text-sm">
                    <RadioGroupItem value="no" />
                    <span>No</span>
                  </Label>
                </RadioGroup>
                {outcomeData.referralAppropriate !== 'yes' && (
                  <Textarea
                    value={outcomeData.referralFeedback || ''}
                    onChange={e =>
                      setOutcomeData(prev => ({ ...prev, referralFeedback: e.target.value }))
                    }
                    placeholder="Provide constructive feedback for future referrals..."
                    className="mt-2"
                    rows={2}
                  />
                )}
              </div>

              {/* Follow-up Recommendation */}
              <div>
                <Label className="text-sm font-medium">Follow‑up recommendation *</Label>
                <Select
                  value={outcomeData.followUpRecommendation}
                  onValueChange={value =>
                    setOutcomeData(prev => ({ ...prev, followUpRecommendation: value }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select recommendation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="return-to-pcp">
                      Return to PCP for ongoing care
                    </SelectItem>
                    <SelectItem value="specialist-follow-up">
                      Follow‑up with specialist
                    </SelectItem>
                    <SelectItem value="additional-specialist">
                      Refer to additional specialist
                    </SelectItem>
                    <SelectItem value="no-follow-up">No follow‑up needed</SelectItem>
                    <SelectItem value="er-monitoring">ER monitoring recommended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Feedback to PCP */}
              <div>
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <MessageSquare className="h-4 w-4" />
                  Feedback to referring physician
                </Label>
                <Textarea
                  value={outcomeData.feedbackToPCP}
                  onChange={e =>
                    setOutcomeData(prev => ({ ...prev, feedbackToPCP: e.target.value }))
                  }
                  placeholder="Share key findings, management decisions, and any suggestions for similar future cases..."
                  className="mt-2"
                  rows={3}
                />
              </div>

              {/* Additional Notes */}
              <div>
                <Label className="text-sm font-medium">Additional notes</Label>
                <Textarea
                  value={outcomeData.additionalNotes}
                  onChange={e =>
                    setOutcomeData(prev => ({ ...prev, additionalNotes: e.target.value }))
                  }
                  placeholder="Any other relevant information..."
                  className="mt-2"
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowOutcomeDialog(false)}>
                Cancel
              </Button>
              <Button onClick={submitOutcome}>
                <Send className="h-4 w-4 mr-2" />
                Submit outcome
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}