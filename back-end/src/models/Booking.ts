import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/db';
import { User } from './User';

export class Booking extends Model {
  declare id: number;
  declare roomId: number;
  declare userId: number;
  declare startTime: Date;
  declare endTime: Date;
  declare description: string;
  declare User?: typeof User;

}

Booking.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  sequelize,
  modelName: 'booking',
  tableName: 'bookings',
  timestamps: true
});

Booking.belongsTo(User, {
  foreignKey: 'userId',
  as: 'Organizer' 
});