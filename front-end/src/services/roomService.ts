const API_URL = "http://localhost:5000/api";

export interface Room {
  id: number;
  name: string;
  description: string;
  createdBy: number;
}

export interface RoomUser {
  email: string;
  role: 'admin' | 'user';
}

export async function createRoom(
  name: string,
  description: string,
  users: RoomUser[] = []
) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/rooms`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name, description, users }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create room");
    }
    return data as Room;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create room");
  }
}

export async function getRoomById(id: number) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/rooms/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch room");
    }
    return data as Room;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch room");
  }
}


export async function updateRoom(
    id: number,
    name: string,
    description: string
  ) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/rooms/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, description }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update room");
      }
      return data as Room;
    } catch (error: any) {
      throw new Error(error.message || "Failed to update room");
    }
  }
  
  export async function deleteRoom(id: number): Promise<boolean> {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/rooms/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete room");
        }
        
        return true;
    } catch (error: any) {
        console.error('Error deleting room:', error);
        throw new Error(error.message || "Failed to delete room");
    }
}

  

export async function addUsersToRoom(
  roomId: number,
  users: RoomUser[]
) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/rooms/${roomId}/users`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ users }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to add users");
    }
    return data as Room;
  } catch (error: any) {
    throw new Error(error.message || "Failed to add users");
  }
}