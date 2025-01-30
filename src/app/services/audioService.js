// src/app/app/services/audio.js
import axios from "axios";
import { awsUploadService } from './awsService';

export async function analyzeAudio(file, bpmRange, onUploadProgress = () => {}, onAnalysisProgress = () => {}) {
  try {
    // 1. Get presigned URL for upload
    const { data: fileUrl } = await axios.post('/api/aws/presigned-url', {
      fileName: file.name,
      type: 'track'
    });

    // 2. Upload to S3
    await awsUploadService.uploadToS3(
      fileUrl.uploadUrl, 
      file,
      (progress) => onUploadProgress(progress)
    );

    onUploadProgress(0); // Reset progress to make it dissapear
    // 3. Start analysis
    const { data } = await axios.post('/api/audio/analyze', {
      trackUrl: fileUrl,
      bpmRange
    });

    const { jobId } = data;

    // 4. Poll for results
    while (true) {
      const { data: status } = await axios.get(`/api/audio/analysis-status/${jobId}`);
      let progress;
      switch (status.progress) {
        case 'downloading':
          progress = 33;
          break;
        case 'validating_audio':
          progress = 50;
          break;
        case 'analyzing_bpm':
          progress = 66;
          break;
        case 'analyzing_key':
          progress = 80;
          break;
        case 'completed':
          progress = 100;
          break;
        default:
          progress = 0;
      }
      onAnalysisProgress(progress);

      if (status.state === 'completed') {
        return status.result;
      }

      if (status.state === 'failed') {
        throw new Error(status.error || 'Analysis failed');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || 'Failed to analyze audio');
  }
}

export async function startConversion(data) {
  try {
    const response = await axios.post("/api/audio/convert-url", data, {
      withCredentials: true,
    });
    return response.data.jobId;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to start conversion");
  }
}
export async function checkConversionStatus(jobId) {
  try {
    const statusResponse = await axios.get(`/api/audio/status/${jobId}`);
    const resultResponse = statusResponse.data.state === 'completed' 
      ? await axios.get(`/api/audio/result/${jobId}`)
      : null;
    
    return {
      status: statusResponse.data.state,
      progress: statusResponse.data.progress,
      result: resultResponse?.data
    };
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to check conversion status");
  }
}
export async function downloadConvertedFile(jobId) {
  try {
    const response = await axios.get(`/api/audio/download/${jobId}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to download file");
  }
}