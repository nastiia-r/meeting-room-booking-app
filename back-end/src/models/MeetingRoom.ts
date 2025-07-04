import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/db';
import { User } from './User';

export class MeetingRoom extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public createdBy!: number; 
}

MeetingRoom.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      }
  },
  {
    sequelize,
    modelName: 'MeetingRoom',
    tableName: 'meeting_rooms',
    timestamps: false,
  }
);

MeetingRoom.belongsTo(User, { foreignKey: 'createdBy' });
User.hasMany(MeetingRoom, { foreignKey: 'createdBy' });