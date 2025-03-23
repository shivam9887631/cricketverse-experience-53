
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

interface ActivityItem {
  date: string;
  title: string;
  description: string;
}

interface ActivityCardProps {
  title: string;
  description: string;
  activities: ActivityItem[];
}

const ActivityCard: React.FC<ActivityCardProps> = ({ title, description, activities }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="border-b pb-3">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium">{activity.title}</h4>
                <span className="text-xs text-muted-foreground">
                  {new Date(activity.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
