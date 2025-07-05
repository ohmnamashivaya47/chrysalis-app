import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Camera, QrCode, Scan, Check, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { cn } from "../../utils/cn";

interface QRScannerProps {
  onScan?: (qrCode: string) => void;
  className?: string;
}

interface ConnectionResult {
  success: boolean;
  user?: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  message: string;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, className }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [connectionResult, setConnectionResult] =
    useState<ConnectionResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScanning = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasPermission(true);
        setIsScanning(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasPermission(false);
    }
  }, []);

  const stopScanning = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const simulateQRScan = useCallback(() => {
    // Simulate scanning a QR code
    const sampleQRCodes = [
      "chr_user_sarah_meditation_buddy",
      "chr_user_alex_zen_master",
      "chr_user_maya_mindful_friend",
    ];

    const randomQR =
      sampleQRCodes[Math.floor(Math.random() * sampleQRCodes.length)];

    // Simulate connection result
    setTimeout(() => {
      const mockUsers = {
        chr_user_sarah_meditation_buddy: {
          id: "1",
          username: "MindfulSarah",
          displayName: "Sarah Chen",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b2e8b7fb?w=150&h=150&fit=crop&crop=face",
        },
        chr_user_alex_zen_master: {
          id: "2",
          username: "ZenAlex",
          displayName: "Alex Rodriguez",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        },
        chr_user_maya_mindful_friend: {
          id: "3",
          username: "SereneMaya",
          displayName: "Maya Patel",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        },
      };

      const user = mockUsers[randomQR as keyof typeof mockUsers];

      setConnectionResult({
        success: true,
        user,
        message: `Connected with ${user.displayName}! You can now see each other's meditation progress.`,
      });

      stopScanning();
      onScan?.(randomQR);
    }, 2000);
  }, [onScan, stopScanning]);

  if (connectionResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("p-6", className)}
      >
        <Card className="p-6 text-center">
          <div
            className={cn(
              "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4",
              connectionResult.success ? "bg-green-100" : "bg-red-100",
            )}
          >
            {connectionResult.success ? (
              <Check className="w-8 h-8 text-green-600" />
            ) : (
              <X className="w-8 h-8 text-red-600" />
            )}
          </div>

          {connectionResult.success && connectionResult.user && (
            <div className="mb-4">
              <img
                src={
                  connectionResult.user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(connectionResult.user.displayName)}&background=84a584&color=fff`
                }
                alt={connectionResult.user.displayName}
                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
              />
              <h3 className="text-lg font-semibold text-sage-900">
                {connectionResult.user.displayName}
              </h3>
              <p className="text-sage-600">@{connectionResult.user.username}</p>
            </div>
          )}

          <p className="text-sage-700 mb-6">{connectionResult.message}</p>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setConnectionResult(null)}>
              Scan Another
            </Button>
            <Button onClick={() => setConnectionResult(null)}>Done</Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (isScanning) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn("relative", className)}
      >
        <Card className="overflow-hidden">
          <div className="relative aspect-square bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 border-4 border-white rounded-2xl opacity-50"></div>
                <motion.div
                  className="absolute inset-0 border-4 border-warmGold rounded-2xl"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-white opacity-75" />
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/50 rounded-lg p-3 text-center">
                <p className="text-white text-sm mb-2">
                  Point your camera at a Chrysalis QR code
                </p>
                <motion.div
                  className="w-6 h-1 bg-warmGold mx-auto rounded-full"
                  animate={{ scaleX: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-center mt-4 gap-3">
          <Button variant="outline" onClick={stopScanning}>
            Cancel
          </Button>
          <Button onClick={simulateQRScan} className="flex items-center gap-2">
            <Scan className="w-4 h-4" />
            Simulate Scan
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={cn("text-center", className)}>
      <Card className="p-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-deepTeal to-sage-500 rounded-2xl flex items-center justify-center mb-4">
          <Camera className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-xl font-semibold text-sage-900 mb-2">
          Connect with QR Code
        </h3>
        <p className="text-sage-600 mb-6">
          Scan another meditator's QR code to connect and share your meditation
          journey
        </p>

        {hasPermission === false && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-amber-800 text-sm">
              Camera permission is required to scan QR codes. Please allow
              camera access and try again.
            </p>
          </div>
        )}

        <Button
          onClick={startScanning}
          className="flex items-center gap-2 mx-auto"
        >
          <Camera className="w-4 h-4" />
          Start Scanning
        </Button>
      </Card>
    </div>
  );
};
