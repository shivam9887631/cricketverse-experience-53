
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, User, Lock, Mail, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import { FirebaseError } from 'firebase/app';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'spectator'
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // If user is already logged in, redirect to home
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Login
        await authService.login(formData.email, formData.password);
        toast({
          title: "Login successful",
          description: "Welcome back to CricketVerse!",
          variant: "default",
        });
      } else {
        // Register
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
      }
      
      navigate('/');
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
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = "Invalid email or password.";
            break;
          default:
            console.error("Authentication error:", error);
        }
        
        toast({
          title: isLogin ? "Login failed" : "Registration failed",
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
      
      navigate('/');
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
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
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
            )}
            
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6">
                  Password
                </label>
                {isLogin && (
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-primary hover:text-primary/90">
                      Forgot password?
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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

            {!isLogin && (
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
            )}

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
                    {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    {isLogin ? 'Sign in' : 'Create account'}
                  </>
                )}
              </motion.button>
            </div>
          </form>

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
      
      {/* Right Panel - Cricket Image */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-primary to-cricket-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-8"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-center"
          >
            Welcome to CricketVerse
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-lg text-center max-w-md"
          >
            Your complete cricket companion for all local tournaments, live scores, and statistics.
          </motion.p>
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-10 flex flex-col items-center"
          >
            <Trophy className="h-16 w-16 mb-4" />
            <div className="glass-morphism px-6 py-4 rounded-xl max-w-sm">
              <p className="text-sm">
                "CricketVerse has transformed how we manage our local cricket tournaments. The real-time updates and comprehensive stats have made it our go-to platform."
              </p>
              <p className="mt-2 font-semibold">— Mumbai Cricket Association</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
