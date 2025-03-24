
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import SocialLogin from '@/components/auth/SocialLogin';
import WelcomePanel from '@/components/auth/WelcomePanel';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // If user is already logged in, redirect to home
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-8 bg-white dark:bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sm:mx-auto sm:w-full sm:max-w-sm"
        >
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary"
          >
            <Trophy className="h-8 w-8 text-white" />
          </motion.div>
          
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
        >
          {isLogin ? (
            <LoginForm 
              isLoading={isLoading} 
              setIsLoading={setIsLoading} 
              onSuccess={handleSuccess} 
            />
          ) : (
            <RegisterForm 
              isLoading={isLoading} 
              setIsLoading={setIsLoading} 
              onSuccess={handleSuccess} 
            />
          )}

          <SocialLogin 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
            onSuccess={handleSuccess} 
          />

          <p className="mt-10 text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold leading-6 text-primary hover:text-primary/90"
            >
              {isLogin ? 'Sign up now' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </div>
      
      {/* Right Panel - Welcome Image */}
      <WelcomePanel />
    </div>
  );
};

export default Login;
