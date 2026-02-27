import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const notificationOptions = [
  { id: 'marketing', label: 'Marketing Emails', description: 'Receive emails about new features and updates.' },
  { id: 'security', label: 'Security Alerts', description: 'Get notified about security events on your account.' },
  { id: 'weekly', label: 'Weekly Digest', description: 'Receive a weekly summary of your activity.' },
  { id: 'mentions', label: 'Mentions & Comments', description: 'Get notified when someone mentions you.' },
];

const roleOptions = [
  { id: 'admin', label: 'Admin', description: 'Full access to all features' },
  { id: 'editor', label: 'Editor', description: 'Can edit and publish content' },
  { id: 'viewer', label: 'Viewer', description: 'View-only access' },
];

const techOptions = [
  { id: 'react', label: 'React' },
  { id: 'vue', label: 'Vue.js' },
  { id: 'angular', label: 'Angular' },
  { id: 'svelte', label: 'Svelte' },
  { id: 'nextjs', label: 'Next.js' },
  { id: 'tailwind', label: 'Tailwind CSS' },
];

const timezones = [
  { value: 'utc', label: 'UTC (Coordinated Universal Time)' },
  { value: 'est', label: 'EST (Eastern Standard Time)' },
  { value: 'pst', label: 'PST (Pacific Standard Time)' },
  { value: 'cet', label: 'CET (Central European Time)' },
  { value: 'jst', label: 'JST (Japan Standard Time)' },
  { value: 'ist', label: 'IST (India Standard Time)' },
];

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, disabled = false }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        checked ? "bg-primary" : "bg-muted",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-card shadow-lg ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
};

export const PreferencesCard = () => {
  const [showSuccess, setShowSuccess] = useState(true);
  const [notifications, setNotifications] = useState({
    marketing: true,
    security: true,
    weekly: false,
    mentions: true,
  });
  const [selectedRole, setSelectedRole] = useState('editor');
  const [selectedTech, setSelectedTech] = useState(['react', 'nextjs', 'tailwind']);
  const [timezone, setTimezone] = useState('utc');

  const toggleNotification = (id) => {
    setNotifications(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTech = (id) => {
    setSelectedTech(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  return (
    <Card className="border-0 shadow-card col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Preferences & Notifications</CardTitle>
        <CardDescription>Manage your notification settings and preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Success Alert Banner */}
        {showSuccess && (
          <div className="flex items-center justify-between rounded-xl bg-success/10 border border-success/20 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-success">Success!</p>
                <p className="text-sm text-success/80">Successfully updated your notification preferences.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowSuccess(false)}
              className="text-success/60 hover:text-success transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Email Notifications with Toggle Switches */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Email Notifications</h3>
          <div className="space-y-4">
            {notificationOptions.map((option) => (
              <div 
                key={option.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary/30 transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
                <ToggleSwitch
                  checked={notifications[option.id]}
                  onChange={() => toggleNotification(option.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Role Selection - Radio Button Group as Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Role Selection</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {roleOptions.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={cn(
                  "relative flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left",
                  selectedRole === role.id
                    ? "border-primary bg-accent"
                    : "border-border hover:border-muted-foreground/30 hover:bg-secondary/30"
                )}
              >
                <div className={cn(
                  "absolute top-4 right-4 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                  selectedRole === role.id
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                )}>
                  {selectedRole === role.id && (
                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <span className={cn(
                  "text-sm font-semibold",
                  selectedRole === role.id ? "text-primary" : "text-foreground"
                )}>
                  {role.label}
                </span>
                <span className="text-xs text-muted-foreground mt-1">{role.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tech Stack - Checkbox Group as Pills */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Tech Stack</h3>
          <p className="text-xs text-muted-foreground">Select the technologies you work with.</p>
          <div className="flex flex-wrap gap-3">
            {techOptions.map((tech) => (
              <button
                key={tech.id}
                type="button"
                onClick={() => toggleTech(tech.id)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-medium transition-all",
                  selectedTech.includes(tech.id)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
                )}
              >
                {selectedTech.includes(tech.id) && (
                  <CheckCircle className="h-4 w-4" />
                )}
                {tech.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timezone Select */}
        <div className="space-y-2">
          <label htmlFor="timezone" className="text-sm font-semibold text-foreground">
            Timezone
          </label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="flex h-10 w-full max-w-md rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer"
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">Your timezone will be used for all date and time displays.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesCard;
