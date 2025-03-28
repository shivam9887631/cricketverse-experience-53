
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import QRCodeScanner from '@/components/multimedia/QRCodeScanner';
import CameraComponent from '@/components/multimedia/CameraComponent';
import MediaGallery from '@/components/multimedia/MediaGallery';
import AudioPlayer from '@/components/multimedia/AudioPlayer';

const Multimedia = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Multimedia Features</h1>
          <p className="text-muted-foreground">
            Explore various multimedia capabilities like camera, gallery, audio playback, and QR code scanning.
          </p>
        </div>

        <Tabs defaultValue="camera" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="camera">Camera</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="qrcode">QR Scanner</TabsTrigger>
          </TabsList>
          
          <TabsContent value="camera">
            <Card>
              <CardHeader>
                <CardTitle>Camera Access</CardTitle>
                <CardDescription>Take photos using your device camera</CardDescription>
              </CardHeader>
              <CardContent>
                <CameraComponent />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle>Media Gallery</CardTitle>
                <CardDescription>Browse your photos and videos</CardDescription>
              </CardHeader>
              <CardContent>
                <MediaGallery />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audio">
            <Card>
              <CardHeader>
                <CardTitle>Audio Player</CardTitle>
                <CardDescription>Play and control audio files</CardDescription>
              </CardHeader>
              <CardContent>
                <AudioPlayer />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="qrcode">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Scanner</CardTitle>
                <CardDescription>Scan QR codes with your device camera</CardDescription>
              </CardHeader>
              <CardContent>
                <QRCodeScanner />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Multimedia;
