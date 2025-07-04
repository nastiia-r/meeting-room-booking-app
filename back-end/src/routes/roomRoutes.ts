import express from 'express';
import { 
  createRoom, 
  deleteRoom, 
  addUsersToRoom,
  getRoomMeetings,
  getRoomById,
} from '../controllers/roomController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, createRoom);
router.delete('/:id', authenticateToken, deleteRoom);
router.post('/:roomId/users', authenticateToken, addUsersToRoom);
router.get('/:roomId', authenticateToken, getRoomById);

router.get('/:roomId/meetings', authenticateToken, getRoomMeetings);
// router.get('/:roomId/check-admin/:userId', authenticateToken, checkRoomAdmin);

export default router;