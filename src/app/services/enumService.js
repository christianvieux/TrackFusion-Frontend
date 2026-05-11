// Frontend/src/app/services/enum.js
import axios from 'axios';
import getApiBaseUrl from '../utils/getApiBaseUrl';
// API base URL
const API_BASE_URL = getApiBaseUrl();

export const fetchEnumValues = async (type) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/enums/${type}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch enum values');
  }
};

export const fetchTrackAttributes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/enums/trackAttributes`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch track attributes: ${error}`);
  }
};