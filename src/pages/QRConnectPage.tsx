import React, { useState } from "react";
import { Layout } from "../components/common/Layout";
import { QRScanner } from "../components/qr/QRScanner";
import { QRGenerator } from "../components/qr/QRGenerator";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { QrCode, Users, Scan, Share2, UserPlus } from "lucide-react";
import { cn } from "../utils/cn";

type QRMode = "scan" | "share" | "connections";

const QRConnectPage: React.FC = () => {
  const [activeMode, setActiveMode] = useState<QRMode>("scan");

  // Mock connections data
  const connections = [
    {
      id: "1",
      username: "MindfulSarah",
      displayName: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b2e8b7fb?w=150&h=150&fit=crop&crop=face",
      connectionDate: new Date("2024-01-15"),
      mutualSessions: 23,
      status: "online",
    },
    {
      id: "2",
      username: "ZenAlex",
      displayName: "Alex Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      connectionDate: new Date("2024-01-10"),
      mutualSessions: 15,
      status: "offline",
    },
    {
      id: "3",
      username: "SereneMaya",
      displayName: "Maya Patel",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      connectionDate: new Date("2024-01-08"),
      mutualSessions: 31,
      status: "meditating",
    },
  ];

  const modeButtons = [
    { mode: "scan" as const, label: "Scan QR", icon: Scan },
    { mode: "share" as const, label: "Share QR", icon: Share2 },
    { mode: "connections" as const, label: "Connections", icon: Users },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "meditating":
        return "bg-deepTeal";
      case "offline":
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "meditating":
        return "Meditating";
      case "offline":
      default:
        return "Offline";
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-deepTeal to-sage-500 rounded-2xl flex items-center justify-center mb-4">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-sage-900 mb-2">QR Connect</h1>
          <p className="text-sage-600">
            Connect with nearby meditators instantly
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 border border-sage-200 inline-flex">
            {modeButtons.map(({ mode, label, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setActiveMode(mode)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeMode === mode
                    ? "bg-sage-500 text-white shadow-sm"
                    : "text-sage-600 hover:text-sage-900",
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {activeMode === "scan" && (
            <div>
              <QRScanner />
              <div className="mt-6 bg-sage-50 rounded-lg p-4">
                <h3 className="font-medium text-sage-900 mb-2">Quick Tips:</h3>
                <ul className="text-sm text-sage-600 space-y-1">
                  <li>
                    • Ask your friend to show their QR code from the "Share QR"
                    tab
                  </li>
                  <li>• Make sure you have good lighting for the camera</li>
                  <li>• Hold your phone steady when scanning</li>
                  <li>• The QR code should fill most of the scanning area</li>
                </ul>
              </div>
            </div>
          )}

          {activeMode === "share" && (
            <div>
              <QRGenerator userId="current_user" username="YourUsername" />
            </div>
          )}

          {activeMode === "connections" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-sage-900">
                  Your Meditation Buddies ({connections.length})
                </h2>
                <Button size="sm" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Invite Friends
                </Button>
              </div>

              {connections.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto bg-sage-100 rounded-2xl flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-sage-400" />
                  </div>
                  <h3 className="text-lg font-medium text-sage-900 mb-2">
                    No connections yet
                  </h3>
                  <p className="text-sage-600 mb-4">
                    Start connecting with other meditators by scanning QR codes
                  </p>
                  <Button onClick={() => setActiveMode("scan")}>
                    Scan Your First QR Code
                  </Button>
                </Card>
              ) : (
                <div className="space-y-3">
                  {connections.map((connection) => (
                    <Card key={connection.id} className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={connection.avatar}
                            alt={connection.displayName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div
                            className={cn(
                              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                              getStatusColor(connection.status),
                            )}
                          ></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sage-900 truncate">
                            {connection.displayName}
                          </h3>
                          <p className="text-sm text-sage-600">
                            @{connection.username}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-sage-500">
                            <span>
                              Connected{" "}
                              {connection.connectionDate.toLocaleDateString()}
                            </span>
                            <span>
                              {connection.mutualSessions} mutual sessions
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className={cn(
                              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                              connection.status === "online"
                                ? "bg-green-100 text-green-700"
                                : connection.status === "meditating"
                                  ? "bg-deepTeal/10 text-deepTeal"
                                  : "bg-gray-100 text-gray-600",
                            )}
                          >
                            {getStatusText(connection.status)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feature Info */}
        <div className="mt-12">
          <Card className="p-6 bg-gradient-to-r from-sage-50 to-deepTeal/5">
            <h3 className="font-semibold text-sage-900 mb-3">
              Why connect with meditation buddies?
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-sage-600">
              <div className="space-y-2">
                <p>• Share meditation achievements and milestones</p>
                <p>• See each other's progress and streaks</p>
                <p>• Get motivation from friends' meditation habits</p>
              </div>
              <div className="space-y-2">
                <p>• Join group meditation sessions</p>
                <p>• Exchange mindfulness tips and insights</p>
                <p>• Build accountability in your practice</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default QRConnectPage;
