import express from 'express';
import { 
  createRoom, 
  getRoomById, 
  getUserRooms, 
  updateRoom, 
  deleteRoom, 
  addUsersToRoom 
} from '../controllers/roomController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, createRoom);
router.get('/my', authenticateToken, getUserRooms);
router.get('/:id', authenticateToken, getRoomById);
router.put('/:id', authenticateToken, updateRoom);
router.delete('/:id', authenticateToken, deleteRoom);
router.post('/:roomId/users', authenticateToken, addUsersToRoom);

export default router;