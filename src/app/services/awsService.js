import axios from 'axios';

class AwsUploadService {
  async uploadToS3 (presignedUrl, file, onProgress= () => {}) {
    return axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress?.(percentCompleted);
      }
    });
  }
}

export const awsUploadService = new AwsUploadService();