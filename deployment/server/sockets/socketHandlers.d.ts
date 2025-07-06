import { Server as SocketIOServer, Socket } from 'socket.io';
export declare const authenticateSocket: (socket: Socket, next: (err?: Error) => void) => Promise<void>;
export declare const setupSocketHandlers: (io: SocketIOServer) => void;
export default setupSocketHandlers;
//# sourceMappingURL=socketHandlers.d.ts.map