// Frontend/src/app/services/enum.js
import axios from 'axios';

export const fetchEnumValues = async (type) => {
  try {
    const response = await axios.get(`/api/enums/${type}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch enum values');
  }
};

export const fetchTrackAttributes = async () => {
  try {
    const response = await axios.get('/api/enums/trackAttributes');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch track attributes: ${error}`);
  }
};