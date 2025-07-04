import express from 'express';
import { getAllUsers, getUserRooms, searchUsersByEmail } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getAllUsers);
router.get('/search', authenticateToken, searchUsersByEmail);
router.get('/:userId/rooms', authenticateToken, getUserRooms);



export default router;