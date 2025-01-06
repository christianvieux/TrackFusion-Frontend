// src/services/tracks.js
import axios from 'axios';
import Fake_Data from './fake_tracks';

export const fetchRecentTracks = async () => {
  try {
    const response = await axios.get(`/api/tracks/public`, { withCredentials: true });
    return response.data;
    // return Fake_Data();
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Failed to fetch recent tracks. Please try again.');
    }
  }
};

export const updateTrack = async (trackId, updatedData) => {
  try {
    const response = await axios.put(`/api/tracks/${trackId}`, updatedData, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Failed to update track. Please try again.');
    }
  }
};

export const fetchPopularTracks = async () => {
  try {
    const response = await axios.get(`/api/tracks/popular`, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Failed to fetch popular tracks. Please try again.');
    }
  }
};

export const createTrack = async (formData) => {
  try {
    const response = await axios.post(
      `/api/tracks/create`, 
      formData, 
      { 
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true 
      }
    );
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Failed to create track. Please try again.');
    }
  }
}

export const testResponseTime = async () => {
  try {
    const response = await axios.post(
      `/api/tracks/test`, 
      { 
        withCredentials: true 
      },
      { timeout: 60000 } // Set timeout to 60 second
    );
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Failed. Response time :( ');
    }
  }
}

export const fetchAuthorizedUrl = async (trackId) => {
  try {
    const response = await axios.get(`/api/tracks/${trackId}/authorized-url`, { withCredentials: true });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Failed to fetch authorized URL. Please try again.');
    }
  }
}

export const fetchTrack = async (trackId) => {
  try {
    const response = await axios.get(`/api/tracks/${trackId}`, { withCredentials: true });
    return response.data;
    // return Fake_Data()[0];
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Failed to fetch track. Please try again.');
    }
  }
};