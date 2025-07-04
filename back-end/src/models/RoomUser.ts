import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/db';
import { User } from './User';
import { MeetingRoom } from './MeetingRoom';

export class RoomUser extends Model {
  public roomId!: number;
  public userId!: number;
  public role!: 'admin' | 'user'; 
}

RoomUser.init(
  {
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    modelName: 'RoomUser',
    tableName: 'room_users',
    timestamps: false,
  }
);

User.belongsToMany(MeetingRoom, { through: RoomUser, foreignKey: 'userId' });
MeetingRoom.belongsToMany(User, { through: RoomUser, foreignKey: 'roomId' });