import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {  getUserRooms } from "../services/userService";
import { deleteRoom, type Room } from "../services/roomService";

interface RoomWithRole extends Room {
    role: 'admin' | 'user';
}

function HomePage() {
    const { userId } = useParams<{ userId: string }>();
    const [rooms, setRooms] = useState<RoomWithRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('Current userId:', userId); 
        const fetchRooms = async () => {
            try {
                if (!userId) return;
                const userRooms = await getUserRooms(userId);
                setRooms(userRooms);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [userId]);

    const handleDeleteRoom = async (roomId: number) => {
        try {
            const confirmed = window.confirm('Are you sure you want to delete this room?');
            if (!confirmed) return;
            
            const success = await deleteRoom(roomId);
            if (success) {
                setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to delete room');
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Rooms</h1>
                <Link
                    to={`/${userId}/add-room`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Room
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{room.name}</h2>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${room.role === 'admin'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {room.role}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>

                            <div className="flex justify-between items-center mt-4">
                                <Link
                                    to={`/room/${room.id}`}
                                    className="text-blue-500 hover:text-blue-700 font-medium text-sm transition-colors"
                                >
                                    View Details
                                </Link>

                                {room.role === 'admin' && (
                                    <button
                                        onClick={() => handleDeleteRoom(room.id)}
                                        className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 text-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {rooms.length === 0 && (
                <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No rooms yet</h3>
                    <p className="mt-1 text-gray-500">Get started by creating your first room.</p>
                    <div className="mt-6">
                        <Link
                            to="/add-room"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            New Room
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;