
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

interface StatItem {
  label: string;
  value: string;
}

interface StatsCardProps {
  title: string;
  description: string;
  stats: StatItem[];
}

const StatsCard: React.FC<StatsCardProps> = ({ title, description, stats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex justify-between border-b pb-2">
              <span className="font-medium">{stat.label}</span>
              <span>{stat.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
