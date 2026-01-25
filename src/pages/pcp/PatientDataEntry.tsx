import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PCPSidebar } from '@/components/navigation/PCPSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  Send,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

interface AIAnalysis {
  referralNecessity: number;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  suggestedSpecialty?: string;
  alternativeCare?: string[];
  riskFactors: string[];
}

export default function PatientDataEntry() {
  const { addNotification } = useNotifications();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    chiefComplaint: '',
    symptomSeverity: '',
    symptomDurationDays: '',
    systolicBp: '',
    diastolicBp: '',
    heartRate: '',
    temperatureF: '',
    bmi: '',
    diabetes: false,
    hypertension: false,
    heartDisease: false,
    asthma: false,
    anxietyDisorder: false,
    priorPcpVisits: '',
    medsTried: '',
    responseToPrimaryCare: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalysis: AIAnalysis = {
      referralNecessity: Math.floor(Math.random() * 40) + 60,
      urgencyLevel: formData.symptomSeverity === 'severe' ? 'high' : 
                    formData.symptomSeverity === 'moderate' ? 'medium' : 'low',
      recommendation: formData.symptomSeverity === 'severe' 
        ? 'Referral to specialist is strongly recommended based on symptom severity and clinical indicators.'
        : 'Patient may benefit from specialist consultation, though continued primary care management is also viable.',
      suggestedSpecialty: 'Cardiology',
      alternativeCare: [
        'Lifestyle modifications',
        'Medication adjustment',
        'Follow-up in 2 weeks'
      ],
      riskFactors: [
        formData.diabetes && 'Diabetes',
        formData.hypertension && 'Hypertension',
        formData.heartDisease && 'Heart Disease History',
        parseInt(formData.age) > 50 && 'Age > 50'
      ].filter(Boolean) as string[]
    };
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    
    addNotification({
      type: 'success',
      title: 'AI Analysis Complete',
      message: 'Patient evaluation has been processed successfully.'
    });
  };

  return (
    <DashboardLayout sidebar={<PCPSidebar />} title="Patient Data Entry">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">New Patient Evaluation</h2>
          <p className="text-muted-foreground">Enter patient data for AI-powered referral assessment</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Patient Data Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>Basic demographic and clinical data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      placeholder="Full name"
                      value={formData.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Years"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                  <Textarea
                    id="chiefComplaint"
                    placeholder="Primary reason for visit..."
                    value={formData.chiefComplaint}
                    onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="symptomSeverity">Symptom Severity</Label>
                    <Select value={formData.symptomSeverity} onValueChange={(v) => handleInputChange('symptomSeverity', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="symptomDuration">Symptom Duration (days)</Label>
                    <Input
                      id="symptomDuration"
                      type="number"
                      placeholder="Days"
                      value={formData.symptomDurationDays}
                      onChange={(e) => handleInputChange('symptomDurationDays', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vital Signs</CardTitle>
                <CardDescription>Current measurements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Systolic BP</Label>
                    <Input
                      type="number"
                      placeholder="mmHg"
                      value={formData.systolicBp}
                      onChange={(e) => handleInputChange('systolicBp', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Diastolic BP</Label>
                    <Input
                      type="number"
                      placeholder="mmHg"
                      value={formData.diastolicBp}
                      onChange={(e) => handleInputChange('diastolicBp', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Heart Rate</Label>
                    <Input
                      type="number"
                      placeholder="bpm"
                      value={formData.heartRate}
                      onChange={(e) => handleInputChange('heartRate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Temperature</Label>
                    <Input
                      type="number"
                      placeholder="°F"
                      value={formData.temperatureF}
                      onChange={(e) => handleInputChange('temperatureF', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
                <CardDescription>Pre-existing conditions and treatment history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-3 block">Pre-existing Conditions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: 'diabetes', label: 'Diabetes' },
                      { id: 'hypertension', label: 'Hypertension' },
                      { id: 'heartDisease', label: 'Heart Disease' },
                      { id: 'asthma', label: 'Asthma' },
                      { id: 'anxietyDisorder', label: 'Anxiety Disorder' }
                    ].map((condition) => (
                      <div key={condition.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition.id}
                          checked={formData[condition.id as keyof typeof formData] as boolean}
                          onCheckedChange={(checked) => handleInputChange(condition.id, checked as boolean)}
                        />
                        <Label htmlFor={condition.id} className="text-sm font-normal">
                          {condition.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prior PCP Visits (last year)</Label>
                    <Input
                      type="number"
                      placeholder="Number of visits"
                      value={formData.priorPcpVisits}
                      onChange={(e) => handleInputChange('priorPcpVisits', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Response to Primary Care</Label>
                    <Select value={formData.responseToPrimaryCare} onValueChange={(v) => handleInputChange('responseToPrimaryCare', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select response" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Medications Tried</Label>
                  <Textarea
                    placeholder="List medications and treatments attempted..."
                    value={formData.medsTried}
                    onChange={(e) => handleInputChange('medsTried', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button 
              size="lg" 
              className="w-full gap-2"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>Analyzing with AI...</>
              ) : (
                <>
                  <Brain className="h-5 w-5" />
                  Run AI Evaluation
                </>
              )}
            </Button>
          </div>

          {/* AI Analysis Panel */}
          <div className="space-y-6">
            <Card className={analysis ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <CardTitle>AI Analysis</CardTitle>
                </div>
                <CardDescription>Intelligent referral assessment</CardDescription>
              </CardHeader>
              <CardContent>
                {!analysis ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Enter patient data and click "Run AI Evaluation" to get intelligent recommendations.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Referral Necessity Score */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Referral Necessity</span>
                        <span className={analysis.referralNecessity >= 70 ? 'text-destructive' : 'text-chart-2'}>
                          {analysis.referralNecessity}%
                        </span>
                      </div>
                      <Progress value={analysis.referralNecessity} className="h-2" />
                    </div>

                    {/* Urgency Level */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Urgency Level</span>
                      <Badge variant={
                        analysis.urgencyLevel === 'critical' ? 'destructive' :
                        analysis.urgencyLevel === 'high' ? 'destructive' :
                        analysis.urgencyLevel === 'medium' ? 'default' : 'secondary'
                      }>
                        {analysis.urgencyLevel.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Recommendation */}
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm">{analysis.recommendation}</p>
                    </div>

                    {/* Suggested Specialty */}
                    {analysis.suggestedSpecialty && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Suggested Specialty</span>
                        <Badge variant="outline">{analysis.suggestedSpecialty}</Badge>
                      </div>
                    )}

                    {/* Risk Factors */}
                    {analysis.riskFactors.length > 0 && (
                      <div>
                        <span className="text-sm font-medium block mb-2">Risk Factors</span>
                        <div className="flex flex-wrap gap-2">
                          {analysis.riskFactors.map((factor, i) => (
                            <Badge key={i} variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Alternative Care */}
                    {analysis.alternativeCare && (
                      <div>
                        <span className="text-sm font-medium block mb-2">Alternative Care Options</span>
                        <ul className="space-y-1">
                          {analysis.alternativeCare.map((option, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="h-3 w-3 text-chart-2" />
                              {option}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-4 space-y-2">
                      <Button className="w-full gap-2">
                        Proceed with Referral <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" className="w-full">
                        Choose Alternative Care
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
