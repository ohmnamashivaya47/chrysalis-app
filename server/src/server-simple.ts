import dotenv from 'dotenv';
import { server } from './app-simple';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

// Start server
server.listen(PORT, () => {
  console.log(`
🚀 Chrysalis Backend (Simple) is running!
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Server: http://localhost:${PORT}
🔌 Socket.io: Enabled
📝 API: http://localhost:${PORT}/api
  `);
});

export default server;
