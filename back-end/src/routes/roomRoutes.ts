import express from 'express';
import { 
  createRoom, 
  getRoomById, 
  deleteRoom, 
  addUsersToRoom 
} from '../controllers/roomController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, createRoom);
router.get('/:id', authenticateToken, getRoomById);
router.delete('/:id', authenticateToken, deleteRoom);
router.post('/:roomId/users', authenticateToken, addUsersToRoom);

export default router;