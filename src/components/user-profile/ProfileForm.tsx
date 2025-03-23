
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  address: string;
}

interface ProfileFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={onChange} 
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          value={formData.email} 
          onChange={onChange} 
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input 
          id="phone" 
          name="phone" 
          value={formData.phone} 
          onChange={onChange} 
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea 
          id="bio" 
          name="bio" 
          value={formData.bio} 
          onChange={onChange} 
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Input 
          id="address" 
          name="address" 
          value={formData.address} 
          onChange={onChange} 
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
};

export default ProfileForm;
