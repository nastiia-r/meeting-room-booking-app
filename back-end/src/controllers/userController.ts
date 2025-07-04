// controllers/userController.ts
import { Request, Response } from 'express';
import { User } from '../models/User';
import { Op } from 'sequelize';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const getAllUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email'],
            where: {
                id: { [Op.ne]: req.user?.id } 
            },
            order: [['name', 'ASC']]
        });

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            message: 'Failed to fetch users',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const searchUsersByEmail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { email } = req.query;
        
        if (!email || typeof email !== 'string') {
            res.status(400).json({ message: 'Valid email parameter is required' });
            return;
        }

        const users = await User.findAll({
            attributes: ['id', 'name', 'email'],
            where: {
                email: { [Op.iLike]: `%${email}%` },
                id: { [Op.ne]: req.user?.id } 
            },
            limit: 10
        });

        res.json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ 
            message: 'Failed to search users',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};