import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientSidebar } from '@/components/navigation/PatientSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Heart,
  Activity,
  Apple,
  Moon,
  Pill,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Droplets,
  Dumbbell,
  Brain,
  Stethoscope,
  ChevronRight
} from 'lucide-react';

interface Recommendation {
  id: string;
  category: 'lifestyle' | 'medication' | 'monitoring' | 'preventive';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  source: string;
  icon: React.ReactNode;
  tasks?: {
    id: string;
    label: string;
    completed: boolean;
    frequency?: string;
  }[];
  tips?: string[];
  progress?: number;
}

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    category: 'lifestyle',
    title: 'Cardiovascular Exercise',
    description: 'Regular aerobic exercise to support heart health based on your cardiology consultation.',
    priority: 'high',
    source: 'Dr. Emily Rodriguez - Cardiology',
    icon: <Activity className="h-5 w-5" />,
    progress: 65,
    tasks: [
      { id: '1a', label: '30 min brisk walking', completed: true, frequency: 'Daily' },
      { id: '1b', label: 'Swimming or cycling session', completed: false, frequency: '3x/week' },
      { id: '1c', label: 'Light stretching routine', completed: true, frequency: 'Daily' }
    ],
    tips: [
      'Start slowly and gradually increase intensity',
      'Monitor heart rate during exercise (target: 100-140 bpm)',
      'Stop if you experience chest pain or severe shortness of breath'
    ]
  },
  {
    id: '2',
    category: 'lifestyle',
    title: 'Heart-Healthy Diet',
    description: 'Dietary modifications to manage blood pressure and cholesterol levels.',
    priority: 'high',
    source: 'Dr. Michael Chen - Primary Care',
    icon: <Apple className="h-5 w-5" />,
    progress: 45,
    tasks: [
      { id: '2a', label: 'Reduce sodium intake (<2300mg/day)', completed: false, frequency: 'Daily' },
      { id: '2b', label: 'Eat 5 servings of fruits/vegetables', completed: true, frequency: 'Daily' },
      { id: '2c', label: 'Choose whole grains over refined', completed: false, frequency: 'Daily' },
      { id: '2d', label: 'Limit saturated fats', completed: true, frequency: 'Daily' }
    ],
    tips: [
      'Read nutrition labels for sodium content',
      'Cook more meals at home to control ingredients',
      'Use herbs and spices instead of salt for flavor'
    ]
  },
  {
    id: '3',
    category: 'medication',
    title: 'Blood Pressure Medication',
    description: 'Take prescribed medication consistently to maintain healthy blood pressure.',
    priority: 'high',
    source: 'Dr. Michael Chen - Primary Care',
    icon: <Pill className="h-5 w-5" />,
    progress: 90,
    tasks: [
      { id: '3a', label: 'Take Lisinopril 10mg', completed: true, frequency: 'Every morning' },
      { id: '3b', label: 'Check BP before medication', completed: true, frequency: 'Daily' },
      { id: '3c', label: 'Log readings in health app', completed: false, frequency: 'Daily' }
    ],
    tips: [
      'Take at the same time each day',
      'Don\'t skip doses even if you feel fine',
      'Report any side effects to your doctor'
    ]
  },
  {
    id: '4',
    category: 'monitoring',
    title: 'Blood Pressure Monitoring',
    description: 'Regular home monitoring to track your cardiovascular health.',
    priority: 'medium',
    source: 'Dr. Emily Rodriguez - Cardiology',
    icon: <Heart className="h-5 w-5" />,
    progress: 75,
    tasks: [
      { id: '4a', label: 'Morning BP reading', completed: true, frequency: 'Daily' },
      { id: '4b', label: 'Evening BP reading', completed: false, frequency: 'Daily' },
      { id: '4c', label: 'Weekly average review', completed: true, frequency: 'Weekly' }
    ],
    tips: [
      'Rest 5 minutes before taking readings',
      'Use the same arm each time',
      'Avoid caffeine 30 minutes before measurement'
    ]
  },
  {
    id: '5',
    category: 'lifestyle',
    title: 'Sleep Hygiene',
    description: 'Improve sleep quality to support overall health and stress management.',
    priority: 'medium',
    source: 'Health Assistant AI',
    icon: <Moon className="h-5 w-5" />,
    progress: 50,
    tasks: [
      { id: '5a', label: 'Maintain consistent sleep schedule', completed: true, frequency: 'Daily' },
      { id: '5b', label: 'Avoid screens 1hr before bed', completed: false, frequency: 'Daily' },
      { id: '5c', label: '7-8 hours of sleep', completed: false, frequency: 'Daily' }
    ]
  },
  {
    id: '6',
    category: 'preventive',
    title: 'Stress Management',
    description: 'Techniques to reduce stress which impacts blood pressure and heart health.',
    priority: 'medium',
    source: 'Dr. Sarah Kim - Mental Health',
    icon: <Brain className="h-5 w-5" />,
    progress: 30,
    tasks: [
      { id: '6a', label: 'Practice deep breathing', completed: false, frequency: '2x/day' },
      { id: '6b', label: 'Mindfulness meditation', completed: false, frequency: 'Daily' },
      { id: '6c', label: 'Take breaks during work', completed: true, frequency: 'Every 2 hours' }
    ]
  },
  {
    id: '7',
    category: 'preventive',
    title: 'Annual Screenings',
    description: 'Preventive health screenings recommended for your age and health profile.',
    priority: 'low',
    source: 'Dr. Michael Chen - Primary Care',
    icon: <Stethoscope className="h-5 w-5" />,
    tasks: [
      { id: '7a', label: 'Annual physical exam', completed: true, frequency: 'Yearly' },
      { id: '7b', label: 'Cholesterol panel', completed: false, frequency: 'Every 6 months' },
      { id: '7c', label: 'Eye examination', completed: false, frequency: 'Yearly' }
    ]
  },
  {
    id: '8',
    category: 'monitoring',
    title: 'Hydration Tracking',
    description: 'Maintain adequate fluid intake for kidney and cardiovascular health.',
    priority: 'low',
    source: 'Health Assistant AI',
    icon: <Droplets className="h-5 w-5" />,
    progress: 60,
    tasks: [
      { id: '8a', label: 'Drink 8 glasses of water', completed: false, frequency: 'Daily' },
      { id: '8b', label: 'Limit caffeine intake', completed: true, frequency: 'Daily' }
    ]
  }
];

export default function CareRecommendations() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All', icon: <Heart className="h-4 w-4" /> },
    { value: 'lifestyle', label: 'Lifestyle', icon: <Dumbbell className="h-4 w-4" /> },
    { value: 'medication', label: 'Medication', icon: <Pill className="h-4 w-4" /> },
    { value: 'monitoring', label: 'Monitoring', icon: <Activity className="h-4 w-4" /> },
    { value: 'preventive', label: 'Preventive', icon: <Stethoscope className="h-4 w-4" /> }
  ];

  const filteredRecommendations = activeCategory === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category === activeCategory);

  const toggleTask = (recId: string, taskId: string) => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id === recId && rec.tasks) {
        const updatedTasks = rec.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        const completedCount = updatedTasks.filter(t => t.completed).length;
        const progress = Math.round((completedCount / updatedTasks.length) * 100);
        return { ...rec, tasks: updatedTasks, progress };
      }
      return rec;
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const overallProgress = Math.round(
    recommendations.reduce((acc, rec) => acc + (rec.progress || 0), 0) / recommendations.filter(r => r.progress !== undefined).length
  );

  const highPriorityCount = recommendations.filter(r => r.priority === 'high').length;

  return (
    <DashboardLayout sidebar={<PatientSidebar />} title="Care Recommendations">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Care Recommendations</h2>
            <p className="text-muted-foreground">Personalized health guidance from your care team</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="text-2xl font-bold">{overallProgress}%</p>
            </div>
            <div className="w-24">
              <Progress value={overallProgress} className="h-3" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{recommendations.length}</p>
                <p className="text-sm text-muted-foreground">Total Plans</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{highPriorityCount}</p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overallProgress}%</p>
                <p className="text-sm text-muted-foreground">Adherence</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {recommendations.flatMap(r => r.tasks || []).filter(t => !t.completed).length}
                </p>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <Button
              key={cat.value}
              variant={activeCategory === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.value)}
              className="gap-2"
            >
              {cat.icon}
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Recommendations List */}
        <div className="space-y-4">
          {filteredRecommendations.map(rec => (
            <Card key={rec.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      rec.priority === 'high' ? "bg-destructive/10 text-destructive" :
                      rec.priority === 'medium' ? "bg-primary/10 text-primary" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {rec.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                        <Badge variant={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                      </div>
                      <CardDescription>{rec.description}</CardDescription>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended by: {rec.source}
                      </p>
                    </div>
                  </div>
                  {rec.progress !== undefined && (
                    <div className="text-right min-w-[80px]">
                      <p className="text-2xl font-bold">{rec.progress}%</p>
                      <Progress value={rec.progress} className="h-2 mt-1" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {rec.tasks && (
                  <div className="space-y-2 mb-4">
                    {rec.tasks.map(task => (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border transition-colors",
                          task.completed ? "bg-muted/50 border-muted" : "bg-background"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={task.id}
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(rec.id, task.id)}
                          />
                          <label
                            htmlFor={task.id}
                            className={cn(
                              "text-sm cursor-pointer",
                              task.completed && "line-through text-muted-foreground"
                            )}
                          >
                            {task.label}
                          </label>
                        </div>
                        {task.frequency && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {task.frequency}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {rec.tips && (
                  <div className="bg-primary/5 rounded-lg p-4">
                    <p className="font-medium text-sm mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Tips for Success
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {rec.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
