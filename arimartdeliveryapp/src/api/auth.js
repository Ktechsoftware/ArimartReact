import API from ".";

// Send OTP
export const sendOtp = (mobileNumber) =>
  API.post('/auth/send-otp', { mobileNumber });

// Verify OTP - Updated to use delivery-user login endpoint
export const verifyOtp = (mobileNumber, OTP) =>
  API.post('/auth/delivery-user/login', {
    mobileNumber,
    otp: OTP
  });

// Register delivery user - Updated to use delivery-user register endpoint
export const registerDeliveryUser = (userData) =>
  API.post('/auth/delivery-user/register', userData);

// Logout
export const logout = () =>
  API.post('/auth/logout');

// Get delivery user info - Updated to use delivery-user endpoint
export const getDeliveryUserInfo = (userId) =>
  API.get(`/auth/delivery-user/user-info/${userId}`);

// Update delivery user info - Updated to use delivery-user endpoint
export const updateDeliveryUserInfo = (userId, updateData) =>
  API.put(`/auth/delivery-user/update/${userId}`, updateData);

// Get registration status
export const getRegistrationStatus = (userId) =>
  API.get(`/auth/delivery-user/registration-status/${userId}`);
