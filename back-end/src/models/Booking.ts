import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/db';
import { User } from './User';
import { MeetingRoom } from './MeetingRoom';

export class Booking extends Model {
    public id!: number;
    public roomId!: number;
    public userId!: number;
    public startTime!: Date;
    public endTime!: Date;
    public description!: string;
}

Booking.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'meeting_rooms',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        modelName: 'Booking',
        tableName: 'bookings',
        timestamps: true,
    }
);

Booking.belongsTo(MeetingRoom, { foreignKey: 'roomId' });
Booking.belongsTo(User, { foreignKey: 'userId' });
MeetingRoom.hasMany(Booking, { foreignKey: 'roomId' });
User.hasMany(Booking, { foreignKey: 'userId' });