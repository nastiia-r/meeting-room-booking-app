import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/db';
import { User } from './models/User';
import authRoutes from './routes/authRoutes';
import roomRoutes from './routes/roomRoutes';
import userRoutes from './routes/userRoutes';
import { MeetingRoom } from './models/MeetingRoom';
import { Booking } from './models/Booking';
import { RoomUser } from './models/RoomUser';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);

app.get('/', (_, res) => {
    res.send('API is running');
});

const start = async () => {
    await connectDB();

    //   await User.sync({ alter: true });
    await User.sync();
    await MeetingRoom.sync();
    await Booking.sync();
    await RoomUser.sync();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

start();
