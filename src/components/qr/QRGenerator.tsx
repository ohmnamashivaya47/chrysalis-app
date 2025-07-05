import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Copy, Check } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { cn } from "../../utils/cn";

interface QRGeneratorProps {
  userId?: string;
  username?: string;
  className?: string;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({
  userId = "current_user",
  username = "YourUsername",
  className,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate QR code data
    const qrData = `chr_user_${userId}_meditation_buddy`;

    // In a real app, this would use the qrCode service
    // For now, we'll use a QR code API service
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&bgcolor=f8faf8&color=1a4a3a&qzone=2`;
    setQrCodeUrl(qrApiUrl);
  }, [userId]);

  const handleCopyLink = async () => {
    const shareData = `chr_user_${userId}_meditation_buddy`;
    try {
      await navigator.clipboard.writeText(shareData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = `chrysalis-qr-${username}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Connect with me on Chrysalis",
          text: `Join me for meditation on Chrysalis! Scan my QR code to connect.`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to copying link
      handleCopyLink();
    }
  };

  return (
    <div className={cn("", className)}>
      <Card className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-sage-900 mb-2">
            Your QR Code
          </h3>
          <p className="text-sage-600">
            Share this code with other meditators to connect instantly
          </p>
        </div>

        {/* QR Code Display */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="bg-white p-4 rounded-2xl shadow-lg border-4 border-sage-100">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="Your Chrysalis QR Code"
                  className="w-64 h-64 object-contain"
                />
              ) : (
                <div className="w-64 h-64 bg-sage-50 rounded-lg flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-sage-300 border-t-sage-600 rounded-full"></div>
                </div>
              )}
            </div>

            {/* Decorative corners */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-4 border-t-4 border-warmGold rounded-tl-lg"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 border-r-4 border-t-4 border-warmGold rounded-tr-lg"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-4 border-b-4 border-warmGold rounded-bl-lg"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-4 border-b-4 border-warmGold rounded-br-lg"></div>
          </motion.div>
        </div>

        {/* User Info */}
        <div className="text-center mb-6">
          <p className="text-sage-900 font-medium">@{username}</p>
          <p className="text-sage-600 text-sm">Meditation Buddy</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex items-center gap-2"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Save
          </Button>

          <Button
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-sage-50 rounded-lg p-4">
          <h4 className="font-medium text-sage-900 mb-2">How to use:</h4>
          <ul className="text-sm text-sage-600 space-y-1">
            <li>• Share this QR code with friends who also use Chrysalis</li>
            <li>• They can scan it to instantly connect with you</li>
            <li>• See each other's meditation progress and achievements</li>
            <li>• Encourage each other on your mindfulness journey</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
