export type UserRole = 'patient' | 'pcp' | 'specialist' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface PatientData {
  age: number;
  gender: 'male' | 'female' | 'other';
  chiefComplaint: string;
  symptomSeverity: 'mild' | 'moderate' | 'severe';
  symptomDurationDays: number;
  systolicBp: number;
  diastolicBp: number;
  heartRate: number;
  temperatureF: number;
  bmi: number;
  diabetes: boolean;
  hypertension: boolean;
  heartDisease: boolean;
  asthma: boolean;
  anxietyDisorder: boolean;
  priorPcpVisits: number;
  medsTried: string[];
  responseToPrimaryCare: 'good' | 'partial' | 'none';
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  pcpId: string;
  pcpName: string;
  specialistId?: string;
  specialistName?: string;
  specialty: string;
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'cancelled';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  updatedAt: Date;
  aiScore?: number;
  aiRecommendation?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  options?: ChatOption[];
  timestamp: Date;
}

export interface ChatOption {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  specialistId: string;
  specialistName: string;
  specialty: string;
  date: Date;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
