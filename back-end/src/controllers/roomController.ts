import { Request, Response } from 'express';
import { MeetingRoom } from '../models/MeetingRoom';
import { RoomUser } from '../models/RoomUser';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { Booking } from '../models/Booking';
import { sequelize } from '../utils/db';

interface RoomUserRequest {
  email: string;
  role: 'admin' | 'user';
}


export const createRoom = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, description, users } = req.body;
      const userId = req.user?.id;
      
      const room = await MeetingRoom.create({
        name,
        description,
        createdBy: userId
      });
      
      await RoomUser.create({
        roomId: room.id,
        userId,
        role: 'admin'
      });
      
      if (users && users.length > 0) {
        for (const user of users) {
          const userToAdd = await User.findOne({ where: { email: user.email } });
          if (userToAdd) {
            await RoomUser.create({
              roomId: room.id,
              userId: userToAdd.id,
              role: user.role || 'user'
            });
          }
        }
      }
      
      res.status(201).json(room);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };
  
  


// export const getRoomById = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const room = await MeetingRoom.findByPk(req.params.id, {
//             include: [{
//                 model: User,
//                 through: { attributes: ['role'] },
//                 attributes: ['id', 'name', 'email']
//             }]
//         });

//         if (!room) {
//             res.status(404).json({ message: 'Room not found' });
//             return;
//         }

//         res.json(room);
//     } catch (error) {
//         console.error('Error in getRoomById:', error);
//         res.status(500).json({ 
//             message: 'Failed to fetch room',
//             error: error instanceof Error ? error.message : 'Unknown error'
//         });
//     }
// };

// export const getRoomMeetings = async (req: Request, res: Response) => {
//     try {
//         const roomId = parseInt(req.params.roomId);
//         const meetings = await Booking.findAll({
//             where: { roomId },
//             include: [{
//                 model: User,
//                 as: 'User',
//                 attributes: ['id', 'name', 'email']
//             }],
//             order: [['startTime', 'ASC']]
//         });
        
//         res.json(meetings);
//     } catch (error) {
//         res.status(500).json({ 
//             message: 'Failed to fetch meetings',
//             error: error instanceof Error ? error.message : 'Unknown error'
//         });
//     }
// };

export const getRoomById = async (req: Request, res: Response): Promise<void> => {
    try {
        const roomId = parseInt(req.params.roomId);
        const room = await MeetingRoom.findByPk(roomId, {
            include: [{
                model: User,
                as: 'Creator',
                attributes: ['id', 'name', 'email']
            }]
        });

        if (!room) {
            res.status(404).json({ message: 'Room not found' });
            return;
        }

        res.json(room);
    } catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({
            message: 'Failed to fetch room',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getRoomMeetings = async (req: Request, res: Response) => {
    try {
        const roomId = parseInt(req.params.roomId);
        
        const meetings = await Booking.findAll({
            where: { roomId },
            include: [{
                model: User,
                as: 'Organizer', 
                attributes: ['id', 'name', 'email']
            }],
            order: [['startTime', 'ASC']]
        });
        
        res.json(meetings);
    } catch (error) {
        console.error('Error fetching meetings:', error);
        res.status(500).json({ 
            message: 'Failed to fetch meetings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const checkRoomAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const roomId = parseInt(req.params.roomId);
        const userId = parseInt(req.params.userId);
        
        const room = await MeetingRoom.findByPk(roomId);
        if (!room) {
            res.status(404).json({ message: 'Room not found' });
            return;
        }
        
        const isAdmin = room.createdBy === userId;
        res.json({ isAdmin });
    } catch (error) {
        console.error('Error checking admin status:', error);
        res.status(500).json({ 
            message: 'Failed to check admin status',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};


export const deleteRoom = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const roomId = parseInt(req.params.id);
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
            res.status(403).json({ message: 'Only room admin can delete this room' });
            return;
        }

        await sequelize.transaction(async (transaction) => {
            await RoomUser.destroy({
                where: { roomId },
                transaction
            });

            await Booking.destroy({
                where: { roomId },
                transaction
            });

            await MeetingRoom.destroy({
                where: { id: roomId },
                transaction
            });
        });

        res.json({ success: true, message: 'Room deleted successfully' });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ 
            success: false,
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