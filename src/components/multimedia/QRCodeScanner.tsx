
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, QrCode } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const QRCodeScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivId = "qr-reader";

  useEffect(() => {
    // Cleanup scanner when component unmounts
    return () => {
      if (scannerRef.current && scanning) {
        scannerRef.current.stop().catch(error => {
          console.error("Failed to stop camera:", error);
        });
      }
    };
  }, [scanning]);

  const startScanner = () => {
    setError(null);
    setScanResult(null);
    setScanning(true);

    try {
      const html5QrCode = new Html5Qrcode(scannerDivId);
      scannerRef.current = html5QrCode;

      html5QrCode.start(
        { facingMode: "environment" },  // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Success callback
          setScanResult(decodedText);
          stopScanner();
        },
        (errorMessage) => {
          // Error callback - Do nothing here as we handle errors separately
          console.log(errorMessage);
        }
      ).catch((err) => {
        setError(`Failed to access camera: ${err}`);
        setScanning(false);
      });
    } catch (err) {
      setError("QR Scanner initialization failed.");
      setScanning(false);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        setScanning(false);
      }).catch((error) => {
        console.error("Failed to stop scanner:", error);
        setScanning(false);
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {scanResult && (
        <Alert>
          <QrCode className="h-4 w-4" />
          <AlertTitle>Scan Result</AlertTitle>
          <AlertDescription className="break-all">{scanResult}</AlertDescription>
        </Alert>
      )}

      <div id={scannerDivId} className={`w-full max-w-sm mx-auto ${scanning ? 'block' : 'hidden'}`}></div>

      <div className="flex justify-center space-x-4">
        {!scanning ? (
          <Button onClick={startScanner}>
            <QrCode className="mr-2" /> Start QR Scanner
          </Button>
        ) : (
          <Button variant="destructive" onClick={stopScanner}>
            Stop Scanner
          </Button>
        )}
      </div>
    </div>
  );
};

export default QRCodeScanner;
