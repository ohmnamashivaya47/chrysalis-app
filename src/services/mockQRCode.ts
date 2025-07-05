/**
 * Mock QR Code Service - Frontend Only
 */

import type { ApiResponse } from "../types";

export interface QRCodeData {
  userId: string;
  username: string;
  qrCode: string;
  qrCodeImageUrl: string;
}

class MockQRCodeService {
  async generateUserQR(userId: string): Promise<ApiResponse<QRCodeData>> {
    try {
      const username = localStorage.getItem("currentUsername") || "User";
      const qrCode = `chrysalis_user_${userId}`;
      
      // Generate a simple QR code URL (in real app, use proper QR library)
      const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode)}`;

      const qrData: QRCodeData = {
        userId,
        username,
        qrCode,
        qrCodeImageUrl
      };

      return {
        success: true,
        data: qrData
      };
    } catch {
      return {
        success: false,
        error: "Failed to generate QR code"
      };
    }
  }

  async scanQR(qrCodeData: string): Promise<ApiResponse<{ userId: string; username: string }>> {
    try {
      // Parse QR code data
      if (!qrCodeData.startsWith("chrysalis_user_")) {
        return {
          success: false,
          error: "Invalid Chrysalis QR code"
        };
      }

      const userId = qrCodeData.replace("chrysalis_user_", "");
      const currentUserId = localStorage.getItem("currentUserId");

      if (userId === currentUserId) {
        return {
          success: false,
          error: "Cannot scan your own QR code"
        };
      }

      // Mock user lookup
      const mockUsers: Record<string, string> = {
        "demo1": "demo_user",
        "user1": "meditation_master",
        "user2": "zen_warrior",
        "user3": "mindful_soul"
      };

      const username = mockUsers[userId] || "Unknown User";

      return {
        success: true,
        data: {
          userId,
          username
        }
      };
    } catch {
      return {
        success: false,
        error: "Failed to scan QR code"
      };
    }
  }

  async connectWithUser(scannedUserId: string): Promise<ApiResponse<void>> {
    try {
      const currentUserId = localStorage.getItem("currentUserId");
      
      if (!currentUserId) {
        return {
          success: false,
          error: "Not authenticated"
        };
      }

      // Store connection in localStorage (in real app, this would be in the backend)
      const connections = JSON.parse(localStorage.getItem("userConnections") || "[]");
      
      if (!connections.includes(scannedUserId)) {
        connections.push(scannedUserId);
        localStorage.setItem("userConnections", JSON.stringify(connections));
      }

      return {
        success: true,
        data: undefined
      };
    } catch {
      return {
        success: false,
        error: "Failed to connect with user"
      };
    }
  }

  async getUserConnections(_userId: string): Promise<ApiResponse<Array<{ userId: string; username: string }>>> {
    try {
      const connections = JSON.parse(localStorage.getItem("userConnections") || "[]");
      
      // Mock user lookup
      const mockUsers: Record<string, string> = {
        "demo1": "demo_user",
        "user1": "meditation_master",
        "user2": "zen_warrior",
        "user3": "mindful_soul"
      };

      const connectionData = connections.map((connUserId: string) => ({
        userId: connUserId,
        username: mockUsers[connUserId] || "Unknown User"
      }));

      return {
        success: true,
        data: connectionData
      };
    } catch {
      return {
        success: false,
        error: "Failed to get connections"
      };
    }
  }
}

export const qrCodeService = new MockQRCodeService();
