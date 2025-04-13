
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import DeviceFeatures from '@/components/device/DeviceFeatures';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone } from 'lucide-react';

const DeviceFeaturesPage = () => {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Smartphone className="mr-2 h-8 w-8" />
            Device Features
          </h1>
          <p className="text-muted-foreground mt-2">
            Explore and interact with your device's native capabilities
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mobile Experience</CardTitle>
            <CardDescription>
              Access your device's hardware features to enhance your cricket experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              CricketVerse can leverage your device's capabilities to provide an enhanced mobile experience.
              Try out the features below to see what's possible on your device.
            </p>
          </CardContent>
        </Card>

        <DeviceFeatures />
      </motion.div>
    </Layout>
  );
};

export default DeviceFeaturesPage;
