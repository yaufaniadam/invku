import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SecurityCard = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Simulated error states
  const errors = {
    currentPassword: false,
    newPassword: true,
    confirmPassword: true,
  };

  const errorMessages = {
    newPassword: 'Password must be at least 8 characters and contain a symbol.',
    confirmPassword: 'Passwords do not match.',
  };

  return (
    <Card className="border-0 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Update Password</CardTitle>
        <CardDescription>Ensure your account is using a secure password.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Password */}
        <div className="space-y-2">
          <Label htmlFor="currentPassword" className="text-sm font-medium text-foreground">
            Current Password
          </Label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              className={cn(
                "flex h-9 w-full rounded-lg border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 pr-10",
                "border-input focus:ring-primary focus:border-primary"
              )}
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
            >
              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* New Password - ERROR STATE */}
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-sm font-medium text-foreground">
            New Password
          </Label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              className={cn(
                "flex h-9 w-full rounded-lg border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 pr-16",
                errors.newPassword 
                  ? "border-destructive focus:ring-destructive focus:border-destructive text-destructive" 
                  : "border-input focus:ring-primary focus:border-primary"
              )}
              placeholder="Enter new password"
              defaultValue="weak"
            />
            <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
              {errors.newPassword && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-destructive flex items-center gap-1">
              {errorMessages.newPassword}
            </p>
          )}
        </div>

        {/* Confirm Password - ERROR STATE */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirm Password
          </Label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className={cn(
                "flex h-9 w-full rounded-lg border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 pr-16",
                errors.confirmPassword 
                  ? "border-destructive focus:ring-destructive focus:border-destructive text-destructive" 
                  : "border-input focus:ring-primary focus:border-primary"
              )}
              placeholder="Confirm new password"
              defaultValue="different"
            />
            <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
              {errors.confirmPassword && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive flex items-center gap-1">
              {errorMessages.confirmPassword}
            </p>
          )}
        </div>

        {/* Password Requirements Hint */}
        <div className="rounded-lg bg-secondary/50 p-3 mt-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Password Requirements:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              Minimum 8 characters
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              At least one uppercase letter
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              At least one number
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              At least one symbol (!@#$%^&*)
            </li>
          </ul>
        </div>

        {/* Update Button */}
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
          Update Password
        </Button>
      </CardContent>
    </Card>
  );
};

export default SecurityCard;
