import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'Product Designer',
    avatar: 'sarah',
    status: 'online',
  },
  {
    name: 'Alex Chen',
    role: 'Frontend Developer',
    avatar: 'alex',
    status: 'online',
  },
  {
    name: 'Maria Garcia',
    role: 'Backend Developer',
    avatar: 'maria',
    status: 'offline',
  },
  {
    name: 'David Kim',
    role: 'Project Manager',
    avatar: 'david',
    status: 'online',
  },
  {
    name: 'Lisa Wong',
    role: 'UX Researcher',
    avatar: 'lisa',
    status: 'away',
  },
];

const statusColors = {
  online: 'bg-success',
  offline: 'bg-muted-foreground',
  away: 'bg-warning',
};

const statusLabels = {
  online: 'Online',
  offline: 'Offline',
  away: 'Away',
};

export const TeamMembers = () => {
  return (
    <Card className="border-0 shadow-card h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Team Members</CardTitle>
        <p className="text-sm text-muted-foreground">Your active collaborators</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {teamMembers.map((member, index) => (
          <div 
            key={index} 
            className="flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-secondary cursor-pointer"
          >
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatar}`} 
                />
                <AvatarFallback>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span 
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
                  statusColors[member.status]
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{member.name}</p>
              <p className="text-sm text-muted-foreground truncate">{member.role}</p>
            </div>
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              member.status === 'online' && 'bg-success/10 text-success',
              member.status === 'offline' && 'bg-muted text-muted-foreground',
              member.status === 'away' && 'bg-warning/10 text-warning',
            )}>
              {statusLabels[member.status]}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TeamMembers;
