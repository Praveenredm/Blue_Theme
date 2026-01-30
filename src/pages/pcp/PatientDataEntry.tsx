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
  User,
  Activity,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp
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
        formData.heartDisease && 'Heart Disease',
        parseInt(formData.age) > 50 && 'Age > 50'
      ].filter(Boolean) as string[]
    };
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    
    addNotification({
      type: 'success',
      title: 'Analysis Complete',
      message: 'Patient evaluation processed successfully.'
    });
  };

  const getUrgencyStyles = (level: string) => {
    switch(level) {
      case 'critical':
      case 'high':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500' };
      case 'medium':
        return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-500' };
      default:
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-500' };
    }
  };

  return (
    <DashboardLayout sidebar={<PCPSidebar />} title="Patient Data Entry">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Patient Evaluation</h1>
            <p className="text-gray-500 mt-1">Enter patient data for AI-powered referral assessment</p>
          </div>
        </div>

        {/* AI Triage Summary Section - Similar to reference */}
        {analysis && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI Triage Summary</h2>
                <p className="text-sm text-gray-600">Intelligent assessment results</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* High Priority Card */}
              <Card className={`${analysis.urgencyLevel === 'high' || analysis.urgencyLevel === 'critical' ? 'bg-white border-red-200' : 'bg-white/50 border-gray-200'}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${analysis.urgencyLevel === 'high' || analysis.urgencyLevel === 'critical' ? 'bg-red-100' : 'bg-gray-100'}`}>
                      <AlertCircle className={`h-5 w-5 ${analysis.urgencyLevel === 'high' || analysis.urgencyLevel === 'critical' ? 'text-red-500' : 'text-gray-400'}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">High Priority</span>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    {analysis.urgencyLevel === 'high' || analysis.urgencyLevel === 'critical' ? '1' : '0'}
                  </div>
                  {analysis.urgencyLevel === 'high' || analysis.urgencyLevel === 'critical' ? (
                    <>
                      <div className="h-1 w-16 bg-red-500 rounded-full mb-3"></div>
                      <p className="text-sm text-gray-600">Requires immediate attention</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 mt-3">No urgent cases</p>
                  )}
                </CardContent>
              </Card>

              {/* Referral Recommended Card */}
              <Card className={`${analysis.referralNecessity >= 70 ? 'bg-white border-orange-200' : 'bg-white/50 border-gray-200'}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${analysis.referralNecessity >= 70 ? 'bg-orange-100' : 'bg-gray-100'}`}>
                      <TrendingUp className={`h-5 w-5 ${analysis.referralNecessity >= 70 ? 'text-orange-500' : 'text-gray-400'}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Referral Recommended</span>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    {analysis.referralNecessity >= 70 ? '1' : '0'}
                  </div>
                  {analysis.referralNecessity >= 70 ? (
                    <>
                      <div className="h-1 w-16 bg-orange-500 rounded-full mb-3"></div>
                      <p className="text-sm text-gray-600">AI suggests specialist care</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 mt-3">Primary care sufficient</p>
                  )}
                </CardContent>
              </Card>

              {/* Primary Care OK Card */}
              <Card className={`${analysis.referralNecessity < 70 ? 'bg-white border-green-200' : 'bg-white/50 border-gray-200'}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${analysis.referralNecessity < 70 ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <CheckCircle2 className={`h-5 w-5 ${analysis.referralNecessity < 70 ? 'text-green-500' : 'text-gray-400'}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Primary Care OK</span>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    {analysis.referralNecessity < 70 ? '1' : '0'}
                  </div>
                  {analysis.referralNecessity < 70 ? (
                    <>
                      <div className="h-1 w-16 bg-green-500 rounded-full mb-3"></div>
                      <p className="text-sm text-gray-600">Can be managed in-house</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 mt-3">Specialist care needed</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Patient Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Patient Information Card */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg font-semibold">Patient Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Patient Name</Label>
                  <Input
                    placeholder="Enter full name"
                    value={formData.patientName}
                    onChange={(e) => handleInputChange('patientName', e.target.value)}
                    className="h-11"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Age</Label>
                    <Input
                      type="number"
                      placeholder="Years"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Gender</Label>
                    <Select value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">BMI</Label>
                    <Input
                      type="number"
                      placeholder="BMI"
                      value={formData.bmi}
                      onChange={(e) => handleInputChange('bmi', e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chief Complaint Card */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg font-semibold">Chief Complaint</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Primary Reason for Visit</Label>
                  <Textarea
                    placeholder="Describe symptoms and concerns..."
                    value={formData.chiefComplaint}
                    onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Severity</Label>
                    <Select value={formData.symptomSeverity} onValueChange={(v) => handleInputChange('symptomSeverity', v)}>
                      <SelectTrigger className="h-11">
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
                    <Label className="text-sm font-medium text-gray-700">Duration (days)</Label>
                    <Input
                      type="number"
                      placeholder="Days"
                      value={formData.symptomDurationDays}
                      onChange={(e) => handleInputChange('symptomDurationDays', e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vital Signs Card */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg font-semibold">Vital Signs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-600">Systolic</Label>
                    <Input
                      type="number"
                      placeholder="mmHg"
                      value={formData.systolicBp}
                      onChange={(e) => handleInputChange('systolicBp', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-600">Diastolic</Label>
                    <Input
                      type="number"
                      placeholder="mmHg"
                      value={formData.diastolicBp}
                      onChange={(e) => handleInputChange('diastolicBp', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-600">Heart Rate</Label>
                    <Input
                      type="number"
                      placeholder="bpm"
                      value={formData.heartRate}
                      onChange={(e) => handleInputChange('heartRate', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-600">Temperature</Label>
                    <Input
                      type="number"
                      placeholder="°F"
                      value={formData.temperatureF}
                      onChange={(e) => handleInputChange('temperatureF', e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical History Card */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                <CardTitle className="text-lg font-semibold">Medical History</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Pre-existing Conditions</Label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { id: 'diabetes', label: 'Diabetes' },
                      { id: 'hypertension', label: 'Hypertension' },
                      { id: 'heartDisease', label: 'Heart Disease' },
                      { id: 'asthma', label: 'Asthma' },
                      { id: 'anxietyDisorder', label: 'Anxiety' }
                    ].map((condition) => (
                      <label key={condition.id} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          id={condition.id}
                          checked={formData[condition.id as keyof typeof formData] as boolean}
                          onCheckedChange={(checked) => handleInputChange(condition.id, checked as boolean)}
                        />
                        <span className="text-sm text-gray-700">{condition.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">PCP Visits (last year)</Label>
                    <Input
                      type="number"
                      placeholder="Number"
                      value={formData.priorPcpVisits}
                      onChange={(e) => handleInputChange('priorPcpVisits', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Response to Care</Label>
                    <Select value={formData.responseToPrimaryCare} onValueChange={(v) => handleInputChange('responseToPrimaryCare', v)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select" />
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
                  <Label className="text-sm font-medium text-gray-700">Medications Tried</Label>
                  <Textarea
                    placeholder="List medications and treatments..."
                    value={formData.medsTried}
                    onChange={(e) => handleInputChange('medsTried', e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Run Analysis Button */}
            <Button 
              size="lg" 
              className="w-full h-14 text-base font-semibold bg-blue-600 hover:bg-blue-700"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5 mr-2" />
                  Run AI Evaluation
                </>
              )}
            </Button>
          </div>

          {/* Right Column - AI Analysis */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className={`border shadow-sm ${analysis ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200'}`}>
                <CardHeader className="border-b border-gray-100 bg-white">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg font-semibold">AI Analysis</CardTitle>
                  </div>
                  <CardDescription>Intelligent referral assessment</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {!analysis ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <Brain className="h-8 w-8 text-gray-300" />
                      </div>
                      <p className="text-sm text-gray-500 px-4">
                        Enter patient data and run the AI evaluation to see intelligent recommendations
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {/* Referral Necessity Score */}
                      <div className="p-5 bg-white rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">Referral Score</span>
                          <span className="text-2xl font-bold text-blue-600">{analysis.referralNecessity}%</span>
                        </div>
                        <Progress value={analysis.referralNecessity} className="h-2.5 bg-gray-100" />
                      </div>

                      {/* Urgency Level */}
                      <div className={`p-4 rounded-xl border ${getUrgencyStyles(analysis.urgencyLevel).bg} ${getUrgencyStyles(analysis.urgencyLevel).border}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Urgency Level</span>
                          <Badge className={`${getUrgencyStyles(analysis.urgencyLevel).text} bg-white border-0 font-semibold`}>
                            {analysis.urgencyLevel.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm text-gray-700 leading-relaxed">{analysis.recommendation}</p>
                      </div>

                      {/* Suggested Specialty */}
                      {analysis.suggestedSpecialty && (
                        <div className="p-4 bg-white rounded-xl border border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Suggested Specialty</span>
                            <Badge variant="outline" className="font-medium">{analysis.suggestedSpecialty}</Badge>
                          </div>
                        </div>
                      )}

                      {/* Risk Factors */}
                      {analysis.riskFactors.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium text-gray-700">Risk Factors</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {analysis.riskFactors.map((factor, i) => (
                              <Badge key={i} className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Alternative Care */}
                      {analysis.alternativeCare && (
                        <div className="space-y-2">
                          <span className="text-sm font-medium text-gray-700 block">Alternative Options</span>
                          <div className="space-y-2">
                            {analysis.alternativeCare.map((option, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{option}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="pt-2 space-y-3">
                        <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-medium">
                          Create Referral
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                        <Button variant="outline" className="w-full h-11 font-medium border-gray-300">
                          Alternative Care Plan
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}