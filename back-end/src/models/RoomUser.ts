import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/db';
import { MeetingRoom } from './MeetingRoom';
import { User } from './User';

export class RoomUser extends Model {
  declare roomId: number;
  declare userId: number;
  declare role: 'admin' | 'user';

  declare Room?: MeetingRoom;
  declare User?: User;
}

RoomUser.init({
  roomId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'meeting_rooms',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user'
  }
}, {
  sequelize,
  modelName: 'room_user',
  tableName: 'room_users',
  timestamps: false
});