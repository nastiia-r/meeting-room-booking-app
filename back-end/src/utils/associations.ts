import { User } from '../models/User';
import { MeetingRoom } from '../models/MeetingRoom';
import { RoomUser } from '../models/RoomUser';
import { Booking } from '../models/Booking';
export function setupAssociations() {
    MeetingRoom.belongsTo(User, {
      foreignKey: 'createdBy',
      as: 'Creator'
    });
  
    User.belongsToMany(MeetingRoom, {
      through: RoomUser,
      foreignKey: 'userId',
      as: 'Rooms'
    });
    
    MeetingRoom.belongsToMany(User, {
      through: RoomUser,
      foreignKey: 'roomId',
      as: 'Members' 
    });
  
    RoomUser.belongsTo(User, {
      foreignKey: 'userId',
      as: 'User'
    });
  
    RoomUser.belongsTo(MeetingRoom, {
      foreignKey: 'roomId',
      as: 'Room' 
    });
  
    User.hasMany(Booking, {
      foreignKey: 'userId',
      as: 'Bookings'
    });
    
    Booking.belongsTo(User, {
      foreignKey: 'userId',
      as: 'User'
    });
    
    MeetingRoom.hasMany(Booking, {
      foreignKey: 'roomId',
      as: 'Bookings'
    });
    
    Booking.belongsTo(MeetingRoom, {
      foreignKey: 'roomId',
      as: 'Room'
    });
  }