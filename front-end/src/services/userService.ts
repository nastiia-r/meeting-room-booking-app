const API_URL = "http://localhost:5000/api";
import type { Room } from "./roomService";

interface UserResponse {
  id: number;
  name: string;
  email: string;
  role?: 'admin' | 'user';
}

export const getAllUsers = async (): Promise<UserResponse[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_URL}/users`, {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText
      }));
      throw new Error(error.message || 'Failed to fetch users');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
};

export const searchUsersByEmail = async (email: string): Promise<UserResponse[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(
      `${API_URL}/users/search?email=${encodeURIComponent(email)}`, 
      {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText
      }));
      throw new Error(error.message || 'Failed to search users');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in searchUsersByEmail:', error);
    throw error;
  }
};



export const getUserRooms = async (userId: string): Promise<RoomWithRole[]> => {
    const response = await fetch(`${API_URL}/users/${userId}/rooms`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const responseText = await response.text(); 
    
    try {
        const data = JSON.parse(responseText); 
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch user rooms');
        }
        return data;
    } catch (e) {
        console.error('Failed to parse response:', responseText);
        throw new Error(`Server returned unexpected format: ${responseText.substring(0, 100)}`);
    }
};


  export interface RoomWithRole extends Room {
    role: 'admin' | 'user';
  }
