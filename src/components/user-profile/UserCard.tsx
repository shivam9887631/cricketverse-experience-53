
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserInfo {
  name: string;
  username: string;
  avatar: string;
  role: string;
  team: string;
  matches: number;
  joinDate: string;
}

interface UserCardProps {
  user: UserInfo;
  onEditProfile: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEditProfile }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <CardTitle>{user.name}</CardTitle>
            <CardDescription className="flex items-center">
              @{user.username}
              <Badge variant="outline" className="ml-2">
                {user.role}
              </Badge>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-1 text-sm">
          <div className="font-medium">Team</div>
          <div className="text-muted-foreground">{user.team}</div>
          <div className="font-medium mt-2">Matches</div>
          <div className="text-muted-foreground">{user.matches}</div>
          <div className="font-medium mt-2">Member since</div>
          <div className="text-muted-foreground">
            {new Date(user.joinDate).toLocaleDateString()}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={onEditProfile}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default UserCard;
