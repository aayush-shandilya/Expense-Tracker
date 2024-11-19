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

    // Updated method to handle user login with online status
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
            pipeline.hset(userKey, 'isOnline', '1'); // Add online status
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

    // Updated method to handle user logout with online status
    async removeUserFromRedis(userId, socketId) {
        try {
            console.log(`Removing user from Redis - UserID: ${userId}, SocketID: ${socketId}`);
            
            const userKey = `user:${userId}`;
            const socketKey = `socket:${socketId}`;

            // Update last active time before removing
            await this.redis.hset(userKey, 'lastActive', new Date().toISOString());
            await this.redis.hset(userKey, 'isOnline', '0'); // Set offline status

            await Promise.all([
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

    // New method to check if user is online
    async isUserOnline(userId) {
        try {
            const isActive = await this.redis.sismember('active_users', userId);
            const userKey = `user:${userId}`;
            const isOnline = await this.redis.hget(userKey, 'isOnline');
            
            return isActive && isOnline === '1';
        } catch (error) {
            console.error('Redis isUserOnline error:', error);
            return false;
        }
    }

    // New method to get user's last active time
    async getUserLastActive(userId) {
        try {
            const userKey = `user:${userId}`;
            const lastActive = await this.redis.hget(userKey, 'lastActive');
            return lastActive || null;
        } catch (error) {
            console.error('Redis getUserLastActive error:', error);
            return null;
        }
    }

    // New method to get online status for multiple users
    async getBulkOnlineStatus(userIds) {
        try {
            const pipeline = this.redis.pipeline();
            userIds.forEach(userId => {
                const userKey = `user:${userId}`;
                pipeline.hget(userKey, 'isOnline');
                pipeline.hget(userKey, 'lastActive');
            });

            const results = await pipeline.exec();
            const onlineStatus = {};

            userIds.forEach((userId, index) => {
                const isOnlineResult = results[index * 2];
                const lastActiveResult = results[index * 2 + 1];

                onlineStatus[userId] = {
                    isOnline: isOnlineResult[1] === '1',
                    lastActive: lastActiveResult[1] || null
                };
            });

            return onlineStatus;
        } catch (error) {
            console.error('Redis getBulkOnlineStatus error:', error);
            return {};
        }
    }

    // New method to broadcast online status change
    async broadcastUserStatus(userId, isOnline, io) {
        try {
            const activeUsers = await this.redis.smembers('active_users');
            const userSocketIds = await Promise.all(
                activeUsers.map(uid => this.getUserSocketId(uid))
            );

            // Filter out null socket IDs and broadcast to all active users
            userSocketIds
                .filter(socketId => socketId)
                .forEach(socketId => {
                    io.to(socketId).emit('user_status_changed', {
                        userId,
                        isOnline,
                        timestamp: new Date().toISOString()
                    });
                });

            return true;
        } catch (error) {
            console.error('Redis broadcastUserStatus error:', error);
            return false;
        }
    }

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