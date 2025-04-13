
import React from 'react';
import NetworkStatus from '@/components/device/NetworkStatus';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pb-16">
        <div className="container px-4 py-2">
          <NetworkStatus />
          {children}
        </div>
      </main>
    </div>
  );
};

export default MobileLayout;
