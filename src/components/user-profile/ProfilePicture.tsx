
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface ProfilePictureProps {
  name: string;
  avatar: string;
  onUploadImage: () => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ 
  name, 
  avatar, 
  onUploadImage 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>
          Update your profile picture
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <Button variant="outline" className="mb-2" onClick={onUploadImage}>
            <Camera className="mr-2 h-4 w-4" />
            Upload New Image
          </Button>
          <p className="text-xs text-muted-foreground">
            JPG, GIF or PNG. Max size of 800K
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePicture;
