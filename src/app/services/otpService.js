// src/services/otp.js
import axios from "axios";


export const generateOtp = async (email, purpose) => {
  try {
    const response = await axios.post(
      "/api/otp/generate",
      { email, purpose },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}

export const verifyOtp = async (email, otp_code, purpose) => {
  try {
    const response = await axios.post(
      "/api/otp/verify",
      { email, otp_code, purpose },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}

export const checkOtpCooldown = async (email, purpose) => {
  try {
    const response = await axios.get(
      "/api/otp/cooldown",
      { params: { email, purpose } }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}