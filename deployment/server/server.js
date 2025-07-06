"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    try {
        // Close database connection
        await app_1.prisma.$disconnect();
        console.log('Database connection closed.');
        // Close server
        app_1.server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
        // Force close after timeout
        setTimeout(() => {
            console.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000);
    }
    catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
};
// Register signal handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});
// Start server
app_1.server.listen(PORT, () => {
    console.log(`
🚀 Chrysalis Meditation App Backend is running!
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Server: http://localhost:${PORT}
💾 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}
🔌 Socket.io: Enabled
📝 API Docs: http://localhost:${PORT}/api
  `);
});
exports.default = app_1.server;
//# sourceMappingURL=server.js.map