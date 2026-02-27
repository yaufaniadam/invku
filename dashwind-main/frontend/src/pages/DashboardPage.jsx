import React, { useState } from 'react';
import { 
  DollarSign, 
  Users, 
  ShoppingCart, 
  TrendingDown 
} from 'lucide-react';
import {
  Sidebar,
  Header,
  StatsCard,
  RevenueChart,
  TrafficChart,
  TransactionsTable,
  TeamMembers,
  TodoList,
  StorageCard,
} from '@/components/dashboard';

const statsData = [
  {
    title: 'Total Revenue',
    value: '$84,254',
    change: '+12.5%',
    changeType: 'increase',
    icon: DollarSign,
    iconColor: 'primary',
  },
  {
    title: 'Active Users',
    value: '24,521',
    change: '+8.2%',
    changeType: 'increase',
    icon: Users,
    iconColor: 'success',
  },
  {
    title: 'New Orders',
    value: '1,842',
    change: '+15.3%',
    changeType: 'increase',
    icon: ShoppingCart,
    iconColor: 'info',
  },
  {
    title: 'Bounce Rate',
    value: '32.4%',
    change: '-4.1%',
    changeType: 'decrease',
    icon: TrendingDown,
    iconColor: 'warning',
  },
];

export default function DashboardPage() {
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
            <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
          </div>

          {/* Row 1: Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {statsData.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                changeType={stat.changeType}
                icon={stat.icon}
                iconColor={stat.iconColor}
              />
            ))}
          </div>

          {/* Row 2: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>
            <div className="lg:col-span-1">
              <TrafficChart />
            </div>
          </div>

          {/* Row 3: Transactions Table */}
          <div className="mb-6 lg:mb-8">
            <TransactionsTable />
          </div>

          {/* Row 4: Team, Todo, Storage */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <TeamMembers />
            <TodoList />
            <StorageCard />
          </div>
        </main>
      </div>
    </div>
  );
}
