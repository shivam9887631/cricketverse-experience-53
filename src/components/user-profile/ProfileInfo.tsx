
import React from 'react';

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
}

interface ProfileInfoProps {
  user: UserInfo;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium text-sm">Full Name</h3>
          <p className="text-muted-foreground">{user.name}</p>
        </div>
        <div>
          <h3 className="font-medium text-sm">Email</h3>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <div>
          <h3 className="font-medium text-sm">Phone</h3>
          <p className="text-muted-foreground">{user.phone}</p>
        </div>
        <div>
          <h3 className="font-medium text-sm">Address</h3>
          <p className="text-muted-foreground">{user.address}</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-sm">Bio</h3>
        <p className="text-muted-foreground">{user.bio}</p>
      </div>
    </div>
  );
};

export default ProfileInfo;
