import express from 'express';
import { getAllUsers, searchUsersByEmail } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getAllUsers);
router.get('/search', authenticateToken, searchUsersByEmail);

export default router;