// src/app/app/services/audio.js
import axios from "axios";

export async function analyzeAudio(formData, onUploadProgress, onAnalysisProgress) {
  try {
    // Initial upload with progress
    const { data } = await axios.post('/api/audio/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress(percentCompleted);
      },
    });

    const { jobId } = data;
    // Reset upload progress
    onUploadProgress(0);

    // Poll for analysis results
    while (true) {
      const { data: statusData } = await axios.get(`/api/audio/analysis/status/${jobId}`);
      const { state, progress, result, error } = statusData;

      if (state === 'completed') {
        onAnalysisProgress(100);
        return result;
      }

      if (state === 'failed') {
        throw new Error(error || 'Analysis failed');
      }

      // Update analysis progress
      if (onAnalysisProgress && progress) {
        onAnalysisProgress(progress);
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to analyze audio");
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