import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const trafficData = [
  { name: 'Direct', value: 45, color: '#818cf8' },      // indigo-400
  { name: 'Social', value: 30, color: '#34d399' },      // green-400
  { name: 'Referral', value: 25, color: '#fbbf24' },    // amber-400
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold" style={{ color: data.payload.color }}>
          {data.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {data.value}% ({data.value}k visits)
        </p>
      </div>
    );
  }
  return null;
};

export const TrafficChart = () => {
  const total = trafficData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="border-0 shadow-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Traffic Source</CardTitle>
        <p className="text-sm text-muted-foreground">Where visitors come from</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-4">
        {/* Donut Chart */}
        <div className="relative w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={trafficData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {trafficData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="transition-opacity hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-foreground">{total}k</span>
            <span className="text-xs text-muted-foreground">Total Visits</span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-6 w-full space-y-3">
          {trafficData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-foreground">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{item.value}%</span>
                <span className="text-xs text-muted-foreground">({item.value}k)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficChart;
