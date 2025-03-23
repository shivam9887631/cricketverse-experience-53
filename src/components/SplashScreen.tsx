
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50"
    >
      <motion.div
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{ 
          scale: 1,
          rotate: 360,
          transition: { 
            scale: { duration: 0.5, ease: "easeOut" },
            rotate: { duration: 1.5, ease: "easeOut" } 
          }
        }}
        className="relative flex items-center justify-center w-24 h-24 mb-8"
      >
        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 border-t-2 border-r-2 border-primary rounded-full animate-spin-slow"></div>
        <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full">
          <Trophy className="w-8 h-8 text-white" />
        </div>
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-6 text-3xl font-bold text-center"
      >
        CricketVerse
      </motion.h1>
      
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "70%" }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xs h-1 mb-4 overflow-hidden bg-gray-200 rounded-full"
      >
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-primary"
        ></motion.div>
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-gray-500"
      >
        Loading cricket universe...
      </motion.p>
    </motion.div>
  );
};

export default SplashScreen;
