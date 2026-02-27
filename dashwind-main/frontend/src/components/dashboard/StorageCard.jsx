import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { HardDrive, Image, FileText, Film, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

const storageBreakdown = [
  { type: 'Images', size: '24.5 GB', Icon: Image, bgClass: 'bg-primary/10', textClass: 'text-primary' },
  { type: 'Documents', size: '18.2 GB', Icon: FileText, bgClass: 'bg-success/10', textClass: 'text-success' },
  { type: 'Videos', size: '15.8 GB', Icon: Film, bgClass: 'bg-warning/10', textClass: 'text-warning' },
  { type: 'Music', size: '9.5 GB', Icon: Music, bgClass: 'bg-info/10', textClass: 'text-info' },
];

const storageStats = {
  used: 68,
  total: 100,
};

export const StorageCard = () => {
  const percentUsed = (storageStats.used / storageStats.total) * 100;

  return (
    <Card className="border-0 shadow-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Storage Usage</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Cloud storage overview</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <HardDrive className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress section */}
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold text-foreground">{storageStats.used}</span>
              <span className="text-lg text-muted-foreground"> / {storageStats.total} GB</span>
            </div>
            <span className="text-sm font-medium text-primary">{percentUsed.toFixed(0)}% used</span>
          </div>
          <Progress value={percentUsed} className="h-3 bg-secondary" />
        </div>

        {/* Storage breakdown */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Storage Breakdown</p>
          {storageBreakdown.map((item, index) => {
            const IconComponent = item.Icon;
            return (
              <div 
                key={index} 
                className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-secondary"
              >
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", item.bgClass)}>
                  <IconComponent className={cn("h-4 w-4", item.textClass)} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.type}</p>
                </div>
                <span className="text-sm font-semibold text-foreground">{item.size}</span>
              </div>
            );
          })}
        </div>

        {/* Upgrade button */}
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Upgrade Storage
        </Button>
      </CardContent>
    </Card>
  );
};

export default StorageCard;
