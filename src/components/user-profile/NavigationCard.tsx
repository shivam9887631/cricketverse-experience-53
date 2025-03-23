
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface NavigationItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface NavigationCardProps {
  items: NavigationItem[];
}

const NavigationCard: React.FC<NavigationCardProps> = ({ items }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigation</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {items.map((item, i) => (
          <Button key={i} variant="ghost" className="w-full justify-start" asChild>
            <a href={item.path} className="flex items-center">
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
              <ChevronRight className="ml-auto h-4 w-4" />
            </a>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default NavigationCard;
