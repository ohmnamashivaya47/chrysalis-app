"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_simple_1 = require("./app-simple");
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 3001;
// Start server
app_simple_1.server.listen(PORT, () => {
    console.log(`
🚀 Chrysalis Backend (Simple) is running!
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Server: http://localhost:${PORT}
🔌 Socket.io: Enabled
📝 API: http://localhost:${PORT}/api
  `);
});
exports.default = app_simple_1.server;
//# sourceMappingURL=server-simple.js.map