const API_URL = "http://localhost:5000/api";

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