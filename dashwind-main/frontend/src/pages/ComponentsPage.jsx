import React, { useState } from 'react';
import { Sidebar, Header } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X,
  Bell,
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  Settings,
  User,
  Mail,
  Heart,
  Star,
  Zap,
  Loader2,
  ArrowRight,
  ExternalLink,
  Copy,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Toast Demo Component
const ToastDemo = () => {
  const showSuccessToast = () => {
    toast.success('Success!', {
      description: 'Your changes have been saved successfully.',
    });
  };

  const showErrorToast = () => {
    toast.error('Error!', {
      description: 'Something went wrong. Please try again.',
    });
  };

  const showWarningToast = () => {
    toast.warning('Warning!', {
      description: 'Please review your input before proceeding.',
    });
  };

  const showInfoToast = () => {
    toast.info('Information', {
      description: 'A new update is available for download.',
    });
  };

  const showPromiseToast = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Saving changes...',
        success: 'Changes saved successfully!',
        error: 'Failed to save changes.',
      }
    );
  };

  const showActionToast = () => {
    toast('New notification', {
      description: 'You have a new message from John.',
      action: {
        label: 'View',
        onClick: () => console.log('View clicked'),
      },
    });
  };

  return (
    <Card className="border-0 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Toast Notifications</CardTitle>
        <CardDescription>Click buttons to trigger different toast types</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Button onClick={showSuccessToast} className="bg-success hover:bg-success/90 text-success-foreground gap-2">
            <CheckCircle className="h-4 w-4" />
            Success Toast
          </Button>
          <Button onClick={showErrorToast} variant="destructive" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            Error Toast
          </Button>
          <Button onClick={showWarningToast} className="bg-warning hover:bg-warning/90 text-warning-foreground gap-2">
            <AlertTriangle className="h-4 w-4" />
            Warning Toast
          </Button>
          <Button onClick={showInfoToast} className="bg-info hover:bg-info/90 text-info-foreground gap-2">
            <Info className="h-4 w-4" />
            Info Toast
          </Button>
          <Button onClick={showPromiseToast} variant="outline" className="gap-2">
            <Loader2 className="h-4 w-4" />
            Promise Toast
          </Button>
          <Button onClick={showActionToast} variant="secondary" className="gap-2">
            <Bell className="h-4 w-4" />
            Action Toast
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Modal Demo Component
const ModalDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-0 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Modals & Dialogs</CardTitle>
        <CardDescription>Different types of modal dialogs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {/* Basic Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Basic Modal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Item</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new item in your collection.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Item Name</label>
                  <input type="text" placeholder="Enter item name" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea placeholder="Enter description" rows={3} className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Confirmation Dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Confirmation
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                  Yes, delete account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Large Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Large Modal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription>
                  Manage your account settings and preferences.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium">Name</label>
                  <input type="text" defaultValue="John Doe" className="col-span-3 flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium">Email</label>
                  <input type="email" defaultValue="john@example.com" className="col-span-3 flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium">Role</label>
                  <select className="col-span-3 flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    <option>Admin</option>
                    <option>Editor</option>
                    <option>Viewer</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

// Alert Demo Component
const AlertDemo = () => {
  const [showDismissible, setShowDismissible] = useState(true);

  return (
    <Card className="border-0 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Alerts</CardTitle>
        <CardDescription>Various alert styles and types</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Success Alert */}
        <Alert className="border-success/20 bg-success/10">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertTitle className="text-success">Success!</AlertTitle>
          <AlertDescription className="text-success/80">
            Your profile has been updated successfully.
          </AlertDescription>
        </Alert>

        {/* Error Alert */}
        <Alert className="border-destructive/20 bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertTitle className="text-destructive">Error!</AlertTitle>
          <AlertDescription className="text-destructive/80">
            There was a problem processing your request. Please try again.
          </AlertDescription>
        </Alert>

        {/* Warning Alert */}
        <Alert className="border-warning/20 bg-warning/10">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertTitle className="text-warning">Warning!</AlertTitle>
          <AlertDescription className="text-warning/80">
            Your subscription will expire in 3 days. Please renew to continue.
          </AlertDescription>
        </Alert>

        {/* Info Alert */}
        <Alert className="border-info/20 bg-info/10">
          <Info className="h-4 w-4 text-info" />
          <AlertTitle className="text-info">Information</AlertTitle>
          <AlertDescription className="text-info/80">
            A new version is available. Update now to get the latest features.
          </AlertDescription>
        </Alert>

        {/* Dismissible Alert */}
        {showDismissible && (
          <Alert className="border-primary/20 bg-primary/10 relative">
            <Bell className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">Notification</AlertTitle>
            <AlertDescription className="text-primary/80">
              This is a dismissible alert. Click the X to close it.
            </AlertDescription>
            <button 
              onClick={() => setShowDismissible(false)}
              className="absolute top-3 right-3 text-primary/60 hover:text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        )}
        {!showDismissible && (
          <Button variant="outline" size="sm" onClick={() => setShowDismissible(true)}>
            Show Dismissible Alert
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Horizontal Tabs Demo
const HorizontalTabsDemo = () => {
  return (
    <Card className="border-0 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Horizontal Tabs</CardTitle>
        <CardDescription>Standard horizontal tab navigation</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-secondary/50 p-1 rounded-xl">
            <TabsTrigger value="account" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Account
            </TabsTrigger>
            <TabsTrigger value="password" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Password
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="billing" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Billing
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="mt-6 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Account Settings</h4>
              <p className="text-sm text-muted-foreground">
                Manage your account information and preferences.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input type="text" defaultValue="John Doe" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input type="email" defaultValue="john@example.com" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="password" className="mt-6 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Password Settings</h4>
              <p className="text-sm text-muted-foreground">
                Update your password to keep your account secure.
              </p>
            </div>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <input type="password" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <input type="password" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="notifications" className="mt-6 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Notification Preferences</h4>
              <p className="text-sm text-muted-foreground">
                Choose what notifications you want to receive.
              </p>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/30 cursor-pointer">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-primary text-primary" />
                <div>
                  <p className="text-sm font-medium">Email notifications</p>
                  <p className="text-xs text-muted-foreground">Receive email updates</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/30 cursor-pointer">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-primary text-primary" />
                <div>
                  <p className="text-sm font-medium">Push notifications</p>
                  <p className="text-xs text-muted-foreground">Receive push updates</p>
                </div>
              </label>
            </div>
          </TabsContent>
          <TabsContent value="billing" className="mt-6 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Billing Information</h4>
              <p className="text-sm text-muted-foreground">
                Manage your billing details and subscription.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Pro Plan</p>
                  <p className="text-sm text-muted-foreground">$29/month</p>
                </div>
                <Button size="sm">Upgrade</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Vertical Tabs Demo
const VerticalTabsDemo = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Settings },
  ];

  return (
    <Card className="border-0 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Vertical Tabs</CardTitle>
        <CardDescription>Side navigation tab layout</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Vertical Tab List */}
          <div className="sm:w-48 flex sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h4 className="font-medium">Profile Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Update your profile information visible to other users.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Display Name</label>
                    <input type="text" defaultValue="John Doe" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <input type="text" defaultValue="@johndoe" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'email' && (
              <div className="space-y-4">
                <h4 className="font-medium">Email Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Manage your email addresses and preferences.
                </p>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-secondary/30 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">john@example.com</p>
                      <p className="text-xs text-muted-foreground">Primary email</p>
                    </div>
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">Verified</span>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h4 className="font-medium">Notification Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Choose how you want to be notified.
                </p>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span className="text-sm">Email notifications</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span className="text-sm">Push notifications</span>
                    <input type="checkbox" className="h-4 w-4" />
                  </label>
                </div>
              </div>
            )}
            {activeTab === 'security' && (
              <div className="space-y-4">
                <h4 className="font-medium">Security Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Secure your account with additional protections.
                </p>
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Enable Two-Factor Authentication
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Buttons Demo Component
const ButtonsDemo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <Card className="border-0 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Buttons</CardTitle>
        <CardDescription>Various button styles and states</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Buttons */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Primary Variants</h4>
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button className="bg-success hover:bg-success/90 text-success-foreground">Success</Button>
            <Button variant="destructive">Destructive</Button>
            <Button className="bg-warning hover:bg-warning/90 text-warning-foreground">Warning</Button>
            <Button className="bg-info hover:bg-info/90 text-info-foreground">Info</Button>
          </div>
        </div>

        {/* Secondary Buttons */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Secondary Variants</h4>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link Button</Button>
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Sizes</h4>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><Plus className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* With Icons */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">With Icons</h4>
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
            <Button variant="secondary" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button className="gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* States */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">States</h4>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleLoadingClick} disabled={isLoading} className="gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? 'Loading...' : 'Click to Load'}
            </Button>
            <Button disabled>Disabled</Button>
            <Button variant="outline" disabled>Disabled Outline</Button>
          </div>
        </div>

        {/* Icon Buttons */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Icon Buttons</h4>
          <div className="flex flex-wrap gap-3">
            <Button size="icon" variant="outline">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <Star className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button size="icon" className="bg-success hover:bg-success/90">
              <CheckCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Button Groups */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Button Groups</h4>
          <div className="inline-flex rounded-lg border border-border overflow-hidden">
            <Button variant="ghost" className="rounded-none border-r border-border">
              Left
            </Button>
            <Button variant="ghost" className="rounded-none border-r border-border">
              Center
            </Button>
            <Button variant="ghost" className="rounded-none">
              Right
            </Button>
          </div>
        </div>

        {/* Gradient Buttons */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Special Styles</h4>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 gap-2">
              <Zap className="h-4 w-4" />
              Gradient
            </Button>
            <Button variant="outline" className="rounded-full gap-2">
              <ExternalLink className="h-4 w-4" />
              Rounded
            </Button>
            <Button className="shadow-lg shadow-primary/25 gap-2">
              <Star className="h-4 w-4" />
              With Shadow
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Page Component
export default function ComponentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-4 lg:p-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">UI Components</h1>
            <p className="text-muted-foreground mt-1">Explore various UI components and their variants.</p>
          </div>

          {/* Components Grid */}
          <div className="space-y-6">
            {/* Row 1: Toast & Buttons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ToastDemo />
              <ModalDemo />
            </div>

            {/* Row 2: Alerts */}
            <AlertDemo />

            {/* Row 3: Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HorizontalTabsDemo />
              <VerticalTabsDemo />
            </div>

            {/* Row 4: Buttons */}
            <ButtonsDemo />
          </div>
        </main>
      </div>
    </div>
  );
}
