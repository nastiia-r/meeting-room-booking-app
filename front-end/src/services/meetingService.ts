const API_URL = "http://localhost:5000/api";

export interface Meeting {
    id: number;
    roomId: number;
    userId: number;
    description: string;
    startTime: string;
    endTime: string;
    Organizer?: { 
        id: number;
        name: string;
        email: string;
    };
}

export const getRoomMeetings = async (roomId: number): Promise<Meeting[]> => {
    const response = await fetch(`${API_URL}/rooms/${roomId}/meetings`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch meetings');
    }
    
    return response.json();
};

