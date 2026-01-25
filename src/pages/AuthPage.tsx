import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, User, Stethoscope, UserCog, Shield } from 'lucide-react';
import { UserRole } from '@/types';

const roleConfig = {
  patient: {
    icon: User,
    label: 'Patient',
    description: 'Access your health dashboard and AI assistant',
    color: 'bg-chart-1'
  },
  pcp: {
    icon: Stethoscope,
    label: 'Primary Care',
    description: 'Manage patients and referrals',
    color: 'bg-chart-2'
  },
  specialist: {
    icon: UserCog,
    label: 'Specialist',
    description: 'Handle referral requests and treatments',
    color: 'bg-chart-3'
  },
  admin: {
    icon: Shield,
    label: 'Administrator',
    description: 'System management and analytics',
    color: 'bg-chart-4'
  }
};

export default function AuthPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password, selectedRole);
    navigate(`/${selectedRole}`);
  };

  const handleDemoLogin = async (role: UserRole) => {
    await login('demo@careflow.ai', 'demo', role);
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-chart-1 opacity-90" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Activity className="h-7 w-7" />
            </div>
            <span className="text-2xl font-bold">CareFlow AI</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Intelligent Healthcare Referral Optimization
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8">
            AI-powered triage, specialty matching, and care coordination for better patient outcomes.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">40%</div>
              <div className="text-sm text-primary-foreground/70">Reduction in unnecessary referrals</div>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">60%</div>
              <div className="text-sm text-primary-foreground/70">Faster specialist matching</div>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">95%</div>
              <div className="text-sm text-primary-foreground/70">Patient satisfaction rate</div>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm text-primary-foreground/70">AI health assistant available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CareFlow AI</span>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="demo">Quick Demo</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>Sign in to your account to continue</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                          const config = roleConfig[role];
                          const Icon = config.icon;
                          return (
                            <button
                              key={role}
                              type="button"
                              onClick={() => setSelectedRole(role)}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                selectedRole === role
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <Icon className={`h-5 w-5 mx-auto mb-1 ${
                                selectedRole === role ? 'text-primary' : 'text-muted-foreground'
                              }`} />
                              <div className={`text-sm font-medium ${
                                selectedRole === role ? 'text-primary' : ''
                              }`}>
                                {config.label}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="demo">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Demo Access</CardTitle>
                  <CardDescription>Select a role to explore the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                    const config = roleConfig[role];
                    const Icon = config.icon;
                    return (
                      <Button
                        key={role}
                        variant="outline"
                        className="w-full justify-start h-auto p-4"
                        onClick={() => handleDemoLogin(role)}
                        disabled={isLoading}
                      >
                        <div className={`h-10 w-10 rounded-lg ${config.color} flex items-center justify-center mr-3`}>
                          <Icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{config.label}</div>
                          <div className="text-sm text-muted-foreground">{config.description}</div>
                        </div>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
