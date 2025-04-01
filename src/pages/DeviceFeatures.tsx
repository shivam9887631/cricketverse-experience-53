
import React from 'react';
import Layout from '@/components/Layout';
import DeviceFeatures from '@/components/device/DeviceFeatures';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass } from 'lucide-react';

const DeviceFeaturesPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Device Features</h1>
          <p className="text-muted-foreground">
            Explore and interact with mobile device hardware capabilities
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Compass className="mr-2" /> Mobile Device Capabilities
            </CardTitle>
            <CardDescription>
              Access hardware features like GPS location, device information, and motion sensors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeviceFeatures />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DeviceFeaturesPage;
