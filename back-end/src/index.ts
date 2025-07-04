import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/db';
import { User } from './models/User';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);

app.get('/', (_, res) => {
    res.send('API is running');
});

const start = async () => {
    await connectDB();

    //   await User.sync({ alter: true });
    await User.sync({ force: true });

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

start();
