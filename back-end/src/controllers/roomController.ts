import { Request, Response } from 'express';
import { MeetingRoom } from '../models/MeetingRoom';
import { RoomUser } from '../models/RoomUser';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

interface RoomUserRequest {
  email: string;
  role: 'admin' | 'user';
}

export const createRoom = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { name, description, users = [] } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const transaction = await MeetingRoom.sequelize?.transaction();

        try {
            const room = await MeetingRoom.create({
                name,
                description,
                createdBy: userId
            }, { transaction });

            await RoomUser.create({
                roomId: room.id,
                userId,
                role: 'admin'
            }, { transaction });

            for (const user of users as RoomUserRequest[]) {
                const userToAdd = await User.findOne({ 
                    where: { email: user.email },
                    transaction
                });
                
                if (userToAdd) {
                    await RoomUser.create({
                        roomId: room.id,
                        userId: userToAdd.id,
                        role: user.role
                    }, { transaction });
                }
            }

            await transaction?.commit();
            res.status(201).json(room);
        } catch (error) {
            await transaction?.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Error in createRoom:', error);
        res.status(500).json({ 
            message: 'Failed to create room',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getRoomById = async (req: Request, res: Response): Promise<void> => {
    try {
        const room = await MeetingRoom.findByPk(req.params.id, {
            include: [{
                model: User,
                through: { attributes: ['role'] },
                attributes: ['id', 'name', 'email']
            }]
        });

        if (!room) {
            res.status(404).json({ message: 'Room not found' });
            return;
        }

        res.json(room);
    } catch (error) {
        console.error('Error in getRoomById:', error);
        res.status(500).json({ 
            message: 'Failed to fetch room',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getUserRooms = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const rooms = await MeetingRoom.findAll({
            include: [{
                model: User,
                where: { id: userId },
                through: { where: {} },
                attributes: []
            }]
        });

        res.json(rooms);
    } catch (error) {
        console.error('Error in getUserRooms:', error);
        res.status(500).json({ 
            message: 'Failed to fetch user rooms',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const updateRoom = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;
        const roomId = req.params.id;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const isAdmin = await RoomUser.findOne({
            where: {
                roomId,
                userId,
                role: 'admin'
            }
        });

        if (!isAdmin) {
            res.status(403).json({ message: 'Only room admin can update' });
            return;
        }

        const [updated] = await MeetingRoom.update(
            { name, description },
            { where: { id: roomId } }
        );

        if (!updated) {
            res.status(404).json({ message: 'Room not found' });
            return;
        }

        res.json({ message: 'Room updated successfully' });
    } catch (error) {
        console.error('Error in updateRoom:', error);
        res.status(500).json({ 
            message: 'Failed to update room',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const deleteRoom = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const roomId = req.params.id;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const isAdmin = await RoomUser.findOne({
            where: {
                roomId,
                userId,
                role: 'admin'
            }
        });

        if (!isAdmin) {
            res.status(403).json({ message: 'Only room admin can delete' });
            return;
        }

        await MeetingRoom.destroy({ where: { id: roomId } });
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error('Error in deleteRoom:', error);
        res.status(500).json({ 
            message: 'Failed to delete room',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const addUsersToRoom = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const roomId = parseInt(req.params.roomId);
        const { users } = req.body as { users: RoomUserRequest[] };
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const transaction = await MeetingRoom.sequelize?.transaction();

        try {
            const isAdmin = await RoomUser.findOne({
                where: {
                    roomId,
                    userId,
                    role: 'admin'
                },
                transaction
            });

            if (!isAdmin) {
                await transaction?.rollback();
                res.status(403).json({ message: 'Only room admin can add users' });
                return;
            }

            const results = [];
            for (const user of users) {
                const userToAdd = await User.findOne({ 
                    where: { email: user.email },
                    transaction
                });

                if (userToAdd) {
                    const [roomUser, created] = await RoomUser.upsert({
                        roomId,
                        userId: userToAdd.id,
                        role: user.role
                    }, {
                        transaction,
                        returning: true
                    });

                    results.push({
                        email: user.email,
                        status: created ? 'added' : 'updated',
                        role: roomUser.role
                    });
                }
            }

            await transaction?.commit();
            res.json({ 
                message: 'Users processed successfully',
                results
            });
        } catch (error) {
            await transaction?.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Error in addUsersToRoom:', error);
        res.status(500).json({ 
            message: 'Failed to add users',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};