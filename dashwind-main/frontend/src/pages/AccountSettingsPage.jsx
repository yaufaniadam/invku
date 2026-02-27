import React, { useState } from 'react';
import { Sidebar, Header } from '@/components/dashboard';
import { ProfileCard, SecurityCard, PreferencesCard } from '@/components/settings';

export default function AccountSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Main content */}
        <main className="p-4 lg:p-8">
          {/* Page title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your profile, security, and preferences.</p>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card - Spans 2 columns */}
            <ProfileCard />
            
            {/* Security Card - Spans 1 column */}
            <SecurityCard />
            
            {/* Preferences Card - Full width (Spans 3 columns) */}
            <PreferencesCard />
          </div>
        </main>
      </div>
    </div>
  );
}
