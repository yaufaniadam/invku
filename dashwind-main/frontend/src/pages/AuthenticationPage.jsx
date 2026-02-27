import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  Layers,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Auth Illustration Component
const AuthIllustration = () => (
  <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 via-accent to-primary/10 items-center justify-center p-12 relative overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
    <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
    
    {/* Main illustration content */}
    <div className="relative z-10 max-w-lg text-center">
      {/* Illustration SVG */}
      <div className="mb-8">
        <svg viewBox="0 0 400 300" className="w-full h-auto">
          {/* Background shapes */}
          <ellipse cx="200" cy="280" rx="150" ry="20" fill="hsl(var(--muted))" opacity="0.5" />
          
          {/* Person on bench */}
          <g transform="translate(80, 100)">
            {/* Bench */}
            <rect x="20" y="100" width="120" height="8" rx="2" fill="hsl(var(--muted-foreground))" opacity="0.3" />
            <rect x="25" y="108" width="8" height="50" fill="hsl(var(--muted-foreground))" opacity="0.3" />
            <rect x="127" y="108" width="8" height="50" fill="hsl(var(--muted-foreground))" opacity="0.3" />
            
            {/* Person body */}
            <ellipse cx="80" cy="40" rx="20" ry="22" fill="#FFD5C8" /> {/* Head */}
            <path d="M60 60 Q80 80 100 60 L95 100 L65 100 Z" fill="hsl(var(--primary))" /> {/* Body */}
            <rect x="65" y="95" width="30" height="20" fill="hsl(var(--primary))" rx="3" /> {/* Torso */}
            
            {/* Hair */}
            <path d="M60 35 Q60 20 80 18 Q100 20 100 35 Q95 30 80 32 Q65 30 60 35" fill="#4A3728" />
            
            {/* Tablet */}
            <rect x="90" y="70" width="25" height="35" rx="3" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
            <rect x="93" y="75" width="19" height="25" rx="1" fill="hsl(var(--primary))" opacity="0.2" />
          </g>
          
          {/* Floating card/login form */}
          <g transform="translate(200, 60)">
            <rect x="0" y="0" width="120" height="150" rx="12" fill="hsl(var(--card))" filter="url(#shadow)" />
            <circle cx="60" cy="35" r="20" fill="hsl(var(--secondary))" />
            <circle cx="60" cy="35" r="12" fill="hsl(var(--muted-foreground))" opacity="0.3" />
            
            {/* Form fields */}
            <rect x="15" y="65" width="90" height="12" rx="6" fill="hsl(var(--secondary))" />
            <rect x="15" y="85" width="90" height="12" rx="6" fill="hsl(var(--secondary))" />
            
            {/* Button */}
            <rect x="15" y="110" width="90" height="25" rx="6" fill="hsl(var(--primary))" />
            <text x="60" y="127" textAnchor="middle" fill="white" fontSize="10" fontWeight="500">Login</text>
          </g>
          
          {/* Decorative elements */}
          <circle cx="120" cy="80" r="30" fill="hsl(var(--primary))" opacity="0.1" />
          <circle cx="120" cy="80" r="20" fill="hsl(var(--primary))" opacity="0.2" />
          <path d="M115 75 L125 85 L135 70" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Tree/plant */}
          <g transform="translate(50, 150)">
            <rect x="8" y="60" width="4" height="40" fill="hsl(var(--muted-foreground))" opacity="0.4" />
            <ellipse cx="10" cy="50" rx="15" ry="20" fill="hsl(var(--success))" opacity="0.3" />
            <ellipse cx="10" cy="45" rx="12" ry="15" fill="hsl(var(--success))" opacity="0.4" />
          </g>
          
          {/* Cloud */}
          <g transform="translate(280, 30)">
            <ellipse cx="20" cy="15" rx="20" ry="12" fill="hsl(var(--secondary))" />
            <ellipse cx="40" cy="18" rx="15" ry="10" fill="hsl(var(--secondary))" />
            <ellipse cx="30" cy="22" rx="18" ry="8" fill="hsl(var(--secondary))" />
          </g>
          
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.1)" />
            </filter>
          </defs>
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Manage Everything in One Place
      </h2>
      <p className="text-muted-foreground">
        Access your dashboard, analytics, and team collaboration tools with a single sign-in.
      </p>
    </div>
  </div>
);

// Sign In Form Component
const SignInForm = ({ onSwitchToSignUp, onSwitchToForgotPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign in logic
    console.log('Sign in:', { email, password, rememberMe });
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 mb-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Layers className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">Dashboard</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Sign In to your Account</h1>
        <p className="text-muted-foreground">Welcome back! Please enter your details</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="pl-11 h-12 rounded-xl border-input bg-secondary/30 focus:bg-card focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="pl-11 pr-11 h-12 rounded-xl border-input bg-secondary/30 focus:bg-card focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={setRememberMe}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
              Remember me
            </Label>
          </div>
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          Sign In
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-muted-foreground">Or sign in with</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-xl border-input hover:bg-secondary/50 font-medium"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-xl border-input hover:bg-secondary/50 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </Button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

// Sign Up Form Component
const SignUpForm = ({ onSwitchToSignIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign up:', formData);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 mb-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Layers className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">Dashboard</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Create your Account</h1>
        <p className="text-muted-foreground">Start your journey with us today</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name Field */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              placeholder="Enter your full name"
              className="pl-11 h-12 rounded-xl border-input bg-secondary/30 focus:bg-card focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="signupEmail" className="text-sm font-medium text-foreground">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="signupEmail"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Enter your email"
              className="pl-11 h-12 rounded-xl border-input bg-secondary/30 focus:bg-card focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="signupPassword" className="text-sm font-medium text-foreground">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="signupPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="Create a password"
              className="pl-11 pr-11 h-12 rounded-xl border-input bg-secondary/30 focus:bg-card focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={formData.agreeTerms}
            onCheckedChange={(checked) => updateField('agreeTerms', checked)}
            className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
            I agree to the{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          Create Account
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-muted-foreground">Or sign up with</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-xl border-input hover:bg-secondary/50 font-medium"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-xl border-input hover:bg-secondary/50 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </Button>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

// Forgot Password Form Component
const ForgotPasswordForm = ({ onSwitchToSignIn, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Simulate sending email
    console.log('Password reset email sent to:', email);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md text-center">
        {/* Success State */}
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Check your Email</h1>
        <p className="text-muted-foreground mb-8">
          We&apos;ve sent a password reset link to<br />
          <span className="font-medium text-foreground">{email}</span>
        </p>
        <Button
          onClick={onSwitchToSignIn}
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          Back to Sign In
        </Button>
        <p className="text-sm text-muted-foreground mt-6">
          Didn&apos;t receive the email?{' '}
          <button
            onClick={() => setIsSubmitted(false)}
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Click to resend
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* Back Button */}
      <button
        onClick={onSwitchToSignIn}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to Sign In</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Forgot Password?</h1>
        <p className="text-muted-foreground">
          No worries! Enter your email and we&apos;ll send you reset instructions.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="resetEmail" className="text-sm font-medium text-foreground">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="resetEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="pl-11 h-12 rounded-xl border-input bg-secondary/30 focus:bg-card focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          Send Reset Link
        </Button>
      </form>
    </div>
  );
};

// Main Authentication Page Component
export default function AuthenticationPage() {
  const [currentView, setCurrentView] = useState('signin'); // 'signin', 'signup', 'forgot'

  return (
    <div className="min-h-screen bg-card flex">
      {/* Left Side - Illustration */}
      <AuthIllustration />

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        {currentView === 'signin' && (
          <SignInForm
            onSwitchToSignUp={() => setCurrentView('signup')}
            onSwitchToForgotPassword={() => setCurrentView('forgot')}
          />
        )}
        {currentView === 'signup' && (
          <SignUpForm onSwitchToSignIn={() => setCurrentView('signin')} />
        )}
        {currentView === 'forgot' && (
          <ForgotPasswordForm onSwitchToSignIn={() => setCurrentView('signin')} />
        )}
      </div>
    </div>
  );
}
