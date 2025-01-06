// services/auth.js
import axios from 'axios';


axios.defaults.withCredentials = true;


export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error); // Throw error with backend message
    } else {
      throw new Error('An unexpected error occurred. Please try again.'); // Generic error message
    }
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post('/api/auth/logout', { withCredentials: true });
    return true;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error); // Throw error with backend message
    } else {
      throw new Error('Failed to log out. Please try again.'); // Generic error message
    }
  }
};

export const getSessionStatus = async () => {
  try {
    const response = await axios.get('/api/auth/session', { withCredentials: true });

    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        // Handle expected "no session" scenario without throwing an error
        return null; // Or any value indicating no active session
      } else if (error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error); // Throw error with backend message
      }
    }
    throw new Error('Failed to check session. Please try again.'); // Generic error message
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post('/api/auth/forgot-password', { email }, { withCredentials: true });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error); // Throw error with backend message
    } else {
      throw new Error('Failed to reset password. Please try again.'); // Generic error message
    }
  }
}

export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(`/api/auth/reset-password/${token}`, { password }, { withCredentials: true });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error); // Throw error with backend message
    } else {
      throw new Error('Failed to reset password. Please try again.'); // Generic error message
    }
  }
}

export const verifyResetToken = async (token) => {
  try {
    const response = await axios.get(`/api/auth/verify-reset-token/${token}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || 'Failed to verify token.');
  }
};

export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axios.put('/api/auth/update-password', { currentPassword, newPassword }, { withCredentials: true });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error); // Throw error with backend message
    } else {
      throw new Error('Failed to update password. Please try again.'); // Generic error message
    }
  }
};

export const updateProfilePicture = async (formData) => {
  try {
    const response = await axios.put('/api/auth/update-profile-picture', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true 
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error); // Throw error with backend message
    } else {
      throw new Error('Failed to update profile picture. Please try again.'); // Generic error message
    }
  }
};