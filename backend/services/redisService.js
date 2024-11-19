// services/redisService.js
const Redis = require('ioredis');

class RedisService {
    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });

        this.redis.on('connect', () => {
            console.log('Redis connected successfully');
        });

        this.redis.on('error', (error) => {
            console.error('Redis connection error:', error);
        });
    }

    async addUserToRedis(userId, socketId) {
        try {
            console.log(`Adding user to Redis - UserID: ${userId}, SocketID: ${socketId}`);
            
            const userKey = `user:${userId}`;
            const socketKey = `socket:${socketId}`;

            // Clear any existing data for this user
            await this.redis.del(userKey);
            
            const pipeline = this.redis.pipeline();

            pipeline.hset(userKey, 'socketId', socketId);
            pipeline.hset(userKey, 'lastActive', new Date().toISOString());
            pipeline.set(socketKey, userId);
            pipeline.sadd('active_users', userId);

            await pipeline.exec();
            console.log(`User ${userId} added to Redis successfully`);
            return true;
        } catch (error) {
            console.error('Redis addUserToRedis error:', error);
            return false;
        }
    }

    async removeUserFromRedis(userId, socketId) {
        try {
            console.log(`Removing user from Redis - UserID: ${userId}, SocketID: ${socketId}`);
            
            const userKey = `user:${userId}`;
            const socketKey = `socket:${socketId}`;

            await Promise.all([
                this.redis.del(userKey),
                this.redis.del(socketKey),
                this.redis.srem('active_users', userId)
            ]);

            console.log(`User ${userId} removed from Redis successfully`);
            return true;
        } catch (error) {
            console.error('Redis removeUserFromRedis error:', error);
            return false;
        }
    }

    // async handleMessage(message, senderId, receiverId, io) {
    //     try {
    //         console.log('Handling message:', {
    //             senderId,
    //             receiverId,
    //             messageId: message._id
    //         });

    //         const isReceiverActive = await this.isUserInRedis(receiverId);
    //         console.log('Receiver active status:', isReceiverActive);
            
    //         if (isReceiverActive) {
    //             const receiverSocketId = await this.getUserSocketId(receiverId);
    //             console.log('Receiver socket ID:', receiverSocketId);
                
    //             if (receiverSocketId && io?.sockets) {
    //                 console.log(`Emitting message to socket ${receiverSocketId}`);
    //                 io.to(receiverSocketId).emit('receive_message', message);
    //                 return true;
    //             }
    //         }

    //         // If receiver is not active or socket not found, increment unread count
    //         const unreadKey = `unread:${receiverId}:${message.chatRoom}`;
    //         await this.redis.incr(unreadKey);
    //         console.log(`Incremented unread messages for ${receiverId}`);
            
    //         return true;
    //     } catch (error) {
    //         console.error('Redis handleMessage error:', error);
    //         return false;
    //     }
    // }

    async handleMessage(message, senderId, receiverId, io) {
        try {
            console.log('Handling message:', {
                senderId,
                receiverId,
                messageId: message._id
            });

            const isReceiverActive = await this.isUserInRedis(receiverId);
            console.log('Receiver active status:', isReceiverActive);
            
            if (isReceiverActive) {
                const receiverSocketId = await this.getUserSocketId(receiverId);
                console.log('Receiver socket ID:', receiverSocketId);
                
                if (receiverSocketId) {
                    // Get socket instance
                    const socket = io.sockets.sockets.get(receiverSocketId);
                    console.log('Socket instance found:', !!socket);
                    
                    if (socket) {
                        // Emit directly to the socket
                        socket.emit('receive_message', {
                            ...message,
                            timestamp: new Date(),
                            delivered: true
                        });
                        console.log('Message emitted directly to socket');
                        return true;
                    } else {
                        // Socket not found, remove user from active users
                        await this.removeUserFromRedis(receiverId, receiverSocketId);
                        console.log('Socket not found, user removed from active users');
                    }
                }
            }

            // If we reach here, message couldn't be delivered in real-time
            const unreadKey = `unread:${receiverId}:${message.chatRoom}`;
            await this.redis.incr(unreadKey);
            console.log(`Incremented unread messages for ${receiverId}`);
            return false;

        } catch (error) {
            console.error('Redis handleMessage error:', error);
            return false;
        }
    }

    async isUserInRedis(userId) {
        try {
            const isActive = await this.redis.sismember('active_users', userId);
            const userKey = `user:${userId}`;
            const userData = await this.redis.hgetall(userKey);
            
            console.log(`User ${userId} Redis status:`, {
                isActive,
                userData
            });
            
            return isActive;
        } catch (error) {
            console.error('Redis isUserInRedis error:', error);
            return false;
        }
    }

    async getUserSocketId(userId) {
        try {
            const socketId = await this.redis.hget(`user:${userId}`, 'socketId');
            console.log(`Socket ID for user ${userId}:`, socketId);
            return socketId;
        } catch (error) {
            console.error('Redis getUserSocketId error:', error);
            return null;
        }
    }

    async getUserFromSocket(socketId) {
        try {
            const userId = await this.redis.get(`socket:${socketId}`);
            console.log(`User ID for socket ${socketId}:`, userId);
            return userId;
        } catch (error) {
            console.error('Redis getUserFromSocket error:', error);
            return null;
        }
    }
}

module.exports = new RedisService();