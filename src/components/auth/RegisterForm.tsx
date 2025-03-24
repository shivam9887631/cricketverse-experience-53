
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';
import { authService } from '@/services/authService';

interface RegisterFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onSuccess: () => void;
}

const RegisterForm = ({ isLoading, setIsLoading, onSuccess }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'spectator'
  });
  
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.register(
        formData.email, 
        formData.password, 
        formData.name,
        formData.userType
      );
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
        variant: "default",
      });
      onSuccess();
    } catch (error) {
      setIsLoading(false);
      
      // Handle Firebase errors
      if (error instanceof FirebaseError) {
        let errorMessage = "An error occurred. Please try again.";
        
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "Email is already in use. Please try another or sign in.";
            break;
          case 'auth/invalid-email':
            errorMessage = "Invalid email address.";
            break;
          case 'auth/weak-password':
            errorMessage = "Password is too weak. Please choose a stronger password.";
            break;
          default:
            console.error("Authentication error:", error);
        }
        
        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium leading-6">
          Full Name
        </label>
        <div className="mt-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="form-input pl-10 block w-full"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6">
          Email address
        </label>
        <div className="mt-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="form-input pl-10 block w-full"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium leading-6">
          Password
        </label>
        <div className="mt-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            className="form-input pl-10 pr-10 block w-full"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="userType" className="block text-sm font-medium leading-6">
          I am a
        </label>
        <select
          id="userType"
          name="userType"
          className="form-input block w-full mt-2"
          value={formData.userType}
          onChange={handleChange}
        >
          <option value="spectator">Spectator</option>
          <option value="player">Player</option>
          <option value="admin">Tournament Organizer</option>
        </select>
      </div>

      <div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex justify-center items-center relative overflow-hidden gap-2"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Create account
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
};

export default RegisterForm;
