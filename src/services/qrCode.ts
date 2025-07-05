import { apiClient } from "./api";
import type { User, LeaderboardGroup } from "../types";

export interface QRCodeData {
  type: "user" | "group";
  id: string;
  metadata?: Record<string, unknown>;
}

export interface QRCodeScanResult {
  type: "user" | "group";
  data: User | LeaderboardGroup;
  success: boolean;
  message?: string;
}

export class QRCodeService {
  private static instance: QRCodeService;

  private constructor() {}

  public static getInstance(): QRCodeService {
    if (!QRCodeService.instance) {
      QRCodeService.instance = new QRCodeService();
    }
    return QRCodeService.instance;
  }

  // Generate QR Code for User Profile
  public generateUserQRCode(userId: string): string {
    const qrData: QRCodeData = {
      type: "user",
      id: userId,
      metadata: {
        timestamp: Date.now(),
        version: "1.0",
      },
    };

    // In a real app, this would generate an actual QR code image
    // For now, we'll return a data URL that encodes the information
    const encodedData = btoa(JSON.stringify(qrData));
    return `chrysalis://scan?data=${encodedData}`;
  }

  // Generate QR Code for Leaderboard Group
  public generateGroupQRCode(groupId: string): string {
    const qrData: QRCodeData = {
      type: "group",
      id: groupId,
      metadata: {
        timestamp: Date.now(),
        version: "1.0",
      },
    };

    const encodedData = btoa(JSON.stringify(qrData));
    return `chrysalis://scan?data=${encodedData}`;
  }

  // Generate QR Code Image (SVG format)
  public generateQRCodeSVG(data: string, size: number = 200): string {
    // This is a simplified QR code generator
    // In a real app, you'd use a library like qrcode or qr-code-generator

    // Generate a simple pattern based on the data
    const hash = this.simpleHash(data);
    const pattern = this.generatePattern(hash, size);

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="white"/>
        ${pattern}
        <text x="${size / 2}" y="${size - 10}" text-anchor="middle" font-size="8" fill="#666">
          Chrysalis QR
        </text>
      </svg>
    `;
  }

  // Scan and Parse QR Code
  public async scanQRCode(qrCodeData: string): Promise<QRCodeScanResult> {
    try {
      // Parse the QR code data
      const parsedData = this.parseQRCodeData(qrCodeData);

      if (!parsedData) {
        return {
          type: "user",
          data: {} as User,
          success: false,
          message: "Invalid QR code format",
        };
      }

      // Fetch the actual data based on type
      if (parsedData.type === "user") {
        const user = await this.fetchUserData(parsedData.id);
        return {
          type: "user",
          data: user,
          success: true,
          message: "User profile found",
        };
      } else if (parsedData.type === "group") {
        const group = await this.fetchGroupData(parsedData.id);
        return {
          type: "group",
          data: group,
          success: true,
          message: "Group found",
        };
      }

      return {
        type: "user",
        data: {} as User,
        success: false,
        message: "Unknown QR code type",
      };
    } catch (error) {
      console.error("Failed to scan QR code:", error);
      return {
        type: "user",
        data: {} as User,
        success: false,
        message: "Failed to process QR code",
      };
    }
  }

  // Parse QR Code Data from URL or encoded string
  private parseQRCodeData(qrCodeData: string): QRCodeData | null {
    try {
      // Handle chrysalis:// URLs
      if (qrCodeData.startsWith("chrysalis://scan?data=")) {
        const encodedData = qrCodeData.split("data=")[1];
        const decodedData = atob(encodedData);
        return JSON.parse(decodedData) as QRCodeData;
      }

      // Handle direct JSON
      if (qrCodeData.startsWith("{")) {
        return JSON.parse(qrCodeData) as QRCodeData;
      }

      // Handle base64 encoded data
      try {
        const decodedData = atob(qrCodeData);
        return JSON.parse(decodedData) as QRCodeData;
      } catch {
        // Not base64, try as-is
        return JSON.parse(qrCodeData) as QRCodeData;
      }
    } catch (error) {
      console.error("Failed to parse QR code data:", error);
      return null;
    }
  }

  // Fetch User Data
  private async fetchUserData(userId: string): Promise<User> {
    try {
      const response = await apiClient.get<User>(`/users/${userId}`);

      if (response.data) {
        return response.data;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error;
    }
  }

  // Fetch Group Data
  private async fetchGroupData(groupId: string): Promise<LeaderboardGroup> {
    try {
      const response = await apiClient.get<LeaderboardGroup>(
        `/groups/${groupId}`,
      );

      if (response.data) {
        return response.data;
      } else {
        throw new Error("Group not found");
      }
    } catch (error) {
      console.error("Failed to fetch group data:", error);
      throw error;
    }
  }

  // Camera Access for QR Code Scanning
  public async startCamera(): Promise<MediaStream | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      return stream;
    } catch (error) {
      console.error("Failed to access camera:", error);
      return null;
    }
  }

  public stopCamera(stream: MediaStream): void {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }

  // Share QR Code
  public async shareQRCode(
    qrCodeData: string,
    _type: "user" | "group",
    name: string,
  ): Promise<boolean> {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Join ${name} on Chrysalis`,
          text: `Scan this QR code to connect with ${name} on Chrysalis meditation app`,
          url: qrCodeData,
        });
        return true;
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(qrCodeData);
        return true;
      }
    } catch (error) {
      console.error("Failed to share QR code:", error);
      return false;
    }
  }

  // Download QR Code as Image
  public downloadQRCode(
    svgString: string,
    filename: string = "chrysalis-qr.png",
  ): void {
    try {
      // Convert SVG to Canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        // Download as PNG
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
          }
        }, "image/png");
      };

      // Convert SVG to data URL
      const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      img.src = url;
    } catch (error) {
      console.error("Failed to download QR code:", error);
    }
  }

  // Validate QR Code Format
  public validateQRCode(qrCodeData: string): boolean {
    try {
      const parsedData = this.parseQRCodeData(qrCodeData);
      return (
        parsedData !== null &&
        (parsedData.type === "user" || parsedData.type === "group") &&
        typeof parsedData.id === "string" &&
        parsedData.id.length > 0
      );
    } catch {
      return false;
    }
  }

  // Get QR Code History (recently scanned)
  public getQRCodeHistory(): QRCodeData[] {
    try {
      const history = localStorage.getItem("qr_code_history");
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  // Save QR Code to History
  public saveToHistory(qrCodeData: QRCodeData): void {
    try {
      const history = this.getQRCodeHistory();

      // Remove if already exists
      const filtered = history.filter(
        (item) => !(item.type === qrCodeData.type && item.id === qrCodeData.id),
      );

      // Add to beginning
      filtered.unshift({
        ...qrCodeData,
        metadata: {
          ...qrCodeData.metadata,
          scannedAt: Date.now(),
        },
      });

      // Keep only last 20 items
      const limited = filtered.slice(0, 20);

      localStorage.setItem("qr_code_history", JSON.stringify(limited));
    } catch (error) {
      console.error("Failed to save QR code to history:", error);
    }
  }

  // Clear QR Code History
  public clearHistory(): void {
    try {
      localStorage.removeItem("qr_code_history");
    } catch (error) {
      console.error("Failed to clear QR code history:", error);
    }
  }

  // Generate Quick Actions for Scanned Items
  public getQuickActions(scanResult: QRCodeScanResult): Array<{
    label: string;
    action: string;
    icon: string;
  }> {
    if (scanResult.type === "user") {
      return [
        { label: "View Profile", action: "view_profile", icon: "👤" },
        { label: "Follow User", action: "follow", icon: "➕" },
        { label: "Send Message", action: "message", icon: "💬" },
        { label: "Share Profile", action: "share", icon: "📤" },
      ];
    } else if (scanResult.type === "group") {
      return [
        { label: "View Group", action: "view_group", icon: "👥" },
        { label: "Join Group", action: "join", icon: "🔗" },
        { label: "Share Group", action: "share", icon: "📤" },
      ];
    }

    return [];
  }

  // Utility methods for QR code generation
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private generatePattern(hash: number, size: number): string {
    const cellSize = Math.floor(size / 25);
    let pattern = "";

    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        const value = (hash + i * 25 + j) % 3;
        if (value === 0) {
          const x = i * cellSize;
          const y = j * cellSize;
          pattern += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
        }
      }
    }

    return pattern;
  }
}

export const qrCodeService = QRCodeService.getInstance();
