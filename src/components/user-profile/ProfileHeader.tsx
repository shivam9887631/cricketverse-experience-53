
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface ProfileHeaderProps {
  title: string;
  description: string;
  onLogout: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  title, 
  description, 
  onLogout 
}) => {
  return (
    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button variant="outline" size="icon" onClick={onLogout}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProfileHeader;
