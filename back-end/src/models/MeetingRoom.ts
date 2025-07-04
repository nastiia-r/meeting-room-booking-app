import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/db';
import { User } from './User';
import { RoomUser } from './RoomUser';
import { Booking } from './Booking';

export class MeetingRoom extends Model {
  declare id: number;
  declare name: string;
  declare description: string;
  declare createdBy: number;
  
  declare Users?: (User & { RoomUser: RoomUser })[];
  declare Creator?: User;
  declare Bookings?: Booking[];
}

MeetingRoom.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'meeting_room',
  tableName: 'meeting_rooms',
  timestamps: true
});