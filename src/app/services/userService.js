// src/services/user.js
import axios from "axios";



export const deleteOwnedTrack = async (trackId) => {
  try {
    const response = await axios.delete(
      `/api/tracks/${trackId}`,
      {
        data: {
          trackId
        },
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error); // Throw error with backend message
    } else {
      throw new Error("An unexpected error occurred. Please try again."); // Generic error message
    }
  }
};

export const removeFavoriteTrack = async (trackId, userId) => {
  try {
    const response = await axios.delete(
      "/api/tracks/favorites",
      {
        data: { userId, trackId },
        withCredentials: true
      }
    );
    return true; //response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error); // Throw error with backend message
    } else {
      throw new Error("An unexpected error occurred. Please try again."); // Generic error message
    }
  }
};

export const addFavoriteTrack = async (trackId, userId) => {
  try {
    const response = await axios.post(
      "/api/tracks/favorites",
      { trackId, userId },
      { withCredentials: true }
    );
    return true; //response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error); // Throw error with backend message
    } else {
      throw new Error("An unexpected error occurred. Please try again."); // Generic error message
    }
  }
};

export const fetchFavoriteTracks = async (userId) => {
  try {
    const response = await axios.get("/api/tracks/favorites", {
      params: { userId }, // Correctly pass userId as part of the params object
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error); // Throw error with backend message
    } else {
      throw new Error(
        "An unexpected error occurred trying to get favorite tracks. Please try again."
      ); // Generic error message
    }
  }
};

export const fetchOwnedTracks = async (userId) => {
  try {
    const response = await axios.get("/api/tracks/user", {
      params: { userId }, // Correctly pass userId as part of the params object
      withCredentials: true,
    });

    console.log(response.data);

    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error); // Throw error with backend message
    } else {
      throw new Error(
        "An unexpected error occurred trying to get owned tracks. Please try again."
      ); // Generic error message
    }
  }
};

export const register = async (email, username, password, otp_code) => {
  try {
    const response = await axios.post('/api/users/register', { email, username, password, otp_code }, { withCredentials: true });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error); // Throw error with backend message
    } else {
      throw new Error('Failed to complete registration. Please try again.'); // Generic error message
    }
  }
};

export const checkEmail = async (email) => {
  try {
    const response = await axios.post('/api/users/check-email', { email }, { withCredentials: true });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error); // Throw error with backend message
    } else {
      throw new Error('Failed to check email. Please try again.'); // Generic error message
    }
  }
}

export const fetchPublicUserInfo = async (userId) => {
  try {
    const response = await axios.get(`/api/users/info/${userId}`, { withCredentials: true });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error); // Throw error with backend message
    } else {
      throw new Error('Failed to get user information. Please try again.'); // Generic error message
    }
  }
};


export const fetchUserPublicFavoriteTracks = async (userId) => {
  try {
    const response = await axios.get(`/api/public/favorite-tracks/${userId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Failed to fetch popular tracks. Please try again.');
    }
  }
};

export const fetchUserPublicTracks = async (userId) => {
  try {
    const response = await axios.get(`/api/public/tracks/${userId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Failed to fetch popular tracks. Please try again.');
    }
  }
};