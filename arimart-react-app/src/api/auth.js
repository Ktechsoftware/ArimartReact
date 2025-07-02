import API from ".";

export const sendOtp = (mobileNumber) =>
  API.post('/auth/send-otp', { mobileNumber });

export const verifyOtp = (mobileNumber, OTP) =>
  API.post('/auth/verify-otp', { mobileNumber, otp: OTP });

export const registerUser = (fullName, userEmail, mobileNumber) =>
  API.post('/auth/register-user', { fullName, userEmail, mobileNumber });

export const logout = () =>
  API.post('/auth/logout');

export const getUserInfo = () =>
  API.get('/auth/user-info');
