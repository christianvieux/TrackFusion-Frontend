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



// Profile pictures
export const ProfileUploadStates = {
  PREPARING: 'PREPARING',
  UPLOADING: 'UPLOADING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};


export const updateProfilePicture = async (file, onProgressChange = () => {}) => {
  const uploadToStorage = async (presignedUrl, file) => {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type
      }
    });
  };

  try {
    // 1. Prepare and validate file
    onProgressChange?.(ProfileUploadStates.PREPARING);
    
    if (!file) {
      throw new Error('No file provided');
    }

    const fileInfo = {
      fileName: file.name,
      contentType: file.type
    };

    // 2. Get presigned URL
    const { data: fileUrl } = await axios.post('/api/aws/presigned-url', {
      fileName: fileInfo.fileName,
      contentType: fileInfo.contentType
    });

    // 3. Upload to storage
    onProgressChange?.(ProfileUploadStates.UPLOADING);
    await uploadToStorage(fileUrl.uploadUrl, file);

    // 4. Trigger processing
    onProgressChange?.(ProfileUploadStates.PROCESSING);
    const { data: { jobId } } = await axios.post('/api/upload/profile-picture', {
      imageUrl: fileUrl
    });

    // 5. Poll for completion
    const result = await checkProfilePictureProcessingStatus(jobId, onProgressChange);
    onProgressChange?.(ProfileUploadStates.COMPLETED);

    return result;
  } catch (error) {
    onProgressChange?.(ProfileUploadStates.FAILED);
    throw new Error(
      error.response?.data?.error || error.message || 'Failed to upload profile picture'
    );
  }
};

const checkProfilePictureProcessingStatus = async (jobId, onProgressChange) => {
  const maxAttempts = 30;
  const delayMs = 1000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { data: status } = await axios.get(`/api/upload/profile-picture-status/${jobId}`);

    if (status.state === 'completed') {
      return status.result;
    }

    if (status.state === 'failed') {
      throw new Error(status.error || 'Profile picture processing failed');
    }

    if (status.progress) {
      onProgressChange?.(ProfileUploadStates.PROCESSING, status.progress);
    }

    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  throw new Error('Profile picture processing timed out');
};