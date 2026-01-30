import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Stethoscope, UserCog, Shield, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '@/types';
import {FcGoogle} from 'react-icons/fc';
import {FaFacebookF} from 'react-icons/fa';


type AuthMode = 'signin' | 'signup';

const roleConfig = {
  patient: {
    icon: User,
    label: 'Patient',
    description: 'Access health dashboard and AI assistant',
  },
  pcp: {
    icon: Stethoscope,
    label: 'Primary Care Provider',
    description: 'Manage patients and referrals',
  },
  specialist: {
    icon: UserCog,
    label: 'Specialist',
    description: 'Handle referral requests',
  },
  admin: {
    icon: Shield,
    label: 'Administrator',
    description: 'System management',
  }
};

const brandColor = '#20A0D8';

// Password strength calculator
const calculatePasswordStrength = (password: string): { strength: number; label: string; color: string } => {
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 25;
  
  // Uppercase check
  if (/[A-Z]/.test(password)) strength += 25;
  
  // Number check
  if (/[0-9]/.test(password)) strength += 25;
  
  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;
  
  let label = 'Weak';
  let color = '#ef4444'; // red
  
  if (strength >= 75) {
    label = 'Strong';
    color = '#22c55e'; // green
  } else if (strength >= 50) {
    label = 'Good';
    color = '#eab308'; // yellow
  } else if (strength >= 25) {
    label = 'Fair';
    color = '#f97316'; // orange
  }
  
  return { strength, label, color };
};

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sign In fields
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up fields
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  
  // Password strength
  const passwordStrength = calculatePasswordStrength(signUpPassword);

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(signInEmail, signInPassword, selectedRole);
    navigate(`/${selectedRole}`);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpPassword !== signUpConfirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // For now, use the same login function - in real app, would call signup endpoint
    await login(signUpEmail, signUpPassword, selectedRole);
    navigate(`/${selectedRole}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <style>{`
        .branding-panel {
          position: fixed;
          top: 0;
          width: 50%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: transform 700ms cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
        }
        
        .branding-panel.signin-mode {
          transform: translateX(0);
          left: 0;
        }
        
        .branding-panel.signup-mode {
          transform: translateX(100%);
          left: 0;
        }
        
        .auth-panel {
          position: fixed;
          top: 0;
          width: 50%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          transition: transform 700ms cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 20;
          overflow-y: auto;
          padding-bottom: 2rem;
          padding-top: 3rem;
          padding-bottom: 3rem;
        }
        
        .auth-panel.signin-mode {
          transform: translateX(0);
          right: 0;
        }
        
        .auth-panel.signup-mode {
          transform: translateX(-100%);
          right: 0;
        }
        
        @media (max-width: 1024px) {
          .branding-panel {
            position: relative;
            width: 100%;
            transform: translateX(0) !important;
            left: auto !important;
            right: auto !important;
            height: auto;
            min-height: 100vh;
            justify-content: flex-start;
            padding-top: 2rem;
          }
          
          .auth-panel {
            position: relative;
            width: 100%;
            transform: translateX(0) !important;
            left: auto !important;
            right: auto !important;
            height: auto;
            min-height: 100vh;
          }
        }
      `}</style>

      

      {/* Left Panel - Branding & Marketing */}
      <div 
        className={`branding-panel hidden lg:flex ${mode === 'signin' ? 'signin-mode' : 'signup-mode'} relative overflow-hidden p-12`}
        style={{ backgroundColor: brandColor }}
      >
          <div className="absolute inset-0 bg-gradient-to-br from-[#20A0D8] via-[#20A0D8] to-[#20A0D8] opacity-95" />
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2" 
              style={{ backgroundColor: 'white' }} />
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-5 translate-x-1/3 translate-y-1/3" 
              style={{ backgroundColor: 'white' }} />
          </div>

          <div className="relative z-10 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <img
                src="/icons/medical-wave.png"
                alt="Refero AI Logo"
                className="h-8 w-8 object-contain"
              />
            </div>
            <span className="text-2xl font-bold">Refero.ai</span>
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Intelligent Healthcare Referral System
          </h1>

          <p className="text-lg text-white/80 mb-12 max-w-md">
            AI-powered triage, specialty matching, and care coordination for better patient outcomes.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">40%</div>
              <div className="text-sm text-white/70">Fewer unnecessary referrals</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">60%</div>
              <div className="text-sm text-white/70">Faster specialist matching</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">95%</div>
              <div className="text-sm text-white/70">Patient satisfaction</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm text-white/70">AI health assistant</div>
            </div>
          </div>
        </div>
        </div>

      {/* Right Panel - Auth Forms */}
      <div className={`auth-panel lg:bg-white ${mode === 'signin' ? 'signin-mode' : 'signup-mode'} relative overflow-hidden p-4 sm:p-6`}>
          <div className="w-full max-w-md">
            {/* Sign In Form */}
            {mode === 'signin' && (
              <div className="space-y-6">
                {/* Mobile Logo */}
                <div className="flex items-center justify-center gap-3 lg:hidden">
                  <div 
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: brandColor }}
                  >
                    <img
                      src="/icons/medical-wave.png"
                      alt="Logo"
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                  <span className="text-xl font-bold">Refero.ai</span>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                  <p className="text-gray-600">Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email" className="text-gray-700 font-medium">Email Address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        required
                        className="pl-10 h-11 border-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signin-password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        required
                        className="pl-10 pr-10 h-11 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                 <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="h-11 w-full flex items-center justify-center gap-3 
             border border-gray-300 rounded-lg 
             hover:bg-gray-50 transition-colors
             font-medium text-gray-700">
                        <FcGoogle size={20} />
                        <span>Google</span>
                      </button>
                      <button
                        type="button"
                        className="h-11 w-full flex items-center justify-center gap-3 
             border border-gray-300 rounded-lg 
             hover:bg-gray-50 transition-colors
             font-medium text-gray-700"
                      >
                        <FaFacebookF size={20} color="#1877F2" />
                        <span>Facebook</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700 font-medium block mb-3">Select Your Role</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                        const config = roleConfig[role];
                        const Icon = config.icon;
                        const isSelected = selectedRole === role;
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setSelectedRole(role)}
                            className={`p-4 rounded-lg border-2 transition-all duration-300 transform ${
                              isSelected
                                ? 'scale-105 shadow-lg'
                                : 'border-gray-200 hover:border-gray-300 hover:scale-102 hover:shadow-md'
                            }`}
                            style={{
                              borderColor: isSelected ? brandColor : undefined,
                              backgroundColor: isSelected ? `${brandColor}15` : 'transparent',
                            }}
                          >
                            <Icon 
                              className={`h-6 w-6 mx-auto mb-2 transition-all duration-300 transform ${
                                isSelected ? 'scale-125' : 'scale-100'
                              }`}
                              style={{ color: isSelected ? brandColor : '#999' }}
                            />
                            <div className={`text-xs font-semibold transition-colors duration-300 ${
                              isSelected ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {config.label.split(' ')[0]}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-11 font-semibold text-white"
                    style={{ backgroundColor: brandColor }}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="font-semibold transition-colors"
                      style={{ color: brandColor }}
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Sign Up Form */}
            {mode === 'signup' && (
              <div className="space-y-6">
                {/* Mobile Logo */}
                <div className="flex items-center justify-center gap-3 lg:hidden">
                  <div 
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: brandColor }}
                  >
                    <img
                      src="/icons/medical-wave.png"
                      alt="Logo"
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                  <span className="text-xl font-bold">Refero.ai</span>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                  <p className="text-gray-600">Join us to get started</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name" className="text-gray-700 font-medium">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signUpFullName}
                      onChange={(e) => setSignUpFullName(e.target.value)}
                      required
                      className="mt-1 h-11 border-gray-300"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-email" className="text-gray-700 font-medium">Email Address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        required
                        className="pl-10 h-11 border-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-phone" className="text-gray-700 font-medium">Phone Number</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        className="pl-10 h-11 border-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        required
                        className="pl-10 pr-10 h-11 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Meter */}
                    {signUpPassword && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full transition-all duration-300"
                              style={{ 
                                width: `${passwordStrength.strength}%`,
                                backgroundColor: passwordStrength.color
                              }}
                            />
                          </div>
                          <span className="text-xs font-semibold" style={{ color: passwordStrength.color }}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={signUpPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}>✓</span>
                            <span>At least 8 characters</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={/[A-Z]/.test(signUpPassword) ? 'text-green-600' : 'text-gray-400'}>✓</span>
                            <span>Uppercase letter</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={/[0-9]/.test(signUpPassword) ? 'text-green-600' : 'text-gray-400'}>✓</span>
                            <span>Number</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={/[!@#$%^&*(),.?":{}|<>]/.test(signUpPassword) ? 'text-green-600' : 'text-gray-400'}>✓</span>
                            <span>Special character</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="signup-confirm-password" className="text-gray-700 font-medium">Confirm Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        required
                        className="pl-10 pr-10 h-11 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Social Auth Buttons */}
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="h-11 w-full flex items-center justify-center gap-3 
             border border-gray-300 rounded-lg 
             hover:bg-gray-50 transition-colors
             font-medium text-gray-700"
                      >
                        <FcGoogle size={20} />
                        <span>Google</span>
                      </button>
                      <button
                        type="button"
                        className="h-11 w-full flex items-center justify-center gap-3 
             border border-gray-300 rounded-lg 
             hover:bg-gray-50 transition-colors
             font-medium text-gray-700"
                      >
                        <FaFacebookF size={20} color="#1877F2" />
                        <span>Facebook</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700 font-medium block mb-3">Select Your Role</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                        const config = roleConfig[role];
                        const Icon = config.icon;
                        const isSelected = selectedRole === role;
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setSelectedRole(role)}
                            className={`p-4 rounded-lg border-2 transition-all duration-300 transform ${
                              isSelected
                                ? 'scale-105 shadow-lg'
                                : 'border-gray-200 hover:border-gray-300 hover:scale-102 hover:shadow-md'
                            }`}
                            style={{
                              borderColor: isSelected ? brandColor : undefined,
                              backgroundColor: isSelected ? `${brandColor}15` : 'transparent',
                            }}
                          >
                            <Icon 
                              className={`h-6 w-6 mx-auto mb-2 transition-all duration-300 transform ${
                                isSelected ? 'scale-125' : 'scale-100'
                              }`}
                              style={{ color: isSelected ? brandColor : '#999' }}
                            />
                            <div className={`text-xs font-semibold transition-colors duration-300 ${
                              isSelected ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {config.label.split(' ')[0]}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-11 font-semibold text-white"
                    style={{ backgroundColor: brandColor }}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="font-semibold transition-colors"
                      style={{ color: brandColor }}
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
