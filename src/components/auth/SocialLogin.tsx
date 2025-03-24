
import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';

interface SocialLoginProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onSuccess: () => void;
}

const SocialLogin = ({ isLoading, setIsLoading, onSuccess }: SocialLoginProps) => {
  const { toast } = useToast();
  
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    try {
      if (provider === 'google') {
        await authService.signInWithGoogle();
      } else {
        await authService.signInWithFacebook();
      }
      
      toast({
        title: "Login successful",
        description: "Welcome to CricketVerse!",
        variant: "default",
      });
      
      onSuccess();
    } catch (error) {
      setIsLoading(false);
      
      toast({
        title: "Social login failed",
        description: "There was an error with the social login. Please try again.",
        variant: "destructive",
      });
      console.error("Social login error:", error);
    }
  };

  return (
    <div className="mt-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-background text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          className="btn-outline flex w-full justify-center items-center"
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading}
        >
          <svg className="h-5 w-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
          </svg>
          Google
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          className="btn-outline flex w-full justify-center items-center"
          onClick={() => handleSocialLogin('facebook')}
          disabled={isLoading}
        >
          <svg className="h-5 w-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </motion.button>
      </div>
    </div>
  );
};

export default SocialLogin;
