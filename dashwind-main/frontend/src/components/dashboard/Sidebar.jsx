import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  ShoppingCart,
  FileText,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Layers,
  Table2,
  ChevronRight,
  ChevronDown,
  Cpu,
  FileSpreadsheet,
  Bitcoin,
  Component
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Menu items with submenu support
const menuItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    href: '/' 
  },
  { 
    icon: BarChart3, 
    label: 'Analytics', 
    href: '#' 
  },
  { 
    icon: FileSpreadsheet, 
    label: 'Invoice', 
    href: '#',
    hasSubmenu: true,
    submenu: [
      { label: 'All Invoices', href: '/invoice/INV-0022', dotColor: 'bg-primary' },
      { label: 'Create Invoice', href: '/invoice/create', dotColor: 'bg-success' },
      { label: 'Invoice Templates', href: '#', dotColor: 'bg-info' },
    ]
  },
  { 
    icon: Cpu, 
    label: 'AI Application', 
    href: '#',
    hasSubmenu: true,
    submenu: [
      { label: 'Text Generator', href: '#', dotColor: 'bg-primary' },
      { label: 'Code Generator', href: '#', dotColor: 'bg-warning' },
      { label: 'Image Generator', href: '#', dotColor: 'bg-info' },
      { label: 'Voice Generator', href: '#', dotColor: 'bg-destructive' },
      { label: 'Video Generator', href: '#', dotColor: 'bg-success' },
    ]
  },
  { 
    icon: Users, 
    label: 'Customers', 
    href: '#' 
  },
  { 
    icon: ShoppingCart, 
    label: 'Orders', 
    href: '#' 
  },
  { 
    icon: Table2, 
    label: 'Tables', 
    href: '/tables' 
  },
  { 
    icon: Component, 
    label: 'UI Components', 
    href: '/components' 
  },
  { 
    icon: FileText, 
    label: 'Reports', 
    href: '#',
    hasSubmenu: true,
    submenu: [
      { label: 'Sales Report', href: '#', dotColor: 'bg-success' },
      { label: 'User Analytics', href: '#', dotColor: 'bg-primary' },
      { label: 'Revenue Report', href: '#', dotColor: 'bg-warning' },
    ]
  },
];

const secondaryItems = [
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: HelpCircle, label: 'Help Center', href: '#' },
];

// Submenu Item Component
const SubmenuItem = ({ item, isActive }) => {
  return (
    <Link
      to={item.href}
      className={cn(
        "flex items-center gap-3 py-2.5 pl-12 pr-4 text-sm transition-colors duration-150",
        isActive
          ? "text-primary font-medium"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", item.dotColor)} />
      <span>{item.label}</span>
    </Link>
  );
};

// Menu Item with Submenu Component
const MenuItemWithSubmenu = ({ item, isActive, isOpen, onToggle, location }) => {
  const hasActiveSubmenu = item.submenu?.some(sub => location.pathname === sub.href);
  const shouldHighlight = isActive || hasActiveSubmenu || isOpen;

  return (
    <div className="space-y-1">
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center justify-between w-full rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
          shouldHighlight
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-secondary hover:text-sidebar-foreground"
        )}
      >
        <div className="flex items-center gap-3">
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </div>
        <ChevronDown 
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )} 
        />
      </button>
      
      {/* Submenu */}
      <div 
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="py-1">
          {item.submenu?.map((subItem, index) => (
            <SubmenuItem
              key={index}
              item={subItem}
              isActive={location.pathname === subItem.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Regular Menu Item Component
const RegularMenuItem = ({ item, isActive }) => {
  return (
    <Link
      to={item.href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-150",
        isActive
          ? "bg-sidebar-active text-sidebar-active-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-sidebar-foreground"
      )}
    >
      <item.icon className="h-5 w-5" />
      <span>{item.label}</span>
      {isActive && (
        <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
      )}
    </Link>
  );
};

export const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({});
  
  const isActive = (href) => {
    if (href === '/') return location.pathname === '/' || location.pathname === '/dashboard';
    return location.pathname === href;
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:z-30",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Layers className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">Dashboard</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={onToggle}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              if (item.hasSubmenu) {
                return (
                  <MenuItemWithSubmenu
                    key={index}
                    item={item}
                    isActive={isActive(item.href)}
                    isOpen={openSubmenus[item.label]}
                    onToggle={() => toggleSubmenu(item.label)}
                    location={location}
                  />
                );
              }
              return (
                <RegularMenuItem
                  key={index}
                  item={item}
                  isActive={isActive(item.href)}
                />
              );
            })}
          </div>

          <div className="mt-8">
            <p className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Support
            </p>
            <div className="mt-4 space-y-1">
              {secondaryItems.map((item, index) => (
                <RegularMenuItem
                  key={index}
                  item={item}
                  isActive={isActive(item.href)}
                />
              ))}
            </div>
          </div>
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-xl p-3 transition-colors duration-150 hover:bg-secondary cursor-pointer">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
              alt="User"
              className="h-10 w-10 rounded-full bg-secondary"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">Admin</p>
            </div>
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
