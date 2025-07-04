import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkRoomAdmin, getRoomById } from "../services/roomService";
import { getRoomMeetings, type Meeting } from "../services/meetingService.ts";
import type { Room } from "../services/roomService";

function RoomPage() {
    const { roomId } = useParams<{ roomId: string }>();
    const [room, setRoom] = useState<Room | null>(null);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!roomId) return;
                const roomData = await getRoomById(parseInt(roomId));
                setRoom(roomData);
                const meetingsData = await getRoomMeetings(parseInt(roomId));
                setMeetings(meetingsData);
                const userId = localStorage.getItem('userId');

                // if (userId) {
                //     const adminStatus = await checkRoomAdmin(parseInt(userId), parseInt(roomId));
                //     setIsAdmin(adminStatus);
                // }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [roomId]);

    // const handleDeleteMeeting = async (meetingId: number) => {
    //     try {
    //         const confirmed = window.confirm('Are you sure you want to cancel this meeting?');
    //         if (!confirmed) return;

    //         setMeetings(prev => prev.filter(m => m.id !== meetingId));
    //     } catch (error) {
    //         alert(error instanceof Error ? error.message : 'Failed to cancel meeting');
    //     }
    // };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    if (!room) return <div className="text-center py-8">Room not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{room.name}</h1>
                <p className="text-gray-600">{room.description}</p>
            </div>

            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Meetings</h2>
                <Link
                    to={`/room/${roomId}/add-meeting`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                    Add Meeting
                </Link>
            </div>

            <div className="space-y-4">
                {meetings.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No meetings scheduled for this room yet.</p>
                    </div>
                ) : (
                    meetings.map(meeting => (
                        <div key={meeting.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-lg">
                                        {meeting.description || 'Meeting'}
                                    </h3>
                                    {meeting.Organizer && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Organized by: {meeting.Organizer.name} ({meeting.Organizer.email})
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">
                                        {new Date(meeting.startTime).toLocaleString()}
                                    </p>
                                    <p className="text-gray-600">
                                        to {new Date(meeting.endTime).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex justify-end space-x-2">
                                <Link
                                    to={`/meeting/${meeting.id}/edit`}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    Edit
                                </Link>
                                {/* <button 
                                    onClick={() => handleDeleteMeeting(meeting.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Cancel
                                </button> */}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default RoomPage;