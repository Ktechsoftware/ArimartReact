// Auth-related API endpoints

export const sendOtp = (mobileData) => API.post('/auth/send-otp', mobileData);
export const verifyOtp = (otpData) => API.post('/auth/verify-otp', otpData);
export const registerUser = (userData) => API.post('/auth/register-user', userData);
export const logout = () => API.post('/auth/logout');
export const getUserInfo = () => API.get('/auth/user-info');
