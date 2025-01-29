// src/services/tracks.js
import axios from 'axios';
import Fake_Data from './fake_tracks';
import { awsUploadService } from './awsService';

export const uploadStates = {
  PREPARING: 'PREPARING',
  UPLOADING: 'UPLOADING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED'
};

export const fetchRecentTracks = async () => {
  try {
    const response = await axios.get(`/api/tracks/public`, { withCredentials: true });

    console.log('response', response.data);
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

const pollUploadStatus = async (jobId, onProgressChange) => {
  const MAX_RETRIES = 60; // 5 minutes total with 5s interval
  const POLL_INTERVAL = 5000; // 5 seconds
  let retries = 0;

  while (retries < MAX_RETRIES) {
    const { data: status } = await axios.get(`/api/upload/track-status/${jobId}`);

    switch (status.state) {
      case 'completed':
        return status.result;
      case 'failed':
        console.log('Upload failed:', status);
        throw new Error(status.error);
      case 'active':
        onProgressChange?.(uploadStates.PROCESSING, status.progress);
        break;
    }

    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
    retries++;
  }

  throw new Error('Upload processing timed out');
};

export const uploadTrack = async (formData, onProgressChange) => {
  try {
    // 1. Prepare file info for presigned URLs
    onProgressChange?.(uploadStates.PREPARING);
    const fileInfo = {
      trackFileName: formData.get("trackFile").name,
      imageFileName: formData.get("imageFile")?.name,
      contentTypes: {
        track: formData.get("trackFile").type,
        image: formData.get("imageFile")?.type,
      },
    };

    // 2. Get presigned URLs
    const [trackUrl, trackCoverUrl] = await Promise.all([
      fileInfo.trackFileName && axios.post("/api/aws/presigned-url", { fileName: fileInfo.trackFileName, type: 'track' })
      .then(({ data }) => data),
      fileInfo.imageFileName && axios.post("/api/aws/presigned-url", {fileName: fileInfo.imageFileName, type: 'image'})
      .then(({ data }) => data)
    ]);

    // 3. Upload files to S3
    onProgressChange?.(uploadStates.UPLOADING);
    await Promise.all([
      awsUploadService.uploadToS3(trackUrl.uploadUrl, formData.get("trackFile")),
      formData.get("imageFile") &&
        awsUploadService.uploadToS3(trackCoverUrl.uploadUrl, formData.get("imageFile")),
    ]);

    // 4. Finalize upload
    onProgressChange?.(uploadStates.PROCESSING);
    const { jobId } = (await axios.post("/api/upload/track", {
      trackUrl: trackUrl,
      imageUrl: trackCoverUrl,
      name: formData.get("name"),
      artist: formData.get("artist"),
      description: formData.get("description"),
      genre: formData.get("genre"),
      mood: formData.get("mood"),
      bpm: formData.get("bpm"),
      is_private: formData.get("is_private"),
      category: formData.get("category"),
    })).data;

    // 5. Poll for completion
    const track = await pollUploadStatus(jobId, onProgressChange);
    onProgressChange?.(uploadStates.COMPLETED);

    return track;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || "Failed to upload track");
  }
};

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
