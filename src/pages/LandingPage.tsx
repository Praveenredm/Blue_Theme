import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle,
  Clock,
  Heart,
  Shield,
  Stethoscope,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Triage',
      description: 'Intelligent symptom analysis and severity prediction for optimal patient routing.'
    },
    {
      icon: Clock,
      title: 'Reduced Wait Times',
      description: '60% faster specialist matching through smart scheduling and availability optimization.'
    },
    {
      icon: Shield,
      title: 'Clinical Accuracy',
      description: '94% referral necessity prediction accuracy with continuous learning from outcomes.'
    },
    {
      icon: Heart,
      title: 'Patient-Centered',
      description: 'Guided health assistant for symptom checking and insurance guidance.'
    }
  ];

  const stats = [
    { value: '40%', label: 'Reduction in unnecessary referrals' },
    { value: '60%', label: 'Faster specialist matching' },
    { value: '95%', label: 'Patient satisfaction rate' },
    { value: '24/7', label: 'AI health assistant' }
  ];

  const roles = [
    {
      icon: Users,
      title: 'Patient',
      description: 'Track referrals, book appointments, and get AI health guidance'
    },
    {
      icon: Stethoscope,
      title: 'Primary Care',
      description: 'AI-assisted patient evaluation and smart referral decisions'
    },
    {
      icon: Activity,
      title: 'Specialist',
      description: 'Manage referral requests and optimize your schedule'
    },
    {
      icon: Shield,
      title: 'Administrator',
      description: 'Monitor performance and manage platform settings'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">CareFlow AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="outline" className="mb-6 px-4 py-1.5">
            <Zap className="h-3 w-3 mr-2" />
            AI-Powered Healthcare Optimization
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Intelligent Healthcare
            <span className="text-primary block mt-2">Referral Platform</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Optimize patient triage, specialist matching, and care coordination with AI-driven decision support. 
            Reduce wait times and improve outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powered by Advanced AI</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform uses machine learning to optimize every step of the referral process
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="bg-card hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for Every Stakeholder</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Role-based dashboards tailored to each user's needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, i) => (
              <Card key={i} className="bg-background hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <role.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{role.title}</h3>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-2/10 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Healthcare Referrals?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join leading healthcare organizations using CareFlow AI to improve patient outcomes and operational efficiency.
              </p>
              <Link to="/auth">
                <Button size="lg" className="gap-2">
                  Get Started Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">CareFlow AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 CareFlow AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
