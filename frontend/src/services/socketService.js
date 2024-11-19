// src/services/socketService.js
import io from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.userId = null;
    }

    connect(userId) {
        if (this.socket?.connected) {
            return;
        }

        this.socket = io('http://localhost:5001', {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.userId = userId;

        this.socket.on('connect', () => {
            console.log('Socket connected');
            this.socket.emit('user_login', userId);
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket() {
        return this.socket;
    }

    isConnected() {
        return this.socket?.connected || false;
    }

    joinRoom(roomId) {
        if (this.socket?.connected) {
            this.socket.emit('join_room', roomId);
        }
    }

    leaveRoom(roomId) {
        if (this.socket?.connected) {
            this.socket.emit('leave_room', roomId);
        }
    }

    sendMessage(messageData) {
        if (this.socket?.connected) {
            this.socket.emit('send_message', messageData);
        }
    }
}

export const socketService = new SocketService();