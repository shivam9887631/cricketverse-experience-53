import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Users, User, Calendar, Bell, Menu, X, Home, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/services/authService';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Matches', path: '/match', icon: <Trophy className="w-5 h-5" /> },
    { name: 'Tournament', path: '/tournament', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Players', path: '/players', icon: <Users className="w-5 h-5" /> },
    { name: 'Multimedia', path: '/multimedia', icon: <Trophy className="w-5 h-5" /> },
  ];

  const handleSignOut = async () => {
    try {
      await authService.logout();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out",
        variant: "default",
      });
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out",
        variant: "destructive",
      });
    }
  };

  const authNavItems = currentUser ? [
    { name: 'Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell className="w-5 h-5" /> },
  ] : [
    { name: 'Sign In', path: '/login', icon: <LogOut className="w-5 h-5 rotate-180" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-morphism backdrop-blur-lg border-b border-white/10">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: 0, ease: "easeInOut" }}
              className="flex items-center justify-center w-10 h-10 bg-primary rounded-full"
            >
              <Trophy className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-semibold">CricketVerse</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}

            {authNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
            
            {currentUser && (
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 text-foreground/80 hover:text-primary hover:bg-primary/5"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-2">Sign Out</span>
              </button>
            )}
          </nav>

          {/* Mobile Navigation Toggle */}
          <button
            className="flex items-center justify-center md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="glass-morphism md:hidden"
        >
          <div className="container px-4 py-3 mx-auto">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/80'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              ))}
              
              {authNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/80'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              ))}
              
              {currentUser && (
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="flex items-center px-3 py-3 text-sm font-medium rounded-md text-foreground/80"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="ml-2">Sign Out</span>
                </button>
              )}
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
