import React, { useEffect, useState } from "react";
import { addUsersToRoom, createRoom } from "../services/roomService";
import { getAllUsers, searchUsersByEmail } from "../services/userService";

interface User {
    id: number;
    name: string;
    email: string;
}

function AddRoomPage() {
    const [roomName, setRoomName] = useState("");
    const [description, setDescription] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<{ email: string, role: 'admin' | 'user' }[]>([]);
    const [searchEmail, setSearchEmail] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getAllUsers();
                setUsers(users);
                setFilteredUsers(users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const searchUsers = async () => {
          if (searchEmail.trim() === '') {
            setFilteredUsers(users);
          } else {
            try {
              const foundUsers = await searchUsersByEmail(searchEmail);
              setFilteredUsers(foundUsers);
            } catch (error) {
              console.error('Search error:', error);
              setFilteredUsers([]);
            }
          }
        };
        searchUsers();
      }, [searchEmail, users]);

      const handleUserSelect = (user: User, role: 'admin' | 'user') => {
        setSelectedUsers(prev => {
          const existing = prev.find(u => u.email === user.email);
          if (existing) {
            if (existing.role === role) {
              return prev.filter(u => u.email !== user.email);
            }
            return prev.map(u => 
              u.email === user.email ? { ...u, role } : u
            );
          }
          return [...prev, { email: user.email, role }];
        });
      };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const newRoom = await createRoom(roomName, description, selectedUsers);
            if (selectedUsers.length > 0) {
                await addUsersToRoom(newRoom.id, selectedUsers);
              }
            alert(`Кімната "${newRoom.name}" успішно створена!`);
            setRoomName('');
            setDescription('');
            setSelectedUsers([]);
        } catch (error) {
            console.error('Error creating room:', error);
            alert('Помилка при створенні кімнати');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div>
            <h1>Add Room</h1>
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Створити нову кімнату</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="roomName">
                            Назва кімнати*
                        </label>
                        <input
                            id="roomName"
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="description">
                            Опис
                        </label>
                        <textarea
                            id="description"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            Додати користувачів
                        </label>
                        <input
                            type="text"
                            placeholder="Пошук по email"
                            className="w-full px-3 py-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                        />

                        <div className="max-h-60 overflow-y-auto border rounded-lg p-2">
                            {filteredUsers.length === 0 ? (
                                <p className="text-gray-500 p-2">Користувачів не знайдено</p>
                            ) : (
                                filteredUsers.map(user => (
                                    <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50">
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>

                                        <div className="flex space-x-2">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                    checked={selectedUsers.some(u => u.email === user.email && u.role === 'admin')}
                                                onChange={() => handleUserSelect(user, 'admin')}
                                                />
                                                <span className="ml-2">Admin</span>
                                            </label>

                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-5 w-5 text-green-600"
                                                    checked={selectedUsers.some(u => u.email === user.email && u.role === 'user')}
                                                onChange={() => handleUserSelect(user, 'user')}
                                                />
                                                <span className="ml-2">User</span>
                                            </label>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {selectedUsers.length > 0 && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <h3 className="font-medium mb-2">Вибрано користувачів:</h3>
                            <ul className="space-y-1">
                                {selectedUsers.map((user, index) => (
                                    <li key={index} className="flex justify-between">
                                        <span>{user.email}</span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-green-100 text-green-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 px-4 rounded-lg text-white font-medium ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isLoading ? 'Створення...' : 'Створити кімнату'}
                    </button>
                </form>
            </div>


        </div>
    )
}

export default AddRoomPage;