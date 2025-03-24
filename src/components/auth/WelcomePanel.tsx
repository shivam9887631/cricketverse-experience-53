
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const WelcomePanel = () => {
  return (
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
  );
};

export default WelcomePanel;
